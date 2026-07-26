/** Regras completas de xadrez (movimento legal, xeque, mate, afogamento, roque, en passant, promocao). */
(function (global) {
  const SIZE = 8;
  const WHITE = "w";
  const BLACK = "b";

  const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  const UNICODE = {
    w: { k: "\u2654", q: "\u2655", r: "\u2656", b: "\u2657", n: "\u2658", p: "\u2659" },
    b: { k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F" },
  };

  function emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  function piece(color, type) {
    return { color, type };
  }

  function initialBoard() {
    const board = emptyBoard();
    const back = ["r", "n", "b", "q", "k", "b", "n", "r"];
    for (let c = 0; c < SIZE; c++) {
      board[0][c] = piece(BLACK, back[c]);
      board[1][c] = piece(BLACK, "p");
      board[6][c] = piece(WHITE, "p");
      board[7][c] = piece(WHITE, back[c]);
    }
    return board;
  }

  function initialState() {
    return {
      board: initialBoard(),
      turn: WHITE,
      castling: { wK: true, wQ: true, bK: true, bQ: true },
      enPassant: null,
      halfmove: 0,
      fullmove: 1,
    };
  }

  function inBounds(r, c) {
    return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
  }

  function cloneBoard(board) {
    return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  }

  function cloneState(state) {
    return {
      board: cloneBoard(state.board),
      turn: state.turn,
      castling: { ...state.castling },
      enPassant: state.enPassant ? { ...state.enPassant } : null,
      halfmove: state.halfmove,
      fullmove: state.fullmove,
    };
  }

  function opposite(color) {
    return color === WHITE ? BLACK : WHITE;
  }

  function unicodeFor(p) {
    if (!p) return "";
    return UNICODE[p.color][p.type] || "";
  }

  function filesLabel(c) {
    return String.fromCharCode(97 + c);
  }

  function ranksLabel(r) {
    return String(8 - r);
  }

  function coordLabel(r, c) {
    return filesLabel(c) + ranksLabel(r);
  }

  function findKing(board, color) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (p && p.color === color && p.type === "k") return { r, c };
      }
    }
    return null;
  }

  function isSquareAttacked(board, r, c, byColor) {
    const enemy = byColor;
    // Pawns
    const pawnDir = enemy === WHITE ? 1 : -1;
    for (const dc of [-1, 1]) {
      const pr = r + pawnDir;
      const pc = c + dc;
      if (inBounds(pr, pc)) {
        const p = board[pr][pc];
        if (p && p.color === enemy && p.type === "p") return true;
      }
    }
    // Knights
    const kn = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of kn) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      const p = board[nr][nc];
      if (p && p.color === enemy && p.type === "n") return true;
    }
    // King
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        const p = board[nr][nc];
        if (p && p.color === enemy && p.type === "k") return true;
      }
    }
    // Sliding: bishop/queen diagonals
    const diag = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    for (const [dr, dc] of diag) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === enemy && (p.type === "b" || p.type === "q")) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
    // Sliding: rook/queen ranks/files
    const ortho = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of ortho) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === enemy && (p.type === "r" || p.type === "q")) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
    return false;
  }

  function isInCheck(board, color) {
    const king = findKing(board, color);
    if (!king) return false;
    return isSquareAttacked(board, king.r, king.c, opposite(color));
  }

  function pushMove(list, fromR, fromC, toR, toC, opts) {
    list.push({
      from: { r: fromR, c: fromC },
      to: { r: toR, c: toC },
      capture: opts.capture || null,
      promote: opts.promote || null,
      castle: opts.castle || null,
      enPassant: !!opts.enPassant,
    });
  }

  function addSlideMoves(board, r, c, color, dirs, list) {
    for (const [dr, dc] of dirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const target = board[nr][nc];
        if (!target) {
          pushMove(list, r, c, nr, nc, {});
        } else {
          if (target.color !== color) {
            pushMove(list, r, c, nr, nc, { capture: target });
          }
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }

  function generatePseudoLegal(state, color) {
    const board = state.board;
    const moves = [];
    const ep = state.enPassant;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (!p || p.color !== color) continue;

        if (p.type === "p") {
          const dir = color === WHITE ? -1 : 1;
          const startRow = color === WHITE ? 6 : 1;
          const promoRow = color === WHITE ? 0 : 7;
          const oneR = r + dir;
          if (inBounds(oneR, c) && !board[oneR][c]) {
            if (oneR === promoRow) {
              pushMove(moves, r, c, oneR, c, { promote: "q" });
            } else {
              pushMove(moves, r, c, oneR, c, {});
              const twoR = r + 2 * dir;
              if (r === startRow && inBounds(twoR, c) && !board[twoR][c]) {
                pushMove(moves, r, c, twoR, c, {});
              }
            }
          }
          for (const dc of [-1, 1]) {
            const nr = r + dir;
            const nc = c + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (target && target.color !== color) {
              if (nr === promoRow) {
                pushMove(moves, r, c, nr, nc, { capture: target, promote: "q" });
              } else {
                pushMove(moves, r, c, nr, nc, { capture: target });
              }
            }
            if (
              ep &&
              ep.r === nr &&
              ep.c === nc &&
              !target
            ) {
              const capR = r;
              const capC = nc;
              const captured = board[capR][capC];
              if (captured && captured.color !== color && captured.type === "p") {
                pushMove(moves, r, c, nr, nc, {
                  capture: captured,
                  enPassant: true,
                });
              }
            }
          }
        } else if (p.type === "n") {
          const kn = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
          ];
          for (const [dr, dc] of kn) {
            const nr = r + dr;
            const nc = c + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (!target) pushMove(moves, r, c, nr, nc, {});
            else if (target.color !== color) {
              pushMove(moves, r, c, nr, nc, { capture: target });
            }
          }
        } else if (p.type === "b") {
          addSlideMoves(
            board,
            r,
            c,
            color,
            [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ],
            moves
          );
        } else if (p.type === "r") {
          addSlideMoves(
            board,
            r,
            c,
            color,
            [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ],
            moves
          );
        } else if (p.type === "q") {
          addSlideMoves(
            board,
            r,
            c,
            color,
            [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ],
            moves
          );
        } else if (p.type === "k") {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (!dr && !dc) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (!inBounds(nr, nc)) continue;
              const target = board[nr][nc];
              if (!target) pushMove(moves, r, c, nr, nc, {});
              else if (target.color !== color) {
                pushMove(moves, r, c, nr, nc, { capture: target });
              }
            }
          }
          // Castling (pseudo; check filtering later)
          const castling = state.castling;
          const back = color === WHITE ? 7 : 0;
          if (r === back && c === 4) {
            const enemy = opposite(color);
            if (
              (color === WHITE ? castling.wK : castling.bK) &&
              !board[back][5] &&
              !board[back][6] &&
              board[back][7] &&
              board[back][7].color === color &&
              board[back][7].type === "r"
            ) {
              pushMove(moves, r, c, back, 6, { castle: "K" });
            }
            if (
              (color === WHITE ? castling.wQ : castling.bQ) &&
              !board[back][3] &&
              !board[back][2] &&
              !board[back][1] &&
              board[back][0] &&
              board[back][0].color === color &&
              board[back][0].type === "r"
            ) {
              pushMove(moves, r, c, back, 2, { castle: "Q" });
            }
            // silence unused in loop - enemy used in legal filter
            void enemy;
          }
        }
      }
    }
    return moves;
  }

  function applyMoveOnBoard(board, move) {
    const next = cloneBoard(board);
    const moving = next[move.from.r][move.from.c];
    next[move.from.r][move.from.c] = null;

    if (move.enPassant) {
      next[move.from.r][move.to.c] = null;
    }

    if (move.castle === "K") {
      next[move.to.r][move.to.c] = moving;
      const rook = next[move.to.r][7];
      next[move.to.r][7] = null;
      next[move.to.r][5] = rook;
      return next;
    }
    if (move.castle === "Q") {
      next[move.to.r][move.to.c] = moving;
      const rook = next[move.to.r][0];
      next[move.to.r][0] = null;
      next[move.to.r][3] = rook;
      return next;
    }

    if (move.promote) {
      next[move.to.r][move.to.c] = piece(moving.color, move.promote);
    } else {
      next[move.to.r][move.to.c] = moving;
    }
    return next;
  }

  function isLegalCastle(state, move, color) {
    if (!move.castle) return true;
    const board = state.board;
    const back = color === WHITE ? 7 : 0;
    const enemy = opposite(color);
    if (isSquareAttacked(board, back, 4, enemy)) return false;
    if (move.castle === "K") {
      if (isSquareAttacked(board, back, 5, enemy)) return false;
      if (isSquareAttacked(board, back, 6, enemy)) return false;
    } else {
      if (isSquareAttacked(board, back, 3, enemy)) return false;
      if (isSquareAttacked(board, back, 2, enemy)) return false;
    }
    return true;
  }

  function getLegalMoves(state, color) {
    color = color || state.turn;
    const pseudo = generatePseudoLegal(state, color);
    const legal = [];
    for (const move of pseudo) {
      if (move.castle && !isLegalCastle(state, move, color)) continue;
      const nextBoard = applyMoveOnBoard(state.board, move);
      if (isInCheck(nextBoard, color)) continue;
      legal.push(move);
    }
    return legal;
  }

  function applyMove(state, move) {
    const next = cloneState(state);
    const moving = next.board[move.from.r][move.from.c];
    const wasPawn = moving && moving.type === "p";
    const didCapture = !!(move.capture || move.enPassant);

    next.board = applyMoveOnBoard(next.board, move);

    // Castling rights
    if (moving.type === "k") {
      if (moving.color === WHITE) {
        next.castling.wK = false;
        next.castling.wQ = false;
      } else {
        next.castling.bK = false;
        next.castling.bQ = false;
      }
    }
    if (moving.type === "r") {
      if (moving.color === WHITE) {
        if (move.from.r === 7 && move.from.c === 0) next.castling.wQ = false;
        if (move.from.r === 7 && move.from.c === 7) next.castling.wK = false;
      } else {
        if (move.from.r === 0 && move.from.c === 0) next.castling.bQ = false;
        if (move.from.r === 0 && move.from.c === 7) next.castling.bK = false;
      }
    }
    // Captured rook on corner
    if (move.capture && move.capture.type === "r" && !move.enPassant) {
      const tr = move.to.r;
      const tc = move.to.c;
      if (tr === 7 && tc === 0) next.castling.wQ = false;
      if (tr === 7 && tc === 7) next.castling.wK = false;
      if (tr === 0 && tc === 0) next.castling.bQ = false;
      if (tr === 0 && tc === 7) next.castling.bK = false;
    }

    // En passant target
    next.enPassant = null;
    if (wasPawn && Math.abs(move.to.r - move.from.r) === 2) {
      next.enPassant = {
        r: (move.from.r + move.to.r) / 2,
        c: move.from.c,
      };
    }

    next.halfmove = wasPawn || didCapture ? 0 : next.halfmove + 1;
    if (moving.color === BLACK) next.fullmove += 1;
    next.turn = opposite(state.turn);

    return next;
  }

  function movesFrom(moves, r, c) {
    return moves.filter((m) => m.from.r === r && m.from.c === c);
  }

  function findMove(moves, fr, fc, tr, tc) {
    return (
      moves.find(
        (m) =>
          m.from.r === fr &&
          m.from.c === fc &&
          m.to.r === tr &&
          m.to.c === tc
      ) || null
    );
  }

  function gameResult(state) {
    const moves = getLegalMoves(state, state.turn);
    const check = isInCheck(state.board, state.turn);
    if (!moves.length) {
      if (check) {
        return {
          over: true,
          result: "checkmate",
          winner: opposite(state.turn),
        };
      }
      return { over: true, result: "stalemate", winner: null };
    }
    return { over: false, result: null, winner: null, inCheck: check };
  }

  function countMaterial(board, color) {
    let n = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell && cell.color === color) n += PIECE_VALUES[cell.type] || 0;
      }
    }
    return n;
  }

  function listCaptured(historyStates) {
    // Derive captured pieces by comparing initial vs current via move history captures
    const whiteLost = [];
    const blackLost = [];
    for (const snap of historyStates) {
      if (snap.move && snap.move.capture) {
        const cap = snap.move.capture;
        if (cap.color === WHITE) whiteLost.push(cap);
        else blackLost.push(cap);
      }
    }
    return { whiteLost, blackLost };
  }

  function describeMove(move, boardBefore) {
    const p = boardBefore[move.from.r][move.from.c];
    const pieceChar = p ? p.type.toUpperCase() : "?";
    const from = coordLabel(move.from.r, move.from.c);
    const to = coordLabel(move.to.r, move.to.c);
    if (move.castle === "K") return "O-O";
    if (move.castle === "Q") return "O-O-O";
    let s = (p && p.type === "p" ? "" : pieceChar) + from;
    if (move.capture || move.enPassant) s += "x";
    else s += "-";
    s += to;
    if (move.promote) s += "=Q";
    if (move.enPassant) s += " e.p.";
    return s;
  }

  function materialScore(board) {
    let score = 0;
    for (const row of board) {
      for (const cell of row) {
        if (!cell) continue;
        const v = PIECE_VALUES[cell.type] || 0;
        score += cell.color === WHITE ? v : -v;
      }
    }
    return score;
  }

  global.Xadrez = {
    SIZE,
    WHITE,
    BLACK,
    PIECE_VALUES,
    UNICODE,
    emptyBoard,
    initialBoard,
    initialState,
    cloneBoard,
    cloneState,
    opposite,
    unicodeFor,
    coordLabel,
    filesLabel,
    ranksLabel,
    findKing,
    isSquareAttacked,
    isInCheck,
    getLegalMoves,
    applyMove,
    movesFrom,
    findMove,
    gameResult,
    countMaterial,
    listCaptured,
    describeMove,
    materialScore,
    applyMoveOnBoard,
  };
})(window);

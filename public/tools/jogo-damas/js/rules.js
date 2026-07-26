/** Regras brasileiras de damas (8×8, captura obrigatória, dama voadora). */
(function (global) {
  const SIZE = 8;
  const WHITE = "w";
  const BLACK = "b";

  function emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  function initialBoard() {
    const board = emptyBoard();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!isDark(r, c)) continue;
        if (r <= 2) board[r][c] = piece(BLACK, false);
        if (r >= 5) board[r][c] = piece(WHITE, false);
      }
    }
    return board;
  }

  function piece(color, king = false) {
    return { color, king };
  }

  function isDark(r, c) {
    return (r + c) % 2 === 1;
  }

  function inBounds(r, c) {
    return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
  }

  function cloneBoard(board) {
    return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  }

  function opposite(color) {
    return color === WHITE ? BLACK : WHITE;
  }

  function countPieces(board, color) {
    let n = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell && cell.color === color) n++;
      }
    }
    return n;
  }

  const DIRS = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  function forwardDirs(color) {
    return color === WHITE
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];
  }

  function promotionRow(color) {
    return color === WHITE ? 0 : SIZE - 1;
  }

  function getAllMoves(board, color) {
    const captures = getAllCaptures(board, color);
    if (captures.length) {
      const max = Math.max(...captures.map((m) => m.captures.length));
      return captures.filter((m) => m.captures.length === max);
    }
    return getQuietMoves(board, color);
  }

  function getQuietMoves(board, color) {
    const moves = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (!p || p.color !== color) continue;
        const dirs = p.king ? DIRS : forwardDirs(color);
        for (const [dr, dc] of dirs) {
          if (p.king) {
            let nr = r + dr;
            let nc = c + dc;
            while (inBounds(nr, nc) && !board[nr][nc]) {
              moves.push(makeQuietMove(r, c, nr, nc, color, true));
              nr += dr;
              nc += dc;
            }
          } else {
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc) && !board[nr][nc]) {
              moves.push(makeQuietMove(r, c, nr, nc, color, false));
            }
          }
        }
      }
    }
    return moves;
  }

  function makeQuietMove(fr, fc, tr, tc, color, isKing) {
    return {
      from: { r: fr, c: fc },
      to: { r: tr, c: tc },
      path: [
        { r: fr, c: fc },
        { r: tr, c: tc },
      ],
      captures: [],
      promote: !isKing && tr === promotionRow(color),
    };
  }

  function getAllCaptures(board, color) {
    const result = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (!p || p.color !== color) continue;
        searchCaptures(board, r, c, p, [], [{ r, c }], result);
      }
    }
    return result;
  }

  function searchCaptures(board, r, c, pieceState, captured, path, out) {
    const options = findCaptureBranches(board, r, c, pieceState, captured);
    if (!options.length) {
      if (captured.length) {
        const to = path[path.length - 1];
        const promote =
          !pieceState.king && to.r === promotionRow(pieceState.color);
        out.push({
          from: path[0],
          to,
          path: path.map((p) => ({ ...p })),
          captures: captured.map((p) => ({ ...p })),
          promote,
        });
      }
      return;
    }

    for (const branch of options) {
      const nextBoard = cloneBoard(board);
      nextBoard[r][c] = null;
      nextBoard[branch.to.r][branch.to.c] = pieceState;
      const nextCaptured = [...captured, branch.capture];
      searchCaptures(
        nextBoard,
        branch.to.r,
        branch.to.c,
        pieceState,
        nextCaptured,
        [...path, branch.to],
        out
      );
    }
  }

  function findCaptureBranches(board, r, c, pieceState, alreadyCaptured) {
    const branches = [];
    const capturedKey = new Set(alreadyCaptured.map((p) => key(p.r, p.c)));

    for (const [dr, dc] of DIRS) {
      if (pieceState.king) {
        let nr = r + dr;
        let nc = c + dc;
        let seenEnemy = null;

        while (inBounds(nr, nc)) {
          const cell = board[nr][nc];
          if (!seenEnemy) {
            if (!cell) {
              nr += dr;
              nc += dc;
              continue;
            }
            if (cell.color === pieceState.color) break;
            if (capturedKey.has(key(nr, nc))) break;
            seenEnemy = { r: nr, c: nc };
            nr += dr;
            nc += dc;
            continue;
          }

          if (cell) break;
          branches.push({
            to: { r: nr, c: nc },
            capture: seenEnemy,
          });
          nr += dr;
          nc += dc;
        }
      } else {
        const midR = r + dr;
        const midC = c + dc;
        const landR = r + dr * 2;
        const landC = c + dc * 2;
        if (!inBounds(landR, landC)) continue;
        const mid = board[midR] && board[midR][midC];
        if (!mid || mid.color === pieceState.color) continue;
        if (capturedKey.has(key(midR, midC))) continue;
        if (board[landR][landC]) continue;
        branches.push({
          to: { r: landR, c: landC },
          capture: { r: midR, c: midC },
        });
      }
    }

    return branches;
  }

  function key(r, c) {
    return r + "," + c;
  }

  function applyMove(board, move) {
    const next = cloneBoard(board);
    const moving = next[move.from.r][move.from.c];
    if (!moving) return next;

    next[move.from.r][move.from.c] = null;
    for (const cap of move.captures) {
      next[cap.r][cap.c] = null;
    }

    let placed = { ...moving };
    if (move.promote) placed = { ...placed, king: true };
    next[move.to.r][move.to.c] = placed;
    return next;
  }

  function movesFrom(moves, r, c) {
    return moves.filter((m) => m.from.r === r && m.from.c === c);
  }

  function findMove(moves, fromR, fromC, toR, toC) {
    const matches = moves.filter(
      (m) =>
        m.from.r === fromR &&
        m.from.c === fromC &&
        m.to.r === toR &&
        m.to.c === toC
    );
    if (matches.length <= 1) return matches[0] || null;
    return matches.sort((a, b) => pathSig(a).localeCompare(pathSig(b)))[0];
  }

  function pathSig(move) {
    return move.path.map((p) => "" + p.r + p.c).join("-");
  }

  function coordLabel(r, c) {
    const file = String.fromCharCode(97 + c);
    const rank = SIZE - r;
    return file + rank;
  }

  function describeMove(move) {
    const start = coordLabel(move.from.r, move.from.c);
    const end = coordLabel(move.to.r, move.to.c);
    if (!move.captures.length) return start + " → " + end;
    return start + " × " + end + " (" + move.captures.length + ")";
  }

  function winner(board, colorToMove) {
    if (countPieces(board, WHITE) === 0) return BLACK;
    if (countPieces(board, BLACK) === 0) return WHITE;
    if (getAllMoves(board, colorToMove).length === 0) return opposite(colorToMove);
    return null;
  }

  global.Damas = {
    SIZE,
    WHITE,
    BLACK,
    initialBoard,
    cloneBoard,
    isDark,
    opposite,
    countPieces,
    getAllMoves,
    applyMove,
    movesFrom,
    findMove,
    coordLabel,
    describeMove,
    winner,
  };
})(window);

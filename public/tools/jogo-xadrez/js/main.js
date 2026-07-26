(function () {
  const {
    WHITE,
    BLACK,
    initialState,
    cloneState,
    getLegalMoves,
    applyMove,
    movesFrom,
    findMove,
    gameResult,
    unicodeFor,
    coordLabel,
    describeMove,
    opposite,
    isInCheck,
  } = window.Xadrez;
  const { chooseAiMove } = window.XadrezAI;
  const { t, applyStatic } = window.XadrezI18n;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const hintEl = document.getElementById("hint");
  const lastMoveEl = document.getElementById("last-move");
  const trayTopEl = document.getElementById("tray-top");
  const trayBottomEl = document.getElementById("tray-bottom");
  const overlayEl = document.getElementById("overlay");
  const overlayTitleEl = document.getElementById("overlay-title");
  const overlayTextEl = document.getElementById("overlay-text");
  const btnUndo = document.getElementById("btn-undo");
  const btnReset = document.getElementById("btn-reset");
  const btnAgain = document.getElementById("btn-again");
  const modeButtons = document.querySelectorAll(".mode-btn");

  const DRAG_THRESHOLD = 6;

  const state = {
    game: initialState(),
    mode: "pvp",
    selected: null,
    legal: [],
    history: [],
    lastMove: null,
    captured: { w: [], b: [] },
    over: false,
    aiThinking: false,
  };

  const drag = {
    active: false,
    moved: false,
    from: null,
    startX: 0,
    startY: 0,
    ghost: null,
    originBtn: null,
    suppressClick: false,
  };

  function boot() {
    applyStatic();
    buildBoardDom();
    bindUi();
    bindDragGlobals();
    refresh();
  }

  function buildBoardDom() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement("button");
        sq.type = "button";
        const light = (r + c) % 2 === 0;
        sq.className = "square " + (light ? "light" : "dark");
        sq.dataset.r = String(r);
        sq.dataset.c = String(c);
        sq.setAttribute("aria-label", coordLabel(r, c));
        sq.classList.add("playable");
        sq.addEventListener("click", () => {
          if (drag.suppressClick) return;
          onSquareClick(r, c);
        });
        boardEl.appendChild(sq);
      }
    }
  }

  function bindUi() {
    btnReset.addEventListener("click", () => resetGame());
    btnAgain.addEventListener("click", () => resetGame());
    btnUndo.addEventListener("click", () => undo());

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.mode = btn.dataset.mode;
        resetGame();
      });
    });
  }

  function bindDragGlobals() {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  function resetGame() {
    endDrag(true);
    state.game = initialState();
    state.selected = null;
    state.legal = getLegalMoves(state.game);
    state.history = [];
    state.lastMove = null;
    state.captured = { w: [], b: [] };
    state.over = false;
    state.aiThinking = false;
    overlayEl.classList.add("hidden");
    lastMoveEl.textContent = t.started;
    refresh();
  }

  function refresh() {
    if (!state.over) {
      state.legal = getLegalMoves(state.game);
    }
    renderPieces();
    renderHighlights();
    renderTrays();
    updateHud();
  }

  function canControlPiece(r, c) {
    if (state.over || state.aiThinking) return false;
    if (state.mode === "ai" && state.game.turn === BLACK) return false;
    const p = state.game.board[r][c];
    if (!p || p.color !== state.game.turn) return false;
    return movesFrom(state.legal, r, c).length > 0;
  }

  function renderPieces() {
    boardEl.querySelectorAll(".piece").forEach((el) => el.remove());

    const movableOrigins = new Set(
      state.legal.map((m) => m.from.r + "," + m.from.c)
    );

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.game.board[r][c];
        if (!p) continue;
        const sq = squareAt(r, c);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "piece " + (p.color === WHITE ? "white" : "black");
        btn.dataset.type = p.type;
        const movable =
          !state.over &&
          p.color === state.game.turn &&
          movableOrigins.has(r + "," + c) &&
          !(state.mode === "ai" && state.game.turn === BLACK);
        if (movable) btn.classList.add("is-movable");
        if (
          state.selected &&
          state.selected.r === r &&
          state.selected.c === c
        ) {
          btn.classList.add("is-selected");
        }
        if (
          drag.active &&
          drag.from &&
          drag.from.r === r &&
          drag.from.c === c
        ) {
          btn.classList.add("is-drag-source");
        }
        btn.setAttribute(
          "aria-label",
          (p.color === WHITE ? t.white : t.black) +
            " " +
            p.type +
            " " +
            coordLabel(r, c)
        );
        btn.innerHTML =
          '<span class="glyph" aria-hidden="true">' +
          unicodeFor(p) +
          "</span>";

        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (drag.suppressClick) return;
          onSquareClick(r, c);
        });

        if (movable) {
          btn.addEventListener("pointerdown", (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            startDrag(r, c, btn, e);
          });
        }

        sq.appendChild(btn);
      }
    }
  }

  function renderTrays() {
    // Top tray: white pieces captured by black (sit near black)
    // Bottom tray: black pieces captured by white
    trayTopEl.innerHTML = "";
    trayBottomEl.innerHTML = "";
    state.captured.w.forEach((p) => {
      const span = document.createElement("span");
      span.className = "tray-piece white";
      span.textContent = unicodeFor(p);
      trayTopEl.appendChild(span);
    });
    state.captured.b.forEach((p) => {
      const span = document.createElement("span");
      span.className = "tray-piece black";
      span.textContent = unicodeFor(p);
      trayBottomEl.appendChild(span);
    });
  }

  function startDrag(r, c, btn, event) {
    if (!canControlPiece(r, c)) return;

    state.selected = { r, c };
    renderHighlights();
    updateHud();

    drag.active = true;
    drag.moved = false;
    drag.from = { r, c };
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.originBtn = btn;
    drag.suppressClick = false;

    try {
      btn.setPointerCapture(event.pointerId);
    } catch (_) {
      /* ignore */
    }

    createGhost(btn, event.clientX, event.clientY);
  }

  function createGhost(btn, x, y) {
    removeGhost();
    const ghost = btn.cloneNode(true);
    ghost.removeAttribute("aria-label");
    ghost.classList.add("piece-ghost");
    ghost.classList.remove("is-movable", "is-selected", "is-drag-source");
    ghost.style.left = x + "px";
    ghost.style.top = y + "px";
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    btn.classList.add("is-drag-source");
  }

  function removeGhost() {
    if (drag.ghost) {
      drag.ghost.remove();
      drag.ghost = null;
    }
  }

  function moveGhost(x, y) {
    if (!drag.ghost) return;
    drag.ghost.style.left = x + "px";
    drag.ghost.style.top = y + "px";
  }

  function onPointerMove(event) {
    if (!drag.active || !drag.from) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && dx * dx + dy * dy >= DRAG_THRESHOLD * DRAG_THRESHOLD) {
      drag.moved = true;
      document.body.classList.add("is-piece-dragging");
    }

    if (drag.moved) {
      moveGhost(event.clientX, event.clientY);
    }
  }

  function squareFromPoint(clientX, clientY) {
    const stack = document.elementsFromPoint(clientX, clientY);
    for (const el of stack) {
      if (!(el instanceof Element)) continue;
      const sq = el.closest(".square");
      if (sq && sq.dataset.r != null && sq.dataset.c != null) {
        return { r: Number(sq.dataset.r), c: Number(sq.dataset.c) };
      }
    }
    return null;
  }

  function onPointerUp(event) {
    if (!drag.active || !drag.from) return;

    const from = drag.from;
    const didDrag = drag.moved;
    const target = didDrag
      ? squareFromPoint(event.clientX, event.clientY)
      : null;

    endDrag(false);

    if (didDrag) {
      drag.suppressClick = true;
      window.setTimeout(() => {
        drag.suppressClick = false;
      }, 0);

      if (target) {
        const move = findMove(
          state.legal,
          from.r,
          from.c,
          target.r,
          target.c
        );
        if (move) {
          playMove(move);
          return;
        }
      }
      refresh();
      return;
    }

    refresh();
  }

  function endDrag(clearSelection) {
    removeGhost();
    document.body.classList.remove("is-piece-dragging");
    boardEl.querySelectorAll(".piece.is-drag-source").forEach((el) => {
      el.classList.remove("is-drag-source");
    });
    drag.active = false;
    drag.moved = false;
    drag.from = null;
    drag.originBtn = null;
    if (clearSelection) state.selected = null;
  }

  function renderHighlights() {
    boardEl.querySelectorAll(".square").forEach((sq) => {
      sq.classList.remove("selected", "valid-target", "in-check", "last-from", "last-to");
    });

    if (state.lastMove) {
      squareAt(state.lastMove.from.r, state.lastMove.from.c).classList.add(
        "last-from"
      );
      squareAt(state.lastMove.to.r, state.lastMove.to.c).classList.add(
        "last-to"
      );
    }

    const king = window.Xadrez.findKing(state.game.board, state.game.turn);
    if (
      king &&
      isInCheck(state.game.board, state.game.turn) &&
      !state.over
    ) {
      squareAt(king.r, king.c).classList.add("in-check");
    }

    if (state.over) return;

    if (!state.selected) return;
    squareAt(state.selected.r, state.selected.c).classList.add("selected");
    const options = movesFrom(state.legal, state.selected.r, state.selected.c);
    for (const move of options) {
      squareAt(move.to.r, move.to.c).classList.add("valid-target");
    }
  }

  function updateHud() {
    btnUndo.disabled = state.history.length === 0 || state.aiThinking;

    if (state.over) return;

    if (state.aiThinking) {
      statusEl.textContent = t.thinking;
      hintEl.textContent = t.hintThinking;
      return;
    }

    const check = isInCheck(state.game.board, state.game.turn);
    if (state.game.turn === WHITE) {
      statusEl.textContent = check ? t.turnWhite + " - " + t.check : t.turnWhite;
    } else {
      statusEl.textContent = check ? t.turnBlack + " - " + t.check : t.turnBlack;
    }

    if (state.mode === "ai" && state.game.turn === BLACK) {
      hintEl.textContent = t.hintAi;
    } else if (state.selected) {
      hintEl.textContent = t.hintSelected;
    } else {
      hintEl.textContent = t.hintDrag;
    }
  }

  function onSquareClick(r, c) {
    if (state.over || state.aiThinking) return;
    if (state.mode === "ai" && state.game.turn === BLACK) return;

    const piece = state.game.board[r][c];
    const isOwn = piece && piece.color === state.game.turn;

    if (state.selected) {
      const move = findMove(
        state.legal,
        state.selected.r,
        state.selected.c,
        r,
        c
      );
      if (move) {
        playMove(move);
        return;
      }
    }

    if (isOwn && movesFrom(state.legal, r, c).length) {
      state.selected = { r, c };
      refresh();
      return;
    }

    state.selected = null;
    refresh();
  }

  function playMove(move) {
    endDrag(true);
    const before = cloneState(state.game);
    state.history.push({
      game: before,
      lastMove: state.lastMove,
      captured: {
        w: state.captured.w.map((p) => ({ ...p })),
        b: state.captured.b.map((p) => ({ ...p })),
      },
    });

    if (move.capture) {
      const cap = { color: move.capture.color, type: move.capture.type };
      if (cap.color === WHITE) state.captured.w.push(cap);
      else state.captured.b.push(cap);
    }

    const label = describeMove(move, state.game.board);
    state.game = applyMove(state.game, move);
    state.lastMove = move;
    lastMoveEl.textContent = label;
    state.selected = null;

    const result = gameResult(state.game);
    if (result.over) {
      state.legal = [];
      endGame(result);
      refresh();
      return;
    }

    refresh();

    if (state.mode === "ai" && state.game.turn === BLACK && !state.over) {
      scheduleAi();
    }
  }

  function scheduleAi() {
    state.aiThinking = true;
    updateHud();
    window.setTimeout(() => {
      const move = chooseAiMove(state.game, BLACK);
      state.aiThinking = false;
      if (!move) {
        const result = gameResult(state.game);
        endGame(result);
        refresh();
        return;
      }
      playMove(move);
    }, 400 + Math.random() * 400);
  }

  function endGame(result) {
    state.over = true;
    hintEl.textContent = t.overHint;
    if (result.result === "stalemate") {
      statusEl.textContent = t.stalemate;
      overlayTitleEl.textContent = t.stalemate;
      overlayTextEl.textContent = t.stalemateText;
    } else if (result.winner === WHITE) {
      statusEl.textContent = t.checkmateWhite;
      overlayTitleEl.textContent = t.checkmateWhite;
      overlayTextEl.textContent = t.mateTextWhite;
    } else {
      statusEl.textContent = t.checkmateBlack;
      overlayTitleEl.textContent = t.checkmateBlack;
      overlayTextEl.textContent = t.mateTextBlack;
    }
    overlayEl.classList.remove("hidden");
  }

  function undo() {
    if (!state.history.length || state.aiThinking) return;
    endDrag(true);

    let snap = state.history.pop();
    if (state.mode === "ai" && snap.game.turn === BLACK && state.history.length) {
      snap = state.history.pop();
    }

    state.game = snap.game;
    state.lastMove = snap.lastMove;
    state.captured = snap.captured;
    state.selected = null;
    state.over = false;
    overlayEl.classList.add("hidden");
    lastMoveEl.textContent = snap.lastMove
      ? describeMove(snap.lastMove, state.game.board)
      : t.started;
    // Fix last move description: board after undo is current; use history carefully
    if (snap.lastMove) {
      // describe from previous would need board before that move; show coord only
      lastMoveEl.textContent =
        coordLabel(snap.lastMove.from.r, snap.lastMove.from.c) +
        " \u2192 " +
        coordLabel(snap.lastMove.to.r, snap.lastMove.to.c);
    }
    refresh();
  }

  function squareAt(r, c) {
    return boardEl.querySelector('[data-r="' + r + '"][data-c="' + c + '"]');
  }

  // silence unused import warning in some linters
  void opposite;

  boot();
})();

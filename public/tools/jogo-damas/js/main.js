(function () {
  const {
    BLACK,
    WHITE,
    applyMove,
    cloneBoard,
    coordLabel,
    countPieces,
    findMove,
    getAllMoves,
    initialBoard,
    isDark,
    movesFrom,
    opposite,
    winner,
  } = window.Damas;
  const { chooseAiMove } = window.DamasAI;
  const { t, applyDom } = window.DamasI18n;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const hintEl = document.getElementById("hint");
  const lastMoveEl = document.getElementById("last-move");
  const countWhiteEl = document.getElementById("count-white");
  const countBlackEl = document.getElementById("count-black");
  const trayBlackEl = document.getElementById("tray-black");
  const trayWhiteEl = document.getElementById("tray-white");
  const overlayEl = document.getElementById("overlay");
  const overlayTitleEl = document.getElementById("overlay-title");
  const overlayTextEl = document.getElementById("overlay-text");
  const btnUndo = document.getElementById("btn-undo");
  const btnReset = document.getElementById("btn-reset");
  const btnAgain = document.getElementById("btn-again");
  const modeButtons = document.querySelectorAll(".mode-btn");

  const DRAG_THRESHOLD = 6;

  const state = {
    board: initialBoard(),
    turn: WHITE,
    mode: "pvp",
    selected: null,
    legal: [],
    history: [],
    lastMove: null,
    over: false,
    aiThinking: false,
    captured: { w: [], b: [] },
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
    applyDom();
    buildBoardDom();
    bindUi();
    bindDragGlobals();
    refresh();
  }

  function cloneCaptured(captured) {
    return {
      w: captured.w.map((p) => ({ color: p.color, king: !!p.king })),
      b: captured.b.map((p) => ({ color: p.color, king: !!p.king })),
    };
  }

  function pieceMarkup(isKing) {
    const disk =
      '<span class="piece-body" aria-hidden="true"></span>' +
      '<span class="piece-top" aria-hidden="true"></span>';
    if (!isKing) return disk;
    return (
      '<span class="piece-stack-base" aria-hidden="true">' +
      disk +
      "</span>" +
      '<span class="piece-stack-top" aria-hidden="true">' +
      disk +
      "</span>"
    );
  }

  function miniMarkup(isKing) {
    const disk =
      '<span class="piece-mini-body" aria-hidden="true"></span>' +
      '<span class="piece-mini-top" aria-hidden="true"></span>';
    if (!isKing) return disk;
    return (
      '<span class="piece-mini-stack-base" aria-hidden="true">' +
      disk +
      "</span>" +
      '<span class="piece-mini-stack-top" aria-hidden="true">' +
      disk +
      "</span>"
    );
  }

  function formatMove(move) {
    const from = coordLabel(move.from.r, move.from.c);
    const to = coordLabel(move.to.r, move.to.c);
    if (!move.captures.length) {
      return t("moveQuiet", { from: from, to: to });
    }
    return t("moveCapture", {
      from: from,
      to: to,
      n: move.captures.length,
    });
  }

  function pieceAria(p, r, c) {
    const colorLabel = p.color === WHITE ? t("pieceWhite") : t("pieceBlack");
    const kingLabel = p.king ? t("pieceKing") : "";
    return colorLabel + kingLabel + t("pieceAt", { square: coordLabel(r, c) });
  }

  function buildBoardDom() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement("button");
        sq.type = "button";
        sq.className = "square " + (isDark(r, c) ? "dark" : "light");
        sq.dataset.r = String(r);
        sq.dataset.c = String(c);
        sq.setAttribute("aria-label", coordLabel(r, c));
        if (isDark(r, c)) sq.classList.add("playable");
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
    state.board = initialBoard();
    state.turn = WHITE;
    state.selected = null;
    state.legal = getAllMoves(state.board, state.turn);
    state.history = [];
    state.lastMove = null;
    state.over = false;
    state.aiThinking = false;
    state.captured = { w: [], b: [] };
    overlayEl.classList.add("hidden");
    applyDom();
    lastMoveEl.textContent = t("gameStarted");
    refresh();
  }

  function refresh() {
    if (!state.over) {
      state.legal = getAllMoves(state.board, state.turn);
    }
    renderPieces();
    renderTrays();
    renderHighlights();
    updateHud();
  }

  function canControlPiece(r, c) {
    if (state.over || state.aiThinking) return false;
    if (state.mode === "ai" && state.turn === BLACK) return false;
    const p = state.board[r][c];
    if (!p || p.color !== state.turn) return false;
    return movesFrom(state.legal, r, c).length > 0;
  }

  function renderPieces() {
    boardEl.querySelectorAll(".piece").forEach((el) => el.remove());

    const movableOrigins = new Set(
      state.legal.map((m) => m.from.r + "," + m.from.c)
    );

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (!p) continue;
        const sq = squareAt(r, c);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "piece " + (p.color === WHITE ? "white" : "black");
        if (p.king) btn.classList.add("king");
        const movable =
          !state.over &&
          p.color === state.turn &&
          movableOrigins.has(r + "," + c) &&
          !(state.mode === "ai" && state.turn === BLACK);
        if (movable) btn.classList.add("is-movable");
        if (state.selected && state.selected.r === r && state.selected.c === c) {
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
        btn.setAttribute("aria-label", pieceAria(p, r, c));
        btn.innerHTML = pieceMarkup(!!p.king);

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
    renderTray(trayBlackEl, state.captured.b);
    renderTray(trayWhiteEl, state.captured.w);
  }

  function renderTray(el, pieces) {
    if (!el) return;
    el.innerHTML = "";
    pieces.forEach((p) => {
      const disk = document.createElement("div");
      disk.className =
        "piece-mini " + (p.color === WHITE ? "white" : "black");
      if (p.king) disk.classList.add("king");
      disk.innerHTML = miniMarkup(!!p.king);
      el.appendChild(disk);
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
    if (drag.originBtn) {
      try {
        /* release handled by pointerup */
      } catch (_) {
        /* ignore */
      }
    }
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
      sq.classList.remove("selected", "valid-target", "must-capture");
    });

    if (state.over) return;

    const mustCapture = state.legal.some((m) => m.captures.length > 0);
    if (mustCapture) {
      const origins = new Set(state.legal.map((m) => m.from.r + "," + m.from.c));
      origins.forEach((k) => {
        const parts = k.split(",");
        const r = Number(parts[0]);
        const c = Number(parts[1]);
        squareAt(r, c).classList.add("must-capture");
      });
    }

    if (!state.selected) return;
    squareAt(state.selected.r, state.selected.c).classList.add("selected");
    const options = movesFrom(state.legal, state.selected.r, state.selected.c);
    for (const move of options) {
      squareAt(move.to.r, move.to.c).classList.add("valid-target");
    }
  }

  function updateHud() {
    countWhiteEl.textContent = String(countPieces(state.board, WHITE));
    countBlackEl.textContent = String(countPieces(state.board, BLACK));
    btnUndo.disabled = state.history.length === 0 || state.aiThinking;

    if (state.over) return;

    if (state.aiThinking) {
      statusEl.textContent = t("statusAiThinking");
      hintEl.textContent = t("hintAiThinking");
      return;
    }

    statusEl.textContent =
      state.turn === WHITE ? t("statusWhite") : t("statusBlack");

    if (state.mode === "ai" && state.turn === BLACK) {
      hintEl.textContent = t("hintAiTurn");
    } else if (state.legal.some((m) => m.captures.length > 0)) {
      hintEl.textContent = t("hintMustCapture");
    } else if (state.selected) {
      hintEl.textContent = t("hintSelected");
    } else {
      hintEl.textContent = t("hintDefault");
    }
  }

  function onSquareClick(r, c) {
    if (state.over || state.aiThinking) return;
    if (state.mode === "ai" && state.turn === BLACK) return;

    const piece = state.board[r][c];
    const isOwn = piece && piece.color === state.turn;

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
    state.history.push({
      board: cloneBoard(state.board),
      turn: state.turn,
      lastMove: state.lastMove,
      captured: cloneCaptured(state.captured),
    });

    for (const cap of move.captures) {
      const taken = state.board[cap.r][cap.c];
      if (taken) {
        state.captured[taken.color].push({
          color: taken.color,
          king: !!taken.king,
        });
      }
    }

    state.board = applyMove(state.board, move);
    state.lastMove = move;
    lastMoveEl.textContent = formatMove(move);
    state.selected = null;

    const next = opposite(state.turn);
    const win = winner(state.board, next);
    if (win) {
      state.turn = next;
      state.legal = [];
      endGame(win);
      refresh();
      return;
    }

    state.turn = next;
    refresh();

    if (state.mode === "ai" && state.turn === BLACK && !state.over) {
      scheduleAi();
    }
  }

  function scheduleAi() {
    state.aiThinking = true;
    updateHud();
    window.setTimeout(() => {
      const move = chooseAiMove(state.board, BLACK);
      state.aiThinking = false;
      if (!move) {
        endGame(WHITE);
        refresh();
        return;
      }
      playMove(move);
    }, 450 + Math.random() * 350);
  }

  function endGame(winColor) {
    state.over = true;
    const winKey =
      winColor === WHITE ? "statusWinWhite" : "statusWinBlack";
    statusEl.textContent = t(winKey);
    overlayTitleEl.textContent = t(winKey);
    overlayTextEl.textContent =
      winColor === WHITE ? t("overlayTextWhite") : t("overlayTextBlack");
    overlayEl.classList.remove("hidden");
    hintEl.textContent = t("hintGameOver");
  }

  function undo() {
    if (!state.history.length || state.aiThinking) return;
    endDrag(true);

    let snap = state.history.pop();
    if (state.mode === "ai" && snap.turn === BLACK && state.history.length) {
      snap = state.history.pop();
    }

    state.board = snap.board;
    state.turn = snap.turn;
    state.lastMove = snap.lastMove;
    state.captured = snap.captured
      ? cloneCaptured(snap.captured)
      : { w: [], b: [] };
    state.selected = null;
    state.over = false;
    overlayEl.classList.add("hidden");
    lastMoveEl.textContent = snap.lastMove
      ? formatMove(snap.lastMove)
      : t("gameStarted");
    refresh();
  }

  function squareAt(r, c) {
    return boardEl.querySelector('[data-r="' + r + '"][data-c="' + c + '"]');
  }

  boot();
})();
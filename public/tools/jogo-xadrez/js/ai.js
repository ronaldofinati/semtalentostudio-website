(function (global) {
  const {
    WHITE,
    BLACK,
    getLegalMoves,
    applyMove,
    materialScore,
    gameResult,
  } = global.Xadrez;

  function chooseAiMove(state, color) {
    color = color || BLACK;
    const moves = getLegalMoves(state, color);
    if (!moves.length) return null;

    // materialScore > 0 favors white; black picks lower scores
    const maximize = color === WHITE;
    let bestScore = maximize ? -Infinity : Infinity;
    const best = [];

    for (const move of moves) {
      const score = minimaxRoot(state, move, color);
      const better = maximize ? score > bestScore : score < bestScore;
      if (better) {
        bestScore = score;
        best.length = 0;
        best.push(move);
      } else if (score === bestScore) {
        best.push(move);
      }
    }

    return best[Math.floor(Math.random() * best.length)];
  }

  function minimaxRoot(state, move, color) {
    const next = applyMove(state, move);
    let bonus = 0;
    if (move.capture) {
      const vals = global.Xadrez.PIECE_VALUES;
      const cap = (vals[move.capture.type] || 0) * 0.2;
      bonus += color === WHITE ? cap : -cap;
    }
    if (move.promote) bonus += color === WHITE ? 1.2 : -1.2;
    return (
      minimax(next, 1, -Infinity, Infinity, next.turn === WHITE) +
      bonus +
      (Math.random() - 0.5) * 0.08
    );
  }

  /**
   * Depth-2 style search: after our move, look at opponent replies (depth leftover).
   * maximizing = true means evaluate for WHITE material (+ good for white).
   * AI plays BLACK, so from black's view we want to minimize materialScore.
   */
  function minimax(state, depth, alpha, beta, maximizing) {
    const result = gameResult(state);
    if (result.over) {
      if (result.result === "checkmate") {
        return result.winner === WHITE ? 10000 - depth : -10000 + depth;
      }
      return 0;
    }
    if (depth <= 0) {
      return evaluate(state);
    }

    const moves = getLegalMoves(state, state.turn);
    if (!moves.length) return evaluate(state);

    if (maximizing) {
      let value = -Infinity;
      for (const move of moves) {
        const next = applyMove(state, move);
        value = Math.max(value, minimax(next, depth - 1, alpha, beta, false));
        alpha = Math.max(alpha, value);
        if (beta <= alpha) break;
      }
      return value;
    }

    let value = Infinity;
    for (const move of moves) {
      const next = applyMove(state, move);
      value = Math.min(value, minimax(next, depth - 1, alpha, beta, true));
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return value;
  }

  function evaluate(state) {
    let score = materialScore(state.board);
    // Small positional nudge: center control
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (!p) continue;
        const center =
          3.5 - Math.abs(r - 3.5) + (3.5 - Math.abs(c - 3.5));
        const nudge = center * 0.05;
        score += p.color === WHITE ? nudge : -nudge;
      }
    }
    if (global.Xadrez.isInCheck(state.board, WHITE)) score -= 0.4;
    if (global.Xadrez.isInCheck(state.board, BLACK)) score += 0.4;
    return score;
  }

  global.XadrezAI = { chooseAiMove };
})(window);

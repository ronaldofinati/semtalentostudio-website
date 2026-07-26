(function (global) {
  const { BLACK, WHITE, applyMove, getAllMoves, countPieces } = global.Damas;

  function chooseAiMove(board, color) {
    color = color || BLACK;
    const moves = getAllMoves(board, color);
    if (!moves.length) return null;

    let bestScore = -Infinity;
    const best = [];

    for (const move of moves) {
      const score = evaluateMove(board, move, color);
      if (score > bestScore) {
        bestScore = score;
        best.length = 0;
        best.push(move);
      } else if (score === bestScore) {
        best.push(move);
      }
    }

    return best[Math.floor(Math.random() * best.length)];
  }

  function evaluateMove(board, move, color) {
    let score = move.captures.length * 12;
    if (move.promote) score += 8;

    const next = applyMove(board, move);
    const mine = countPieces(next, color);
    const theirs = countPieces(next, color === WHITE ? BLACK : WHITE);
    score += (mine - theirs) * 3;

    const centerBonus =
      3.5 - Math.abs(move.to.r - 3.5) - Math.abs(move.to.c - 3.5);
    score += centerBonus * 0.35;

    if (!move.captures.length) {
      const dir = color === BLACK ? 1 : -1;
      score += (move.to.r - move.from.r) * dir * 0.2;
    }

    score += Math.random() * 0.4;
    return score;
  }

  global.DamasAI = { chooseAiMove };
})(window);

(function (global) {
  const STRINGS = {
    pt: {
      brand: "Xadrez",
      brandSub: "Regras cl\u00e1ssicas \u00b7 8\u00d78",
      turnWhite: "Vez das brancas",
      turnBlack: "Vez das pretas",
      check: "Xeque!",
      checkmateWhite: "Xeque-mate \u2014 brancas vencem",
      checkmateBlack: "Xeque-mate \u2014 pretas vencem",
      stalemate: "Afogamento \u2014 empate",
      mode: "Modo",
      pvp: "Dois jogadores",
      ai: "Contra o PC",
      tipsTitle: "Dicas",
      tip1: "Clique ou arraste para mover",
      tip2: "Roque, en passant e promo\u00e7\u00e3o inclusos",
      tip3: "Xeque e mate seguem as regras cl\u00e1ssicas",
      undo: "Desfazer",
      reset: "Novo jogo",
      white: "Brancas",
      black: "Pretas",
      lastMove: "\u00daltima jogada",
      started: "Partida iniciada",
      hintDrag:
        "Arraste uma pe\u00e7a destacada at\u00e9 o destino (ou clique para selecionar).",
      hintSelected: "Arraste a pe\u00e7a at\u00e9 uma casa verde ou clique no destino.",
      hintAi: "Turno do computador.",
      hintThinking: "Aguarde a jogada das pretas.",
      thinking: "PC pensando\u2026",
      overlayEyebrow: "Fim de partida",
      again: "Jogar de novo",
      captured: "Capturadas",
      capturedHint: "Nas bordas do tabuleiro",
      overHint: "Partida encerrada.",
      mateTextWhite: "O rei preto n\u00e3o tem escapat\u00f3ria.",
      mateTextBlack: "O rei branco n\u00e3o tem escapat\u00f3ria.",
      stalemateText: "N\u00e3o h\u00e1 jogadas legais sem estar em xeque.",
    },
    en: {
      brand: "Chess",
      brandSub: "Classic rules \u00b7 8\u00d78",
      turnWhite: "White to move",
      turnBlack: "Black to move",
      check: "Check!",
      checkmateWhite: "Checkmate \u2014 white wins",
      checkmateBlack: "Checkmate \u2014 black wins",
      stalemate: "Stalemate \u2014 draw",
      mode: "Mode",
      pvp: "Two players",
      ai: "Vs computer",
      tipsTitle: "Tips",
      tip1: "Click or drag to move",
      tip2: "Castling, en passant and promotion included",
      tip3: "Check and mate follow classic rules",
      undo: "Undo",
      reset: "New game",
      white: "White",
      black: "Black",
      lastMove: "Last move",
      started: "Game started",
      hintDrag:
        "Drag a highlighted piece to its destination (or click to select).",
      hintSelected: "Drag the piece to a green square or click the target.",
      hintAi: "Computer's turn.",
      hintThinking: "Waiting for black's move.",
      thinking: "PC thinking\u2026",
      overlayEyebrow: "Game over",
      again: "Play again",
      captured: "Captured",
      capturedHint: "On the board edges",
      overHint: "Game finished.",
      mateTextWhite: "The black king has no escape.",
      mateTextBlack: "The white king has no escape.",
      stalemateText: "No legal moves and not in check.",
    },
    es: {
      brand: "Ajedrez",
      brandSub: "Reglas cl\u00e1sicas \u00b7 8\u00d78",
      turnWhite: "Turno de las blancas",
      turnBlack: "Turno de las negras",
      check: "\u00a1Jaque!",
      checkmateWhite: "Jaque mate \u2014 ganan las blancas",
      checkmateBlack: "Jaque mate \u2014 ganan las negras",
      stalemate: "Ahogado \u2014 tablas",
      mode: "Modo",
      pvp: "Dos jugadores",
      ai: "Contra el PC",
      tipsTitle: "Consejos",
      tip1: "Haz clic o arrastra para mover",
      tip2: "Enroque, al paso y coronaci\u00f3n incluidos",
      tip3: "Jaque y mate siguen las reglas cl\u00e1sicas",
      undo: "Deshacer",
      reset: "Nueva partida",
      white: "Blancas",
      black: "Negras",
      lastMove: "\u00daltima jugada",
      started: "Partida iniciada",
      hintDrag:
        "Arrastra una pieza destacada al destino (o haz clic para seleccionar).",
      hintSelected:
        "Arrastra la pieza a una casilla verde o haz clic en el destino.",
      hintAi: "Turno de la computadora.",
      hintThinking: "Espera la jugada de las negras.",
      thinking: "PC pensando\u2026",
      overlayEyebrow: "Fin de la partida",
      again: "Jugar de nuevo",
      captured: "Capturadas",
      capturedHint: "En los bordes del tablero",
      overHint: "Partida terminada.",
      mateTextWhite: "El rey negro no tiene escape.",
      mateTextBlack: "El rey blanco no tiene escape.",
      stalemateText: "No hay jugadas legales y no est\u00e1 en jaque.",
    },
    zh: {
      brand: "\u56fd\u9645\u8c61\u68cb",
      brandSub: "\u7ecf\u5178\u89c4\u5219 \u00b7 8\u00d78",
      turnWhite: "\u767d\u65b9\u884c\u68cb",
      turnBlack: "\u9ed1\u65b9\u884c\u68cb",
      check: "\u5c06\u519b\uff01",
      checkmateWhite: "\u5c06\u6b7b \u2014 \u767d\u65b9\u80dc",
      checkmateBlack: "\u5c06\u6b7b \u2014 \u9ed1\u65b9\u80dc",
      stalemate: "\u903c\u548c \u2014 \u5e73\u5c40",
      mode: "\u6a21\u5f0f",
      pvp: "\u53cc\u4eba\u5bf9\u6218",
      ai: "\u5bf9\u6218\u7535\u8111",
      tipsTitle: "\u63d0\u793a",
      tip1: "\u70b9\u51fb\u6216\u62d6\u52a8\u68cb\u5b50\u79fb\u52a8",
      tip2: "\u542b\u738b\u8f66\u6613\u4f4d\u3001\u5403\u8fc7\u8def\u5175\u4e0e\u5347\u53d8",
      tip3: "\u5c06\u519b\u4e0e\u5c06\u6b7b\u9075\u5faa\u7ecf\u5178\u89c4\u5219",
      undo: "\u64a4\u9500",
      reset: "\u65b0\u5bf9\u5c40",
      white: "\u767d\u65b9",
      black: "\u9ed1\u65b9",
      lastMove: "\u4e0a\u4e00\u7740",
      started: "\u5bf9\u5c40\u5f00\u59cb",
      hintDrag:
        "\u5c06\u9ad8\u4eae\u68cb\u5b50\u62d6\u5230\u76ee\u6807\u683c\uff08\u6216\u70b9\u51fb\u9009\u62e9\uff09\u3002",
      hintSelected:
        "\u62d6\u5230\u7eff\u8272\u683c\u6216\u70b9\u51fb\u76ee\u6807\u683c\u3002",
      hintAi: "\u7535\u8111\u56de\u5408\u3002",
      hintThinking: "\u7b49\u5f85\u9ed1\u65b9\u8d70\u68cb\u3002",
      thinking: "\u7535\u8111\u601d\u8003\u4e2d\u2026",
      overlayEyebrow: "\u5bf9\u5c40\u7ed3\u675f",
      again: "\u518d\u6765\u4e00\u5c40",
      captured: "\u88ab\u5403\u5b50",
      capturedHint: "\u5728\u68cb\u76d8\u8fb9\u7f18",
      overHint: "\u5bf9\u5c40\u5df2\u7ed3\u675f\u3002",
      mateTextWhite: "\u9ed1\u738b\u65e0\u8def\u53ef\u9003\u3002",
      mateTextBlack: "\u767d\u738b\u65e0\u8def\u53ef\u9003\u3002",
      stalemateText:
        "\u65e0\u5408\u6cd5\u7740\u6cd5\u4e14\u672a\u5904\u4e8e\u88ab\u5c06\u519b\u3002",
    },
  };

  function detectLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = (params.get("lang") || "").toLowerCase();
      if (q.startsWith("pt")) return "pt";
      if (q.startsWith("en")) return "en";
      if (q.startsWith("es")) return "es";
      if (q.startsWith("zh")) return "zh";
    } catch (_) {
      /* ignore */
    }
    const nav = (navigator.language || "pt").toLowerCase();
    if (nav.startsWith("en")) return "en";
    if (nav.startsWith("es")) return "es";
    if (nav.startsWith("zh")) return "zh";
    return "pt";
  }

  const lang = detectLang();
  const t = STRINGS[lang] || STRINGS.pt;

  function applyStatic() {
    document.documentElement.lang =
      lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : lang;
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set("brand-mark", t.brand);
    set("brand-sub", t.brandSub);
    set("label-mode", t.mode);
    set("label-tips", t.tipsTitle);
    set("tip-1", t.tip1);
    set("tip-2", t.tip2);
    set("tip-3", t.tip3);
    set("btn-undo", t.undo);
    set("btn-reset", t.reset);
    set("label-white", t.white);
    set("label-black", t.black);
    set("label-last", t.lastMove);
    set("label-captured", t.captured);
    set("captured-hint", t.capturedHint);
    set("overlay-eyebrow", t.overlayEyebrow);
    set("btn-again", t.again);
    document.title = t.brand;
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      if (btn.dataset.mode === "pvp") btn.textContent = t.pvp;
      if (btn.dataset.mode === "ai") btn.textContent = t.ai;
    });
  }

  global.XadrezI18n = { lang, t, applyStatic, STRINGS };
})(window);

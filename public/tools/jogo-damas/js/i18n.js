(function (global) {
  const DICTS = {
    pt: {
      title: "Damas Brasileiras",
      brand: "Damas",
      brandSub: "Regras brasileiras — 8×8",
      modeHeading: "Modo",
      modeGroupAria: "Modo de jogo",
      modePvp: "Dois jogadores",
      modeAi: "Contra o PC",
      rulesHeading: "Capturas",
      rule1: "Captura é obrigatória",
      rule2: "Maior sequência vence o empate",
      rule3: "Pedras capturam para frente e para trás",
      rule4: "Damas voadoras (movimento longo)",
      undo: "Desfazer",
      reset: "Novo jogo",
      again: "Jogar de novo",
      white: "Brancas",
      black: "Pretas",
      lastMoveHeading: "Última jogada",
      gameStarted: "Partida iniciada",
      hintDefault:
        "Arraste uma peça destacada até o destino (ou clique para selecionar).",
      hintSelected:
        "Arraste a peça até uma casa verde ou clique no destino.",
      hintMustCapture:
        "Captura obrigatória: arraste uma peça marcada em vermelho (maior sequência).",
      hintAiTurn: "Turno do computador.",
      hintAiThinking: "Aguarde a jogada das pretas.",
      hintGameOver: "Partida encerrada.",
      statusWhite: "Vez das brancas",
      statusBlack: "Vez das pretas",
      statusAiThinking: "PC pensando…",
      statusWinWhite: "Brancas venceram",
      statusWinBlack: "Pretas venceram",
      overlayEyebrow: "Fim de partida",
      overlayTextWhite: "As pretas ficaram sem jogadas ou sem peças.",
      overlayTextBlack: "As brancas ficaram sem jogadas ou sem peças.",
      boardSectionAria: "Tabuleiro de damas",
      boardAria: "Tabuleiro 8 por 8",
      trayBlackAria: "Peças pretas capturadas",
      trayWhiteAria: "Peças brancas capturadas",
      pieceWhite: "Branca",
      pieceBlack: "Preta",
      pieceKing: " dama",
      pieceAt: " em {square}",
      moveQuiet: "{from} → {to}",
      moveCapture: "{from} × {to} ({n})",
    },
    en: {
      title: "Brazilian Checkers",
      brand: "Checkers",
      brandSub: "Brazilian rules — 8×8",
      modeHeading: "Mode",
      modeGroupAria: "Game mode",
      modePvp: "Two players",
      modeAi: "Vs computer",
      rulesHeading: "Captures",
      rule1: "Capturing is mandatory",
      rule2: "Longest sequence wins ties",
      rule3: "Men capture forward and backward",
      rule4: "Flying kings (long moves)",
      undo: "Undo",
      reset: "New game",
      again: "Play again",
      white: "White",
      black: "Black",
      lastMoveHeading: "Last move",
      gameStarted: "Game started",
      hintDefault: "Drag a highlighted piece to its destination (or click to select).",
      hintSelected: "Drag the piece to a green square or click the destination.",
      hintMustCapture:
        "Mandatory capture: drag a red-marked piece (longest sequence).",
      hintAiTurn: "Computer's turn.",
      hintAiThinking: "Waiting for Black's move.",
      hintGameOver: "Game over.",
      statusWhite: "White to move",
      statusBlack: "Black to move",
      statusAiThinking: "PC thinking…",
      statusWinWhite: "White wins",
      statusWinBlack: "Black wins",
      overlayEyebrow: "Game over",
      overlayTextWhite: "Black has no moves or pieces left.",
      overlayTextBlack: "White has no moves or pieces left.",
      boardSectionAria: "Checkers board",
      boardAria: "8 by 8 board",
      trayBlackAria: "Captured black pieces",
      trayWhiteAria: "Captured white pieces",
      pieceWhite: "White",
      pieceBlack: "Black",
      pieceKing: " king",
      pieceAt: " on {square}",
      moveQuiet: "{from} → {to}",
      moveCapture: "{from} × {to} ({n})",
    },
    es: {
      title: "Damas Brasileñas",
      brand: "Damas",
      brandSub: "Reglas brasileñas — 8×8",
      modeHeading: "Modo",
      modeGroupAria: "Modo de juego",
      modePvp: "Dos jugadores",
      modeAi: "Contra el PC",
      rulesHeading: "Capturas",
      rule1: "La captura es obligatoria",
      rule2: "La secuencia más larga gana el empate",
      rule3: "Las piedras capturan adelante y atrás",
      rule4: "Damas voladoras (movimiento largo)",
      undo: "Deshacer",
      reset: "Nueva partida",
      again: "Jugar de nuevo",
      white: "Blancas",
      black: "Negras",
      lastMoveHeading: "Última jugada",
      gameStarted: "Partida iniciada",
      hintDefault:
        "Arrastra una pieza destacada hasta el destino (o haz clic para seleccionar).",
      hintSelected:
        "Arrastra la pieza a una casilla verde o haz clic en el destino.",
      hintMustCapture:
        "Captura obligatoria: arrastra una pieza marcada en rojo (mayor secuencia).",
      hintAiTurn: "Turno del ordenador.",
      hintAiThinking: "Espera la jugada de las negras.",
      hintGameOver: "Partida terminada.",
      statusWhite: "Turno de las blancas",
      statusBlack: "Turno de las negras",
      statusAiThinking: "PC pensando…",
      statusWinWhite: "Ganan las blancas",
      statusWinBlack: "Ganan las negras",
      overlayEyebrow: "Fin de la partida",
      overlayTextWhite: "Las negras se quedaron sin jugadas o sin piezas.",
      overlayTextBlack: "Las blancas se quedaron sin jugadas o sin piezas.",
      boardSectionAria: "Tablero de damas",
      boardAria: "Tablero 8 por 8",
      trayBlackAria: "Piezas negras capturadas",
      trayWhiteAria: "Piezas blancas capturadas",
      pieceWhite: "Blanca",
      pieceBlack: "Negra",
      pieceKing: " dama",
      pieceAt: " en {square}",
      moveQuiet: "{from} → {to}",
      moveCapture: "{from} × {to} ({n})",
    },
    zh: {
      title: "巴西跳棋",
      brand: "跳棋",
      brandSub: "巴西规则 — 8×8",
      modeHeading: "模式",
      modeGroupAria: "游戏模式",
      modePvp: "双人",
      modeAi: "对战电脑",
      rulesHeading: "吃子",
      rule1: "吃子必须进行",
      rule2: "最长连吃优先",
      rule3: "兵可向前向后吃子",
      rule4: "飞王（远距离移动）",
      undo: "撤销",
      reset: "新游戏",
      again: "再玩一局",
      white: "白方",
      black: "黑方",
      lastMoveHeading: "上一手",
      gameStarted: "对局开始",
      hintDefault: "拖动高亮棋子到目标格（或点击选择）。",
      hintSelected: "将棋子拖到绿格，或点击目标格。",
      hintMustCapture: "必须吃子：拖动红框棋子（最长连吃）。",
      hintAiTurn: "电脑回合。",
      hintAiThinking: "等待黑方走棋。",
      hintGameOver: "对局结束。",
      statusWhite: "白方行棋",
      statusBlack: "黑方行棋",
      statusAiThinking: "电脑思考中…",
      statusWinWhite: "白方获胜",
      statusWinBlack: "黑方获胜",
      overlayEyebrow: "对局结束",
      overlayTextWhite: "黑方无子可走或已无棋子。",
      overlayTextBlack: "白方无子可走或已无棋子。",
      boardSectionAria: "跳棋棋盘",
      boardAria: "8×8 棋盘",
      trayBlackAria: "被吃的黑子",
      trayWhiteAria: "被吃的白子",
      pieceWhite: "白子",
      pieceBlack: "黑子",
      pieceKing: "王",
      pieceAt: " 在 {square}",
      moveQuiet: "{from} → {to}",
      moveCapture: "{from} × {to} ({n})",
    },
  };

  const LANG_ATTR = { pt: "pt-BR", en: "en", es: "es", zh: "zh-CN" };

  function detectLocale() {
    try {
      const q = new URLSearchParams(global.location.search).get("lang");
      if (q && DICTS[q]) return q;
    } catch (_) {
      /* ignore */
    }
    return "pt";
  }

  const locale = detectLocale();

  function t(key, vars) {
    const table = DICTS[locale] || DICTS.pt;
    let s = table[key];
    if (s == null) s = DICTS.pt[key];
    if (s == null) s = key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function applyDom(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");
      const value = t(key);
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    });
    if (document.documentElement) {
      document.documentElement.lang = LANG_ATTR[locale] || locale;
    }
    if (document.title != null) document.title = t("title");
  }

  global.DamasI18n = { t: t, locale: locale, applyDom: applyDom };
})(window);
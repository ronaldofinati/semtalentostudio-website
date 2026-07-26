import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/models/3d/catalog.json"), "utf8"),
);

/** Keep brands, product codes, materials, and maker jargon in English. */
const TITLE_PT = {
  "printables_1005333_raspberry-pi-5-case": "Case Raspberry Pi 5",
  "printables_103696_christmas-decoration-with-traditional-mounting":
    "Enfeite de Natal com fixação tradicional",
  "printables_1038731_hygrometer-case-for-aa-or-aaa-battery":
    "Case de higrômetro para bateria AA ou AAA",
  "printables_1051411_framework-portable-handheld-case-beth-deck-rev-15":
    "Case portátil Framework handheld (Beth Deck rev. 1.5)",
  "printables_106329_meshlicious-pc-case-feet": "Pés para case PC Meshlicious",
  "printables_107185_classic-rocket": "Foguete clássico",
  "printables_1084_rpi3b-prusa-mk3-mk3s-frame-mount-case":
    "Case RPi3B com suporte de frame Prusa MK3 / MK3S",
  "printables_1106873_modern-and-unique-vase-for-your-home-decor":
    "Vaso moderno e exclusivo para decoração",
  "printables_117820_raspberry-pi-3-case": "Case Raspberry Pi 3",
  "printables_119650_pikvm-case": "Case PiKVM",
  "printables_1215943_vase-with-rectangular-pattern":
    "Vaso com padrão retangular",
  "printables_1243685_fox-vase": "Vaso raposa",
  "printables_1368704_raspberry-pi-pico-case-1-2-wireless":
    "Case Raspberry Pi Pico (1 e 2, Wireless)",
  "printables_1368935_thin-samsung-galaxy-z-fold-7-case-with-camera-bump":
    "Capa fina Samsung Galaxy Z Fold 7 com relevo da câmera",
  "printables_139936_vase": "Vaso",
  "printables_140171_plant-pot-traysaucer": "Prato / saucer para vaso",
  "printables_1402055_a-creepy-stylized-tree-with-twisted-branches-hollo":
    "Árvore estilizada sinistra com galhos retorcidos, olhos ocos e base larga",
  "printables_140214_pencil-case": "Estojo",
  "printables_140621_dual-asthma-inhaler-case":
    "Case duplo para inalador de asma",
  "printables_1438930_flashforge-ad5x-nozzle-holder-case-remix":
    "Case suporte de nozzle Flashforge AD5X (Remix)",
  "printables_144317_poco-x3-x3-pro-case": "Capa POCO X3 / X3 Pro",
  "printables_1458664_dual-level-planter": "Floreira de dois níveis",
  "printables_1459945_ribbed-harmony-planter": "Floreira Harmony canelada",
  "printables_1460252_happy-pot": "Vaso Happy Pot",
  "printables_146128_vase-rainbow-duhova-vaza": "Vaso arco-íris",
  "printables_1465876_catpot": "CatPot",
  "printables_1465893_the-plant-buddies": "The Plant Buddies",
  "printables_1466237_rainy-pot": "Vaso Rainy Pot",
  "printables_1468595_haven-case-for-raspberry-pi-based-manet-by-paralle":
    "Haven — Case MANET com Raspberry Pi (Parallel × MorosX)",
  "printables_1472668_leaf-key-wall-key-holder":
    "Leaf & Key — porta-chaves de parede",
  "printables_1473574_u-terra-planter": "Floreira U-Terra",
  "printables_153434_bic-lighter-leather-case-pattern":
    "Molde de case de couro para isqueiro Bic",
  "printables_153705_spiral-vase": "Vaso espiral",
  "printables_1558561_bic-mini-lighter-grenade-case":
    "Case estilo granada para isqueiro Bic Mini",
  "printables_163066_toothbrush-travel-case":
    "Case de viagem para escova de dentes",
  "printables_1635128_mesh-lamp-next-generation":
    "Luminária mesh — next generation",
  "printables_164464_well-in-that-case": "Well in that case",
  "printables_175827_rigid-case-for-the-galaxy-tab-s6-lite":
    "Capa rígida Galaxy Tab S6 Lite",
  "printables_1762974_modern-geometric-desk-organizer-plant-pot-cover":
    "Organizador de mesa geométrico / cobertura para vaso",
  "printables_184938_iphone-12-mini-slim-case": "Capa slim iPhone 12 mini",
  "printables_202774_voronoi-vase-light": "Luminária vaso Voronoi",
  "printables_204882_flipper-zero-case": "Case Flipper Zero",
  "printables_205297_industrial-lamp-with-concrete-base":
    "Luminária industrial com base de concreto",
  "printables_220890_spiral-vase": "Vaso espiral",
  "printables_223917_arduino-nano-case": "Case Arduino Nano",
  "printables_225170_industrial-monstera-pot": "Vaso industrial Monstera",
  "printables_230192_a-self-watering-planter-one-print-in-spiral-vase":
    "Floreira autoirrigável (uma impressão em vase mode)",
  "printables_230275_wingspan-base-ee-oe-sleeved-insert":
    "Base Wingspan + EE + OE + inserto sleeved",
  "printables_238672_arduino-case": "Case Arduino",
  "printables_243424_multi-use-case-with-inserts":
    "Case multiuso com insertos",
  "printables_251919_toothbrush-travel-case":
    "Case de viagem para escova de dentes",
  "printables_253254_flipper-zero-case": "Case Flipper Zero",
  "printables_259524_flipper-zero-and-devboard-storage-case":
    "Case de armazenamento Flipper Zero e Devboard",
  "printables_261434_vase-mode-wing": "Asa em vase mode",
  "printables_261624_airpods-pro-case": "Case AirPods Pro",
  "printables_26172_stacker-twist-pot-vase-mode":
    "Vaso Stacker Twist (vase mode)",
  "printables_270368_raspberry-pi-3b-case": "Case Raspberry Pi 3B+",
  "printables_271478_gridfinity-honeycomb-storage-wall-stronger-base-pl":
    "Gridfinity Honeycomb Storage Wall — bases reforçadas",
  "printables_272622_iphone-11pro-case": "Capa iPhone 11 / Pro",
  "printables_276263_iphone-13-mini-case": "Capa iPhone 13 mini",
  "printables_27649_thermometer-case-for-ikea-lack-enclosure":
    "Case de termômetro para enclosure Ikea LACK",
  "printables_283152_centerpiece-vase-bud-vase-7-variations":
    "Vaso centro de mesa / vasinho (7 variações)",
  "printables_286611_milk-carton-vase": "Vaso caixa de leite",
  "printables_289500_westone-iem-case-with-flush-lid-headphone-case":
    "Case Westone IEM com tampa flush / case de fone",
  "printables_314289_steam-deck-carrying-case-insert-eu":
    "Inserto para carrying case Steam Deck (EU)",
  "printables_316252_samsung-galaxy-s22-ultra-case":
    "Capa Samsung Galaxy S22 Ultra",
  "printables_317496_the-kunai-corne-case": "The Kunai — Case Corne",
  "printables_327407_mini-measuring-cup-vase-mode":
    "Mini copo medidor (vase mode)",
  "printables_32825_dental-night-guard-case":
    "Case para placa dental (night guard)",
  "printables_329770_universal-bauble-ornament-hanger":
    "Gancho universal para bola de Natal",
  "printables_331681_ornament-cap-print-in-vase-mode-and-eyelet-for-chr":
    "Tampa de enfeite (vase mode) e ilhós para ornamentos de Natal",
  "printables_333683_chromecast-remote-case": "Case do controle Chromecast",
  "printables_338982_lttstorecom-altoids-tin-bit-case":
    "Case de bits estilo lata Altoids (lttstore.com)",
  "printables_362020_festool-systainer3-case-rails-7mm-half-cut":
    "Trilhos para case FESTOOL Systainer³ (corte 7 mm half)",
  "printables_364676_iphone-14-case": "Capa iPhone 14",
  "printables_377158_parametric-gridfinity-base-plate-freecad-file-incl":
    "Base plate Gridfinity paramétrica (arquivo FreeCAD incluso)",
  "printables_378189_incense-holder": "Porta-incenso",
  "printables_381045_bambu-lab-x1-desiccant-case":
    "Case de dessecante Bambu Lab X1",
  "printables_384357_flux-paste-box-for-rugged-multipart-pinecilts100ts":
    "Caixa de pasta flux para case rugged multipart Pinecil / TS100 / TS80",
  "printables_386322_21700-battery-case": "Case para bateria 21700",
  "printables_393311_18650-battery-case": "Case para bateria 18650",
  "printables_3951_appler-iphone-7-8-case": "Capa Apple iPhone 7–8",
  "printables_3952_appler-iphone-7-8-plus-case": "Capa Apple iPhone 7–8 Plus",
  "printables_395724_samsung-s23-ultra-two-part-case":
    "Capa Samsung S23 Ultra em duas partes",
  "printables_41391_raspberry-pi-4-case-with-fan-mount":
    "Case Raspberry Pi 4 com suporte para fan",
  "printables_430144_gridfinity-base-with-snap-connectors":
    "Base Gridfinity com conectores snap",
  "printables_433905_iphone-13-pro-max-case": "Capa iPhone 13 Pro Max",
  "printables_443690_1x1-short-vase-mode-gridfinity-bin-with-magnets":
    "Bin Gridfinity 1×1 curto em vase mode com ímãs",
  "printables_461852_ikea-kallax-gridfinity-base-plate-stls":
    "Base plate Gridfinity para Ikea Kallax (STL)",
  "printables_464786_slim-magnetic-sd-micro-sd-card-case":
    "Case magnético slim para cartões SD + Micro SD",
  "printables_47612_air-quality-sensor-case-esp32":
    "Case de sensor de qualidade do ar ESP32",
  "printables_4787_samsung-galaxy-s10-case": "Capa Samsung Galaxy S10+",
  "printables_491146_wemos-d1-mini-v40-case-wled":
    "Case Wemos D1 Mini V4.0 — WLED",
  "printables_50035_esp32-devkit-v1-chunky-case":
    'Case ESP32 DevKit V1 "Chunky"',
  "printables_50038_esp32-devkit-v1-case": "Case ESP32 DevKit V1",
  "printables_507308_iphone-11-phone-case": "Capa iPhone 11",
  "printables_510952_protective-case-for-tp4056": "Case protetor para TP4056",
  "printables_535656_paper-bag": 'Sacola "Paper" Bag',
  "printables_53723_pinecil-case": "Case Pinecil",
  "printables_544139_fluke-107-rugged-case": "Case rugged Fluke 107",
  "printables_5475_appler-iphone-xr-case-and-bumper":
    "Capa Apple iPhone XR e bumper",
  "printables_557353_iphone-1212-pro-case-magsafe":
    "Capa iPhone 12 / 12 Pro MagSafe",
  "printables_57877_raspberry-pi-4-nes-case": "Case Raspberry Pi 4 estilo NES",
  "printables_632637_tall-christmas-tree-vase-mode":
    "Árvore de Natal alta — vase mode",
  "printables_639512_iphone-15-case": "Capa iPhone 15",
  "printables_647027_iphone-15-pro-max-case-pla-and-tpu":
    "Capa iPhone 15 Pro Max (PLA e TPU)",
  "printables_681907_iphone-14-case": "Capa iPhone 14",
  "printables_695402_samsung-zflip-5-mobile-case": "Capa Samsung Z Flip 5",
  "printables_696647_base-for-crocs-jibbitzcharm":
    "Base para Crocs Jibbitz / Charm",
  "printables_699154_lego-base-plate": "Base plate LEGO",
  "printables_78397_iphone-13-pro-basic-case": "Capa básica iPhone 13 Pro",
  "printables_789513_case-for-five-switch": "Case para five switch",
  "printables_847476_bubble-vase-vase-mode": "Vaso bolha — vase mode",
  "printables_860071_samsung-galaxy-a15-tpu-casecover":
    "Capa / cover TPU Samsung Galaxy A15",
  "printables_888011_nodebrix-modular-case-system-for-heltec-lora32-v3":
    "Sistema modular de case NodeBrix para Heltec LoRa32 v3 e RAK19007 (Meshtastic)",
  "printables_968226_screw-box-with-sliding-lid-screw-case-small-parts":
    "Caixa de parafusos com tampa deslizante | case | organizador de peças pequenas",
};

const missing = [];
const lines = [
  "/** Portuguese display titles for STL models (en/es/zh keep English `title`). */",
  "export const stlTitlesPt: Record<string, string> = {",
];

for (const m of catalog) {
  const pt = TITLE_PT[m.id];
  if (!pt) {
    missing.push(m.id + " | " + m.title);
    continue;
  }
  lines.push(`  ${JSON.stringify(m.id)}: ${JSON.stringify(pt)},`);
}
lines.push("};");
lines.push("");
lines.push("export function getStlDisplayTitle(");
lines.push("  id: string,");
lines.push("  englishTitle: string,");
lines.push('  locale: string,');
lines.push("): string {");
lines.push('  if (locale === "pt" || locale.startsWith("pt-")) {');
lines.push("    return stlTitlesPt[id] ?? englishTitle;");
lines.push("  }");
lines.push("  return englishTitle;");
lines.push("}");
lines.push("");

const outTs = path.join(ROOT, "src/data/stl-titles-pt.ts");
fs.writeFileSync(outTs, lines.join("\n"), "utf8");
console.log("wrote", outTs, "entries", catalog.length - missing.length);
if (missing.length) {
  console.log("MISSING", missing.length);
  missing.forEach((x) => console.log(x));
  process.exitCode = 1;
}
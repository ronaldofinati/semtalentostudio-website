const fs = require("fs");
const md = `# Handoff \u2014 Galeria Design de Cal\u00e7ados

Documento para continuar o trabalho em outro terminal ou sess\u00e3o de agente.

**Projeto:** \`D:\\Sem Talento Studio\\Projeto Website\`  
**P\u00e1gina:** \`/pt/projetos/footwear-design\` (equivalente em \`/en\`, \`/es\`, \`/zh\` via next-intl)  
**\u00daltima atualiza\u00e7\u00e3o:** junho de 2026

---

## Stack: Next.js 15, Tailwind 4, next-intl, Sharp

| Item | Detalhe |
|------|---------|
| Framework | Next.js 15 (App Router) + React 19 |
| Estilo | Tailwind CSS 4 (\`postcss.config.mjs\`, \`@tailwindcss/postcss\`) |
| i18n | next-intl \u2014 \`messages/{pt,en,es,zh}.json\` |
| Imagens | Sharp \u2192 WebP em \`public/projects/footwear/\` |
| Fontes PNG | \`Assets/projects/footwear/{slug}/\` |

Arquivos centrais da galeria:

- \`src/components/FootwearShowcase.tsx\` \u2014 cards, lightbox, layouts (\`standard\`, \`pair\`, \`collection\`)
- \`src/data/project-media.ts\` \u2014 \`FOOTWEAR_PRODUCT_IMAGES\`, \`FOOTWEAR_PRODUCT_IDS\`, \`PROJECT_COVERS\`
- \`src/app/[locale]/projetos/[slug]/page.tsx\` \u2014 monta \`FootwearShowcase\` para \`footwear-design\`
- \`messages/*.json\` \u2192 \`projects.items.footwear-design.products\`

---

## Comandos essenciais

\`\`\`bash
cd D:\\Sem Talento Studio\\Projeto Website

npm run dev      # next dev --turbopack
npm run build
npm run start
npm run lint
\`\`\`

### Scripts de processamento (raiz do projeto)

| Comando | Fun\u00e7\u00e3o |
|---------|--------|
| \`node scripts/process-urban-canvas.mjs\` | Urban Canvas 70 \u2192 \`urban-canvas-01..04.webp\` |
| \`node scripts/process-performance.mjs\` | Performance \u2192 \`performance-01..04.webp\` |
| \`node scripts/process-flux-stride.mjs\` | Flux Stride Pro |
| \`node scripts/process-flux-stride-night.mjs\` | Flux Stride Pro \u2014 Night |
| \`node scripts/process-eclat-95.mjs\` | \u00c9clat 95 champagne |
| \`node scripts/process-eclat-rubis.mjs\` | \u00c9clat 95 \u2014 Rubis |
| \`node scripts/process-etoile-pointe.mjs\` | \u00c9toile Pointe (par) |
| \`node scripts/compose-kids-hero.mjs\` | Comp\u00f5e \`00-hero.png\` (quarto + recortes) |
| \`node scripts/process-kids-playroom.mjs\` | Petit Pas (hero + tiles est\u00fadio) |

Legado / utilit\u00e1rios: \`process-footwear.mjs\`, \`process-generated-cards.mjs\`, \`process-urban-v2.mjs\`, \`warm-urban-canvas-04.mjs\`, \`rotate-etoile-03.mjs\`, \`patch-*.cjs\`, \`fix-footwear-json.cjs\`, \`clean-footwear-site.cjs\`, \`remove-footwear-products.cjs\`.

### compose-kids-hero + process-kids-playroom

\`\`\`bash
node scripts/compose-kids-hero.mjs
node scripts/process-kids-playroom.mjs
\`\`\`

\`process-kids-playroom.mjs\` chama \`compose-kids-hero.mjs\` automaticamente se existir \`Assets/projects/footwear/kids-playroom/00-bedroom-bg.png\`.

### Corrigir UTF-16 no drive D: (one-liner)

\`\`\`bash
node -e "const fs=require('fs'),p='D:\\\\Website\\\\FOOTWEAR-GALLERY-HANDOFF.md';const b=fs.readFileSync(p);const u16=b[0]===0xFF&&b[1]===0xFE;const t=u16?b.slice(2).toString('utf16le'):b.toString('utf8');fs.writeFileSync(p,t.replace(/^\\uFEFF/,''),'utf8');console.log('UTF-8 OK',p)"
\`\`\`

Criar ou sobrescrever este handoff:

\`\`\`javascript
const fs = require("fs");
fs.writeFileSync("D:\\\\Website\\\\FOOTWEAR-GALLERY-HANDOFF.md", conteudoMarkdown, "utf8");
\`\`\`

---

## Oito cards conclu\u00eddos (ordem da galeria)

1. **urban-canvas** \u2014 Urban Canvas 70 (\`standard\`)
2. **performance** \u2014 Kynetic Pro Velocity + Apex Forge Carbon (\`standard\`)
3. **flux-stride** \u2014 Flux Stride Pro (\`standard\`)
4. **flux-stride-night** \u2014 variante Night (\`standard\`)
5. **eclat-95** \u2014 \u00c9clat 95 champagne (\`standard\`)
6. **eclat-95-rubis** \u2014 \u00c9clat 95 Rubis (\`standard\`)
7. **etoile-pointe** \u2014 \u00c9toile Pointe (\`pair\`)
8. **kids-playroom** \u2014 **Petit Pas** (\`collection\`)

Manter a mesma ordem em \`FOOTWEAR_PRODUCT_IDS\`, em \`products\` nos quatro locales e na p\u00e1gina.

---

## Layout types: standard, pair, collection em FootwearShowcase.tsx

| \`layout\` | Componente | Comportamento |
|----------|------------|---------------|
| omitido / \`standard\` | \`ProductCard\` | Aspect 4:3, carrossel + miniaturas (\u22647 imagens); 1 coluna no grid \`lg\` |
| \`pair\` | \`PairProductCard\` | Hero 21:10 + grade de tiles; \`lg:col-span-2\` |
| \`collection\` | \`CollectionProductCard\` | Hero = imagem \`00\`; tiles = \`01..n\`; tag \u00e2mbar; \`lg:col-span-2\` |

\`ImageLightbox\`: Esc, setas, textos em \`common\` (zoom, fechar, anterior, pr\u00f3xima).

---

## Diagrama do grid (\`lg:grid-cols-2\`, \`gap-8\`)

\`\`\`
\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502   urban-canvas      \u2502   performance       \u2502
\u2502   (standard)        \u2502   (standard)        \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502   flux-stride       \u2502   flux-stride-night \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502   eclat-95          \u2502   eclat-95-rubis    \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502   etoile-pointe (pair \u2014 col-span-2)      \u2502
\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502   kids-playroom / Petit Pas (collection) \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

Mobile: uma coluna; pair e collection ocupam largura total.

---

## Mapeamento de pastas e scripts

### Sa\u00edda: \`public/projects/footwear/\`

WebPs em \`src/data/project-media.ts\`. Capa: \`cover.webp\`.

### Entrada: \`Assets/projects/footwear/{slug}/\`

| Slug | Fontes | Script | Sa\u00edda |
|------|--------|--------|-------|
| \`urban-canvas\` | \`01-lateral.png\` \u2026 \`04-detalhe-cadarco.png\` | \`process-urban-canvas.mjs\` | \`urban-canvas-01..04.webp\` |
| \`performance\` | \`kynetic-pro-velocity.webp\`, \`gen-kynetic-pro-02.png\`, \`apex-forge-carbon.webp\`, \`gen-apex-forge-02.png\` | \`process-performance.mjs\` | \`performance-01..04.webp\` |
| \`flux-stride\` | \`01\`\u2013\`04\` | \`process-flux-stride.mjs\` | \`flux-stride-01..04.webp\` |
| \`flux-stride-night\` | idem | \`process-flux-stride-night.mjs\` | \`flux-stride-night-01..04.webp\` |
| \`eclat-95\` | \`01\`\u2013\`04\` | \`process-eclat-95.mjs\` | \`eclat-95-01..04.webp\` |
| \`eclat-95-rubis\` | \`01\`\u2013\`04\` | \`process-eclat-rubis.mjs\` | \`eclat-95-rubis-01..04.webp\` |
| \`etoile-pointe\` | \`01-par-frente\`, \`02-par-angulo\`, \`03-par-top\`, \`04-detalhe-caixa\` | \`process-etoile-pointe.mjs\` | \`etoile-pointe-01..04.webp\` |
| \`kids-playroom\` | \`00-bedroom-bg.png\`, \`01\`\u2013\`04\`, \`00-hero.png\` | \`compose-kids-hero.mjs\` + \`process-kids-playroom.mjs\` | \`kids-playroom-00..04.webp\` |

### WebPs \u00f3rf\u00e3os (limpeza pendente)

\`apex-forge-*.webp\`, \`baby-zoo-*.webp\`, \`flex-wave-*.webp\`, \`flux-slip-*.webp\`, \`kynetic-pro-*.webp\`, \`last-studio-*.webp\`, \`talento-rasteira-*.webp\`, \`vertex-stride-*.webp\`, \`urban-canvas-05..07.webp\`, \`etoile-pointe-03.webp.tmp\`.

---

## Fluxo especial Petit Pas (compose workflow)

1. **Fundo:** \`00-bedroom-bg.png\` \u2192 1920\u00d7960.
2. **\`compose-kids-hero.mjs\`:** flood-fill, recorte alpha, sombra SVG, \`PAIRS\` \u2192 \`00-hero.png\`.
3. **\`process-kids-playroom.mjs\`:** hero \u2192 \`kids-playroom-00.webp\`; pares \u2192 \`01..04\` em fundo est\u00fadio.
4. **UI:** \`layout: "collection"\` \u2014 hero usa \`images[0]\`, tiles \`images.slice(1)\`.

**Pend\u00eancia:** refinar cutout do hero infantil.

---

## \u00c9toile aprovado \u2014 n\u00e3o alterar

Card **etoile-pointe** aprovado. N\u00e3o reprocessar imagens nem alterar copy sem pedido expl\u00edcito.

---

## Pend\u00eancias

| Item | Notas |
|------|-------|
| Hero Petit Pas | Refinar cutout em \`compose-kids-hero.mjs\` |
| Performance | Coer\u00eancia visual entre vistas |
| Migra\u00e7\u00e3o Rhino | Export / copy Rhino ou KeyShot |
| Limpeza WebPs \u00f3rf\u00e3os | Fora de \`FOOTWEAR_PRODUCT_IMAGES\` |
| npm scripts | Atalhos no \`package.json\` |
| Capa | Revisar \`cover.webp\` |
| Galeria product-design | Projeto \`product-design\` sem galeria |

---

## Como adicionar um novo card

1. \`Assets/projects/footwear/novo-slug/\` com PNGs.
2. \`scripts/process-*.mjs\` \u2192 WebPs em \`public/projects/footwear/\`.
3. \`src/data/project-media.ts\` (\`FOOTWEAR_PRODUCT_IMAGES\`, \`FOOTWEAR_PRODUCT_IDS\`).
4. \`messages/{pt,en,es,zh}.json\` \u2192 \`products\`.
5. \`npm run build\` e validar \`/pt/projetos/footwear-design\`.

---

## Checklist para retomar

- [ ] \`cd D:\\Sem Talento Studio\\Projeto Website\` e \`npm install\`
- [ ] \`npm run dev\` \u2192 \`/pt/projetos/footwear-design\`
- [ ] 8 cards na ordem correta
- [ ] JSON em UTF-8
- [ ] N\u00e3o alterar **etoile-pointe**
- [ ] Handoff sempre com \`fs.writeFileSync(..., "utf8")\`

---

## Resumo do hist\u00f3rico de conversa

- Galeria incremental; remo\u00e7\u00e3o de cards legados (\`talento-rasteira\`, \`last-studio\`).
- Urban Canvas, Performance, Flux / Night, \u00c9clat / Rubis em pipeline Sharp + est\u00fadio.
- \u00c9toile Pointe em layout \`pair\` \u2014 **aprovado**.
- Petit Pas (\`collection\`) com compose + process.
- Lightbox i18n; slug \`footwear-design\` e capa.
- Windows/D:: evitar UTF-16; usar Node \`utf8\`.

---

*Gerado com \`fs.writeFileSync(path, data, "utf8")\`.*
`;
const out = "D:/Sem Talento Studio/Projeto Website/FOOTWEAR-GALLERY-HANDOFF.md";
fs.writeFileSync(out, md, "utf8");
console.log("Written", out, fs.statSync(out).size, "bytes");

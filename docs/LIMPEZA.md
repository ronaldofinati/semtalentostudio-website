# Limpeza e peso do projeto

Varredura em 2026-07-26.

## Runtime do site (necessario)

| Pasta | ~Tamanho | Nota |
|-------|----------|------|
| `public/` | ~1,9 GB | Conteudo servido (STLs em `public/models/3d` ~1,8 GB) |
| `src/`, `messages/`, `scripts/` | pequeno | Codigo |
| `node_modules/` | ~0,5 GB | `npm install` |
| `.next/` | ~0,3 GB | cache de build (regeneravel) |

## Arquivo (pode sair do projeto)

| Item | ~Tamanho | Acao |
|------|----------|------|
| `Assets/` | ~2,7 GB | **Mover** para `D:\Sem Talento Studio\Arquivo Assets` (ver docs/ASSETS.md) |
| `Assets/projects/stl-antigo` | ~0,23 GB | **Removido** nesta limpeza (colecao incompleta) |

## Removido nesta limpeza

- `.tmp-ferr.html`, `.tmp-sg.html`, `.tmp-sg2.html`
- `FOOTWEAR-GALLERY-HANDOFF.md` na raiz (duplicata de `docs/`)
- `Assets/projects/stl-antigo`
- `tsconfig.tsbuildinfo` (regeneravel)
- tentativa de remover `ffmpeg-static` residual do `node_modules`

## Mantido de proposito

- `public/models/3d` — biblioteca STL do site
- `public/education/slides` — slides da home (damas/xadrez sao PNGs grandes ~5 MB total; aceitavel)
- `public/projects/nestlab` — capa NestLab
- Documentacao em `docs/`

## Como ganhar ~2,7 GB agora

1. Mover `Assets` conforme `docs/ASSETS.md`
2. Criar `.assets-root` apontando para o novo caminho
3. (Opcional) `Remove-Item .next -Recurse` e regenerar com `npm run build` se quiser limpar cache
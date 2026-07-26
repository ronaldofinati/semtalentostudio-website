# Pasta Assets — arquivo-fonte

## Resposta curta

**Sim, pode mover `Assets` para fora do projeto** sem afetar o site no ar ou o `npm run dev`.

O Next.js serve apenas o que esta em `public/` e `src/`. A pasta `Assets` e material de origem (PNG brutos, STL antes da publicacao, renders de teste) usada por **scripts offline**.

## Destino sugerido

```
D:\Sem Talento Studio\Assets
```

(ou outro disco/pasta de arquivo)

## Como mover com seguranca

1. Feche o servidor local (`Ctrl+C` no `iniciar.bat` / `npm run dev`).
2. Mova a pasta inteira:
   - De: `D:\Sem Talento Studio\Projeto Website\Assets`
   - Para: `D:\Sem Talento Studio\Assets`
3. Crie `.assets-root` na raiz do site (copie de `.assets-root.example`) com o caminho absoluto da nova pasta.
4. Confirme o site: `npm run dev` — home, Modelos 3D e downloads devem funcionar.

Opcional (PowerShell):

```powershell
$env:ASSETS_ROOT = "D:\Sem Talento Studio\Assets"
node scripts/publish-stl-models.mjs --catalog-only
```

## O que NAO apagar

| Pasta | Motivo |
|-------|--------|
| `public/` | Conteudo publicado do site (inclui `public/models/3d` ~1,8 GB) |
| `src/`, `messages/`, `scripts/` | Codigo |
| `node_modules/`, `.next/` | Regeneraveis, mas necessarios para desenvolver |

## O que pode sair / ficar no arquivo

| Item | Nota |
|------|------|
| `Assets/` inteira | Mover para arquivo |
| `Assets/projects/stl` | Fonte dos STLs; o site usa `public/models/3d` |
| `Assets/projects/stl-antigo` | Obsoleto (colecao incompleta) — pode apagar |
| `Assets/Teste Render` | So testes — arquivo |

## Scripts que leem Assets

Usam `scripts/lib/assets-root.mjs` (ou caminho relativo legado `Assets/...`):

- `scripts/publish-stl-models.mjs` — republicar biblioteca STL
- `scripts/process-*.mjs` — processar imagens de portfolio (offline)

Se um script antigo ainda apontar so para `./Assets`, defina `ASSETS_ROOT` ou atualize para `assetsPath(...)`.

## Relacao site x arquivo

```
Projeto Website/          ← codigo + public (leve o suficiente para desenvolver)
  public/models/3d/       ← STLs publicados (necessario no site)
  .assets-root            ← aponta para o arquivo

Arquivo Assets/           ← fora do site (~2,7 GB)
  projects/stl/
  projects/footwear/
  ...
```
# STLs no Cloudflare R2

Os binarios em `public/models/3d` (~1,8 GB) **nao** vao para o Git nem para a Vercel.
Ficam no **Cloudflare R2** e o site aponta para eles via `NEXT_PUBLIC_STL_BASE_URL`.

## 1. Criar o bucket

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **R2 Object Storage** → **Create bucket**
2. Nome sugerido: `semtalento-models`
3. Location: Automatic

## 2. Acesso publico (URL base)

### Opcao recomendada — dominio ja na Cloudflare (`.com`)

Se `semtalentostudio.com` esta na Cloudflare:

1. Bucket → **Settings** → **Custom Domains** → Add `files.semtalentostudio.com`
2. Cloudflare cria o DNS automaticamente
3. Base URL: `https://files.semtalentostudio.com`

### Alternativa — URL publica r2.dev

1. Bucket → **Settings** → **Public access** → Allow Access / Connect R2.dev subdomain
2. Base URL fica no formato: `https://pub-XXXX.r2.dev`
3. Use exatamente essa URL (sem barra no final) em `NEXT_PUBLIC_STL_BASE_URL`

> Nota: custom domain em `files.semtalentostudio.com.br` so funciona se a zona `.com.br` estiver na Cloudflare.
> Hoje o DNS do `.com.br` esta no Registro.br (Vercel + Zoho) — por isso preferimos `.com` ou `r2.dev`.

Os objetos devem ficar com a chave `models/3d/...` (mesmo path do catalogo).

Exemplo final:

`https://files.semtalentostudio.com/models/3d/printables_107185_classic-rocket/preview_01.jpg`

## 3. API Token (upload do PC)

1. R2 → **Manage R2 API Tokens** → Create API token
2. Permissao: **Object Read & Write** no bucket `semtalento-models`
3. Anote: **Access Key ID**, **Secret Access Key**, **Account ID**
4. No `.env.local` do projeto (nunca commitar):

```env
NEXT_PUBLIC_STL_BASE_URL=https://files.semtalentostudio.com
R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=semtalento-models
R2_PREFIX=models/3d
```

## 4. Sync local → R2

```powershell
cd "D:\Sem Talento Studio\Projeto Website"
npm install
node scripts/sync-stl-to-r2.mjs --dry-run
node scripts/sync-stl-to-r2.mjs
```

Primeiro upload: varios minutos (~1,8 GB). Rodadas seguintes pulam arquivos com o mesmo tamanho.

## 5. Vercel

Environment Variable (Production):

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_STL_BASE_URL` | `https://files.semtalentostudio.com` (ou a URL r2.dev) |

Redeploy depois de salvar.

## 6. Codigo do site

- Flag: `src/config/features.ts` → `stlFilesPublished: true`
- Helper: `src/lib/stl-assets.ts` → `stlAssetUrl()`
- UI: `StlModelsShowcase` usa o helper em previews e downloads

Local sem env: continua usando `/models/3d/...` de `public/` (se a pasta existir no disco).

## Checklist

- [ ] Bucket criado
- [ ] Custom domain ou r2.dev ativo (HTTPS)
- [ ] Token R2 no `.env.local`
- [ ] `node scripts/sync-stl-to-r2.mjs` OK
- [ ] `NEXT_PUBLIC_STL_BASE_URL` na Vercel + Redeploy
- [ ] Testar `/pt/projetos/3d-models` — preview + download

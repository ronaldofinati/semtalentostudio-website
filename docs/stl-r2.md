# STLs no Cloudflare R2

Os binarios em `public/models/3d` (~1,8 GB) **nao** vao para o Git nem para a Vercel.
Ficam no **Cloudflare R2** e o site aponta para eles via `NEXT_PUBLIC_STL_BASE_URL`.

**Status (2026-07-26):** publicado e testado no ar.

| Item | Valor |
|------|--------|
| Bucket | `semtalento-models` |
| URL publica atual | `https://pub-6273b8eac583494bb4d388f24d6fe2b3.r2.dev` |
| Prefixo das chaves | `models/3d/...` (igual ao catalogo) |
| Arquivos no 1º sync | 1192 |
| Flag | `stlFilesPublished: true` em `src/config/features.ts` |

Exemplo de objeto:

`https://pub-6273b8eac583494bb4d388f24d6fe2b3.r2.dev/models/3d/printables_107185_classic-rocket/preview_01.jpg`

Custo esperado com ~1,8 GB: **dentro do free tier** do R2 (10 GB + egress gratis). Ver [pricing](https://developers.cloudflare.com/r2/pricing/).

---

## 1. Criar o bucket

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → menu conta → **Storage & databases** → **R2** → **Overview**
2. Na 1ª vez: ativar R2 (checkout $0 se estiver no free)
3. **Create bucket** → nome `semtalento-models`
4. Location Automatic, storage class **Standard**
5. **Nao** use R2 Data Catalog (isso e outra coisa)

Atalho: https://dash.cloudflare.com/?to=/:account/r2/overview

## 2. Acesso publico (URL base)

### Em producao hoje — r2.dev

1. Bucket → **Settings** → **Public Development URL** → Enable (digitar `allow`)
2. Copiar URL `https://pub-....r2.dev`
3. Usar em `NEXT_PUBLIC_STL_BASE_URL` (sem barra no final)

> r2.dev e rate-limited; ok para comecar. Custom domain e melhor a medio prazo.

### Depois — Custom Domain no `.com` (Cloudflare)

1. Bucket → **Custom Domains** → `files.semtalentostudio.com`
2. Atualizar `NEXT_PUBLIC_STL_BASE_URL` no `.env.local` e na Vercel
3. Redeploy

> `files.semtalentostudio.com.br` so funciona se a zona `.com.br` estiver na Cloudflare.
> Hoje `.com.br` esta no Registro.br (Vercel + Zoho).

## 3. API Token (upload do PC)

1. R2 → **Manage R2 API Tokens**
2. Preferir **Account API Tokens** (recommended)
3. Create → Object **Read & Write** → bucket `semtalento-models`
4. Expiracao: Forever ou 1 ano; IP Include/Exclude vazios
5. Copiar **antes** do Finish:
   - Access Key ID
   - Secret Access Key
   - Account ID = pedaco do meio de `https://ACCOUNT_ID.r2.cloudflarestorage.com` (**exatamente 32** hex)
6. Ignorar o “Token Value” da Cloudflare API (nao e o que o script usa)

No `.env.local` (nunca commitar):

```env
NEXT_PUBLIC_STL_BASE_URL=https://pub-6273b8eac583494bb4d388f24d6fe2b3.r2.dev
R2_ACCOUNT_ID=32_caracteres_hex
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=semtalento-models
R2_PREFIX=models/3d
```

## 4. Sync local → R2

```powershell
cd "D:\Sem Talento Studio\Projeto Website"
npm install
npm run sync:stl-r2
# ou: node scripts/sync-stl-to-r2.mjs
# dry-run: node scripts/sync-stl-to-r2.mjs --dry-run
```

- Nao arrastar 1,8 GB pela UI do dashboard
- Sync seguinte pula arquivos com o mesmo tamanho
- Se der SSL handshake fail: confira Account ID com 32 caracteres

## 5. Vercel

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_STL_BASE_URL` | `https://pub-6273b8eac583494bb4d388f24d6fe2b3.r2.dev` |

Production + Redeploy. **Nao** colocar as keys R2 secretas na Vercel.

## 6. Codigo do site

- `src/lib/stl-assets.ts` → `stlAssetUrl()`
- `src/components/StlModelsShowcase.tsx` → previews e downloads
- Local sem `NEXT_PUBLIC_STL_BASE_URL`: usa `/models/3d/...` de `public/` se existir

## Checklist

- [x] Bucket criado
- [x] r2.dev ativo (HTTPS)
- [x] Token R2 no `.env.local`
- [x] Sync inicial OK (1192 arquivos)
- [x] `NEXT_PUBLIC_STL_BASE_URL` na Vercel + Redeploy
- [x] Testar `/pt/projetos/3d-models` — preview + download
- [ ] (Opcional) Custom domain `files.semtalentostudio.com`

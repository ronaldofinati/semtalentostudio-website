# Plano GO-LIVE — SemTalento Studio

**Objetivo:** site no ar em `https://semtalentostudio.com.br`, estável, com contato, analytics e STLs.

Atualizado: **2026-07-26** (noite) — go-live principal concluído; pendências amanhã.

---

## Status atual (foto)

| Item | Status |
|------|--------|
| Site Next.js | No ar (Vercel) |
| GitHub | `https://github.com/ronaldofinati/semtalentostudio-website` (user `ronaldofinati`) |
| Vercel team | `https://vercel.com/sem-talento-studio` — Hobby |
| Domínio `.com.br` | `https://semtalentostudio.com.br` + `www` (Registro.br → Vercel) |
| Domínio `.com` | Na Cloudflare — **redirect → `.com.br` ainda pendente** |
| Contato SMTP (Zoho) | OK em produção (vars na Vercel) |
| Analytics | Vercel Web Analytics ligado |
| Privacidade / robots / sitemap | OK |
| STLs (~1,8 GB) | Cloudflare R2 — ver `docs/stl-r2.md` |
| Mobile (submenus + overflow cards) | Corrigido e publicado |
| Cadastro de usuários | Não necessário |

**URLs:**
- Produção: https://semtalentostudio.com.br/pt
- Preview legado: https://semtalentostudio-website.vercel.app/pt
- Modelos 3D: https://semtalentostudio.com.br/pt/projetos/3d-models

---

## Pendências (próxima sessão)

1. **Redirect `.com` → `.com.br`** (Cloudflare, zona do `.com`)
2. Opcional: Custom Domain R2 `files.semtalentostudio.com` (hoje usa `*.r2.dev`)
3. Opcional: pagamento real nos STLs pagos (hoje checkout demo)
4. Conferir WhatsApp final em `src/config/site.ts` se ainda for provisório

---

## Regra de ouro

- **Nunca** enviar `.env.local` / senhas / tokens R2 para o GitHub.
- Atualizar o site = alterar código → commit autorizado → push → Vercel publica sozinha.
- STLs **não** vão no Git nem no deploy Vercel; sync local → R2 com `npm run sync:stl-r2`.

---

## Fases (checklist histórico)

### FASE 0 — Código base
- [x] `docs/GO-LIVE.md`, robots, sitemap, `/privacidade`
- [x] `.gitignore` (`.env.local`, `/public/models/3d/`)
- [x] `.vercelignore` (`public/models/3d`)

### FASE 1 — Contas
- [x] GitHub `ronaldofinati`
- [x] Vercel (login GitHub) / team Sem Talento Studio

### FASE 2 — STLs (R2)
- [x] Bucket `semtalento-models`
- [x] Public Development URL (r2.dev)
- [x] Account API Token (Object Read & Write) — só no PC
- [x] Sync 1192 arquivos (`scripts/sync-stl-to-r2.mjs`)
- [x] `NEXT_PUBLIC_STL_BASE_URL` na Vercel + flag `stlFilesPublished: true`
- Detalhes: **`docs/stl-r2.md`**

### FASE 3 — Deploy
- [x] Repo GitHub + deploy Vercel Next.js
- [x] Site abre em `*.vercel.app` e no domínio próprio

### FASE 4 — SMTP produção
- [x] Vars na Vercel: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`
- [x] Valores corretos (não colar o *nome* da variável no Value)
- [x] Host Zoho: `smtppro.zoho.com` (domínio próprio)
- [x] Formulário `/pt/contato` envia e chega em `contato@`
- Ver também: `docs/email-setup.md`

### FASE 5 — Domínio `.com.br`
- [x] Domínios na Vercel: apex + www (Production; sem redirect apex→www forçado)
- [x] DNS Registro.br (modo avançado) — **não** trocar nameservers para Vercel DNS (preserva Zoho)

Registros usados (conferir no painel se mudarem):

| Tipo | Nome | Valor |
|------|------|--------|
| A | `@` (raiz) | `216.198.79.1` |
| CNAME | `www` | `589484c2fee2017a.vercel-dns-017.com.` |

MX/TXT Zoho **mantidos**.

- [ ] Redirect `.com` → `.com.br` (**pendente**)

### FASE 6 — Testes
- [x] Contato / domínio HTTPS
- [x] STLs preview + download
- [x] Mobile: submenus do header; overflow horizontal dos cards
- [ ] Passada completa idiomas / WhatsApp / todas ferramentas (quando quiser)

### FASE 7 — Analytics
- [x] Vercel Web Analytics Enable + `@vercel/analytics` no layout
- [x] Texto de privacidade menciona analytics

### FASE 8 — Legal mínimo
- [x] `/privacidade`, link rodapé, robots, sitemap

### FASE 9 — Fluxo de atualização
1. Pedir mudança no chat  
2. Código alterado  
3. Autorizar commit  
4. Push → Vercel (~1–2 min)  
5. Testar URL  

### FASE 10 — Monetização (roadmap)
| Quando | O quê |
|--------|--------|
| Agora | Contato / WhatsApp / orçamento manual |
| Depois | Pix/Stripe nos STLs pagos |
| Depois | Patrocínio QuimicaLab |
| Depois | Página Serviços |

---

## Variáveis de ambiente (produção — Vercel)

| Key | Uso |
|-----|-----|
| `SMTP_*` + `CONTACT_TO` | Formulário de contato (Zoho) |
| `NEXT_PUBLIC_STL_BASE_URL` | Base pública dos STLs (R2) |

**Não** colocar `R2_ACCESS_KEY_*` / `R2_SECRET_*` na Vercel — só no `.env.local` do PC para sync.

Modelo local: `.env.example`.

---

## Problemas resolvidos (para não repetir)

| Sintoma | Causa / solução |
|---------|-----------------|
| `SMTP_HOST` “already exists” / “branch undefined” | Var fantasma Preview; criar só Production ou apagar via CLI |
| Contato `hostname: 'SMTP_HOST'` | Value era o texto `SMTP_HOST` — usar `smtppro.zoho.com` |
| Submenus mobile não abriam | Dropdown cortado por `overflow-x-auto` — painel abaixo da barra |
| Cards “largos demais” no mobile | Grid sem `min-w-0` — overflow horizontal |
| Upload R2 SSL handshake fail | `R2_ACCOUNT_ID` com 31 chars (precisa **32**) |
| STLs “em breve” no ar | Faltava `NEXT_PUBLIC_STL_BASE_URL` + redeploy |

---

## Contas / caminhos

| O quê | Onde |
|-------|------|
| Código | `D:\Sem Talento Studio\Projeto Website` |
| Assets fonte | `D:\Sem Talento Studio\Assets` (`.assets-root`) |
| STLs locais (não no Git) | `public/models/3d` |
| Docs e-mail | `docs/email-setup.md` |
| Docs R2/STL | `docs/stl-r2.md` |
| Identidade / DNS | `docs/infra-identidade.md` |

---

## Decisões registradas

- 2026-07-26: 1º deploy **sem** STLs no Vercel; STLs depois via **R2**
- Repo do site **separado** do CAD
- Apex `semtalentostudio.com.br` como URL principal (não forçar www)
- Analytics: Vercel (Hobby, painel privado)
- Checkout STL pago: demo por enquanto

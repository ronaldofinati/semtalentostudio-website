# Plano GO-LIVE — SemTalento Studio

**Objetivo:** site no ar em `https://semtalentostudio.com.br`, estável, com contato funcionando e analytics privado.

**Como usar este documento:** siga as fases na ordem. Em cada passo há **Você faz** e **Eu (assistente) faço**. Não pule fases.

Atualizado: 2026-07-26.

---

## Mapa mental (visão geral)

```
1. Repo Git + GitHub
2. Decisão dos arquivos pesados (Modelos 3D ~1,8 GB)
3. Conta Vercel + primeiro deploy
4. Variáveis SMTP (Zoho) na Vercel
5. DNS do domínio → Vercel
6. Testes no ar (contato, mobile, ferramentas)
7. Analytics privado
8. Privacidade + robots + sitemap
9. WhatsApp comercial final
10. Checklist “100% publicado”
```

---

## Status atual (foto do projeto)

| Item | Status |
|------|--------|
| Site Next.js local | Pronto (`npm run dev` / `iniciar.bat`) |
| Domínio `.com.br` | Feito (Registro.br) — ver `infra-identidade.md` |
| Domínio `.com` | Feito (Cloudflare) |
| Zoho Mail + `.env.local` | Variáveis existem localmente — **testar envio** |
| Git no projeto | **Ainda não** (pasta sem `.git`) |
| GitHub remoto | Conta existe; repo ainda não |
| Vercel | Em criação (usuário) |
| Contagem de acessos | **Não existe** |
| Cadastro de usuários | Não necessário agora |
| Página de privacidade | Feito (`/privacidade`) |
| robots / sitemap | Feito |
| `public/models/3d` | R2 — ver `docs/stl-r2.md` |

---

## Regra de ouro

- **Nunca** envie `.env.local` / senhas para o GitHub.
- Atualizar o site depois = eu altero o código → commit → push → Vercel publica sozinha.
- Você não precisa virar programador: precisa de contas (GitHub, Vercel) e acesso ao Registro.br / Zoho.

---

## FASE 0 — Preparar o código (eu faço)

- [x] Este plano (`docs/GO-LIVE.md`)
- [x] Corrigir caminhos desatualizados nos docs
- [x] `robots.ts` + `sitemap.ts`
- [x] Página `/privacidade`
- [x] Garantir `.gitignore` correto (`.env.local`, `Assets`, `.next`)
- [ ] Inicializar Git (quando você autorizar o 1º commit)

---

## FASE 1 — Contas (você faz, eu guio)

### 1.1 GitHub

**Você faz:**
1. Crie conta em https://github.com (se não tiver).
2. Aviso aqui: “GitHub pronto, usuário = ___”.

**Eu faço depois:**
- `git init` no projeto
- Primeiro commit (sem segredos)
- Criar repositório privado e push (com sua autorização)

### 1.2 Vercel

**Você faz:**
1. Conta em https://vercel.com com o **mesmo login GitHub**.
2. Aviso: “Vercel pronta”.

---

## FASE 2 — Arquivos pesados (STLs)

O site tem ~**1,8 GB** em `public/models/3d`. A Vercel Hobby **não** leva isso no deploy.

**Decisão:** Cloudflare **R2** (site leve na Vercel; arquivos no CDN).

Passo a passo: **`docs/stl-r2.md`**.

Resumo:
1. Bucket R2 + URL pública (`files.semtalentostudio.com` ou `*.r2.dev`)
2. Sync: `node scripts/sync-stl-to-r2.mjs`
3. Vercel env: `NEXT_PUBLIC_STL_BASE_URL`
4. Flag `stlFilesPublished: true` (já no código)

---

## FASE 3 — Primeiro deploy na Vercel

**Eu faço (com você aprovando):**
1. Push do código no GitHub.
2. Importar projeto na Vercel (Framework: Next.js).
3. Build de teste.
4. URL temporária `*.vercel.app`.

**Você faz:**
- Confirmar no navegador que a URL temporária abre.

---

## FASE 4 — E-mail de contato em produção

**Você faz:**
1. Confirmar Zoho Mail Lite ativo e `contato@` recebendo.
2. Ter a senha / app password do SMTP (já usada no `.env.local`).

**Eu faço:**
1. Orientar a colar no painel Vercel → Settings → Environment Variables:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`
2. Redeploy.
3. Testar `/pt/contato` no ar.

Checklist espelho: `docs/email-setup.md`.

---

## FASE 5 — Domínio no ar

**Você faz (Registro.br — modo avançado DNS):**

Apontar `semtalentostudio.com.br` para a Vercel (valores exatos a Vercel mostra; tipicamente):

| Tipo | Nome | Valor |
|------|------|--------|
| A | `@` | `76.76.21.21` (confirmar no painel Vercel) |
| CNAME | `www` | `cname.vercel-dns.com` (confirmar no painel) |

**Eu faço:**
- Adicionar domínio no projeto Vercel.
- Esperar SSL (cadeado HTTPS).
- Redirect `.com` → `.com.br` (Cloudflare) se ainda não estiver.

**Critério de pronto:** `https://semtalentostudio.com.br/pt` abre com cadeado.

---

## FASE 6 — Testes no ar (juntos)

Marque comigo:

- [ ] Home / projetos / educação / contato
- [ ] Formulário envia e chega no Zoho
- [ ] WhatsApp abre com o número certo
- [ ] Ferramentas (simulado, jogos, QuimicaLab, colorir)
- [ ] Mobile (Chrome no celular)
- [ ] Idiomas pt/en/es/zh

---

## FASE 7 — Analytics privado (só você vê)

**Recomendação:** Vercel Analytics **ou** Cloudflare Web Analytics (grátis, sem cookies pesados).

- Painel **privado** (não público no site).
- Serve para controle e conversa com patrocínio (exportar relatório mensal).

**Não** colocar contador público no lançamento.

---

## FASE 8 — Conteúdo legal mínimo

- [ ] Página `/privacidade` (LGPD básica: o que coletamos = formulário de contato)
- [ ] Link no rodapé
- [ ] robots + sitemap

---

## FASE 9 — Atualizações depois do ar

Fluxo padrão (toda vez que quiser melhorar algo):

1. Você pede no chat (“muda X”).
2. Eu altero o código.
3. Você autoriza o commit.
4. Push → Vercel publica em 1–2 minutos.
5. Você testa a URL.

**Não é complicado** quando a FASE 1–5 estiver feita uma vez.

---

## FASE 10 — Monetização (só documentar agora)

Não implementar checkout ainda. Roadmap:

| Quando | O quê |
|--------|--------|
| Agora | Contato / WhatsApp / orçamento manual |
| Depois | Trocar pagamento demo dos STLs por Pix/Stripe |
| Depois | Patrocínio QuimicaLab (já tem CTA) |
| Depois | Página “Serviços” com pacotes |

Detalhes de e-mail/marca: `email-setup.md`, `presenca-marca.md`, `infra-identidade.md`.

---

## Cadastro de usuários?

**Decisão:** não no lançamento. Ferramentas grátis ficam abertas.  
Histórico do Simulado já fica **só no aparelho da pessoa** (não no seu servidor).

---

## Impedimentos conhecidos

1. **Sem Git** → sem deploy fácil na Vercel.
2. **1,8 GB de modelos** → precisa da FASE 2.
3. **SMTP só no PC** → contato quebra no ar até colar env na Vercel.
4. WhatsApp: conferir número final em `src/config/site.ts`.

---

## Próximo passo AGORA

Responda neste chat com estas 3 linhas (copie e complete):

```
GitHub: (não tenho / tenho, usuário = ___)
Vercel: (não tenho / tenho)
Modelos 3D no 1º ar: A / B / C
```

Com isso eu executo a FASE 0 restante e te pego pela mão na FASE 1.

---

## Decisão registrada (2026-07-26)

- GitHub: conta existe (login hotmail informado)
- Vercel: criar agora
- Modelos 3D: **opção A** no 1º ar; arquivos depois com ajuda

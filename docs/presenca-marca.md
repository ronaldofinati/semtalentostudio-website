# Presenca de marca — SemTalento Studio

Plano de marketing e comunicacao (diretor de marketing).
Documentado em 2026-07-25.

**Objetivo publico:** so a marca aparece na web.
**Realidade tecnica:** plataformas exigem um administrador humano (CPF) nos bastidores.
Isso e normal e **nao** significa aparecer como pessoa fisica no Instagram, YouTube ou anuncios.

---

## 1. O que e possivel (e o que nao e)

| Desejo | Realidade |
|--------|-----------|
| Pagina / perfil / anuncios so com nome SemTalento Studio | Sim |
| Faturamento e verificacao de anuncios no **CNPJ** | Sim (Meta + Google Ads) |
| Zero vinculo tecnico com qualquer CPF | Nao — Meta e Google pedem admin real |
| Visitante ve seu nome/foto pessoal | Evitavel — se montar certo |
| Criar Meta **sem** Facebook pessoal | Nao — login admin usa perfil Facebook (privado) |
| E-mail da marca no dominio | Ja definido: Zoho `contato@...` |

**Regra de ouro:** CPF/Facebook pessoal = **chave de acesso** (bastidor).
CNPJ + Pagina + Instagram Business + Ads = **rosto publico**.

Nao use CPF como anunciante "da marca" se puder usar CNPJ.
Nao poste da marca no seu feed pessoal.

---

## 2. Arquitetura (como montar do zero)

```
[Voce - bastidor]
  Facebook pessoal (privado, sem posts da marca)
  Conta Google (Gmail pessoal ou conta admin)
       |
       +-- Meta Business Portfolio
       |     +-- Pagina Facebook "SemTalento Studio"
       |     +-- Instagram profissional @semtalentostudio
       |     +-- Conta de anuncios (CNPJ)
       |     +-- WhatsApp Business (numero TIM)
       |
       +-- YouTube Brand / canal @semtalentostudio
       |     +-- link Google Ads (CNPJ)
       |
       +-- Zoho: contato@semtalentostudio.com.br
       +-- Site: semtalentostudio.com.br
```

Tudo que o publico ve: **marca**.
Tudo que a Meta/Google pedem em auditoria: **CNPJ + admin**.

---

## 3. Inventario do que ja existe

| Ativo | Status |
|-------|--------|
| CNPJ (Design + Software) | Existe |
| Dominio .com.br (CNPJ) + .com | Feito |
| E-mail Zoho | Feito — ver `docs/email-setup.md` |
| Site Next.js | Em construcao / quase no ar |
| YouTube @semtalentostudio | Existe (tutoriais Rhino; retomada) |
| WhatsApp Business numero TIM | Em ativacao |
| Meta Business / IG / Pagina FB | Ainda nao documentado (criar agora) |
| Google Ads | Fluxo criativo em `docs/apresentacao-site-para-youtube.md` |

O "plano perdido" que voce lembra era sobretudo: dominio + Zoho + WhatsApp separado.
**Este documento** e o plano de redes e anuncios que faltava.

---

## 4. Ordem de execucao (fases)

### Fase A — Fundacao (antes de anuncio pago)

1. Site no ar (HTTPS, DNS, contato Zoho SMTP OK).
2. Chip TIM ativo + WhatsApp Business no numero comercial.
3. Atualizar `src/config/site.ts` com o WhatsApp novo.
4. Pagina "Sobre" / Contato so com marca (sem nome pessoal, foto pessoal, CPF).
5. (Opcional mas util para verificacao Meta) no site ou rodape institucional: razao social + CNPJ se a Meta pedir cruzamento — da para manter discreto (pagina Contato / Politica).

### Fase B — Presenca organica (marca)

1. **Meta Business Portfolio** em business.facebook.com
   - Login: Facebook pessoal (so admin)
   - E-mail comercial: contato@semtalentostudio.com.br
   - Dados da empresa: CNPJ
2. Criar **Pagina** Facebook "SemTalento Studio" (nao perfil pessoal).
3. Criar / converter **Instagram profissional** @semtalentostudio
   - Conta nova da marca (preferivel) OU converter uma conta sem historico pessoal
   - Vincular a Pagina + Portfolio
4. **YouTube:** manter @semtalentostudio
   - Garantir Conta de marca / canal da marca (nome = SemTalento Studio)
   - Sobre: link do site, e-mail Zoho, sem dados pessoais
   - Anexar: videos da apresentacao do site (ver `docs/apresentacao-site-para-youtube.md`)
5. Bio padrao em todas as redes:
   - Nome: SemTalento Studio
   - Site: https://semtalentostudio.com.br
   - Contato: WhatsApp TIM + contato@...

### Fase C — Anuncios (pago)

So depois de A+B estaveis.

1. **Google Ads** — tipo Organizacao / CNPJ
   - Vincular canal YouTube
   - Campanhas de video (6s / 15s / 30s) CTA Contato
2. **Meta Ads** — conta de anuncios no Portfolio, faturamento CNPJ
   - Trafego para site / WhatsApp / lead
3. Pixel / tags: Google + Meta no site (fase tecnica depois do ar)

Orcamento inicial sugerido (do briefing antigo ~R$100–200/mes):
- 70% Google/YouTube video ou busca marca
- 30% Meta (alcance / engajamento / WhatsApp)
- Ou 100% organico 30–60 dias e so entao pago

### Fase D — Escala

Mercado Pago / checkout, marketplace, remarketing — alinhado ao CNPJ.

---

## 5. Redes: checklist "nao misturar pessoal"

### Fazer
- Pagina FB + IG profissional + YouTube marca
- Anuncios com CNPJ
- WhatsApp so no chip TIM
- E-mail Zoho em tudo
- Perfil Facebook pessoal: privado; sem postar a marca no feed pessoal

### Evitar
- Anunciar com CPF "como se fosse a empresa"
- Instagram pessoal virando "empresa" sem Portfolio (mistura audiencia)
- Usar foto/nome real no avatar da marca
- Compartilhar senha da marca; use permissoes (admin/gestor)
- Criar pagina fake / perfil falso (risco de ban)

---

## 6. YouTube — o que fazer com o canal atual

Canal ja existe como ativo da marca. Nao precisa apagar.

1. Entrar no YouTube Studio como @semtalentostudio
2. Confirmar que e canal de marca (nao so perfil Google com seu nome)
3. Atualizar: banner, logo, descricao, link do site, pais Brasil
4. Playlist: Design / Rhino / Studio / Ferramentas
5. Upload do video da apresentacao do site (OBS → CapCut → MP4)
6. Quando houver Google Ads: Associar canal a conta Ads (CNPJ)

Se o canal ainda estiver "preso" ao nome pessoal no Google:
Configuracoes → criar / usar Conta de marca com nome SemTalento Studio.

---

## 7. Meta — passo a passo resumido

1. Facebook pessoal (pode ficar privado)
2. business.facebook.com → Criar Portfolio Empresarial
3. E-mail: contato@semtalentostudio.com.br
4. Informacoes da empresa: CNPJ + razao social (iguais ao cartao CNPJ)
5. Criar Pagina SemTalento Studio
6. Criar Instagram profissional da marca → vincular
7. Conta de anuncios → pagamento / verificacao CNPJ
8. (Depois) WhatsApp Business API ou so link wa.me do TIM no site e nos anuncios

**Nota:** seu nome aparece para a Meta como administrador; **clientes nao veem** isso na Pagina.

---

## 8. Google Ads — passo a passo resumido

1. Conta Google admin (Gmail)
2. ads.google.com → conta **Organizacao** + CNPJ
3. Verificacao de anunciante (documentos empresa)
4. Vincular YouTube @semtalentostudio
5. Campanhas de video / pesquisa conforme criativos prontos

---

## 9. Conteudo organico (primeiros 30 dias no ar)

| Semana | Foco |
|--------|------|
| 1 | Site no ar + 3 posts IG/FB (marca, o que fazemos, contato) |
| 2 | 1 video YouTube (apresentacao do studio ou Rhino) |
| 3 | Bastidores de projeto (calçado/produto) sem rostos se preferir |
| 4 | Ferramenta (SizeGuide / educacao) + CTA WhatsApp |

Tom: marca tecnica e visual, nao "influenciador pessoal".

---

## 10. Criterio de sucesso (simples)

- Visitante so encontra SemTalento Studio
- Contato: WhatsApp TIM + Zoho
- Anuncios: faturamento CNPJ
- Seu CPF/Facebook so nos paineis admin

---

## Documentos relacionados

| Arquivo | Uso |
|---------|-----|
| `docs/email-setup.md` | Zoho + DNS + SMTP |
| `docs/apresentacao-site-para-youtube.md` | Site → MP4 → YouTube → Ads |
| `docs/presenca-marca.md` | Este plano |
| `src/config/site.ts` | Contatos do site |

---

## Proxima acao pratica (esta semana)

1. Terminar TIM + WhatsApp Business
2. Site no ar + SMTP Zoho testado
3. Criar Meta Portfolio + Pagina + IG marca
4. Revisar YouTube como canal de marca + 1 video novo
5. So entao abrir Google Ads / Meta Ads com CNPJ
# SemTalento Studio — Website

Portfolio multilingue da SemTalento Studio.

## Publicar o site (comece aqui)

Plano e **status atual**: **[docs/GO-LIVE.md](docs/GO-LIVE.md)**

- Site: https://semtalentostudio.com.br/pt  
- STLs (R2): **[docs/stl-r2.md](docs/stl-r2.md)**  
- Pendente: redirect `.com` → `.com.br`

## Desenvolvimento local

```bash
cd "D:\Sem Talento Studio\Projeto Website"
npm install
npm run dev
```

Ou execute `iniciar.bat`. Abra http://localhost:3000 (redireciona para /pt).

## Paginas

- `/pt` — Home
- `/pt/projetos` — Portfolio
- `/pt/projetos/3d-models` — Biblioteca STL
- `/pt/ferramentas` — Ferramentas
- `/pt/educacao` — Educacao
- `/pt/conteudo` — YouTube
- `/pt/sobre` — Sobre
- `/pt/contato` — Contato
- `/pt/privacidade` — Privacidade

Idiomas: pt, en, es, zh

## Assets

Ver **[docs/ASSETS.md](docs/ASSETS.md)** — `D:\Sem Talento Studio\Assets` via `.assets-root`.

## Documentacao

| Arquivo | Conteudo |
|---------|----------|
| [docs/GO-LIVE.md](docs/GO-LIVE.md) | **Status go-live + historico + pendencias** |
| [docs/stl-r2.md](docs/stl-r2.md) | Cloudflare R2 / sync STL |
| [docs/email-setup.md](docs/email-setup.md) | Zoho Mail + SMTP |
| [docs/infra-identidade.md](docs/infra-identidade.md) | Dominio, e-mail, WhatsApp |
| [docs/presenca-marca.md](docs/presenca-marca.md) | Marca e redes |

## Contatos

- WhatsApp: `src/config/site.ts`
- E-mail: `contato@semtalentostudio.com.br`

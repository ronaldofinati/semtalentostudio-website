# Apresentacao do site -> MP4 -> YouTube -> Anuncio

Plano documentado em 06/07/2026. **Nao altera o site** - fluxo externo de captura, edicao e publicacao.

---

## O que existe hoje no site

Componente `StudioPresentation` na home (`/pt`):

| Item | Detalhe |
|------|---------|
| Slides | 12 (intro ate outro) |
| Duracao total | ~68 s (10x5 s + CTA 8 s + outro 10 s) |
| Efeito | Ken Burns (zoom suave nas imagens) |
| Audio | Bach BWV 846 (CC0, Wikimedia) |
| Arquivos | `src/components/StudioPresentation.tsx`, `src/data/studio-presentation.ts` |

**Importante:** HTML/CSS/JS no navegador, **nao e MP4**. Para YouTube e Google Ads e preciso capturar ou renderizar uma vez.

---

## Fluxo geral

```
Site -> Captura (OBS ou Playwright) -> Edicao -> MP4 1080p -> YouTube -> Google Ads
```

---

## Passo 1 - Capturar (OBS)

1. `iniciar.bat`
2. `http://localhost:3000/pt` em tela cheia (F11)
3. Desativar reducao de movimento no Windows
4. OBS: gravar so o player, 1920x1080
5. Clicar na pagina para liberar audio
6. Gravar 1 ciclo completo (12 slides)

**Opcao futura:** `scripts/render-presentation.mjs` (Playwright + ffmpeg)

---

## Passo 2 - Edicao (CapCut / DaVinci)

| No site | No video |
|---------|----------|
| Textos genericos | Titulos diretos |
| 68 s | Versoes 6s, 15s, 30s, 60s para anuncio |
| Sem narracao | Locucao + legendas |
| Controles visiveis | Recortar sem barra de controle |

Projeto de video **separado** - site nao muda.

---

## Passo 3 - Export MP4

- MP4 H.264, 1920x1080, 30 fps, 10-15 Mbps
- Audio AAC 48 kHz

---

## Passo 4 - YouTube

Upload, thumbnail, tags. Landing: semtalentostudio.com.br/pt

---

## Passo 5 - Google Ads

Campanha de video. Formatos: in-stream, bumper (6s), 15-20s non-skippable.
CTA: /pt/contato

---

## Ordem pratica

1. OBS -> 1 ciclo 1080p
2. CapCut -> legendas + versoes curtas
3. YouTube -> upload
4. Google Ads

---

## Referencias no repo

- `src/data/studio-presentation.ts` - slides e duracoes
- `src/app/globals.css` - animacao presentation-zoom
- `messages/*/home.presentation` - textos i18n

---

## Melhorar narracao de video ja publicado

### YouTube NAO permite trocar narracao online

Edicao online limitada a: cortes, musica da biblioteca, desfoque, end screens.

### Fluxo correto

1. Recuperar arquivo fonte original (ideal) ou download via yt-dlp
2. Extrair audio: `ffmpeg -i video.mp4 -vn -acodec pcm_s16le audio.wav`
3. Melhorar: Adobe Podcast Enhance, Descript Studio Sound, Auphonic
4. Remontar video + audio no editor
5. **Novo upload** no YouTube

### Republicar

- Nao da para manter URL/views trocando so o audio
- Novo upload perde metricas do antigo; despublicar antigo e linkar no comentario fixo
- Se tiver projeto CapCut/Premiere: trocar faixa de audio e reexportar
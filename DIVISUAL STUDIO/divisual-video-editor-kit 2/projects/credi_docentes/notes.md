# credi_docentes — 2026-06-16

## Vídeo
- Source: `videos heygen/Video_avatar_editado_1.3x.mp4` — 1080×1920 9:16, 25fps, 48.88s (avatar HeyGen, ya acelerado 1.3x)
- Final: `output/heygen_credi_final.mp4` → entregado como `videos heygen/Video_avatar_FINAL_editado.mp4`

## Decisiones clave
- **Sin recorte (Fase 2 omitida):** narración HeyGen limpia, sin muletillas/silencios → re-cortar solo degradaría calidad. Se trabaja sobre el base directo.
- **Sin logo del kit:** el isotipo del kit es de *Divisual*; este anuncio es de *Credi Ayudarte* (ya tiene su logo en la pared). Usar el ajeno sería error de marca. Se mantiene el *estilo* (amarillo #FAC51C, tipografía, motion enérgico).
- Transcripción local con **faster-whisper** (la key de ElevenLabs del .env está revocada, HTTP 401).
- Render en **Windows**: puppeteer-core instalado vía npm (`--use-system-ca` por CA corporativa); execFileSync en vez de execSync (ComSpec roto).

## Perfil: VENTAS / PITCH
Hook → Dolor → Reencuadre → Solución → CTA WhatsApp.

## Beats (6 + karaoke)
1. hook 0.40–6.00 — "¿Eres DOCENTE del gobierno?" + dolor
2. painlist 13.80–20.80 — chips: Descuentos/Cooperativas/Embargos/Tarjetas en mora/Por fuera (sync)
3. reframe 21.60–24.80 — "Otro crédito a ciegas NO es la solución" (sync a "ciegas")
4. solution 25.80–32.40 — checklist: nómina / deudas negociables / capacidad (sync)
5. ordenar 33.80–37.40 — "ORDENAR TU SITUACIÓN sin dejarte peor" (sync a "ordenar")
6. cta 43.60–48.86 — WhatsApp + palabra "CRÉDITO" (popIn) + "Atención inmediata"
+ Karaoke palabra-a-palabra 0–43.4s (amarillo activo), cortado en el CTA para que respire.

## Pipeline técnico
- Beats GSAP timeline determinista → screenshot por frame → ProRes 4444 (yuva444p12le)
- Karaoke ASS (libass) quemado al final de la cadena
- Composite: 6 overlays con enable=between + subtitles, h264 crf18, aac 192k, +faststart

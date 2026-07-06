# PROJECT_SNAPSHOT — Credi Ayudarte 0622

## Fecha de revisión
2026-06-22

## Carpeta raíz
`C:\Users\PC\Desktop\CLAUDE USOS\PROYECTOS VIDEO`

## Kits encontrados
- **HyperFrames Student Kit** (`hyperframes-student-kit/`) — pipeline real en Windows (`npx hyperframes`). ← USAR ESTE
- **Divisual Studio Kit** (`DIVISUAL STUDIO/divisual-video-editor-kit 2/`) — Mac-only (Homebrew/ProRes/bun/puerto 5190). Solo referencia conceptual + assets de marca Credi.
- **Instrucciones maestras** (`INSTRUCCIONES/`, `claude.md/CLAUDE_MASTER_VIDEO_PREMIUM.md`).

## Video detectado
- Fuente: `CONTENIDO/CONTENIDO MAMA/videos heygen/0622.mov` → copiado a `assets/source.mp4`
- Specs: 1080×1920, 30fps, 35.87s, H.264 + AAC. Avatar HeyGen mujer hablando, sofá rosado + pared crema.

## Reutilizado de sesión previa (`heygen-0622`)
- `transcript.json` (whisperx, word-level) — NO re-transcribir.
- `source.mp4`, `audio.mp3`.
- Matte con alpha (`frames_fg/`, 1076 PNGs RGBA) — disponible pero NO usado (la usuaria eligió conservar el fondo original).

## Marca (recuperada de `DIVISUAL STUDIO/.../projects/credi_docentes_v2/` + logo a color enviado)
- Credi Ayudarte — financiera/créditos Colombia.
- Paleta del logo: oro `#EFC01E`, verde `#5FA22E`, gris `#9CA1A6`, carbón `#3C4043`. (Refinar a hex exacto con el PNG a color.)
- Logo blanco: `assets/logo-white.png` (isotipo 2560², sin versión oscura). Logo a color: pendiente de la usuaria.
- WhatsApp: 315 247 4348 · palabra CRÉDITO.

## Decisiones de la usuaria
- Dirección visual: **fondo original + overlays** (no recompuesto oscuro).
- CTA: marca + WhatsApp.
- Paleta: la del logo a color enviado.

## Error de la sesión previa que NO repetir
- `heygen-0622` usó `/embedded-captions` → DNA `anchor-vertical` (solo rail de subtítulos verbatim sobre el video crema). Es "subtítulos encima del video" = edición no premium. Por eso se reconstruye aquí con motion graphics densos.

## Observaciones / riesgos
- Fondo crema muy claro (luma ~223) → texto blanco se lava. Mitigación: scrims oscuros globales top/bottom + cards glass oscuras.
- Logo a color aún no en el proyecto → la tarjeta CTA usa logo blanco provisional hasta recibir el PNG a color.

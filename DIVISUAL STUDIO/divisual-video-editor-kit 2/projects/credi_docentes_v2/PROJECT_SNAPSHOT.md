# PROJECT_SNAPSHOT — credi_docentes_v2

## Fecha de revisión
2026-06-17

## Carpeta raíz detectada
C:\Users\PC\Desktop\PROYECTOS VIDEO\DIVISUAL STUDIO\divisual-video-editor-kit 2

## Video
- Origen: Desktop\videos heygen\Video_avatar_editado_1.3x.mp4 (idéntico a input/heygen_avatar.mp4)
- 1080×1920, 25fps, 48.88s, h264 + aac. Estado: editado (cortado/1.3x), persona centrada.

## Recursos de marca
- brand/logo/logo-white.png (isotipo blanco 2560×2560, transparente)
- Paleta/fonts/cards: styles/client-style.md
- Transcript palabra-por-palabra: output/heygen_transcript.json

## Pipeline de render (Windows, verificado)
- Chrome: C:\Program Files\Google\Chrome\Application\chrome.exe
- puppeteer-core: output/compositions/credi_docentes/node_modules
- ffmpeg/ffprobe: PATH (WinGet)
- Método: composición HTML → PNG frames (alfa) → ProRes 4444 yuva444p10le → overlay ffmpeg sobre base (audio intacto)

## Salida
- output/compositions/credi_docentes_v2/  (index.html, capture.js, renders/)
- output/Video_avatar_PREMIUM_credi.mp4
- Copia final: Desktop\videos heygen\Video_avatar_PREMIUM_credi.mp4

## Observaciones
- Existe intento previo heygen_credi_final.mp4 (beats sueltos) — se rehace cohesionado.
- No reinstalar puppeteer: reusar node_modules de credi_docentes.

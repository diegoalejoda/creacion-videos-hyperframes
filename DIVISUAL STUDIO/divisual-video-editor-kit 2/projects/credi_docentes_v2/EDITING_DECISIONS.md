# EDITING_DECISIONS — Credi Ayudarte v2

## Cliente
Credi Ayudarte (finanzas, docentes del gobierno)

## Video
Video_avatar_editado_1.3x.mp4 (= input/heygen_avatar.mp4) — 1080×1920, 25fps, 48.88s

## Objetivo
Leads por WhatsApp + confianza.

## Estilo aplicado
Premium denso / liquid glass / karaoke / acento amarillo #FAC51C sobre negro #0D0D0D.

## Decisiones visuales
- **Una sola composición maestra continua** (no beats sueltos) → karaoke continuo, cero gaps, mayor cohesión que el intento previo (heygen_credi_final.mp4).
- **Overlay-only**: los gráficos se compositan sobre el video original con ffmpeg → el video base mantiene calidad y audio al 100%. El "glass" se logra con relleno translúcido + borde + sombra (backdrop-filter no aplica sin video dentro del HTML).
- **Honestidad/compliance**: NO se inventan porcentajes ni tasas de éxito (marca financiera + guion dice "no prometemos milagros"). Se enfatiza método (checklist) y dolor real (chips de deudas), no resultados garantizados.
- **Protección de cara**: persona centrada → cards arriba o en tercio inferior; captions banda baja.
- **Palabras clave resaltadas en karaoke**: docente, deudas, descuentos, nómina, capacidad, negociar, crédito, WhatsApp.
- **CTA**: tarjeta WhatsApp con número real 315 247 4348 + cápsula "CRÉDITO" oro + "atención inmediata".

## Ajustes durante producción
- **Paleta**: el logo REAL de pared (visible en el video) usa verde + amarillo, no solo amarillo. Se incorporó verde de marca `#43B23A` como acento secundario (checks, WhatsApp, palabras "solución/positivo") manteniendo `#FAC51C` como héroe. Más fiel a la identidad real.
- **Intro**: se añadió spotlight oscuro detrás del título para separarlo del logo de pared (legibilidad).
- **Watermark superior** eliminado por redundancia con el logo de pared del set.
- **Captions** suprimidos durante checklist (23.5–37.3) y CTA (40.1–fin) porque las tarjetas tipográficas ya transmiten esas frases (evita doble texto).

## Cambios solicitados
- (ninguno aún — primera versión)

## Pendientes
- Revisión visual del usuario tras primer render.

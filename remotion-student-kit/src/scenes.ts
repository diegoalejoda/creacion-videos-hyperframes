import wordsData from "./words.json";
import { C, FPS } from "./theme";

export type Word = { t: string; start: number; end: number };
export const WORDS: Word[] = wordsData.words as Word[];

export const DURATION = 1235; // 41.17s @ 30fps

export type SceneKind = "presenter" | "slide";
export type SceneId =
  | "hookA"
  | "slideTasa"
  | "presB"
  | "slide30"
  | "presCaso"
  | "slidePension"
  | "presCierre"
  | "cta";

// A motion-graphic card that appears alongside the caption during a talking
// beat. `from`/`to` are seconds LOCAL to the scene (scene start = 0).
export type CardKind = "chips" | "bars" | "numbers" | "list" | "tag" | "percent";

export type Card = {
  from: number;
  to: number;
  label: string;
  kind: CardKind;
  items?: string[]; // "chips" | "list" | "numbers"
  stat?: string; // badge, e.g. "+30%" / "× 4"
  note?: string; // small caption under a "percent" ring
  highlightAt?: number; // "numbers": local sec at which the last badge lights up
};

// Top-band graphics sit above her head and leave the caption at collar height;
// everything else stacks under a raised caption.
export function cardPlace(card: Card): "top" | "below" {
  return card.kind === "numbers" || card.kind === "tag" ? "top" : "below";
}

export type Scene = {
  id: SceneId;
  kind: SceneKind;
  from: number;
  to: number;
  cards?: Card[];
  accent?: string;
};

// Short, frequent cuts: 3 quick slides (~3.3-3.7s) spread through the video
// instead of one long block. Motion-graphic cards appear only in short
// intervals during talk — most presenter time is caption-only.
export const SCENES: Scene[] = [
  {
    id: "hookA",
    kind: "presenter",
    from: 0,
    to: 390, // 0-13.0s — hook + cosa 1 completa + arranque de cosa 2
    accent: C.coral,
    cards: [
      // "por estas tres cosas y la última te va a sorprender"
      { from: 1.9, to: 4.75, label: "3 COSAS", kind: "numbers", items: ["1", "2", "3"], highlightAt: 3.5 },
      // "si tienes tres o cuatro deudas por ahí pequeñas"
      { from: 5.0, to: 7.8, label: "DEUDAS PEQUEÑAS", kind: "list", stat: "× 4", items: ["Tarjeta", "Digital", "Almacén", "Otra"] },
      // "cada una te cobra por separado: estudio, seguro y manejo"
      { from: 8.85, to: 11.1, label: "COBROS POR SEPARADO", kind: "chips", items: ["Estudio", "Seguro", "Manejo"] },
    ],
  },
  { id: "slideTasa", kind: "slide", from: 390, to: 480, accent: C.coral }, // 13.0-16.0s (3.0s)
  {
    id: "presB",
    kind: "presenter",
    from: 480,
    to: 648, // 16.0-21.60s — cosa 3: crédito digital / aval
    accent: C.coral,
    cards: [
      { from: 0.4, to: 2.2, label: "CRÉDITO DIGITAL", kind: "tag" },
      { from: 3.5, to: 5.55, label: "TE SUMAN EL AVAL", kind: "bars", stat: "+AVAL" },
    ],
  },
  { id: "slide30", kind: "slide", from: 648, to: 759, accent: C.coral }, // 21.60-25.30s (3.7s)
  {
    id: "presCaso",
    kind: "presenter",
    from: 759,
    to: 943, // 25.30-31.42s — caso real
    accent: C.green,
    cards: [
      { from: 0.2, to: 2.0, label: "CASO REAL · PENSIONADO", kind: "tag" },
      { from: 3.3, to: 5.95, label: "PERDÍA DE SU PENSIÓN", kind: "percent", note: "cada mes, sin darse cuenta" },
    ],
  },
  { id: "slidePension", kind: "slide", from: 943, to: 1048, accent: C.green }, // 31.42-34.92s (3.5s)
  {
    id: "presCierre",
    kind: "presenter",
    from: 1048,
    to: 1145, // 34.92-38.18s
    accent: C.green,
    cards: [
      { from: 0.3, to: 3.1, label: "LO QUE HACEMOS", kind: "list", items: ["Organizar tus cuotas", "Que pagues menos"] },
    ],
  },
  {
    id: "cta",
    kind: "presenter",
    from: 1145,
    to: DURATION, // 38.18-41.17s
    accent: C.green,
  },
];

/* Running "cosa 1 / 2 / 3" counter in the upper-left. Spans scenes, so it lives
   on the global timeline: each entry marks the second she starts that item, and
   the whole counter clears once she moves on to the real-case story. */
export const BIG_NUMBERS: { n: number; at: number }[] = [
  { n: 1, at: 4.78 }, // "Si tienes tres o cuatro deudas por ahí pequeñas…"
  { n: 2, at: 11.26 }, // "Si aceptaste un crédito por afán…"
  { n: 3, at: 16.0 }, // "si hiciste un crédito digital…"
];
export const BIG_NUMBERS_END = 25.46; // "A un pensionado que atendimos…"

export function activeBigNumber(frame: number): { n: number; at: number } | undefined {
  const t = sec(frame);
  if (t >= BIG_NUMBERS_END) return undefined;
  let cur: { n: number; at: number } | undefined;
  for (const b of BIG_NUMBERS) if (t >= b.at) cur = b;
  return cur;
}

export const BIG_NUM_X = 140; // upper-left placement, clear of her hair/face
export const BIG_NUM_Y = 500;

export const CAP_Y = 1190; // caption band center: collar / blue-circle height (caption-only beats)
export const CAP_Y_RAISED = 1050; // raised caption position when a motion card sits below it
export const CARD_Y = 1345; // motion-card center when paired with a raised caption
export const TOP_Y = 215; // top-band graphics center (above her head, over the dark wall)

export const sec = (frame: number) => frame / FPS;
export const frame = (s: number) => Math.round(s * FPS);

export function sceneAt(frame: number): Scene | undefined {
  return SCENES.find((s) => frame >= s.from && frame < s.to);
}

export function activeCard(scene: Scene, globalFrame: number): Card | undefined {
  if (!scene.cards) return undefined;
  const localSec = sec(globalFrame) - sec(scene.from);
  return scene.cards.find((c) => localSec >= c.from && localSec < c.to);
}

export function wordsIn(fromFrame: number, toFrame: number): Word[] {
  const a = sec(fromFrame);
  const b = sec(toFrame);
  return WORDS.filter((w) => w.start >= a - 0.15 && w.start < b);
}

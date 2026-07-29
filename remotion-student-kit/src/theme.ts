// Brand system pulled from the live CrediAyudarte site CSS (:root vars).
export const C = {
  green: "#8DB336",
  greenDk: "#70A63B",
  yellow: "#F1CF00",
  yellowDk: "#E8BB00",
  coral: "#E0653A",
  coralDk: "#C24E27",
  blueGray: "#BAC6D3",
  blueGrayDk: "#A5BACE",
  light: "#EDEEF0",
  offWhite: "#FBFCF6",
  dark: "#5B5B5F",
  ink: "#333333",
  text: "#7A7A7A",
  white: "#FFFFFF",
};

export const FONT = {
  slab: '"Roboto Slab", Georgia, serif', // headings
  sans: '"Roboto", system-ui, sans-serif', // body
};

export const RADIUS = { pill: 999, md: 28, sm: 14 };

export const SHADOW = {
  card: "0 22px 48px rgba(69,71,75,0.20)",
  soft: "0 12px 30px rgba(69,71,75,0.14)",
  chip: "0 8px 20px rgba(69,71,75,0.18)",
};

export const FPS = 30;

// Soft, airy deck gradient used behind slides.
export const deckBg = `radial-gradient(120% 80% at 50% -10%, ${C.white} 0%, ${C.offWhite} 45%, ${C.light} 100%)`;

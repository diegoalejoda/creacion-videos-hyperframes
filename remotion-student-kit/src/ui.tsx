import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, RADIUS, SHADOW } from "./theme";
import {
  sec,
  wordsIn,
  DURATION,
  CAP_Y,
  CAP_Y_RAISED,
  CARD_Y,
  TOP_Y,
  BIG_NUM_X,
  BIG_NUM_Y,
  BIG_NUMBERS_END,
  Scene,
  Card,
  sceneAt,
  activeCard,
  activeBigNumber,
  cardPlace,
  Word,
} from "./scenes";

// Group a scene's words into short karaoke lines (break on punctuation or length).
function buildLines(words: Word[], maxWords = 6): Word[][] {
  const lines: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const punct = /[.,;:?!]$/.test(w.t);
    if (cur.length >= maxWords || punct) {
      lines.push(cur);
      cur = [];
    }
  }
  if (cur.length) lines.push(cur);
  return lines;
}

/* ---------------- motion helpers ---------------- */

export function useEnter(delay = 0, damping = 200) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.9 } });
}

/* ---------------- liquid-glass surface ---------------- */

export const Glass: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  tint?: string; // base translucent fill
  dark?: boolean; // smoked glass for legibility over unpredictable video footage
}> = ({ children, style, radius = 40, tint = "rgba(255,255,255,0.24)", dark = false }) => {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        background: dark
          ? `linear-gradient(135deg, rgba(18,18,22,0.55), rgba(18,18,22,0.34))`
          : `linear-gradient(135deg, ${tint}, rgba(255,255,255,0.08))`,
        backdropFilter: "blur(22px) saturate(185%)",
        WebkitBackdropFilter: "blur(22px) saturate(185%)",
        border: dark ? "1.5px solid rgba(255,255,255,0.28)" : "1.5px solid rgba(255,255,255,0.55)",
        boxShadow: dark
          ? "0 26px 60px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.22), inset 0 -8px 22px rgba(255,255,255,0.05)"
          : "0 26px 60px rgba(40,42,58,0.30), inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -8px 22px rgba(255,255,255,0.12)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* specular sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: dark
            ? "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.0) 30%)"
            : "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.0) 30%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

/* ---------------- presenter motion-graphics layer ---------------- */

// Soft animated brand light-leaks in the corners (kept off her face).
const PresenterBg: React.FC<{ accent: string }> = ({ accent }) => {
  const f = useCurrentFrame();
  const a = 0.5 + 0.5 * Math.sin(f / 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -220,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}2e, transparent 68%)`,
          transform: `translate(${a * 30}px, ${a * 18}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -300,
          right: -240,
          width: 820,
          height: 820,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.green}22, transparent 68%)`,
          transform: `translate(${-a * 26}px, ${a * 20}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -320,
          left: "50%",
          width: 1000,
          height: 700,
          marginLeft: -500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.yellow}1c, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const PresenterBeat: React.FC<{
  scene: Scene;
  children?: React.ReactNode;
}> = ({ scene, children }) => {
  const accent = scene.accent ?? C.green;
  return (
    <AbsoluteFill>
      <PresenterBg accent={accent} />
      {children}
    </AbsoluteFill>
  );
};

/* ---------------- talk-beat motion-graphic card ---------------- */
/* Dark glass stat card shown in short intervals while she talks — bars/
   sparkline variant for numeric beats, chip-row variant for named items. */

const MiniBars: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => {
  const { fps } = useVideoConfig();
  const finals = [0.34, 0.52, 0.44, 0.7, 0.86, 1];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 74, marginTop: 18 }}>
      {finals.map((h, i) => {
        const e = spring({ frame: frame - i * 2.5, fps, config: { damping: 14 } });
        return (
          <div
            key={i}
            style={{
              width: 22,
              height: Math.max(4, h * 74 * e),
              borderRadius: 6,
              background: `linear-gradient(180deg, ${C.blueGray}, ${accent})`,
              boxShadow: `0 4px 12px ${accent}44`,
            }}
          />
        );
      })}
    </div>
  );
};

const Sparkline: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => {
  const { fps } = useVideoConfig();
  const draw = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const len = 260;
  return (
    <svg width={260} height={40} viewBox="0 0 260 40" style={{ marginTop: 10 }}>
      <path
        d="M2 30 C 40 30, 55 12, 85 18 S 140 34, 170 20 S 220 6, 258 8"
        fill="none"
        stroke={accent}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
    </svg>
  );
};

const CardHeader: React.FC<{ label: string; stat?: string; accent: string }> = ({ label, stat, accent }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: accent, boxShadow: `0 0 10px ${accent}` }} />
      <span
        style={{
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 24,
          color: "rgba(255,255,255,0.88)",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
    {stat ? (
      <div
        style={{
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: RADIUS.pill,
          padding: "8px 18px",
          fontFamily: FONT.slab,
          fontWeight: 700,
          fontSize: 28,
          color: C.white,
        }}
      >
        {stat}
      </div>
    ) : null}
  </div>
);

// Numbered badges in the top band — pops one per counted item.
const NumberBadges: React.FC<{ card: Card; frame: number; accent: string }> = ({
  card,
  frame,
  accent,
}) => {
  const { fps } = useVideoConfig();
  const items = card.items ?? [];
  const hlFrame = card.highlightAt != null ? (card.highlightAt - card.from) * fps : Infinity;
  return (
    <div style={{ display: "flex", gap: 34, justifyContent: "center" }}>
      {items.map((n, i) => {
        const e = spring({ frame: frame - i * 7, fps, config: { damping: 12 } });
        const isLast = i === items.length - 1;
        const hl = isLast
          ? spring({ frame: frame - hlFrame, fps, config: { damping: 11 } })
          : 0;
        return (
          <div
            key={n}
            style={{
              width: 132,
              height: 132,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `3px dashed ${hl > 0.1 ? accent : "rgba(255,255,255,0.75)"}`,
              background:
                hl > 0.1
                  ? `radial-gradient(circle, ${accent}55, rgba(18,18,22,0.42))`
                  : "rgba(18,18,22,0.34)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: hl > 0.1 ? `0 0 34px ${accent}88` : "0 12px 30px rgba(0,0,0,0.4)",
              opacity: e,
              transform: `scale(${0.5 + e * 0.5}) scale(${1 + hl * 0.12})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT.slab,
                fontWeight: 700,
                fontSize: 68,
                color: C.white,
                textShadow: "0 3px 14px rgba(0,0,0,0.55)",
              }}
            >
              {n}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Ring that sweeps in with a "?" center — illustrates a proportion without
// inventing a hard figure.
const PercentRing: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => {
  const { fps } = useVideoConfig();
  const sweep = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const r = 74;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={190} height={190} viewBox="0 0 190 190">
      <circle cx={95} cy={95} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={22} />
      <circle
        cx={95}
        cy={95}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray={`${sweep * 0.38 * circ} ${circ}`}
        transform="rotate(-90 95 95)"
      />
      <text
        x={95}
        y={118}
        textAnchor="middle"
        fontFamily={FONT.slab}
        fontWeight={700}
        fontSize={72}
        fill={C.white}
      >
        ?
      </text>
    </svg>
  );
};

export const TalkCard: React.FC<{ card: Card; localFrame: number; accent: string }> = ({
  card,
  localFrame,
  accent,
}) => {
  const { fps } = useVideoConfig();
  const cardStartF = card.from * fps;
  const cardEndF = card.to * fps;
  const inE = spring({ frame: localFrame - cardStartF, fps, config: { damping: 16 } });
  const outE = interpolate(localFrame, [cardEndF - 6, cardEndF], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const e = Math.min(inE, outE);
  const cardFrame = localFrame - cardStartF;
  const top = cardPlace(card) === "top";

  const body = (() => {
    if (card.kind === "numbers")
      return <NumberBadges card={card} frame={cardFrame} accent={accent} />;

    if (card.kind === "tag")
      return (
        <Glass dark radius={RADIUS.pill} style={{ padding: "18px 38px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: FONT.slab,
              fontWeight: 700,
              fontSize: 42,
              color: C.white,
              whiteSpace: "nowrap",
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{ width: 16, height: 16, borderRadius: 8, background: accent, boxShadow: `0 0 16px ${accent}` }}
            />
            {card.label}
          </div>
        </Glass>
      );

    return (
      <Glass dark radius={32} style={{ padding: "26px 30px" }}>
        <CardHeader label={card.label} stat={card.stat} accent={accent} />
        {card.kind === "bars" && (
          <>
            <MiniBars frame={cardFrame} accent={accent} />
            <Sparkline frame={cardFrame} accent={accent} />
          </>
        )}
        {card.kind === "chips" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            {(card.items ?? []).map((it, i) => {
              const ie = spring({ frame: cardFrame - i * 4, fps, config: { damping: 14 } });
              return (
                <span
                  key={it}
                  style={{
                    opacity: ie,
                    transform: `translateY(${(1 - ie) * 10}px)`,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    borderRadius: RADIUS.pill,
                    padding: "12px 24px",
                    fontFamily: FONT.slab,
                    fontWeight: 700,
                    fontSize: 30,
                    color: C.white,
                  }}
                >
                  {it}
                </span>
              );
            })}
          </div>
        )}
        {card.kind === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {(card.items ?? []).map((it, i) => {
              const ie = spring({ frame: cardFrame - i * 5, fps, config: { damping: 16 } });
              return (
                <div
                  key={it}
                  style={{
                    opacity: ie,
                    transform: `translateX(${(1 - ie) * -24}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: RADIUS.sm,
                    padding: "12px 20px",
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.white,
                      fontFamily: FONT.sans,
                      fontWeight: 900,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: FONT.slab, fontWeight: 700, fontSize: 32, color: C.white }}>
                    {it}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {card.kind === "percent" && (
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 14 }}>
            <PercentRing frame={cardFrame} accent={accent} />
            {card.note ? (
              <span
                style={{
                  fontFamily: FONT.sans,
                  fontWeight: 600,
                  fontSize: 30,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.25,
                }}
              >
                {card.note}
              </span>
            ) : null}
          </div>
        )}
      </Glass>
    );
  })();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: top ? TOP_Y : CARD_Y,
          transform: `translate(-50%, -50%) translateY(${(1 - e) * (top ? -20 : 22)}px) scale(${
            0.94 + e * 0.06
          })`,
          opacity: e,
          ...(top ? {} : { width: 620 }),
        }}
      >
        {body}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- running "cosa 1/2/3" counter ---------------- */
/* Big numeral in the upper-left that ticks over as she starts each of the three
   items, and clears when she moves on to the real-case story. Presenter beats
   only — slides own the full screen. */

export const BigNumberLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = sceneAt(frame);
  const big = activeBigNumber(frame);
  if (!scene || scene.kind !== "presenter" || !big) return null;

  const accent = scene.accent ?? C.green;
  const pop = spring({ frame: frame - big.at * fps, fps, config: { damping: 13 } });
  const fadeOut = interpolate(frame, [BIG_NUMBERS_END * fps - 8, BIG_NUMBERS_END * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin(frame / 34) * 5;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: BIG_NUM_X,
          top: BIG_NUM_Y,
          width: 200,
          height: 200,
          marginLeft: -100,
          marginTop: -100,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `3px dashed rgba(255,255,255,0.7)`,
          background: `radial-gradient(circle, ${accent}33, rgba(18,18,22,0.42))`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 30px ${accent}44`,
          opacity: fadeOut * Math.min(1, pop * 1.4),
          transform: `translateY(${float}px) scale(${0.62 + pop * 0.38})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT.slab,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1,
            color: C.white,
            textShadow: "0 4px 18px rgba(0,0,0,0.6)",
          }}
        >
          {big.n}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- liquid-glass karaoke captions ---------------- */

export const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sec(frame);
  const scene = sceneAt(frame);
  if (!scene || scene.kind !== "presenter") return null;
  if (scene.id === "cta") return null; // CTA carries its message on a card
  const words = wordsIn(scene.from, scene.to);
  if (words.length === 0) return null;

  const card = activeCard(scene, frame);
  const capY = card && cardPlace(card) === "below" ? CAP_Y_RAISED : CAP_Y;

  // Rolling lines: only the current spoken line is shown at a time.
  const lines = buildLines(words);
  let li = 0;
  for (let i = 0; i < lines.length; i++) {
    if (t >= lines[i][0].start - 0.12) li = i;
  }
  const line = lines[li];
  const lineStartF = line[0].start * 30;
  const appear = interpolate(frame, [lineStartF - 4, lineStartF + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {card ? <TalkCard card={card} localFrame={frame - scene.from} accent={scene.accent ?? C.green} /> : null}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: capY,
          transform: `translate(-50%, -50%) translateY(${(1 - appear) * 18}px)`,
          opacity: appear,
          width: 900,
        }}
      >
        <Glass dark radius={40} style={{ padding: "26px 38px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px 12px",
            }}
          >
            {(() => {
              let activeIdx = -1;
              for (let i = 0; i < line.length; i++) if (t >= line[i].start) activeIdx = i;
              return line.map((w, i) => {
              const active = i === activeIdx;
              const past = i < activeIdx;
              return (
                <span
                  key={i}
                  style={{
                    position: "relative",
                    fontFamily: FONT.slab,
                    fontWeight: 700,
                    fontSize: 54,
                    lineHeight: 1.05,
                    padding: active ? "2px 18px" : "2px 2px",
                    borderRadius: RADIUS.pill,
                    background: active
                      ? `linear-gradient(135deg, ${C.green}, ${C.greenDk})`
                      : "transparent",
                    color: active ? C.white : past ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)",
                    textShadow: active ? "none" : "0 2px 8px rgba(0,0,0,0.4)",
                    boxShadow: active ? `0 6px 18px ${C.green}66` : "none",
                    transform: active ? "translateY(-3px)" : "none",
                  }}
                >
                  {w.t.replace(/[.,]$/, "")}
                </span>
              );
              });
            })()}
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- persistent chrome ---------------- */

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, DURATION], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: 8,
        background: "rgba(186,198,211,0.30)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${C.green}, ${C.yellow})`,
          boxShadow: `0 0 16px ${C.green}88`,
        }}
      />
    </div>
  );
};

/* ---------------- slide primitives ---------------- */

export const Blob: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  drift?: number;
}> = ({ x, y, size, color, drift = 0 }) => {
  const frame = useCurrentFrame();
  const dx = drift ? Math.sin(frame / 42) * drift : 0;
  const dy = drift ? Math.cos(frame / 55) * drift * 0.7 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(26px)",
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    />
  );
};

export const SlideRoot: React.FC<{
  children: React.ReactNode;
  bg?: string;
  accent?: string;
  footer?: boolean;
}> = ({ children, bg, accent = C.green, footer = true }) => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 11], [100, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const settle = spring({
    frame,
    fps: 30,
    config: { damping: 200 },
  });
  return (
    <AbsoluteFill style={{ clipPath: `inset(${cover}% 0 0 0)` }}>
      <AbsoluteFill
        style={{
          background:
            bg ??
            `radial-gradient(125% 75% at 50% -8%, ${C.white} 0%, ${C.offWhite} 48%, ${C.light} 100%)`,
          transform: `scale(${interpolate(settle, [0, 1], [1.06, 1])})`,
        }}
      />
      <Blob x={-180} y={-160} size={640} color={`${accent}2e`} drift={26} />
      <Blob x={620} y={1360} size={720} color={`${C.green}22`} drift={-34} />
      <Blob x={-120} y={1200} size={440} color={`${C.blueGray}33`} drift={20} />
      <AbsoluteFill
        style={{
          paddingLeft: 96,
          paddingRight: 96,
          paddingTop: 120,
          paddingBottom: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </AbsoluteFill>
      {footer ? <SlideFooter /> : null}
    </AbsoluteFill>
  );
};

export const SlideFooter: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 42,
      left: 0,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      opacity: 0.8,
    }}
  >
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: 5,
        background: C.green,
        display: "inline-block",
        boxShadow: `0 0 12px ${C.green}`,
      }}
    />
    <span
      style={{
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: 27,
        color: C.text,
        letterSpacing: 2,
      }}
    >
      CREDIAYUDARTE · TE AYUDAMOS DE VERDAD
    </span>
  </div>
);

export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
}> = ({ children, color = C.green, delay = 4 }) => {
  const e = useEnter(delay);
  return (
    <div style={{ alignSelf: "flex-start", opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <Glass radius={RADIUS.pill} tint={`${color}22`} style={{ padding: "12px 26px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color,
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 5,
              background: color,
              boxShadow: `0 0 14px ${color}`,
            }}
          />
          {children}
        </div>
      </Glass>
    </div>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ children, size = 92, color = C.ink, delay = 8 }) => {
  const e = useEnter(delay);
  return (
    <h1
      style={{
        fontFamily: FONT.slab,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.04,
        color,
        margin: 0,
        opacity: e,
        transform: `translateY(${(1 - e) * 26}px)`,
      }}
    >
      {children}
    </h1>
  );
};

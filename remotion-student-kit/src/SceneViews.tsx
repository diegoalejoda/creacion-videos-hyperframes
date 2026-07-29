import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, RADIUS, SHADOW } from "./theme";
import { SlideRoot, Kicker, Title, Glass, PresenterBeat } from "./ui";
import { Scene } from "./scenes";

type SP = { scene: Scene };

/* ============ Presenter beats (hook / presB / caso / cierre) ============ */
export const TalkScene: React.FC<SP> = ({ scene }) => <PresenterBeat scene={scene} />;

/* ============ SLIDE 1 — la tasa y el aval que no revisas ============ */
export const SlideTasa: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowA = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const rowB = spring({ frame: frame - 28, fps, config: { damping: 200 } });
  return (
    <SlideRoot accent={C.coral}>
      <Kicker color={C.coral}>Antes de aceptar</Kicker>
      <Title size={70}>
        No revisas la tasa
        <br />
        ni el aval que te suman
      </Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
        <div
          style={{
            opacity: rowA,
            transform: `translateX(${(1 - rowA) * -30}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.7)",
            border: `1px solid ${C.white}`,
            boxShadow: SHADOW.soft,
            borderRadius: RADIUS.md,
            padding: "26px 34px",
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 36, color: C.dark }}>Tasa real</span>
          <span style={{ fontFamily: FONT.slab, fontWeight: 700, fontSize: 44, color: C.coral }}>¿ ? %</span>
        </div>
        <div
          style={{
            opacity: rowB,
            transform: `translateX(${(1 - rowB) * -30}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.7)",
            border: `1px solid ${C.white}`,
            boxShadow: SHADOW.soft,
            borderRadius: RADIUS.md,
            padding: "26px 34px",
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 36, color: C.dark }}>Aval sumado</span>
          <span style={{ fontFamily: FONT.slab, fontWeight: 700, fontSize: 44, color: C.coral }}>¿ ? %</span>
        </div>
      </div>
    </SlideRoot>
  );
};

/* ============ SLIDE 2 — el +30% (payoff numérico) ============ */
export const Slide30: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const badge = spring({ frame: frame - 50, fps, config: { damping: 11 } });
  return (
    <SlideRoot accent={C.coral}>
      <Kicker color={C.coral}>Créditos digitales</Kicker>
      <Title size={70}>
        Al aval le suman
        <br />
        hasta un 30% más
      </Title>
      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: FONT.sans, fontWeight: 700, fontSize: 32, color: C.dark }}>
          <span>Te desembolsan</span>
          <span>100%</span>
        </div>
        <div style={{ width: "100%", height: 74, borderRadius: RADIUS.md, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.white}`, boxShadow: SHADOW.soft, overflow: "hidden", marginBottom: 22 }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(135deg, ${C.green}, ${C.greenDk})` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: FONT.sans, fontWeight: 700, fontSize: 32, color: C.dark }}>
          <span>Realmente pagas</span>
          <span style={{ color: C.coral }}>hasta 130%</span>
        </div>
        <div style={{ width: "100%", height: 74, borderRadius: RADIUS.md, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.white}`, boxShadow: SHADOW.soft, overflow: "hidden" }}>
          <div style={{ width: `${Math.min(fill * 130, 130) / 1.3}%`, height: "100%", background: `linear-gradient(135deg, ${C.coral}, ${C.coralDk})` }} />
        </div>
      </div>
      {badge > 0.01 && (
        <div style={{ alignSelf: "center", marginTop: 24, transform: `scale(${interpolate(badge, [0, 1], [1.5, 1])})`, opacity: interpolate(badge, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }) }}>
          <Glass radius={RADIUS.pill} tint={`${C.coral}26`} style={{ padding: "22px 44px" }}>
            <span style={{ color: C.coral, fontFamily: FONT.slab, fontWeight: 700, fontSize: 52 }}>
              +30% del dinero que recibiste
            </span>
          </Glass>
        </div>
      )}
    </SlideRoot>
  );
};

/* ============ SLIDE 3 — elegibilidad (pensión / nómina del gobierno) ============ */
const CheckRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div style={{ opacity: e, transform: `translateX(${(1 - e) * -30}px)`, display: "flex", alignItems: "center", gap: 22 }}>
      <span
        style={{
          width: 54,
          height: 54,
          borderRadius: RADIUS.sm,
          background: `linear-gradient(135deg, ${C.green}, ${C.greenDk})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.white,
          fontSize: 30,
          fontWeight: 900,
          flexShrink: 0,
          boxShadow: `0 10px 22px ${C.green}55`,
        }}
      >
        ✓
      </span>
      <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 38, color: C.ink }}>{text}</span>
    </div>
  );
};

export const SlidePension: React.FC<SP> = () => (
  <SlideRoot accent={C.green}>
    <Kicker color={C.green}>¿Te podemos ayudar?</Kicker>
    <Title size={64}>
      Si recibes pensión o
      <br />
      nómina del gobierno
    </Title>
    <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 22 }}>
      <CheckRow text="Pensionados" delay={16} />
      <CheckRow text="Empleados del gobierno" delay={32} />
      <CheckRow text="Organizamos tus cuotas" delay={48} />
    </div>
  </SlideRoot>
);

/* ============ CTA (presenter) ============ */
export const CtaScene: React.FC<SP> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const pulse = spring({ frame: frame - 22, fps, config: { damping: 12 } });
  return (
    <PresenterBeat scene={scene}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1090,
          transform: `translateX(-50%) translateY(${(1 - card) * 80}px)`,
          opacity: card,
          width: 900,
        }}
      >
        <Glass dark radius={40} style={{ padding: "40px 46px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ textAlign: "center", fontFamily: FONT.slab, fontWeight: 700, fontSize: 50, color: C.white }}>
              Escríbenos al{" "}
              <span
                style={{
                  display: "inline-block",
                  transform: `scale(${interpolate(pulse, [0, 1], [1.3, 1])})`,
                  background: `linear-gradient(135deg, ${C.yellow}, ${C.yellowDk})`,
                  color: C.ink,
                  padding: "4px 24px",
                  borderRadius: RADIUS.pill,
                  boxShadow: `0 8px 22px ${C.yellow}88`,
                }}
              >
                WhatsApp
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                background: `linear-gradient(135deg, ${C.green}, ${C.greenDk})`,
                borderRadius: RADIUS.pill,
                padding: "24px 40px",
                color: C.white,
                fontFamily: FONT.slab,
                fontWeight: 700,
                fontSize: 52,
                boxShadow: `0 14px 34px ${C.green}66`,
              }}
            >
              <span style={{ fontSize: 54 }}>✆</span> 315 247 4348
            </div>
            <div style={{ textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,0.85)" }}>
              Pensionados y empleados del gobierno · respuesta inmediata
            </div>
          </div>
        </Glass>
      </div>
    </PresenterBeat>
  );
};

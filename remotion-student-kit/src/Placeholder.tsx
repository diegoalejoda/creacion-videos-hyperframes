import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Placeholder: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity,
        }}
      >
        <h1 style={{ color: "white", fontSize: 80, fontFamily: "sans-serif" }}>
          Remotion workspace ready
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

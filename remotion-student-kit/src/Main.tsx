import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import { C } from "./theme";
import { SCENES, Scene } from "./scenes";
import { useBrandFonts } from "./fonts";
import { BigNumberLayer, CaptionLayer, ProgressBar } from "./ui";
import {
  TalkScene,
  SlideTasa,
  Slide30,
  SlidePension,
  CtaScene,
} from "./SceneViews";

const SCENE_COMPONENTS: Record<string, React.FC<{ scene: Scene }>> = {
  hookA: TalkScene,
  slideTasa: SlideTasa,
  presB: TalkScene,
  slide30: Slide30,
  presCaso: TalkScene,
  slidePension: SlidePension,
  presCierre: TalkScene,
  cta: CtaScene,
};

export const Main: React.FC = () => {
  useBrandFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: C.light }}>
      {/* continuous presenter video + audio, always in sync */}
      <OffthreadVideo
        src={staticFile("source.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Audio src={staticFile("audio.mp3")} />

      {/* scene overlays */}
      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from}>
            <Comp scene={s} />
          </Sequence>
        );
      })}

      {/* running "cosa 1/2/3" counter, then karaoke captions on top */}
      <BigNumberLayer />
      <CaptionLayer />

      <ProgressBar />
    </AbsoluteFill>
  );
};

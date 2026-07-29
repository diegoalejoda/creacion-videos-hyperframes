import { Composition } from "remotion";
import { Main } from "./Main";
import { DURATION } from "./scenes";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CrediSlides"
      component={Main}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

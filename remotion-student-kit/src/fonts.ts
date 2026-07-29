import { useEffect, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";

const DEFS: [string, number, string][] = [
  ["Roboto", 400, "fonts/Roboto-400.ttf"],
  ["Roboto", 500, "fonts/Roboto-500.ttf"],
  ["Roboto", 700, "fonts/Roboto-700.ttf"],
  ["Roboto", 900, "fonts/Roboto-900.ttf"],
  ["Roboto Slab", 400, "fonts/RobotoSlab-400.ttf"],
  ["Roboto Slab", 700, "fonts/RobotoSlab-700.ttf"],
];

// Loads brand fonts, blocking the render until they are ready.
// The delayRender handle is created during render (useState initializer)
// so it is correctly tracked per frame/tab under renderMedia.
export function useBrandFonts() {
  const [handle] = useState(() =>
    delayRender("brand-fonts", { timeoutInMilliseconds: 90000 })
  );

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    Promise.all(
      DEFS.map(([family, weight, file]) => {
        const face = new FontFace(family, `url(${staticFile(file)})`, {
          weight: String(weight),
        });
        return face.load().then((f) => (document.fonts as any).add(f));
      })
    )
      .then(finish)
      .catch(finish);
    // Safety net in case a load neither resolves nor rejects.
    const t = setTimeout(finish, 80000);
    return () => clearTimeout(t);
  }, [handle]);
}

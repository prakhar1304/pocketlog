import { useEffect, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Count-up for hero balance — avoids Reanimated runOnJS spam. */
export function useAnimatedNumber(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = Date.now();
    const from = 0;
    const to = Math.round(target);

    const tick = () => {
      const now = Date.now();
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

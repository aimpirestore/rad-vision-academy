"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Stat = { value: number; suffix?: string; label: string };

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative border-y border-brand-black/[0.06] bg-brand-light-grey/40">
      <div className="container-default">
        <div className="grid grid-cols-2 divide-x divide-y divide-brand-black/[0.06] sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-10 text-center">
              <span className="text-display-lg text-gradient-red">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-sm font-medium text-brand-dark-grey">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

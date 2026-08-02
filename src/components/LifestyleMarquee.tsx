import { useEffect, useRef } from "react";

type Shot = { src: string; alt: string };

const SPEED = 40; // px per second

export function LifestyleMarquee({ shots }: { shots: Shot[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (now >= pausedUntil.current) {
          el.scrollLeft += SPEED * dt;
        }
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause briefly whenever the user interacts (touch drag, wheel, mouse drag)
    const pause = () => {
      pausedUntil.current = performance.now() + 2000;
    };
    const events: Array<keyof HTMLElementEventMap> = [
      "pointerdown",
      "pointermove",
      "touchstart",
      "touchmove",
      "wheel",
      "scroll",
      "mouseenter",
    ];
    const onScroll = () => {
      // only user scrolls should pause; programmatic ones are tiny per frame
    };
    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchmove", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mousemove", pause);
    void events;
    void onScroll;

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchmove", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mousemove", pause);
    };
  }, []);

  // Mouse drag-to-scroll (touch is native)
  const drag = useRef<{ x: number; left: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className="kz-hide-scrollbar overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
    >
      <div className="flex w-max gap-4 px-4">
        {[...shots, ...shots].map((img, i) => (
          <figure
            key={i}
            className="group relative h-[26rem] w-64 shrink-0 overflow-hidden rounded-[2rem] bg-muted sm:w-72"
          >
            <img
              src={img.src}
              alt={img.alt}
              width={768}
              height={1366}
              loading="lazy"
              draggable={false}
              className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

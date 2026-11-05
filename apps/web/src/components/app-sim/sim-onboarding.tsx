"use client";

import type { PublicProduct } from "@alert/core";
import Image from "next/image";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useSim } from "./sim-store";

const SLIDE_WIDTH = 390;

function CutOut({ product, className, style }: { product?: PublicProduct | undefined; className: string; style?: CSSProperties }) {
  const src = product?.options?.values.find((o) => o.image)?.image ?? product?.image;
  if (!src) return null;
  return (
    <div className={cn("sim-float absolute", className)} style={style}>
      <Image src={src} alt="" fill sizes="220px" className="product-shot object-contain" />
    </div>
  );
}

function Slide({ panel, title, body, children }: { panel: string; title: ReactNode; body: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-[390px] shrink-0 flex-col">
      <div className={cn("relative isolate h-[31rem] shrink-0 overflow-hidden rounded-b-[2.5rem]", panel)}>
        {/* The art drifts slightly faster than the slide while dragging (parallax). */}
        <div className="absolute inset-0 [transform:translateX(calc(var(--drag,0)*0.35px))]">{children}</div>
      </div>
      <div className="px-7 pt-8">
        <h2 className="type-display text-[2rem] font-extrabold leading-[1.02]">{title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{body}</p>
      </div>
    </div>
  );
}

export function SimOnboarding() {
  const sim = useSim();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; dx: number; moved: boolean } | null>(null);
  const find = (slug: string) => sim.bySlug.get(slug);
  const last = 2;

  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)));

  const zoom = () => {
    const phone = trackRef.current?.closest<HTMLElement>("[data-sim-phone]");
    return (phone && Number.parseFloat(phone.style.zoom)) || 1;
  };

  const onDown = (e: React.PointerEvent) => {
    drag.current = { id: e.pointerId, x: e.clientX, dx: 0, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const track = trackRef.current;
    if (!d || !track || d.id !== e.pointerId) return;
    let dx = (e.clientX - d.x) / zoom();
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      track.setPointerCapture(e.pointerId);
      track.dataset.dragging = "true";
    }
    // Resist at the ends.
    if ((index === 0 && dx > 0) || (index === last && dx < 0)) dx *= 0.3;
    d.dx = dx;
    track.style.setProperty("--drag", String(dx));
  };
  const onUp = () => {
    const d = drag.current;
    const track = trackRef.current;
    drag.current = null;
    if (!d || !track || !d.moved) return;
    delete track.dataset.dragging;
    track.style.setProperty("--drag", "0");
    if (d.dx < -SLIDE_WIDTH * 0.16) go(index + 1);
    else if (d.dx > SLIDE_WIDTH * 0.16) go(index - 1);
  };

  return (
    <div className="relative flex h-full flex-col bg-paper">
      <button
        type="button"
        onClick={() => go(last)}
        className={cn(
          "absolute right-5 top-[58px] z-20 rounded-full bg-on-brand/20 px-4 py-2 text-[13px] font-semibold text-on-brand backdrop-blur-md transition-opacity",
          index === last && "pointer-events-none opacity-0",
        )}
      >
        Skip
      </button>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          ref={trackRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="sim-track flex h-full touch-pan-y"
          style={{ transform: `translateX(calc(${-index * SLIDE_WIDTH}px + var(--drag, 0) * 1px))` }}
        >
          <Slide
            panel="bg-brand"
            title={
              <>
                Everything for school, office <span className="type-accent text-pink">and art.</span>
              </>
            }
            body="Pens to planners, school bags to staplers, with live stock on every item."
          >
            <span aria-hidden="true" className="rule-light pattern-ruled absolute inset-0" />
            <CutOut product={find("backpack-25l")} className="left-[40%] top-[18%] size-[13.5rem] rotate-[7deg]" />
            <CutOut product={find("notebook-a5-dotted")} className="left-[4%] top-[26%] size-[10rem] -rotate-[12deg]" style={{ animationDelay: "-2s" }} />
            <CutOut product={find("hb-pencils-12")} className="left-[10%] top-[6%] size-[7rem] rotate-[18deg]" style={{ animationDelay: "-4s" }} />
            <CutOut product={find("acrylic-paint-12")} className="bottom-[6%] left-[22%] size-[9rem] -rotate-[4deg]" style={{ animationDelay: "-1s" }} />
          </Slide>

          <Slide
            panel="bg-contrast"
            title={
              <>
                Snap the list. <span className="type-accent text-pink">We&rsquo;ll pack the bag.</span>
              </>
            }
            body="Point your camera at your school's printed stationery list, and every item lands in your bag."
          >
            <span aria-hidden="true" className="rule-light pattern-dots absolute inset-0" />
            <div className="absolute left-1/2 top-[14%] w-[15rem] -translate-x-1/2 -rotate-3 rounded-md bg-sheet p-4 text-on-sheet shadow-[0_24px_40px_-16px_rgb(0_0_0/0.6)]">
              <span className="tape absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 rotate-3" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-60">{sim.data.list.school}</p>
              <p className="mt-0.5 font-mono text-[13px] font-bold">{sim.data.list.grade} stationery list</p>
              <ul className="relative mt-2 space-y-1.5 overflow-hidden">
                {sim.data.list.items.slice(0, 8).map((item, i) => (
                  <li key={item.slug + i} className="sim-tick-line font-mono text-[10px]" style={{ animationDelay: `${i * 0.35}s` }}>
                    {item.qty} × {item.name}
                  </li>
                ))}
                <span className="scan-laser sim-laser absolute inset-x-0 top-0" />
              </ul>
            </div>
          </Slide>

          <Slide
            panel="bg-orchid"
            title={
              <>
                Real specials. <span className="type-accent text-pink">Live stock.</span>
              </>
            }
            body="See what's on special and exactly how many are left, the moment it changes."
          >
            <span aria-hidden="true" className="rule-light pattern-dots absolute inset-0" />
            <CutOut product={find("acrylic-paint-12")} className="left-[8%] top-[16%] size-[13rem] -rotate-[8deg]" />
            <CutOut product={find("stapler-full-strip")} className="right-[2%] top-[40%] size-[11rem] rotate-[6deg]" style={{ animationDelay: "-3s" }} />
            <CutOut product={find("maths-set-9")} className="bottom-[4%] left-[14%] size-[9.5rem] rotate-[4deg]" style={{ animationDelay: "-1.5s" }} />
            <span className="absolute left-[12%] top-[12%] rotate-[-6deg] rounded-[6px] bg-ink px-2.5 py-1 text-[13px] font-bold text-paper">−21%</span>
            <span className="absolute right-[10%] top-[24%] rotate-[5deg] rounded-[6px] bg-brand px-2.5 py-1 text-[12px] font-bold text-on-brand">ONLY 3 LEFT</span>
          </Slide>
        </div>
      </div>

      <div className="shrink-0 px-7 pb-10 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Intro slides">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={cn("h-2 rounded-full transition-all duration-300 ease-glide", i === index ? "w-7 bg-ink" : "w-2 bg-line-strong")}
              />
            ))}
          </div>
          {index < last ? (
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="inline-flex size-14 items-center justify-center rounded-full bg-ink text-paper transition-transform active:scale-95"
            >
              <ArrowRightIcon className="size-6" />
            </button>
          ) : null}
        </div>
        {index === last ? (
          <div className="fade-in mt-5">
            <button
              type="button"
              onClick={sim.start}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-semibold text-on-brand transition-transform active:scale-[0.98]"
            >
              Continue as guest
              <ArrowRightIcon className="size-5" />
            </button>
            <p className="mt-3 text-center text-[12px] text-muted">Sign-in comes with the full app.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

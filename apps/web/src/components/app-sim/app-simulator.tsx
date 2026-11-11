"use client";

import { useEffect, useRef } from "react";
import { BagIcon, GridIcon, HomeIcon, ScanIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { SimAccount } from "./sim-account";
import { SimAisle, SimShop } from "./sim-aisle";
import { SimBag } from "./sim-bag";
import { SimCheckout, SimOrder, SimOrders } from "./sim-checkout";
import { SimHome } from "./sim-home";
import { SimOnboarding } from "./sim-onboarding";
import { SimProduct } from "./sim-product";
import { SimScan } from "./sim-scan";
import { SimProvider, useSim, type SimData, type Tab } from "./sim-store";

/* Logical screen size (an iPhone 15/16-class device) and the frame around it. */
const SCREEN_W = 390;
const SCREEN_H = 844;
const FRAME = 14;
const PHONE_W = SCREEN_W + FRAME * 2;
const PHONE_H = SCREEN_H + FRAME * 2;

function StatusBar({ light }: { light: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[54px] items-center justify-between px-9 pt-1", light ? "text-on-contrast" : "text-ink")}>
      <span className="text-[16px] font-semibold tabular-nums">9:41</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3C5.5 6.7 6.7 6.2 8 6.2Zm0 3.5c.6 0 1.1.2 1.5.6L8 12 6.5 10.3c.4-.4.9-.6 1.5-.6Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path d="M24.5 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

function TabBar() {
  const sim = useSim();
  const tab = sim.state.tab;
  const item = (id: Tab, label: string, icon: React.ReactNode, extra?: React.ReactNode) => (
    <button
      type="button"
      aria-label={label}
      aria-current={tab === id ? "page" : undefined}
      onClick={() => sim.setTab(id)}
      {...(id === "bag" ? { "data-sim-bag": true } : {})}
      className={cn(
        "relative flex size-12 flex-col items-center justify-center rounded-full transition-colors duration-200",
        tab === id ? "text-paper" : "text-paper/50 hover:text-paper/80",
      )}
    >
      {icon}
      {extra}
      <span aria-hidden="true" className={cn("absolute bottom-1 h-[3px] rounded-full bg-pink-bright transition-all duration-300", tab === id ? "w-4" : "w-0")} />
    </button>
  );

  return (
    // The frosted touch: a light blur behind a mostly solid bar, as on One UI.
    <nav aria-label="App" className="absolute inset-x-5 bottom-7 z-30 flex h-[68px] items-center justify-around rounded-[34px] bg-ink/88 px-2 shadow-lift backdrop-blur-xl">
      {item("home", "Home", <HomeIcon className="size-6" />)}
      {item("shop", "Shop", <GridIcon className="size-6" />)}
      <button
        type="button"
        aria-label="Scan a school list"
        onClick={() => sim.push({ kind: "scan" })}
        className="-mt-9 inline-flex size-[62px] items-center justify-center rounded-full bg-brand text-on-brand ring-[6px] ring-paper transition-transform active:scale-90"
      >
        <ScanIcon className="size-7" />
      </button>
      {item(
        "bag",
        sim.bag.count ? `Bag, ${sim.bag.count} items` : "Bag",
        <BagIcon className="size-6" />,
        sim.bag.count ? (
          <span key={sim.bag.count} className="bag-pop absolute right-0.5 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold tabular-nums text-on-brand">
            {sim.bag.count}
          </span>
        ) : null,
      )}
      {item("account", "Account", <UserIcon className="size-6" />)}
    </nav>
  );
}

function Screen() {
  const sim = useSim();
  const screen = sim.screen;
  const depth = sim.state.stack.length;
  const fullBleed = screen.kind === "onboarding" || screen.kind === "scan" || screen.kind === "product";
  const animation = screen.kind === "tabs" && depth === 1 ? "sim-fade" : sim.state.dir === 1 ? "sim-push" : "sim-pop";
  const key = `${sim.state.session}-${depth}-${screen.kind}-${screen.kind === "tabs" ? sim.state.tab : ""}`;

  let content: React.ReactNode;
  switch (screen.kind) {
    case "onboarding":
      content = <SimOnboarding />;
      break;
    case "aisle":
      content = <SimAisle category={screen.category} />;
      break;
    case "product":
      content = <SimProduct slug={screen.slug} />;
      break;
    case "scan":
      content = <SimScan />;
      break;
    case "checkout":
      content = <SimCheckout />;
      break;
    case "order":
      content = <SimOrder id={screen.id} />;
      break;
    case "orders":
      content = <SimOrders />;
      break;
    case "tabs":
      content =
        sim.state.tab === "home" ? <SimHome /> : sim.state.tab === "shop" ? <SimShop /> : sim.state.tab === "bag" ? <SimBag /> : <SimAccount />;
      break;
  }

  return (
    <div key={key} className={cn("absolute inset-0 bg-paper", !fullBleed && "pt-[54px]", animation)}>
      {content}
    </div>
  );
}

function Phone() {
  const sim = useSim();
  const wrapRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Fit the phone to the window. CSS zoom keeps layout, scrolling and touch maths simple.
  useEffect(() => {
    const fit = () => {
      const phone = phoneRef.current;
      const wrap = wrapRef.current;
      if (!phone || !wrap) return;
      // Fit the whole phone between where it starts on the page and the bottom of the window.
      // On stacked (phone/tablet) layouts the preview sits below the intro, so just fit the screen.
      const stacked = window.innerWidth < 1024;
      const top = stacked ? 0 : wrap.getBoundingClientRect().top + window.scrollY;
      const byHeight = (window.innerHeight - Math.min(top, window.innerHeight * 0.4) - 24) / PHONE_H;
      const zoom = Math.max(0.55, Math.min(1, byHeight, wrap.clientWidth / (PHONE_W + 24)));
      phone.style.zoom = String(Math.round(zoom * 1000) / 1000);
    };
    fit();
    const observer = new ResizeObserver(fit);
    if (wrapRef.current) observer.observe(wrapRef.current);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // The touch cursor: a soft circle that follows the mouse over the screen, like device mode in Chrome.
  const placeCursor = (e: React.PointerEvent) => {
    const screen = screenRef.current;
    const cursor = cursorRef.current;
    if (!screen || !cursor || e.pointerType !== "mouse") return;
    const rect = screen.getBoundingClientRect();
    const zoom = Number.parseFloat(phoneRef.current?.style.zoom ?? "1") || 1;
    cursor.style.transform = `translate(${(e.clientX - rect.left) / zoom}px, ${(e.clientY - rect.top) / zoom}px)`;
    cursor.dataset.visible = "true";
  };

  const lightStatus = sim.screen.kind === "onboarding" || sim.screen.kind === "scan";

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      <div ref={phoneRef} data-sim-phone className="relative shrink-0" style={{ width: PHONE_W, height: PHONE_H, zoom: 0.8 }}>
        {/* Side buttons */}
        <span aria-hidden="true" className="absolute -left-[3px] top-[150px] h-8 w-[4px] rounded-l bg-device" />
        <span aria-hidden="true" className="absolute -left-[3px] top-[205px] h-14 w-[4px] rounded-l bg-device" />
        <span aria-hidden="true" className="absolute -left-[3px] top-[275px] h-14 w-[4px] rounded-l bg-device" />
        <span aria-hidden="true" className="absolute -right-[3px] top-[230px] h-20 w-[4px] rounded-r bg-device" />

        {/* Frame */}
        <div className="sim-frame absolute inset-0 rounded-[64px] bg-device p-[14px]">
          <div
            ref={screenRef}
            onPointerMove={placeCursor}
            onPointerDown={(e) => {
              placeCursor(e);
              if (cursorRef.current) cursorRef.current.dataset.down = "true";
            }}
            onPointerUp={() => {
              if (cursorRef.current) delete cursorRef.current.dataset.down;
            }}
            onPointerLeave={() => {
              if (cursorRef.current) {
                delete cursorRef.current.dataset.visible;
                delete cursorRef.current.dataset.down;
              }
            }}
            className="sim-screen relative h-full w-full overflow-hidden rounded-[50px] bg-paper text-ink"
          >
            <Screen />
            {sim.screen.kind === "tabs" ? <TabBar /> : null}
            <StatusBar light={lightStatus} />
            <span aria-hidden="true" className="absolute left-1/2 top-[11px] z-50 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-device" />
            {sim.state.toast ? (
              <p
                key={sim.state.toast.id}
                role="status"
                className="sim-toast pointer-events-none absolute inset-x-6 top-[60px] z-50 rounded-2xl bg-ink px-4 py-3 text-center text-[13px] font-semibold text-paper shadow-lift"
              >
                {sim.state.toast.text}
              </p>
            ) : null}
            <span aria-hidden="true" className={cn("absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full", lightStatus ? "bg-on-contrast" : "bg-ink")} />
            <div ref={cursorRef} aria-hidden="true" className="sim-touch" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSimulator({ data }: { data: SimData }) {
  return <SimProvider data={data}>{() => <Phone />}</SimProvider>;
}

"use client";

/*
 * State for the in-browser app preview: which screen is showing, the tab, and a demo
 * bag. The preview is a self-contained prototype, so its bag lives here in memory on
 * purpose. The real app's bag lives on the server, like the website's.
 */
import type { CategorySlug, PublicProduct } from "@alert/core";
import { unitPriceCents } from "@alert/core/pricing";
import { createContext, use, useMemo, useReducer, type ReactNode } from "react";

export type Tab = "home" | "shop" | "bag" | "account";
export type Screen =
  | { kind: "onboarding" }
  | { kind: "tabs" }
  | { kind: "aisle"; category: CategorySlug }
  | { kind: "product"; slug: string }
  | { kind: "scan" }
  | { kind: "checkout" }
  | { kind: "order"; id: string }
  | { kind: "orders" };

export interface SimLine {
  slug: string;
  option?: string;
  qty: number;
}

export interface SimCategory {
  slug: CategorySlug;
  name: string;
  blurb: string;
  subcategories: { slug: string; name: string }[];
}

export interface SimSchoolList {
  school: string;
  grade: string;
  items: { slug: string; option?: string; qty: number; name: string }[];
}

export interface SimData {
  products: PublicProduct[];
  categories: SimCategory[];
  list: SimSchoolList;
}

interface State {
  stack: Screen[];
  tab: Tab;
  /** 1 = moving forward (slide in from the right), -1 = going back. */
  dir: 1 | -1;
  bag: SimLine[];
  toast: { id: number; text: string } | null;
  sheet: "checkout" | null;
  /** Bumps on restart so every screen remounts fresh. */
  session: number;
}

type Action =
  | { type: "push"; screen: Screen }
  | { type: "pop" }
  | { type: "replace"; screen: Screen }
  | { type: "clearBag" }
  | { type: "tab"; tab: Tab }
  | { type: "start" }
  | { type: "add"; lines: SimLine[]; max: (line: SimLine) => number }
  | { type: "qty"; key: string; qty: number; max: number }
  | { type: "toast"; text: string }
  | { type: "sheet"; sheet: State["sheet"] }
  | { type: "restart" };

export const lineKey = (slug: string, option?: string) => (option ? `${slug}--${option}` : slug);

const initial: State = { stack: [{ kind: "onboarding" }], tab: "home", dir: 1, bag: [], toast: null, sheet: null, session: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "push":
      return { ...state, stack: [...state.stack, action.screen], dir: 1 };
    case "replace":
      return { ...state, stack: [{ kind: "tabs" }, action.screen], dir: 1 };
    case "clearBag":
      return { ...state, bag: [] };
    case "pop":
      return state.stack.length > 1 ? { ...state, stack: state.stack.slice(0, -1), dir: -1 } : state;
    case "tab":
      return { ...state, stack: [{ kind: "tabs" }], tab: action.tab, dir: 1 };
    case "start":
      return { ...state, stack: [{ kind: "tabs" }], tab: "home", dir: 1 };
    case "add": {
      const bag = [...state.bag];
      for (const line of action.lines) {
        const key = lineKey(line.slug, line.option);
        const max = action.max(line);
        const existing = bag.findIndex((l) => lineKey(l.slug, l.option) === key);
        if (existing >= 0) {
          const current = bag[existing];
          if (current) bag[existing] = { ...current, qty: Math.min(current.qty + line.qty, max) };
        } else if (max > 0) {
          bag.push({ ...line, qty: Math.min(line.qty, max) });
        }
      }
      return { ...state, bag };
    }
    case "qty":
      return {
        ...state,
        bag: state.bag.flatMap((l) =>
          lineKey(l.slug, l.option) !== action.key ? [l] : action.qty <= 0 ? [] : [{ ...l, qty: Math.min(action.qty, action.max) }],
        ),
      };
    case "toast":
      return { ...state, toast: { id: (state.toast?.id ?? 0) + 1, text: action.text } };
    case "sheet":
      return { ...state, sheet: action.sheet };
    case "restart":
      return { ...initial, session: state.session + 1 };
  }
}

function useSimState(data: SimData) {
  const [state, dispatch] = useReducer(reducer, initial);
  const bySlug = useMemo(() => new Map(data.products.map((p) => [p.slug, p])), [data.products]);

  const stockOf = (line: SimLine) => {
    const product = bySlug.get(line.slug);
    if (!product) return 0;
    const option = line.option ? product.options?.values.find((o) => o.key === line.option) : undefined;
    return Math.min(option ? option.stock : (product.stock ?? 0), 99);
  };

  const priced = state.bag.flatMap((line) => {
    const product = bySlug.get(line.slug);
    if (!product) return [];
    const unit = unitPriceCents(product, line.option, line.qty);
    return [{ ...line, key: lineKey(line.slug, line.option), product, unit, total: unit * line.qty, max: stockOf(line) }];
  });

  return {
    state,
    data,
    bySlug,
    screen: state.stack[state.stack.length - 1] ?? { kind: "tabs" as const },
    bag: {
      lines: priced,
      count: priced.reduce((sum, l) => sum + l.qty, 0),
      subtotal: priced.reduce((sum, l) => sum + l.total, 0),
    },
    push: (screen: Screen) => dispatch({ type: "push", screen }),
    pop: () => dispatch({ type: "pop" }),
    /** Shows a screen on top of the tabs, dropping whatever was in between (e.g. after paying). */
    replace: (screen: Screen) => dispatch({ type: "replace", screen }),
    clearBag: () => dispatch({ type: "clearBag" }),
    setTab: (tab: Tab) => dispatch({ type: "tab", tab }),
    start: () => dispatch({ type: "start" }),
    add: (lines: SimLine[]) => dispatch({ type: "add", lines, max: stockOf }),
    setQty: (key: string, qty: number) => {
      const line = state.bag.find((l) => lineKey(l.slug, l.option) === key);
      dispatch({ type: "qty", key, qty, max: line ? stockOf(line) : 0 });
    },
    stockOf,
    toast: (text: string) => dispatch({ type: "toast", text }),
    openSheet: (sheet: State["sheet"]) => dispatch({ type: "sheet", sheet }),
    restart: () => dispatch({ type: "restart" }),
  };
}

type Sim = ReturnType<typeof useSimState>;
const SimContext = createContext<Sim | null>(null);

export function SimProvider({ data, children }: { data: SimData; children: (sim: Sim) => ReactNode }) {
  const sim = useSimState(data);
  return <SimContext value={sim}>{children(sim)}</SimContext>;
}

export function useSim(): Sim {
  const sim = use(SimContext);
  if (!sim) throw new Error("useSim must be used inside SimProvider");
  return sim;
}

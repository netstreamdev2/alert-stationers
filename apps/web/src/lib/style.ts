import type { CSSProperties } from "react";

/** Sets a CSS custom property inline, e.g. an animation delay: `style={cssVar("--delay", "120ms")}`. */
export function cssVar(name: `--${string}`, value: string): CSSProperties {
  return { [name]: value } as CSSProperties;
}

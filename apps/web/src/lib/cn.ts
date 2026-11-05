import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge taught our design tokens (globals.css @theme), so a later class always
 * wins over a conflicting earlier one, e.g. cn("inline-flex", "hidden sm:inline-flex").
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "paper", "surface", "ink", "ink-soft", "muted", "line", "line-strong",
        "pink", "pink-press", "pink-tint", "pink-bright", "brand", "on-brand", "magenta", "orchid",
        "contrast", "on-contrast", "contrast-muted",
        "tint-blush", "tint-sand", "tint-sage", "tint-sky", "tint-lilac", "tint-butter",
        "success", "warning", "error", "device", "sheet", "on-sheet", "sheet-rule",
      ],
      radius: ["tile", "card"],
      shadow: ["lift"],
      ease: ["snap", "glide"],
      font: ["sans", "display", "serif", "mono"],
    },
  },
});

/** Joins class names, skipping falsy values; later classes override conflicting earlier ones. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

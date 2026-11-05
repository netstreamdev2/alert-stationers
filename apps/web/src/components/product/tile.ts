import type { CategorySlug } from "@alert/core";

/** Each aisle has its own tile tint and paper texture, so products read as a family. */
export const categoryTile: Record<CategorySlug, { tint: string; pattern: string }> = {
  writing: { tint: "bg-tint-sky", pattern: "pattern-ruled" },
  "paper-books": { tint: "bg-tint-sand", pattern: "pattern-grid" },
  school: { tint: "bg-tint-blush", pattern: "pattern-dots" },
  "art-craft": { tint: "bg-tint-butter", pattern: "pattern-dots" },
  "office-filing": { tint: "bg-tint-sage", pattern: "pattern-grid" },
  "gifts-planners": { tint: "bg-tint-lilac", pattern: "pattern-ruled" },
};

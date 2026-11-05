/**
 * Flies a copy of the product's picture from where it was added into the bag icon
 * (any visible element with `data-bag-target`). Purely decorative; skipped when the
 * shopper prefers reduced motion.
 */
export function flyToBag(source: Element | null, targetSelector = "[data-bag-target]"): void {
  if (!source || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = [...document.querySelectorAll<HTMLElement>(targetSelector)].find((el) => el.checkVisibility());
  if (!target) return;

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const img = source.querySelector("img");
  const size = img ? Math.min(from.width, from.height, 150) : 28;

  const ghost = document.createElement("div");
  ghost.className = img ? "fly-ghost" : "fly-ghost fly-ghost--dot";
  ghost.setAttribute("aria-hidden", "true");
  if (img) ghost.appendChild(img.cloneNode());
  Object.assign(ghost.style, {
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);
  const flight = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - lift}px) scale(0.55) rotate(-8deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.1) rotate(0deg)`, opacity: 0.5 },
    ],
    { duration: 760, easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
  );
  const cleanUp = () => ghost.remove();
  flight.onfinish = cleanUp;
  flight.oncancel = cleanUp;
}

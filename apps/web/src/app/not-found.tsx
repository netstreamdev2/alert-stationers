import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        <div
          aria-hidden="true"
          className="pattern-ruled relative mx-auto mb-8 grid size-32 rotate-[-4deg] place-items-center rounded-card bg-tint-blush"
        >
          <span className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-6" />
          <span className="type-accent text-5xl text-pink">404</span>
        </div>
        <h1 className="type-display text-[2.25rem] font-extrabold leading-[1.02] sm:text-5xl">This aisle is still being stocked.</h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-[17px] text-ink-soft">
          We&rsquo;re building this page next. Everything that&rsquo;s ready is on the homepage.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
        </div>
      </div>
    </section>
  );
}

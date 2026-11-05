export function AnnouncementBar() {
  return (
    <div className="bg-contrast text-on-contrast">
      <div className="shell flex h-9 items-center justify-center gap-3 text-[13px] sm:justify-between">
        <p className="flex items-center gap-2 truncate">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-pink-bright" />
          <span className="sm:hidden">Proof of concept · demo products and prices</span>
          <span className="hidden sm:inline">Proof of concept: products and prices are for demonstration</span>
        </p>
        <p className="hidden shrink-0 text-contrast-muted sm:block">All prices include VAT</p>
      </div>
    </div>
  );
}

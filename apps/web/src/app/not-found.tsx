import { NotFoundContent } from "@/components/site/not-found-content";
import { ShopChrome } from "@/components/site/shop-chrome";

/** Unmatched URLs render outside any group layout, so this brings the shop chrome itself. */
export default function NotFound() {
  return (
    <ShopChrome>
      <NotFoundContent />
    </ShopChrome>
  );
}

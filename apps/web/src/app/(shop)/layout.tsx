import { ShopChrome } from "@/components/site/shop-chrome";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return <ShopChrome>{children}</ShopChrome>;
}

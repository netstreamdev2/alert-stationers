import { Aisles } from "@/components/home/aisles";
import { Hero } from "@/components/home/hero";
import { OneBag } from "@/components/home/one-bag";
import { ProductSection } from "@/components/home/product-section";
import { SchoolListsSection } from "@/components/home/school-lists";

/* For now the home page is composed in code. Later the CMS decides which blocks show, and in what order. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Aisles />
      <ProductSection
        id="specials-title"
        eyebrow="Deals"
        title="On special"
        href="/specials"
        linkLabel="All specials"
        slugs={["planner-2027-a5", "backpack-25l", "acrylic-paint-12", "printing-paper-a4-80"]}
      />
      <SchoolListsSection />
      <ProductSection
        id="favourites-title"
        eyebrow="Desk favourites"
        title="Fresh on the shelf"
        href="/shop"
        linkLabel="Shop everything"
        slugs={[
          "gel-pens-6",
          "fineliners-10",
          "fountain-pen-steel",
          "mechanical-pencil-05",
          "notebook-a5-dotted",
          "exercise-book-a4-72",
          "whiteboard-markers-4",
          "sticky-notes-76-4",
        ]}
      />
      <OneBag />
    </>
  );
}

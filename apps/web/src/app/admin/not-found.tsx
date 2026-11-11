import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="type-display text-[2rem] font-extrabold">Not found</h1>
      <p className="mt-2 text-[15px] text-muted">That product or page isn&rsquo;t in the admin.</p>
      <Link href="/admin/inventory" className="mt-6 inline-block font-semibold text-pink hover:underline">
        Back to inventory
      </Link>
    </div>
  );
}

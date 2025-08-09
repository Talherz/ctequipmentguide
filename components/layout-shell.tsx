import Link from "next/link";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";

// Define simple vendor and category shapes to populate the sidebar. These types
// intentionally use `string | number` for IDs to support both numeric and UUID
// identifiers that may be used in Supabase. Names are always strings.
type Vendor = { id: string | number; name: string };
type Category = { id: string | number; name: string };

interface LayoutShellProps {
  children: ReactNode;
  vendors?: Vendor[];
  categories?: Category[];
}

/**
 * LayoutShell provides the basic page frame for the catalog.
 * It renders a top navigation bar with a search input and a sidebar
 * for vendor and category filters. Child content is displayed in the main area.
 *
 * This component is intentionally minimal for the initial proof‑of‑concept.
 * Later pull requests will connect the search bar and filters to live data.
 */
export default function LayoutShell({
  children,
  vendors = [],
  categories = [],
}: LayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <nav className="bg-background border-b border-border px-4 py-2 flex items-center gap-4">
        <Link href="/products" className="text-lg font-semibold">
          Catalog
        </Link>
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full"
            // The search bar will be wired up in a later pull request to update
            // the query string; for now it is a simple input.
          />
        </div>
      </nav>
      {/* Sidebar + main content */}
      <div className="flex flex-1">
        {/* Sidebar for filters */}
        <aside className="hidden md:block w-60 border-r border-border p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Vendor</h3>
            <ul className="space-y-1 text-sm">
              {vendors.length === 0 && (
                <li className="text-muted-foreground">No vendors</li>
              )}
              {vendors.map((vendor) => (
                <li key={vendor.id}>
                  <Link
                    href={{ pathname: "/products", query: { vendor: vendor.id.toString() } }}
                    className="text-foreground hover:underline focus:underline"
                  >
                    {vendor.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <ul className="space-y-1 text-sm">
              {categories.length === 0 && (
                <li className="text-muted-foreground">No categories</li>
              )}
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={{ pathname: "/products", query: { category: category.id.toString() } }}
                    className="text-foreground hover:underline focus:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
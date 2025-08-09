import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/* eslint-disable @typescript-eslint/no-explicit-any */


/**
 * Server-rendered product catalog. Fetches products from Supabase based on
 * optional query parameters for search (`q`), vendor, category, and page.
 * Pagination is implemented via Supabase's range API and counts the total
 * number of matching rows to compute the number of pages. If the database
 * tables are missing, a friendly message is displayed.
 */
export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // Extract query parameters with sensible defaults
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : undefined;
  const vendor = typeof searchParams.vendor === "string" ? searchParams.vendor : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const currentPageRaw = typeof searchParams.page === "string" ? searchParams.page : undefined;
  const currentPage = Number.parseInt(currentPageRaw || "1", 10) || 1;
  const pageSize = 12;

  // Create a Supabase client on the server
  const supabase = await createClient();

  // Build base query selecting essential fields; include count for pagination
  let query = supabase
    .from("products")
    .select(
      "id, slug, name, sku, price, vendor_id, category_id",
      { count: "exact" },
    );

  // Apply search filter if provided (case-insensitive match on name)
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }
  // Filter by vendor ID if provided
  if (vendor) {
    query = query.eq("vendor_id", vendor);
  }
  // Filter by category ID if provided
  if (category) {
    query = query.eq("category_id", category);
  }

  // Apply pagination boundaries
  const fromIndex = (currentPage - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;

  const { data: products, error, count } = await query
    .order("name", { ascending: true })
    .range(fromIndex, toIndex);

  // Handle potential errors (e.g. table does not exist)
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-destructive-foreground">
          Unable to fetch products: {error.message}
        </p>
      </div>
    );
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      {(!products || products.length === 0) ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="border border-border rounded-lg p-4 hover:shadow"
              >
                <h2 className="font-medium mb-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku || "N/A"}
                </p>
                {product.price !== null && (
                  <p className="text-sm font-medium mt-1">
                    {Number(product.price).toFixed(2)}
                  </p>
                )}
              </Link>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={{
                  pathname: "/products",
                  query: {
                    ...(q ? { q } : {}),
                    ...(vendor ? { vendor } : {}),
                    ...(category ? { category } : {}),
                    page: pageNumber.toString(),
                  },
                }}
                className={`px-3 py-1 rounded-md text-sm border ${
                  pageNumber === currentPage
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
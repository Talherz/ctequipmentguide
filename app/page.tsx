import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/**
 * The home page acts as a storefront landing page for the equipment catalog.
 * It fetches categories, vendors and a small selection of featured products
 * directly from Supabase on the server and renders a modern, responsive
 * layout using Tailwind CSS. Visitors can navigate to filtered product
 * listings or individual products via prominent links. Images are pulled
 * from the `image_url` column of the products table when available.
 */
export default async function HomePage() {
  // Create a Supabase client on the server.
  const supabase = await createClient();

  // Fetch categories (id, name) ordered alphabetically.
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("name", { ascending: true });

  // Fetch vendors (id, name) ordered alphabetically.
  const { data: vendors } = await supabase
    .from("vendors")
    .select("id,name")
    .order("name", { ascending: true });

  // Fetch a handful of featured products for the landing page.
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, sku, price, image_url, vendor_id, category_id",
    )
    .order("name", { ascending: true })
    .limit(8);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <section className="relative bg-gradient-to-b from-background via-background to-muted border-b border-border py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Discover Top Automotive Equipment
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Shop professional tools and equipment from the industry’s leading vendors.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Shop All Products
          </Link>
          {categories && categories.length > 0 && (
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-muted"
            >
              Browse Categories
            </a>
          )}
        </div>
      </section>

      {/* Categories section */}
      {categories && categories.length > 0 && (
        <section id="categories" className="py-16 px-6">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={{ pathname: "/products", query: { category: String(category.id) } }}
                className="group relative block rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {/* Decorative gradient background; if you add image_url to the categories
                    table, replace this with an <img> tag similar to the products below. */}
                <div className="h-36 sm:h-40 md:h-44 bg-gradient-to-br from-accent to-accent-foreground/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary-foreground drop-shadow-md group-hover:scale-105 transition-transform">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Vendors section */}
      {vendors && vendors.length > 0 && (
        <section id="vendors" className="py-16 px-6 bg-muted">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Top Vendors
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={{ pathname: "/products", query: { vendor: String(vendor.id) } }}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {vendor.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products section */}
      {products && products.length > 0 && (
        <section id="featured-products" className="py-16 px-6">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Featured Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {/* Product image (if available) */}
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url as string}
                    alt={product.name}
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-medium mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    SKU: {product.sku ?? "N/A"}
                  </p>
                  {product.price !== null && (
                    <p className="mt-auto text-lg font-semibold">
                      {Number(product.price).toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

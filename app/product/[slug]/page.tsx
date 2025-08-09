import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetail from "./product-detail";

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ProductPage fetches a single product by slug from Supabase on the server.
 * If found, it renders the ProductDetail client component which allows
 * adding the item to the cart. If not found, it triggers a 404 using
 * Next.js's notFound helper.
 */
export default async function ProductPage({ params }: { params: any }) {
  const { slug } = params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, sku, price, description, vendor_id, category_id",
    )
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !product) {
    // Show 404 if product does not exist or query fails
    notFound();
  }
  return <ProductDetail product={product} />;
}
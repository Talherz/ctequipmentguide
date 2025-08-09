import type { ReactNode } from "react";
import LayoutShell from "@/components/layout-shell";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout for all /products routes.
 * Wraps its children with the LayoutShell which provides
 * the top navigation bar and sidebar filters.
 */
export default async function ProductsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch vendor and category lists server-side for the sidebar. Errors are
  // swallowed so that the page still renders if the tables are not yet
  // present or the query fails. Empty arrays will result in simple "No vendors"
  // and "No categories" messages.
  let vendors: { id: string | number; name: string }[] = [];
  let categories: { id: string | number; name: string }[] = [];
  try {
    const supabase = await createClient();
    const { data: vendorData } = await supabase
      .from("vendors")
      .select("id,name")
      .order("name", { ascending: true });
    vendors = vendorData ?? [];
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id,name")
      .order("name", { ascending: true });
    categories = categoryData ?? [];
  } catch {
    // ignore errors; leave vendors and categories empty
  }
  return (
    <LayoutShell vendors={vendors} categories={categories}>
      {children}
    </LayoutShell>
  );
}
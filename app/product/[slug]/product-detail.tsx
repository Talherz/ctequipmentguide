"use client";

import { useCart } from "@/components/cart-context";

interface Product {
  id: string | number;
  slug: string;
  name: string;
  price: number | null;
  sku?: string | null;
  vendor_id?: string | number | null;
  category_id?: string | number | null;
  description?: string | null;
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const handleAddToCart = () => {
    if (product.price === null) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: typeof product.price === "number" ? product.price : Number(product.price),
      quantity: 1,
      sku: product.sku ?? undefined,
      vendor_id: product.vendor_id ?? undefined,
      category_id: product.category_id ?? undefined,
    });
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <div className="text-sm text-muted-foreground">
        {product.sku && <p className="mb-1">SKU: {product.sku}</p>}
        {product.price !== null && (
          <p className="text-lg font-medium">
            ${" "}
            {Number(product.price).toFixed(2)}
          </p>
        )}
      </div>
      {product.description && (
        <p className="text-sm">{product.description}</p>
      )}
      <button
        onClick={handleAddToCart}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90"
      >
        Add to cart
      </button>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";

/**
 * CartPage renders the current contents of the cart using the useCart hook.
 * It provides a simple summary of each item along with a total. In later
 * pull requests this page can be enhanced to allow quantity adjustments
 * or removal of items.
 */
export default function CartPage() {
  const { cart, total } = useCart();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-border rounded-md border border-border">
            {cart.map((item) => (
              <li key={item.id} className="p-4 flex justify-between items-center">
                <div>
                  <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold">
              Total: {total.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <Link
              href="/checkout"
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90"
            >
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { fetchcarts } from "../api/carts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"; // Assuming we make a table component or just use divs. I'll use standard HTML for speed or basic divs if Table doesn't exist.
// Wait, I didn't create Table component. I'll use divs or make a simple table structure.

export const CartItems = ({ cartId }) => {
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart-items", cartId],
    queryFn: () => fetchcarts(cartId),
    enabled: !!cartId,
  });

  if (isLoading) return <div className="space-y-2 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-md" />)}</div>;
  if (isError) return <p className="text-destructive">Failed to load cart items</p>;

  if (items.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Your cart is empty.</div>;
  }

  const grandTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 items-center p-4 border-b last:border-0 text-sm">
            <div className="col-span-6 font-medium">
              {item.product.title}
            </div>
            <div className="col-span-2 text-center">
              {item.quantity}
            </div>
            <div className="col-span-2 text-right text-muted-foreground">
              {item.product.unit_price}
            </div>
            <div className="col-span-2 text-right font-medium">
              {item.total_price}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">Rs {grandTotal}</span>
          </div>
          {/* Checkout button could go here */}
        </div>
      </div>
    </div>
  );
};

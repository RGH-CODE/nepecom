import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createcarts, fetchcarts, deletecarts } from "../api/carts";
import { setCartId, getCartId, removeCartId } from "../utils/cartStorage";
import { CartItems } from "./CartItems";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { ShoppingBag, Trash2 } from "lucide-react";

export const CartCards = () => {
  // Initialize from storage or props
  const [cartId, setCartIdState] = useState(() => getCartId());

  const queryClient = useQueryClient();

  const { mutate: createCart, isPending, isError, error } = useMutation({
    mutationFn: createcarts,
    onSuccess: (data) => {
      setCartId(data.id);
      setCartIdState(data.id);
    },
  });

  const { mutate: deleteCart } = useMutation({
    mutationFn: deletecarts,
    onSuccess: clearCart,
    onError: clearCart, // Clear anyway for better UX if it fails (e.g. 404)
  });

  function clearCart() {
    removeCartId();
    setCartIdState(null);
    queryClient.removeQueries(["cart", cartId]);
    queryClient.removeQueries(["cart-items", cartId]);
  }

  const handleCreateCart = () => {
    if (!cartId) {
      createCart();
    }
  };

  // If no cart, maybe auto-create or show empty state?
  // Use existing logic: button to create.

  return (
    <div className="container max-w-4xl py-12 px-4">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Shopping Cart
          </CardTitle>
          {cartId && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteCart(cartId)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" /> Clear Cart
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!cartId ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <p className="text-muted-foreground text-center">You have no active cart session.</p>
              <Button onClick={handleCreateCart} disabled={isPending}>
                {isPending ? "Starting Cart..." : "Start Shopping"}
              </Button>
              {isError && (
                <p className="text-destructive text-sm">
                  {error?.response?.data?.detail || "Failed to create cart"}
                </p>
              )}
            </div>
          ) : (
            <CartItems cartId={cartId} />
          )}
        </CardContent>
        {/* Footer could go here for total calculations */}
      </Card>
    </div>
  );
};

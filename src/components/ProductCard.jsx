import { useMutation } from "@tanstack/react-query";
import { createcarts, addToCart } from "../api/carts";
import { getCartId, setCartId } from "../utils/cartStorage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

export default function ProductCard({ product }) {
  const cartId = getCartId();

  const createCartMutation = useMutation({
    mutationFn: createcarts,
    onSuccess: (cart) => {
      setCartId(cart.id);
      addItem({
        cartId: cart.id,
        product_id: product.id,
        quantity: 1,
      });
    },
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: addToCart,
  });

  const handleAddToCart = () => {
    if (cartId) {
      addItem({
        cartId,
        product_id: product.id,
        quantity: 1,
      });
    } else {
      createCartMutation.mutate();
    }
  };

  const isLoading = isPending || createCartMutation.isPending;

  return (
    <div>
      <Card className="overflow-hidden h-full flex flex-col group">
        <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="translate-y-4 group-hover:translate-y-0 transition-transform"
              size="lg"
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-1" title={product.title}>
            {product.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
            {product.description || "No description available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 mt-auto">
          <p className="text-lg font-bold text-primary">
            Rs {product.price}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

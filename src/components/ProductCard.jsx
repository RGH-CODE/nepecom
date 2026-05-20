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

  // ALWAYS GET LATEST CART ID
  const currentCartId = getCartId();

  if (currentCartId) {

    addItem({
      cartId: currentCartId,
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
            src={product.images?.[0]?.image || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="button bg-primary text-primary-foreground hover:bg-orange-400"
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
            {product.description || { truncatewords: 30 } || "No description available"}
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

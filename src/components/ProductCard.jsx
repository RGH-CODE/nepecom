import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createcarts, addToCart } from "../api/carts";
import api from "../api/axios"
import { getCartId, setCartId } from "../utils/cartStorage";
import { IsAuthenticated } from "../utils/authentication";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

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

  const { mutate: addItem, isPending: isAddingToCart } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
    },
  });

   const handleAddToCart = (e) => {
    e.stopPropagation();
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

  const handleBuyNow = async () => {

 
  // LOGIN CHECK
  if (!IsAuthenticated()) {
    navigate("/login");
    return;
  }

  try {

    // CUSTOMER
    const customerRes = await api.get(
      "store/customers/me/"
    );

    const customer = customerRes.data;

    // ADDRESS
    let address = null;

    try {

      const addressRes = await api.get(
        "store/address/me/"
      );

      address = addressRes.data;

    } catch {

      address = null;
    }

    // PROFILE CHECK
    const isProfileComplete =
      customer.phone &&
      address &&
      address.street &&
      address.city &&
      address.province;

    // INCOMPLETE
    if (!isProfileComplete) {

      navigate("/complete-profile", {
        state: {
          buyNow: true,
          productId: product.id,
          quantity: 1,
        },
      });

      return;
    }

    // COMPLETE
navigate("/checkout", {
  state: {
    buyNow: {
      product_id: product.id,
      quantity: 1,
      product: product,
    },
  },
});

  } catch (err) {

    console.log(err);

    alert("Something went wrong");
  }
};

  const isLoading = isAddingToCart || createCartMutation.isPending;
  const inStock = product.inventory > 0;

  return (
    <Card
      className="group relative overflow-hidden h-full flex flex-col cursor-pointer rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Stock Badge */}
      {!inStock && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Out of Stock
        </div>
      )}

      {/* Discount Badge (if you have discount data) */}
      {product.discount && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          -{product.discount}%
        </div>
      )}

      {/* Image Container with Hover Effects */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        <img
          src={product.images?.[0]?.image || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick View Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
          >
            👁️ 
          </button>
        </div>

        {/* Secondary Image Preview on Hover (if multiple images exist) */}
        {product.images?.[1]?.image && (
          <img
            src={product.images[1].image}
            alt={`${product.title} alternate`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}
      </div>

      {/* Product Info */}
      <CardHeader className="p-4 space-y-2 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm md:text-base font-bold line-clamp-2 leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
            {product.title}
          </CardTitle>
          
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <CardDescription className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {product.description
            ? product.description.split(" ").slice(0, 8).join(" ") + "..."
            : "Discover this amazing product with great features and quality."}
        </CardDescription>

      
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.rating})</span>
          </div>
        )}
      </CardHeader>

      {/* Footer with Price and Actions */}
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full space-y-3">
          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                Rs {product.price?.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-gray-500 line-through">
                  Rs {product.originalPrice?.toLocaleString()}
                </p>
              )}
            </div>
            
            {/* Stock Indicator */}
            <div className={`text-xs font-semibold px-2 py-1 rounded ${
              inStock 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {inStock ? `${product.inventory} left` : "Unavailable"}
            </div>
          </div>

          
          <div className="flex items-start justify-between gap-2">
             <Button
  onClick={
    handleAddToCart}
  disabled={isLoading || !inStock}
  className="h-6 md:h-8 px-2 md:px-3 text-[10px] md:text-xs lg:text-sm bg-orange-400 hover:bg-blue-400"
  size="sm"
>
  {isLoading ? "..." : added ? "+" : "Add to Cart"}
</Button>
            <Button
            type="button"
  onClick={handleBuyNow}
  disabled={isLoading || !inStock}
  size="sm"
  className="
    h-7 md:h-9
    px-2 md:px-4
    text-[10px] md:text-xs lg:text-sm
    bg-green-500
    hover:bg-green-700
    text-white
    whitespace-nowrap
  "
>
  {isLoading
    ? "Buying...."
    : !inStock
    ? "Out of Stock"
    : "Buy Now"}
</Button>
          </div>
        </div>
      </CardFooter>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Card>
  );
}










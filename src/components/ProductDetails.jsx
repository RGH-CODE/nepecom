import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IsAuthenticated } from "../utils/authentication";
import api from "../api/axios"
import { fetchProductById } from "../api/products";
import { createcarts, addToCart } from "../api/carts";
import { getCartId, setCartId } from "../utils/cartStorage";
import { Button } from "./ui/button";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
   const [added, setAdded] = useState(false);
   const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => fetchProductById(id),
  });

  const createCartMutation = useMutation({
    mutationFn: createcarts,
    onSuccess: (cart) => {
      setCartId(cart.id);
      addItem({
        cartId: cart.id,
        product_id: product.id,
        quantity: quantity,
      });
    },
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
   setAdded(true);
    
      
    },
  });

  const handleAddToCart = (e) => {
    e.stopPropagation()
    const currentCartId = getCartId();

    if (currentCartId) {
      addItem({
        cartId: currentCartId,
        product_id: product.id,
        quantity: quantity,
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

    setBuyNowLoading(true);

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

    // INCOMPLETE PROFILE
    if (!isProfileComplete) {

      navigate("/complete-profile", {
        state: {
          buyNow: {
            product_id: product.id,
            quantity: quantity,
            product: product,
          },
        },
      });

      return;
    }

    // DIRECT CHECKOUT
    navigate("/checkout", {
      state: {
        buyNow: {
          product_id: product.id,
          quantity: quantity,
          product: product,
        },
      },
    });

  } catch (err) {

    console.log(err);

    alert("Something went wrong");

  } finally {

    setBuyNowLoading(false);
  }
};

if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold text-red-600">
            Failed to Load Product
          </h2>
          <p className="text-gray-600">
            Unable to fetch product details. Please try again later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [{ image: "https://via.placeholder.com/700x700?text=No+Image" }];

  const inStock = product.inventory > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-orange-500">
            Home
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Gallery Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square border-4 border-gray-200 shadow-lg group">
                <img
                  src={images[selectedImage]?.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === idx
                          ? "border-orange-500 shadow-lg ring-2 ring-orange-300"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={img.image}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Title & Price */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Title: {product.title}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-orange-600">
                    Price: Rs {product.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {inStock
                    ? `${product.inventory} items in stock`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              {inStock && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold transition"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.inventory, quantity + 1))
                      }
                      className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                 type="button"
                  onClick={handleAddToCart}
                  disabled={isPending || !inStock}
                  className="flex-1 px-8 py-4 rounded-xl font-bold text-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </span>
                  ) : (
                    "🛒 Add To Cart"
                  )}
                </button>
<button
  type="button"
  onClick={handleBuyNow}
  disabled={buyNowLoading || !inStock}
  className="flex-1 px-8 py-4 rounded-xl font-bold text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
>
  {buyNowLoading
    ? "Buying..."
    : !inStock
    ? "Out of Stock"
    : "Buy Now"}
</button>
              </div>

              {/* Description */}
              <div className="pt-6 border-t-2 border-gray-200 space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  Product Description and Information and guidelines
                </h2>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
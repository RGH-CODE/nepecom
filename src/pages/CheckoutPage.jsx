import { useEffect,useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchcarts } from "../api/carts";
import { createOrder } from "../api/orders";
import {fetchProfile} from "../api/auth"; 
import {
  fetchCustomersDetails,
} from "../api/customers";

import {
  fetchAddress,
} from "../api/address";

import { IsAuthenticated } from "../utils/authentication";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const cartId = state?.cartId;

  // -----------------------------
  // REDIRECT IF NO CART
  // -----------------------------
  useEffect(() => {
    if (!cartId) {
      navigate("/carts");
    }
  }, [cartId, navigate]);

  // -----------------------------
  // CART QUERY
  // -----------------------------
  const {
    data: cartItems = [],
    isLoading: cartLoading,
    isError: cartError,
  } = useQuery({
    queryKey: ["checkout-cart", cartId],
    queryFn: () => fetchcarts(cartId),
    enabled: !!cartId,
  });

const {
  data:profile,
  isLoading:profileLoading
}=useQuery({
  queryKey:["profile-details"],
  queryFn:fetchProfile,
}) ;


  // CUSTOMER QUERY
  

  const {
    data: customer,
    isLoading: customerLoading,
  } = useQuery({
    queryKey: ["customer-details"],
    queryFn: fetchCustomersDetails,
  });

  // -----------------------------
  // ADDRESS QUERY
  // -----------------------------
  const {
    data: address,
    isLoading: addressLoading,
  } = useQuery({
    queryKey: ["customer-address"],
    queryFn: fetchAddress,
  });

  // -----------------------------
  // PROFILE VALIDATION
  // -----------------------------
  useEffect(() => {
    if (!profileLoading && !customerLoading && !addressLoading) {
      const isProfileComplete =
        profile?.first_name &&
        profile?.last_name && 
        customer?.phone &&
        address?.street &&
        address?.city &&
        address?.province;

      if (!isProfileComplete) {
        navigate("/complete-profile", {
          state: { cartId },
        });
      }
    }
  }, [
    profile,
    customer,
    address,
    profileLoading,
    customerLoading,
    addressLoading,
    navigate,
    cartId,
  ]);

  // -----------------------------
  // ORDER MUTATION
  // -----------------------------
  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      navigate("/orders");
    },

    onError: (err) => {
      console.log(err);
    },
  });

  // -----------------------------
  // CONFIRM ORDER
  // -----------------------------
  const handleConfirmOrder = () => {
    if (!IsAuthenticated()) {
      navigate("/login");
      return;
    }

    orderMutation.mutate({
      cart_id: cartId,
    });
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (
    cartLoading ||
    profileLoading || 
    customerLoading ||
    addressLoading
  ) {
    return <p>Loading checkout...</p>;
  }

  // -----------------------------
  // ERROR STATE
  // -----------------------------
  if (cartError) {
    return <p>Failed to load checkout</p>;
  }

  // -----------------------------
  // TOTAL CALCULATION
  // -----------------------------
  const total = cartItems.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* CUSTOMER */}
      <div className="border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">
          Customer Info
        </h2>

        <p>{profile?.first_name} {profile.last_name}</p>
        <p>{customer?.phone}</p>
      </div>

      {/* ADDRESS */}
      <div className="border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">
          Shipping Address
        </h2>

        <p>{address?.street}</p>
        <p>{address?.city}</p>
        <p>{address?.province}</p>
      </div>

      {/* ITEMS */}
      <div className="border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">
          Order Items
        </h2>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between"
            >
              <span>
                {item.product.title} × {item.quantity}
              </span>

              <span>
                Rs {item.total_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between text-xl font-bold border-t pt-4">
        <span>Total</span>
        <span>Rs {total}</span>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleConfirmOrder}
        disabled={orderMutation.isPending}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        {orderMutation.isPending
          ? "Placing Order..."
          : "Confirm Order"}
      </button>
       <button
  onClick={() => navigate("/complete-profile")}
  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
>
  {isLoading ? "Redirecting..." : "Edit Profile Details"}
</button>
    </div>
  );
}
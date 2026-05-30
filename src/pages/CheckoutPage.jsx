import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchcarts } from "../api/carts";
import { createOrder } from "../api/orders";
import { fetchProfile } from "../api/auth";
import { fetchCustomersDetails } from "../api/customers";
import { fetchAddress } from "../api/address";
import { IsAuthenticated } from "../utils/authentication";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod,setPaymentMethod]=useState("COD")
  
  // Get data from state - can be either cartId or buyNow data
  const cartId = state?.cartId;
  const buyNowData = state?.buyNow; // { product_id, quantity, product }

  // -----------------------------
  // REDIRECT IF NO DATA
  // -----------------------------
  useEffect(() => {
    if (!cartId && !buyNowData) {
      navigate("/carts");
    }
  }, [cartId, buyNowData, navigate]);

  // -----------------------------
  // CART QUERY (only if cartId exists)
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

  // -----------------------------
  // PROFILE QUERY
  // -----------------------------
  const {
    data: profile,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["profile-details"],
    queryFn: fetchProfile,
  });

  // -----------------------------
  // CUSTOMER QUERY
  // -----------------------------
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


  //esewa submitfrom
const submitEsewaForm = (
  paymentUrl,
  payload
) => {

  const form = document.createElement("form");

  form.method = "POST";

  form.action = paymentUrl;

  Object.entries(payload).forEach(
    ([key, value]) => {

      const input =
        document.createElement("input");

      input.type = "hidden";

      input.name = key;

      input.value = value;

      form.appendChild(input);
    }
  );

  document.body.appendChild(form);

  form.submit();
};

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
          state: { 
            cartId, 
            buyNow: buyNowData,
            returnTo: "/checkout"
          },
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
    buyNowData,
  ]);

  // -----------------------------
  // ORDER MUTATION
  // -----------------------------
  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: (data) => {

  if (data.payment_method === "ESEWA") {

    submitEsewaForm(
      data.payment_url,
      data.payload
    );

  } else {

    navigate("/orders");

  }
},

    onError: (err) => {
      console.log(err);
      alert("Failed to place order. Please try again.");
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

    // Determine order payload based on checkout type
    const orderPayload = buyNowData
      ? {
          // Buy Now: send product_id and quantity
          product_id: buyNowData.product_id,
          quantity: buyNowData.quantity,
          payment_method:paymentMethod
        }
      : {
          // Cart: send cart_id
          cart_id: cartId,
          payment_method:paymentMethod
        };

    orderMutation.mutate(orderPayload);
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (profileLoading || customerLoading || addressLoading || (cartId && cartLoading)) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // ERROR STATE
  // -----------------------------
  if (cartError && cartId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load checkout. Please try again.</p>
          <button
            onClick={() => navigate("/carts")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // PREPARE ORDER ITEMS
  // -----------------------------
  let orderItems = [];
  let total = 0;

  if (buyNowData) {
    // Buy Now: single product
    const product = buyNowData.product;
    const quantity = buyNowData.quantity;
    const itemTotal = product.price * quantity;

    orderItems = [
      {
        id: product.id,
        product: product,
        quantity: quantity,
        total_price: itemTotal,
      },
    ];
    total = itemTotal;
  } else {
    // Cart: multiple products
    orderItems = cartItems;
    total = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-1">
          {buyNowData ? "Quick Buy" : "Review your order"}
        </p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-bold text-lg mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Customer Info
        </h2>

        <div className="space-y-1 text-gray-700">
          <p className="font-medium">
            {profile?.first_name} {profile?.last_name}
          </p>
          <p className="text-sm">{customer?.phone}</p>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-bold text-lg mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Shipping Address
        </h2>

        <div className="space-y-1 text-gray-700">
          <p>{address?.street}</p>
          <p>
            {address?.city}, {address?.province}
          </p>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Order Items
          {buyNowData && (
            <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-normal">
              Quick Buy
            </span>
          )}
        </h2>

        <div className="space-y-3">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  {item.product.title}
                </span>
                <span className="text-gray-600 text-sm ml-2">
                  × {item.quantity}
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                Rs {item.total_price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-green-600">Rs {total.toLocaleString()}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="space-y-3">
<div className="space-y-3 space-x-4 ">
<label>
  <input 
  type="radio"
  value="COD"
  checked={paymentMethod==="COD"}
  onChange={(e)=>
    setPaymentMethod(e.target.value)
  }
  />
  Cash on Delivery
</label>
<label>
  <input
  type="radio"
  value="S"
  checked={paymentMethod==="S"}
  onChange={(e)=>
    setPaymentMethod(e.target.value)
  }
  />
  Pay with esewa
</label>
</div>
        <button
          onClick={handleConfirmOrder}
          disabled={orderMutation.isPending}
          className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
        >
          {orderMutation.isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Placing Order...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Confirm Order
            </>
          )}
        </button>

        <button
          onClick={() =>
            navigate("/complete-profile", {
              state: { 
                cartId, 
                buyNow: buyNowData,
                returnTo: "/checkout"
              },
            })
          }
          disabled={isLoading}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            "Redirecting..."
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile Details
            </>
          )}
        </button>

        <button
          onClick={() => navigate(buyNowData ? -1 : "/carts")}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          {buyNowData ? "Back to Product" : "Back to Cart"}
        </button>
      </div>
    </div>
  );
}
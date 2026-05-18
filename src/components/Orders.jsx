import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  fetchOrders,
  fetchOrderById,
  deleteOrder,
} from "../api/orders";
import { IsAuthenticated } from "../utils/authentication";

export default function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cartIdFromCart = location.state?.cartId;
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);

  // auth guard
  if (!IsAuthenticated()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => navigate("/login")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Please login to view orders
        </button>
      </div>
    );
  }

  // fetch orders list
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // fetch single order details
  const {
    data: orderDetails,
    isLoading: isOrderLoading,
  } = useQuery({
    queryKey: ["order", selectedOrderId],
    queryFn: () => fetchOrderById(selectedOrderId),
    enabled: !!selectedOrderId,
  });

  // create order
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  useEffect(() => {
    if (cartIdFromCart) {
      createMutation.mutate({ cart_id: cartIdFromCart });
    }
  }, [cartIdFromCart]);

  // delete order
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrderId(null);
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 max-w-5xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-center">
        Orders
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading Orders...</p>
      ) : (
        <div className="space-y-10">

          {/* ORDER DETAILS */}
          {orders.length === 0 ? (
            <p className="text-center text-red-400">
              You have not made any orders
            </p>
          ) : selectedOrderId && orderDetails ? (
            <div className="space-y-4 border rounded-lg p-4 sm:p-6">

              <h2 className="text-lg sm:text-xl font-semibold">
                Order #{orderDetails?.id}
              </h2>

              {isOrderLoading ? (
                <p className="text-gray-500">Loading order details...</p>
              ) : (
                <div className="space-y-4">
                  {orderDetails?.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-20 h-20 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.product?.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: Rs. {item.unit_price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-sm sm:text-base">
                        Total: Rs {item.unit_price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Select an order to view details
            </p>
          )}

          {/* ORDERS LIST */}
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <span className="font-medium">
                  Order {order.id}
                </span>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    View
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition w-full sm:w-auto"
                    onClick={() => deleteMutation.mutate(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}
import React from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createOrder,
    fetchOrders,
    fetchOrderById,
    deleteOrder,
} from "../api/orders";

export default function OrdersPage() {
    const location = useLocation();
    const queryClient = useQueryClient();

    const cartIdFromCart = location.state?.cartId; // ✅ get cartId
    const [selectedOrderId, setSelectedOrderId] = React.useState(null);

    // =========================
    // FETCH ALL ORDERS
    // =========================
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
    });

    // =========================
    // FETCH SINGLE ORDER
    // =========================
    const { data: orderDetails } = useQuery({
        queryKey: ["order", selectedOrderId],
        queryFn: () => fetchOrderById(selectedOrderId),
        enabled: !!selectedOrderId,
    });

    // =========================
    // CREATE ORDER
    // =========================
    const createMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
        },
    });

    // =========================
    // AUTO CREATE WHEN ARRIVED FROM CART
    // =========================
    useEffect(() => {
        if (cartIdFromCart) {
            createMutation.mutate({ cart_id: cartIdFromCart });
        }
    }, [cartIdFromCart]);

    // =========================
    // DELETE ORDER
    // =========================
    const deleteMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            setSelectedOrderId(null);
        },
    });

    return (
        <div className="p-10 space-y-20">
            <h1 className="text-2xl font-bold Justify-center mx-160">Orders</h1>

            {/* ORDERS LIST */}
            {isLoading ? (
                <p className="text-green-300">Loading Orders.....</p>
            ) : (
               <ul className="max-w-3xl mx-auto space-y-10">

 {/* ORDER DETAILS */}
            {orderDetails && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">
      Order #{orderDetails.id}
    </h2>

    {orderDetails.items.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-10 border p-4 rounded"
      >
        {/* IMAGE */}
        <img
          src={item.product.image}
          alt={item.product.title}
          className="w-16 h-16 object-cover rounded"
        />

        {/* DETAILS */}
        <div className="flex-1">
          <p className="font-medium">{item.product.title}</p>
          <p>Price: Rs. {item.unit_price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
<p>Total cost: Rs {item.unit_price*item.quantity}</p>
      </div>
      

    ))}
    
  </div>
)}

                    {orders.map((order) => (
                        <li key={order.id} className="border p-3 flex justify-between">
                            <span>Order {order.id}</span>
                           
                            <div className="flex gap-80">
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-green-900 transition"
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                View
                              </button>

                                <button className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-900 transition" onClick={() => deleteMutation.mutate(order.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

           
        </div>
    );
}
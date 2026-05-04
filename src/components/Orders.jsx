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
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Orders</h1>

            {/* ORDERS LIST */}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-2">
                    {orders.map((order) => (
                        <li key={order.id} className="border p-3 flex justify-between">
                            <span>Order #{order.id}</span>

                            <div className="flex gap-2">
                                <button onClick={() => setSelectedOrderId(order.id)}>
                                    View
                                </button>

                                <button onClick={() => deleteMutation.mutate(order.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* ORDER DETAILS */}
            {orderDetails && (
                <pre className="bg-gray-100 p-4">
                    {JSON.stringify(orderDetails, null, 2)}
                </pre>
            )}
        </div>
    );
}
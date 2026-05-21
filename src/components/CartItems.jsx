import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchcarts } from "../api/carts";
import { createOrder } from "../api/orders";
import { IsAuthenticated } from "../utils/authentication";
import api from "../api/axios"

export const CartItems = ({ cartId }) => {
  const navigate = useNavigate();
 
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart-items", cartId],
    queryFn: () => fetchcarts(cartId),
    enabled: !!cartId,
    staleTime: 1000 * 10, 
  });

  // ✅ CREATE ORDER MUTATION
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // redirect after order created
      navigate("/orders"); // or `/orders/${data.id}`
    },
  });

  if (isLoading)
    return (
      <div className="space-y-2 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-md" />
        ))}
      </div>
    );

  if (isError)
    return <p className="text-destructive">Failed to load cart items</p>;

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Your cart is empty.
      </div>
    );
  }

  const grandTotal = items.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* ITEMS */}
      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-center p-4 border-b last:border-0 text-sm"
          >
            <div className="col-span-6 font-medium">
              {item.product.title}
            </div>
            <div className="col-span-2 text-center">
              {item.quantity}
            </div>
            <div className="col-span-2 text-right text-muted-foreground">
              {item.product.unit_price}
            </div>
            <div className="col-span-2 text-right font-medium">
              {item.total_price}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">Rs {grandTotal}</span>
          </div>
        </div>
      </div>

      {/* ORDER BUTTON */}
      <button
        type="button"
        disabled={createMutation.isPending}
        onClick={async () => {
          if (!IsAuthenticated()) {
            navigate("/login");
            return;
          }
          try{
            const customerRes=await api.get("store/customers/me/");
            let address=null;
            
            try{
              const addressRes=await api.get("store/address/me/");
              address=addressRes.data;
            }catch{
              address=null;
            }
            const customer=customerRes.data;

            const isProfileComplete=
            customer.phone &&
            address &&
            address.street &&
            address.city &&
            address.province;
            
            if(!isProfileComplete){
              navigate("/complete-profile",{
                state:{cartId},
              });
              return;
            }
            navigate("/checkout",{
              state:{cartId},
            });
          }catch(err){
            console.log(err);
            <p>something went wrong!!</p>
          }

         
          // createMutation.mutate({ cart_id: cartId });
        }}
        className="bg-black text-white px-4 py-2 rounded hover:bg-green-300"
      >
        {isLoading ? "Ordering..." : "Order Now"}
      </button>
    </div>
  );
};
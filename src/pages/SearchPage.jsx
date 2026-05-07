import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard"
export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const { data: products = [],isLoading } = useQuery({
  queryKey: ["search", query],
  queryFn: () => fetchProducts(null, query),
  enabled: !!query,
});
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Search Results for "{query}"
      </h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
      )}
    </div>
  );
}
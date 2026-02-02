import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'

export default function ProductGrid({ collectionId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", collectionId],
    queryFn: () => fetchProducts(collectionId),
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[400px] w-full rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  );

  if (error) return <div className="text-center text-red-500 py-10">Error loading products</div>;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {data.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

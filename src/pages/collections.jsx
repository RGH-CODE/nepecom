import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import CollectionFilter from '../components/CollectionFilter'

export default function Collections() {
  const [collectionId, setCollectionId] = useState(null)

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <CollectionFilter onSelect={setCollectionId} selectedId={collectionId} />
          </div>
        </aside>
        <main className="flex-1">
          <ProductGrid collectionId={collectionId} />
        </main>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { fetchCollections } from '../api/collections'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export default function CollectionFilter({ onSelect, selectedId }) {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-md" />)}</div>

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Collections</h3>
      <div className="flex flex-col space-y-1">
        <Button
          variant={selectedId === null ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => onSelect(null)}
        >
          All Products
        </Button>
        {collections.map((collection) => (
          <Button
            key={collection.id}
            variant={selectedId === collection.id ? "secondary" : "ghost"}
            className={cn("justify-start", selectedId === collection.id && "bg-secondary font-medium")}
            onClick={() => onSelect(collection.id)}
          >
            {collection.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

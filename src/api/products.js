// api/products.js
import api from './axios'

export const fetchProducts = async (collectionId = null) => {
  if (!collectionId) {
    const res = await api.get('store/products/')

    // handle paginated or direct array
    return res.data.results || res.data
  }

  const res = await api.get(`store/collections/${collectionId}/`)


  return res.data.products || res.data.products || []
}
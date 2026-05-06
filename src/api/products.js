// api/products.js
import api from './axios';

export const fetchProducts = async (collectionId = null) => {
  const url = collectionId
    ? `store/products/?collection_id=${collectionId}`
    : 'store/products/';

  const res = await api.get(url);

  // handle paginated or direct response
  return res.data.results || res.data;
};
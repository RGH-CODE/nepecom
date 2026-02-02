import api from './axios'

export const fetchProducts = async () => {
  const res = await api.get('store/products/')
  return res.data.results|| []
}

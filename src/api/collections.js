import api from './axios'

export const fetchCollections = async () => {
  const res = await api.get('store/collections/')
  return res.data
}

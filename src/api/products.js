import api from "./axios";

export const fetchProducts = async (
  collectionId = null,
  search = ""
) => {
  const params = new URLSearchParams();

  if (collectionId) {
    params.append("collection_id", collectionId);
  }

  if (search) {
    params.append("search", search);
  }

  const url = `store/products/?${params.toString()}`;

  console.log(url); // debug

  const res = await api.get(url);

  return res.data.results || res.data;
};
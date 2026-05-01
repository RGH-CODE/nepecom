import axios from 'axios'

const api = axios.create({
  baseURL: 'https://nepecom.onrender.com/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});


export default api;
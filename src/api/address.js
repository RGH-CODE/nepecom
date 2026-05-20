import api from './axios'

 export const fetchAddress=async()=>{
    const res=await api.get('store/address/me/')
   return res.data
 }

export const updateAddress=async(data)=>{
    const res=await api.patch('store/address/me/',data);
    return res.data
}



import api from './axios'

 export const fetchCustomersDetails=async()=>{
    const res=await api.get('store/customers/me/')
    return res.data
 }

export const updateCustomersDetails=async(data)=>{
    const res=await api.put('store/customers/me/',data);
   return  res.data
}

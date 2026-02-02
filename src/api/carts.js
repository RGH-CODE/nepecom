import React from 'react'
import api from './axios'
export const  createcarts = async(data) => {
    const res=await api.post('store/carts/',data)
    return res.data
   
}


export const addToCart = async ({ cartId, product_id, quantity }) => {
  const res = await api.post(
    `store/carts/${cartId}/items/`,
    { product_id, quantity }
  );
  return res.data;
};


export const fetchcarts=async(cartId)=>{
    const res =await api.get(`store/carts/${cartId}/items/`)
    return res.data
}

export const deletecarts=async(cartId)=>{
  const res =await api.delete(`store/carts/${cartId}`)
  return res.data
}
import api from './axios'

// CREATE ORDER
export const createOrder = async (data) => {
    try {
        const res = await api.post('/store/orders/', data) // trailing slash
        return res.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

// FETCH ALL ORDERS
export const fetchOrders = async () => {
    try {
        const res = await api.get('/store/orders/')
        return res.data.results || res.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

// FETCH SINGLE ORDER
export const fetchOrderById = async (orderId) => {
    try {
        const res = await api.get(`/store/orders/${orderId}/`)
        return res.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

// DELETE ORDER
export const deleteOrder = async (orderId) => {
    try {
        const res = await api.delete(`/store/orders/${orderId}/`)
        return res.data
    } catch (err) {
        console.log(err)
        throw err
    }
}
import axiosInstance from './axiosInstance';

export const getOrders = () => axiosInstance.get('/orders');
export const createOrder = (orderData) => axiosInstance.post('/orders', orderData);
export const updateOrder = (id, orderData) => axiosInstance.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => axiosInstance.delete(`/orders/${id}`);

export default {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder
};

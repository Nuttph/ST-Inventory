import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get('/products');
export const createProduct = (productData) => axiosInstance.post('/products', productData);
export const updateProduct = (id, productData) => axiosInstance.put(`/products/${id}`, productData);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);

export default {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};

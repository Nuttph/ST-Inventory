import axiosInstance from './axiosInstance';

export const getUsers = () => axiosInstance.get('/users');
export const createUser = (userData) => axiosInstance.post('/users', userData);
export const updateUser = (id, userData) => axiosInstance.put(`/users/${id}`, userData);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);

export default {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};

import axiosInstance from '../utils/axiosInstance';

export const orderApi = {
  createOrder: async (orderData: any) => {
    return axiosInstance.post('/orders', orderData);
  },
  payOrder: async (id: string, paymentMethod: string) => {
    return axiosInstance.patch(`/orders/${id}/pay`, { paymentMethod });
  }
};

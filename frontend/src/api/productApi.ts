import axiosInstance from '../utils/axiosInstance';

export const productApi = {
  getProducts: async (tenantId?: string) => {
    return axiosInstance.get('/products', { params: { tenantId } });
  },
};

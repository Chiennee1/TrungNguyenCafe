import axiosInstance from '../utils/axiosInstance';

export const reportApi = {
  getRevenue: async (params: any) => {
    return axiosInstance.get('/reports/revenue', { params });
  },
};

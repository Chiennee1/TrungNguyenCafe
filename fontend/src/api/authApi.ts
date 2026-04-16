import axiosInstance from '../utils/axiosInstance';

export const authApi = {
  login: async (credentials: any) => {
    return axiosInstance.post('/auth/login', credentials);
  },
};

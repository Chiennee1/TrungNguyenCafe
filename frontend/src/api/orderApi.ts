import axiosInstance from '../utils/axiosInstance';

export interface OrderQueryParams {
  from?: string;
  to?: string;
  status?: number;
  paymentMethod?: string;
  page?: number;
  pageSize?: number;
}

export const orderApi = {
  getOrders: async (params: OrderQueryParams = {}) => {
    const query = new URLSearchParams();
    if (params.from)            query.set('from', params.from);
    if (params.to)              query.set('to', params.to);
    if (params.status !== undefined) query.set('status', String(params.status));
    if (params.paymentMethod)   query.set('paymentMethod', params.paymentMethod);
    if (params.page)            query.set('page', String(params.page));
    if (params.pageSize)        query.set('pageSize', String(params.pageSize));
    return axiosInstance.get(`/orders?${query.toString()}`);
  },
  getOrderById: async (id: string) => {
    return axiosInstance.get(`/orders/${id}`);
  },
  createOrder: async (orderData: any) => {
    return axiosInstance.post('/orders', orderData);
  },
  updateStatus: async (id: string, status: number) => {
    return axiosInstance.patch(`/orders/${id}/status`, status);
  },
};

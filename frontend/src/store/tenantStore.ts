import { create } from 'zustand';

interface Tenant {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface TenantState {
  tenants: Tenant[];
  activeTenantId: string | null;
  setTenants: (tenants: Tenant[]) => void;
  setActiveTenant: (id: string) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenants: [],
  activeTenantId: null,
  setTenants: (tenants) => set({ tenants }),
  setActiveTenant: (id) => set({ activeTenantId: id }),
}));

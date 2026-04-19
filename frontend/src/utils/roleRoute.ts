import type { Role } from '../store/authStore';

export function getHomePathByRole(role?: Role | string | null): string {
    switch (role) {
        case 'STAFF_POS':
            return '/pos';
        case 'WAREHOUSE':
            return '/inventory';
        case 'BARISTA':
            return '/orders';
        case 'SYSTEM_ADMIN':
        case 'CHAIN_MANAGER':
        case 'FRANCHISE_OWNER':
        case 'STORE_MANAGER':
        default:
            return '/dashboard';
    }
}

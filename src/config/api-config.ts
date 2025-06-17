export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    CUSTOMERS_ALL: '/api/customers/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    PRODUCTS: '/api/products',
    PRODUCTS_ALL: '/api/products/all',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    LOGIN: '/api/login',
    ORDERS: '/api/orders',
    ORDER_BY_ID: (id: string) => `/api/orders/${id}/`,
    ASSIGN_MANAGER: (orderId: string, managerId: string) =>
      `/api/orders/${orderId}/assign-manager/${managerId}/`,
    ORDER_DELIVERY: (id: string) => `/api/orders/${id}/delivery/`,
    ORDER_RECEIVE: (id: string) => `/api/orders/${id}/receive/`,
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATIONS_READ_ALL: '/api/notifications/read-all',
    NOTIFICATION_BY_ID: (notificationId: string) => `/api/notifications/${notificationId}/read`,
  },
} as const;

export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    CUSTOMERS_ALL: '/api/customers/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    PRODUCTS: '/api/products',
    PRODUCTS_ALL: '/api/products/all',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    ORDERS: '/api/orders',
    ORDER_BY_ID: (orderId: string) => `/api/orders/${orderId}/`,
    ASSING_MANAGER: (orderId: string, managerId: string) =>
      `/api/orders/${orderId}/assign-manager/${managerId}`,
    UNASSIGN_MANAGER: (orderId: string) => `/api/orders/${orderId}/unassign-manager`,
    POST_COMMENT: (orderId: string) => `/api/orders/${orderId}/comments`,
    DELETE_COMMENT: (orderId: string, commentId: string) =>
      `/api/orders/${orderId}/comments/${commentId}`,
    UPDATE_DELIVERY: (orderId: string) => `/api/orders/${orderId}/delivery`,
    RECEIVE_ORDER: (orderId: string) => `/api/orders/${orderId}/receive`,
    UPDATE_STATUS: (orderId: string) => `/api/orders/${orderId}/status`,
    LOGIN: '/api/login',
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATIONS_READ_ALL: '/api/notifications/read-all',
    NOTIFICATION_BY_ID: (notificationId: string) => `/api/notifications/${notificationId}/read`,
  },
} as const;

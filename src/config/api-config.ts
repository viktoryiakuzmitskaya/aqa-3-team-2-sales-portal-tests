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
  },
} as const;

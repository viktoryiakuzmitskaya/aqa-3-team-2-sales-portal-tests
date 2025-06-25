export const ERRORS = {
  UNAUTHORIZED: 'Invalid access token',
  INCORRECT_CREDENTIALS: 'Incorrect credentials',
  LOGIN_ERROR: 'Login error',
  NOT_AUTHORIZED: 'Not authorized',
  INCORRECT_REQUEST_BODY: 'Incorrect request body',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  CUSTOMER_ALREADY_EXISTS: (email: string) => `Customer with email '${email}' already exists`,
  ORDER_NOT_FOUND: (id: string) => `Order with id '${id}' wasn't found`,
  ORDER_BAD_REQUEST: 'Incorrect request body',
  COMMENT_NOT_FOUND: 'Comment was not found',
  MANAGER_NOT_FOUND: (id: string) => `Manager with id '${id}' wasn't found`,
} as const;

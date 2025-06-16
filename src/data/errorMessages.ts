export const ERRORS = {
  UNAUTHORIZED: 'Invalid access token',
  INCORRECT_CREDENTIALS: 'Incorrect credentials',
  LOGIN_ERROR: 'Login error',
  NOT_AUTHORIZED: 'Not authorized',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  CUSTOMER_ALREADY_EXISTS: (email: string) => `Customer with email '${email}' already exists`,
} as const;

export const ERRORS = {
  UNAUTHORIZED: 'Invalid access token',
  INCORRECT_CREDENTIALS: 'Incorrect credentials',
  LOGIN_ERROR: 'Login error',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
} as const;

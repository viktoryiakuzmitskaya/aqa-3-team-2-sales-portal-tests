export const ERROR_MESSAGES = {
  INCORRECT_REQUEST_BODY: 'Incorrect request body',
  NOT_AUTHORIZED: 'Not authorized',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  CUSTOMER_ALREADY_EXISTS: (email: string) => `Customer with email '${email}' already exists`,
};

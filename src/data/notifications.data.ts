export const NOTIFICATIONS = {
  CUSTOMER_CREATED: 'Customer was successfully created',
  CUSTOMER_DUPLICATED: (email: string) => `Customer with email '${email}' already exists`,
  CUSTOMER_DELETED: 'Customer was successfully deleted',
  ORDER_CANCELED: 'Order was successfully canceled',
  ORDER_REOPENED: 'Order was successfully reopened',
};

export const EMPTY_TABLE_ROW_TEXT = 'No records created yet';

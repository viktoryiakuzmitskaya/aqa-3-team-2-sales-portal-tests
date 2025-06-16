export enum ORDER_STATUSES {
  DRAFT = 'Draft',
  IN_PROCESS = 'In Process',
  PARTIALLY_RECEIVED = 'Partially Received',
  RECEIVED = 'Received',
  CANCELED = 'Canceled',
}

export enum ORDER_HISTORY_ACTIONS {
  CREATED = 'Order created',
  CUSTOMER_CHANGED = 'Customer changed',
  REQUIRED_PRODUCTS_CHANGED = 'Requested products changed',
  PROCESSED = 'Order processing started',
  DELIVERY_SCHEDULED = 'Delivery Scheduled',
  DELIVERY_EDITED = 'Delivery Edited',
  RECEIVED = 'Received',
  RECEIVED_ALL = 'All products received',
  CANCELED = 'Order canceled',
  MANAGER_ASSIGNED = 'Manager Assigned',
  MANAGER_UNASSIGNED = 'Manager Unassigned',
  REOPENED = 'Order reopened',
}

export enum DELIVERY_CONDITIONS {
  DELIVERY = 'Delivery',
  PICK_UP = 'Pickup',
}

export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

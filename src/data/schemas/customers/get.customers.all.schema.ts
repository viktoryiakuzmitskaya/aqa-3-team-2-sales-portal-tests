import { baseSchema } from '../base.schema';
import { customerSchema } from './customer.schema';
/*
const getCustomerSchemaAll = {
  type: 'object',
  properties: {
    ...baseSchema,
    Customer: customerSchema,
  },
  required: ['IsSuccess', 'ErrorMessage', 'Customer'],
};*/

export { getCustomerSchemaAll };

const getCustomerSchemaAll = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    ...baseSchema,
  },
  required: ['Customers', 'IsSuccess', 'ErrorMessage'],
};

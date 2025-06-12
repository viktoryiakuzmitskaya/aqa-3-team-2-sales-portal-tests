import { baseSchema } from '../base.schema';
import { customerSchema } from './customer.schema';

const getCustomersSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    total: {
      type: 'number',
    },
    page: {
      type: 'number',
    },
    limit: {
      type: ['number', 'null'],
    },
    search: {
      type: 'string',
    },
    country: {
      type: 'array',
    },
    sorting: {
      type: 'object',
      properties: {
        sortField: {
          type: 'string',
        },
        sortOrder: {
          type: 'string',
        },
      },
      required: ['sortField', 'sortOrder'],
    },
    ...baseSchema,
  },
  required: [
    'Customers',
    'total',
    'page',
    'limit',
    'search',
    'country',
    'sorting',
    'IsSuccess',
    'ErrorMessage',
  ],
};

export { getCustomersSchema };

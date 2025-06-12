import { productItemSchema } from './productItem.schema';

export const productsSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productItemSchema,
    },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' },
    search: { type: 'string' },
    manufacturer: { type: 'array', items: { type: 'string' } },
    sorting: {
      type: 'object',
      properties: {
        sortField: { type: 'string' },
        sortOrder: { type: 'string' },
      },
      required: ['sortField', 'sortOrder'],
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: [
    'Products',
    'total',
    'page',
    'limit',
    'search',
    'manufacturer',
    'sorting',
    'IsSuccess',
    'ErrorMessage',
  ],
};

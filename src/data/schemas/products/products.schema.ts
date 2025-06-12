import { productItemSchema } from './productItem.schema';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { SORT_ORDERS, PRODUCTS_SORT_FIELDS } from 'types/api.types';

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
    manufacturer: {
      type: 'array',
      items: { type: 'string', enum: Object.values(MANUFACTURERS) },
    },
    sorting: {
      type: 'object',
      properties: {
        sortField: { type: 'string', enum: Object.values(PRODUCTS_SORT_FIELDS) },
        sortOrder: { type: 'string', enum: Object.values(SORT_ORDERS) },
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

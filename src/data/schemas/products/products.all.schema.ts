import { productItemSchema } from './productItem.schema';

export const productsAllSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productItemSchema,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
};

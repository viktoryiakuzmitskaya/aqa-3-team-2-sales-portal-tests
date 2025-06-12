import { productSchema } from './product.schema';

export const productsAllSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productSchema,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
};

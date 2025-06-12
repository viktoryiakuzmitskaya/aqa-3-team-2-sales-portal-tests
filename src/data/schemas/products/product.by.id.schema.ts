import { productSchema } from './product.schema';

export const productByIdSchema = {
  type: 'object',
  properties: {
    Product: productSchema,
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Product', 'IsSuccess', 'ErrorMessage'],
};

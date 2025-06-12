import { productItemSchema } from './productItem.schema';

export const productByIdSchema = {
  type: 'object',
  properties: {
    Product: productItemSchema,
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Product', 'IsSuccess', 'ErrorMessage'],
};

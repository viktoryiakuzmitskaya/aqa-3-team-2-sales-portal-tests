import { productObjectSchema } from './product.object.schema';

const productSchema = {
  type: 'object',
  properties: {
    Product: productObjectSchema,
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Product', 'IsSuccess', 'ErrorMessage'],
};

export { productSchema };

import { productObjectSchema } from './product.object.schema';

const productsSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productObjectSchema,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
  },
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
};

export { productsSchema };

import { MANUFACTURERS } from 'data/products/manufacturers.data';

export const productSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    price: { type: 'number' },
    manufacturer: {
      type: 'string',
      enum: Object.values(MANUFACTURERS),
    },
    createdOn: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'createdOn'],
};

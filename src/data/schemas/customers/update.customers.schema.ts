import { baseSchema } from '../base.schema';
import { customerSchema } from './customer.schema';

const putCustomersSchema = {
  type: 'object',
  properties: {
    ...baseSchema.properties,
    Customer: customerSchema,
  },
  required: ['IsSuccess', 'ErrorMessage', 'Customer'],
};

export { putCustomersSchema };

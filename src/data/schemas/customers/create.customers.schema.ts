import { baseSchema } from '../base.schema';
import { customerSchema } from './customer.schema';

const postCustomerSchema = {
  type: 'object',
  properties: {
    ...baseSchema,
    Customer: customerSchema,
  },
  required: ['IsSuccess', 'ErrorMessage', 'Customer'],
};

export { postCustomerSchema };

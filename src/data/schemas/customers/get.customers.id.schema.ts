import { baseSchema } from '../base.schema';
import { customerSchema } from './customer.schema';

const getCustomersSchemaById = {
  type: 'object',
  properties: {
    ...baseSchema.properties,
    Customer: customerSchema,
  },
  required: ['IsSuccess', 'ErrorMessage', 'Customer'],
};

export { getCustomersSchemaById };

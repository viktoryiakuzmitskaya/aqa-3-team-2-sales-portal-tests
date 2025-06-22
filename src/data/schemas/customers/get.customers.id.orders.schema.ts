import { baseSchema } from '../base.schema';

const getCustomerOrderByIdSchema = {
  type: 'object',
  properties: {
    Orders: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          status: { type: 'string' },
          customer: { type: 'string' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                amount: { type: 'number' },
                price: { type: 'number' },
                manufacturer: { type: 'string' },
                notes: { type: 'string' },
                received: { type: 'boolean' },
              },
              required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'notes', 'received'],
            },
          },
          delivery: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  country: { type: 'string' },
                  city: { type: 'string' },
                  street: { type: 'string' },
                  house: { type: 'number' },
                  flat: { type: 'number' },
                },
                required: ['country', 'city', 'street', 'house', 'flat'],
              },
              finalDate: { type: 'string' },
              condition: { type: 'string' },
            },
            required: ['address', 'finalDate', 'condition'],
          },
          total_price: { type: 'number' },
          createdOn: { type: 'string' },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                createdOn: { type: 'string' },
                _id: { type: 'string' },
              },
              required: ['text', 'createdOn', '_id'],
            },
          },
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                customer: { type: 'string' },
                products: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      name: { type: 'string' },
                      amount: { type: 'number' },
                      price: { type: 'number' },
                      manufacturer: { type: 'string' },
                      notes: { type: 'string' },
                      received: { type: 'boolean' },
                    },
                    required: [
                      '_id',
                      'name',
                      'amount',
                      'price',
                      'manufacturer',
                      'notes',
                      'received',
                    ],
                  },
                },
                total_price: { type: 'number' },
                delivery: {
                  type: 'object',
                  properties: {
                    address: {
                      type: 'object',
                      properties: {
                        country: { type: 'string' },
                        city: { type: 'string' },
                        street: { type: 'string' },
                        house: { type: 'number' },
                        flat: { type: 'number' },
                      },
                      required: ['country', 'city', 'street', 'house', 'flat'],
                    },
                    finalDate: { type: 'string' },
                    condition: { type: 'string' },
                  },
                  required: ['address', 'finalDate', 'condition'],
                },
                changedOn: { type: 'string' },
                action: { type: 'string' },
                performer: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    roles: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    createdOn: { type: 'string' },
                  },
                  required: ['_id', 'username', 'firstName', 'lastName', 'roles', 'createdOn'],
                },
              },
              required: [
                'status',
                'customer',
                'products',
                'total_price',
                'delivery',
                'changedOn',
                'action',
                'performer',
              ],
            },
          },
          assignedManager: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              roles: {
                type: 'array',
                items: { type: 'string' },
              },
              createdOn: { type: 'string' },
            },
            required: ['_id', 'username', 'firstName', 'lastName', 'roles', 'createdOn'],
          },
        },
        required: [
          '_id',
          'status',
          'customer',
          'products',
          'delivery',
          'total_price',
          'createdOn',
          'comments',
          'history',
          'assignedManager',
        ],
      },
    },
    ...baseSchema.properties,
  },
  required: ['Orders', 'IsSuccess', 'ErrorMessage'],
};

export { getCustomerOrderByIdSchema };

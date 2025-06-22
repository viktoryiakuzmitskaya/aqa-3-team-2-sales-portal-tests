import {
  DELIVERY_CONDITIONS,
  ORDER_HISTORY_ACTIONS,
  ORDER_STATUSES,
  ROLES,
} from 'data/orders/orders.data';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { customerSchema } from '../customers/customer.schema';
import { COUNTRIES } from 'data/customers/countries.data';

export const commentSchema = {
  type: 'object',
  properties: {
    createdOn: { type: 'string' },
    text: { type: 'string' },
    _id: { type: 'string' },
  },
  required: ['createdOn', 'text', '_id'],
};

export const assignedManagerSchema = {
  anyOf: [
    {
      type: 'object',
      properties: {
        createdOn: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        username: { type: 'string' },
        _id: { type: 'string' },
        roles: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values(ROLES),
          },
        },
      },
      required: ['createdOn', 'firstName', 'lastName', 'username', '_id', 'roles'],
    },
    { type: 'null' },
  ],
};

export const deliverySchema = {
  anyOf: [
    {
      type: 'object',
      properties: {
        condition: { type: 'string', enum: Object.values(DELIVERY_CONDITIONS) },
        finalDate: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            country: { type: 'string', enum: Object.values(COUNTRIES) },
            city: { type: 'string' },
            street: { type: 'string' },
            house: { type: 'number' },
            flat: { type: 'number' },
          },
          required: ['country', 'city', 'street', 'house', 'flat'],
        },
      },
      required: ['condition', 'finalDate', 'address'],
    },
    { type: 'null' },
  ],
};

export const productSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    price: { type: 'number' },
    manufacturer: { type: 'string', enum: Object.values(MANUFACTURERS) },
    received: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'received'],
};

export const orderHistorySchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUSES),
    },
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: productSchema,
    },
    total_price: { type: 'number' },
    action: {
      type: 'string',
      enum: Object.values(ORDER_HISTORY_ACTIONS),
    },
    changedOn: { type: 'string' },
    delivery: deliverySchema,
    assignedManager: assignedManagerSchema,
    performer: assignedManagerSchema,
  },
  required: [
    'status',
    'customer',
    'products',
    'total_price',
    'action',
    'changedOn',
    'delivery',
    'assignedManager',
    'performer',
  ],
};

export const orderSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUSES),
    },
    customer: customerSchema,
    products: {
      type: 'array',
      items: productSchema,
    },
    total_price: { type: 'number' },
    createdOn: { type: 'string' },
    delivery: deliverySchema,
    comments: {
      type: 'array',
      items: commentSchema,
    },
    history: {
      type: 'array',
      items: orderHistorySchema,
    },
    assignedManager: assignedManagerSchema,
  },
  required: [
    '_id',
    'status',
    'customer',
    'products',
    'total_price',
    'createdOn',
    'comments',
    'history',
    'assignedManager',
  ],
};

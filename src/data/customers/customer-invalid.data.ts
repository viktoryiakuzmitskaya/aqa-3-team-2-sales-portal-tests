import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { COUNTRIES } from './countries.data';
import { ERRORS } from 'data/errorMessages';

export const invalidTestCases = [
  {
    name: 'Email without @',
    data: generateCustomerData({ email: 'userexample.com' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Email without domain',
    data: generateCustomerData({ email: 'user@' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Empty email',
    data: generateCustomerData({ email: '' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Empty name',
    data: generateCustomerData({ name: '' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Name with numbers',
    data: generateCustomerData({ name: 'John123 Doe' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Name with special characters',
    data: generateCustomerData({ name: '@John_Doe!' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Name too long (41 chars)',
    data: generateCustomerData({ name: 'A'.repeat(41) }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Phone without +',
    data: generateCustomerData({ phone: '1234567890' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Phone too short (9 digits)',
    data: generateCustomerData({ phone: '+123456789' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Phone too long (21 digits)',
    data: generateCustomerData({ phone: '+123456789012345678901' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Phone with letters',
    data: generateCustomerData({ phone: '+123abc4567' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Empty street',
    data: generateCustomerData({ street: '' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Street with special characters',
    data: generateCustomerData({ street: '#Main$Street' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Street too long (41 chars)',
    data: generateCustomerData({ street: 'A'.repeat(41) }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'House = 0',
    data: generateCustomerData({ house: 0 }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'House = 1000',
    data: generateCustomerData({ house: 1000 }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Negative house',
    data: generateCustomerData({ house: -5 }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Flat = 0',
    data: generateCustomerData({ flat: 0 }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Flat = 10000',
    data: generateCustomerData({ flat: 10000 }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'City with digits',
    data: generateCustomerData({ city: 'NewYork1' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'City with special characters',
    data: generateCustomerData({ city: 'Berlin!' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'City too long (21 chars)',
    data: generateCustomerData({ city: 'A'.repeat(21) }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Invalid country',
    data: generateCustomerData({ country: 'Utopia' as COUNTRIES }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Notes with forbidden symbols',
    data: generateCustomerData({ notes: 'Hello <world>' }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    name: 'Notes too long (251 chars)',
    data: generateCustomerData({ notes: 'A'.repeat(251) }),
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
];

export const invalidTestCasesWithoutToken = [
  {
    name: 'token is invalid (space  string)',
    token: ' ',
    expectedMessage: ERRORS.NOT_AUTHORIZED,
  },
  {
    name: 'token is invalid (random string)',
    token: '12334',
    expectedMessage: ERRORS.UNAUTHORIZED,
  },
];

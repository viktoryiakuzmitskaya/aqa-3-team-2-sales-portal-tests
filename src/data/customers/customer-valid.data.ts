import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { COUNTRIES } from './countries.data';

export const validTestCases = [
  {
    name: 'All fields valid and filled',
    data: generateCustomerData(),
    isSuccess: true,
  },
  {
    name: 'Minimal name length (1 character)',
    data: generateCustomerData({ name: 'J' }),
    isSuccess: true,
  },
  {
    name: 'Max length name (40 characters)',
    data: generateCustomerData({ name: 'A'.repeat(19) + ' ' + 'B'.repeat(20) }),
    isSuccess: true,
  },
  {
    name: 'Minimal phone length (10 characters)',
    data: generateCustomerData({ phone: '+1234567890' }),
    isSuccess: true,
  },
  {
    name: 'Max phone length (20 characters)',
    data: generateCustomerData({ phone: '+12345678901234567890' }),
    isSuccess: true,
  },
  {
    name: 'Minimal street length (1 character)',
    data: generateCustomerData({ street: 'S' }),
    isSuccess: true,
  },
  {
    name: 'Minimal flat number (1)',
    data: generateCustomerData({ flat: 1 }),
    isSuccess: true,
  },
  {
    name: 'Max flat number (9999)',
    data: generateCustomerData({ flat: 9999 }),
    isSuccess: true,
  },
  {
    name: 'Minimal house number (1)',
    data: generateCustomerData({ house: 1 }),
    isSuccess: true,
  },
  {
    name: 'Max house number (999)',
    data: generateCustomerData({ house: 999 }),
    isSuccess: true,
  },
  {
    name: 'Minimal city length (1 character)',
    data: generateCustomerData({ city: 'M' }),
    isSuccess: true,
  },
  {
    name: 'Valid country from enum',
    data: generateCustomerData({ country: 'USA' as COUNTRIES }),
    isSuccess: true,
  },
  {
    name: 'Empty notes (optional field)',
    data: generateCustomerData({ notes: '' }),
    isSuccess: true,
  },
  {
    name: 'Max length notes (250 characters)',
    data: generateCustomerData({ notes: 'A'.repeat(250) }),
    isSuccess: true,
  },
  {
    name: 'Missing notes field',
    data: (() => {
      const data = generateCustomerData();
      delete data.notes;
      return data;
    })(),
    isSuccess: true,
  },
  {
    name: 'Missing notes field1',
    data: (({ notes, ...rest }) => rest)(generateCustomerData()),
    isSuccess: true,
  },
];

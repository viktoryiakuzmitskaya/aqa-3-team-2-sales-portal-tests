import { faker } from '@faker-js/faker';
import { COUNTRIES } from 'data/customers/countries.data';
import { IDelivery } from 'types/orders.type';
import { convertToDate } from 'utils/date.utils';
import { DELIVERY_CONDITIONS } from './orders.data';
import moment from 'moment';
import { getRandromEnumValue } from 'utils/enum.utils';

export function generateDelivery(customData: Partial<IDelivery> = {}): IDelivery {
  const baseAddress = {
    country: getRandromEnumValue(COUNTRIES),
    city: 'Mock City' + faker.string.alpha(5),
    street: 'Mock Street' + faker.string.alpha(5),
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 9999 }),
  };

  const finalDate = moment().add(5, 'days').toISOString();

  return {
    address: baseAddress,
    finalDate: convertToDate(finalDate),
    condition: DELIVERY_CONDITIONS.DELIVERY,
    ...customData,
  };
}

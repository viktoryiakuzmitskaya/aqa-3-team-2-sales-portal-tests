import { COUNTRIES } from 'data/customers/countries.data';

export type DeliveryDetail =
  | 'Country'
  | 'City'
  | 'Street'
  | 'House'
  | 'Flat'
  | 'Delivery Date'
  | 'Delivery Type';
export type DeliveryType = 'Delivery' | 'Pickup';
export type DeliveryLocation = 'Home' | 'Other';
export type DeliveryDataPickerMonths =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';
export interface DataInEditDeliveryModal {
  day: string;
  month?: DeliveryDataPickerMonths;
  city: string;
  country: COUNTRIES;
  street: string;
  house: number;
  flat: number;
}

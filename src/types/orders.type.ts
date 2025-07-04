import { COUNTRIES } from 'data/customers/countries.data';
import {
  DELIVERY_CONDITIONS,
  ORDER_HISTORY_ACTIONS,
  ORDER_STATUSES,
} from 'data/orders/orders.data';
import { ICustomer, ICustomerFromResponse } from './customer.types';
import { IResponseFields, SORT_ORDERS } from './api.types';
import { IProduct } from './products.types';
import { IManager } from './signIn.types';

export interface IDelivery {
  address: {
    country: COUNTRIES;
    city: string;
    street: string;
    house: number;
    flat: number;
  };
  finalDate: string;
  condition: DELIVERY_CONDITIONS;
}

export interface IHistory {
  action: ORDER_HISTORY_ACTIONS;
  assignedManager: IManager | null;
  changedOn: string;
  customer: string;
  delivery: IDelivery | null;
  performer: IManager;
  products: IProductOrder[];
  status: ORDER_STATUSES;
  total_price: number;
}

export interface IComment {
  comment: string;
}

export interface ICommentFromResponse {
  _id: string;
  text: string;
  createdOn: string;
}

export interface IOrder {
  assignedManager: IManager | null;
  comments: ICommentFromResponse[];
  createdOn: string;
  customer: ICustomerFromResponse;
  delivery: IDelivery | null;
  history: IHistory[];
  products: IProductOrder[];
  status: ORDER_STATUSES;
  total_price: number;
}

export interface IOrderFromResponse extends IOrder {
  _id: string;
}
export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}
export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
  limit: number;
  page: number;
  search: string;
  sorting: {
    sortField: ordersSortField;
    sortOrder: SORT_ORDERS;
  };
  status: ORDER_STATUSES;
  total: number;
}
export type ordersSortField =
  | 'createdOn'
  | 'email'
  | 'name'
  | 'orderNumber'
  | 'price'
  | 'status'
  | 'assignedManager';
export interface IProductOrder extends IProduct {
  received: boolean;
  _id: string;
}
export interface ICreateOrdersData {
  customer: string;
  products: string[];
}

export interface IOrderOptions {
  customerData?: Partial<ICustomer>;
  productData?: Partial<IProduct>;
  productCount?: number;
  isUniqueProducts?: boolean;
}

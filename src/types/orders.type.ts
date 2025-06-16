import { COUNTRIES } from 'data/customers/countries.data';
import {
  DELIVERY_CONDITIONS,
  ORDER_HISTORY_ACTIONS,
  ORDER_STATUSES,
  ROLES,
} from 'data/orders/orders.data';
import { IProductFromResponse } from './products.types';
import { ICustomerFromResponse } from './customer.types';
import { IResponseFields } from './api.types';

export interface IDelivery {
  address?: {
    country: COUNTRIES;
    city: string;
    street: string;
    house: number;
    flat: number;
  };
  finalDate: string;
  condition: DELIVERY_CONDITIONS;
}
export interface IPerformer {
  createdOn: string;
  firstName: string;
  lastName: string;
  roles: ROLES;
  username: string;
  _id: string;
}
export interface IAssignedManager {
  createdOn: string;
  firstName: string;
  lastName: string;
}

export interface IHistory {
  action: ORDER_HISTORY_ACTIONS;
  assignedManager?: IAssignedManager | null;
  changedOn: string;
  customer: string;
  delivery?: IDelivery | null;
  performer?: IPerformer;
  products: IProductFromResponse[];
  status: ORDER_STATUSES;
  total_price: number;
}

export interface ICommentFromResponse {
  _id: string;
  text: string;
  createdOn: string;
}

export interface IOrder {
  assignedManager?: IAssignedManager | null;
  comments: ICommentFromResponse[];
  createdOn: string;
  customer: ICustomerFromResponse;
  delivery: IDelivery | null;
  history: IHistory;
  products: IProductFromResponse[];
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
}

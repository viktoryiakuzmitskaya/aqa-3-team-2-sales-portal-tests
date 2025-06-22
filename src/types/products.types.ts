import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { IResponseFields, productsSortField, sortDirection } from './api.types';

export enum ESortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ESortProductsFields {
  NAME = 'name',
  PRICE = 'price',
  MANUFACTURER = 'manufacturer',
  CREATED_ON = 'createdOn',
}

export interface IProduct {
  name: string;
  manufacturer: MANUFACTURERS;
  price: number;
  amount: number;
  notes?: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsResponse extends IResponseFields {
  Products: IProductFromResponse[];
}

export interface IProductsSortedResponse extends IResponseFields {
  Products: IProductFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  manufacturer: MANUFACTURERS[];
  sorting: {
    sortField: productsSortField;
    sortOrder: sortDirection;
  };
}

export interface IProductsSearchParams {
  search?: string;
  manufacturer?: MANUFACTURERS | MANUFACTURERS[];
  sortField?: productsSortField;
  sortOrder?: sortDirection;
  page?: number;
  limit?: number;
}

import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { IResponseFields, sortDirection } from './api.types';

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
  sorting: {
    sortField: 'createdOn' | 'name' | 'manufacturer' | 'price';
    sortOrder: sortDirection;
  };
}

export interface IProductsSortedResponse extends IResponseFields {
  Products: IProductFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  manufacturer: string[];
  sorting: {
    sortField: 'createdOn' | 'name' | 'manufacturer' | 'price';
    sortOrder: sortDirection;
  };
}

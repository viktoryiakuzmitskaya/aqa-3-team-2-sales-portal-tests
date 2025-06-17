export interface IRequestOptions {
  baseURL: string;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: object;
  headers?: Record<string, string>;
}

export interface IResponse<T extends object | null> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export type sortDirection = 'asc' | 'desc';

export type customersSortField = 'createdOn' | 'email' | 'name' | 'country';

export type productsSortField = 'createdOn' | 'name' | 'manufacturer' | 'price';

export enum SORT_ORDERS {
  ASC = 'asc',
  DESC = 'desc',
}

export enum PRODUCTS_SORT_FIELDS {
  CREATED_ON = 'createdOn',
  NAME = 'name',
  MANUFACTURER = 'manufacturer',
  PRICE = 'price',
}

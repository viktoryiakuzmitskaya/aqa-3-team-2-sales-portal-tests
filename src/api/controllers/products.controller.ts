import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/api-config';
import { IRequestOptions } from 'types/api.types';
import {
  IProduct,
  IProductResponse,
  IProductsResponse,
  IProductsSortedResponse,
} from 'types/products.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams';

export class ProductsController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep()
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep()
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep()
  async create(body: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep()
  async updateById(body: IProduct, id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep()
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS_ALL),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductsResponse>(options);
  }

  @logStep()
  async getSorted(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductsSortedResponse>(options);
  }
}

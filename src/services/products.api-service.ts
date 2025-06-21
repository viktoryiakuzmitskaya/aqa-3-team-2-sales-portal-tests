import { APIRequestContext } from '@playwright/test';
import { ProductsController } from '../api/controllers/products.controller';
import { IProduct, IProductFromResponse } from '../types/products.types';
import { generateProductData } from '../data/products/generateProduct.data';
import { STATUS_CODES } from '../data/status.code';
import { validateResponse } from '../utils/notifications/validations/responseValidation';

export class ProductsApiService {
  private controller: ProductsController;

  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  getSorted(token: string, params?: any) {
    return this.controller.getSorted(token, params);
  }

  delete(id: string, token: string) {
    return this.controller.delete(id, token);
  }

  async create(token: string, product?: Partial<IProduct>): Promise<IProductFromResponse> {
    const productData = product ? { ...generateProductData(), ...product } : generateProductData();
    const res = await this.controller.create(productData, token);
    validateResponse(res, STATUS_CODES.CREATED, true, null);
    return res.body.Product;
  }

  async populate(
    amount: number,
    token: string,
    customDataList: Partial<IProduct>[] = [],
  ): Promise<IProductFromResponse[]> {
    return Promise.all(
      Array.from({ length: amount }, (_, index) => {
        const productData = customDataList[index] ?? {};
        return this.create(token, productData);
      }),
    );
  }
}

import { APIRequestContext } from '@playwright/test';
import { ProductsController } from 'api/controllers/products.controller';
import { IProduct, IProductFromResponse, IProductsSearchParams } from 'types/products.types';
import { generateProductData } from 'data/products/generateProduct.data';
import { STATUS_CODES } from 'data/status.code';
import {
  validateDeleteResponse,
  validateResponse,
} from 'utils/notifications/validations/responseValidation';
import { logStep } from 'utils/reporter.utils';

export class ProductsApiService {
  private controller: ProductsController;

  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  @logStep('Get sorted products via API')
  async getSorted(token: string, params?: IProductsSearchParams) {
    return await this.controller.getSorted(token, params as Record<string, string>);
  }

  @logStep('Delete product via API')
  async delete(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }

  @logStep('Create Product via API')
  async create(token: string, product?: Partial<IProduct>): Promise<IProductFromResponse> {
    const productData = generateProductData(product);
    const res = await this.controller.create(productData, token);
    validateResponse(res, STATUS_CODES.CREATED, true, null);
    return res.body.Product;
  }

  @logStep('Create Product via API (Raw Response)')
  async createRaw(product: IProduct, token: string) {
    return await this.controller.create(product, token);
  }

  @logStep('Update Product via API')
  async updateById(product: IProduct, id: string, token: string) {
    return await this.controller.updateById(product, id, token);
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

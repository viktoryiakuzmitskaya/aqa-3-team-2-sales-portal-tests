import { APIRequestContext } from '@playwright/test';
import { ProductsController } from 'api/controllers/products.controller';
import { generateProductData } from 'data/products/generateProduct.data';
import { STATUS_CODES } from 'data/status.code';
import { IProduct } from 'types/products.types';
import { validateDeleteResponse, validateResponse } from 'utils/notifications/validations/responseValidation';
import { logStep } from 'utils/reporter.utils';

export class ProductsApiService {
  controller: ProductsController;
  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  @logStep('Create Product via API')
  async create(token: string, customData?: IProduct) {
    const body = generateProductData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Product;
  }

  @logStep('Delete product via API')
  async delete(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }
}

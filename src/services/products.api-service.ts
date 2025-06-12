import { APIRequestContext } from '@playwright/test';
import { ProductsController } from 'api/controllers/products.controller';
import { generateProductData } from 'data/products/generateProduct.data';
import { STATUS_CODES } from 'data/status.code';
import { IProduct } from 'types/products.types';
import { validateResponse } from 'utils/notifications/validations/responseValidation';

export class ProductsApiService {
  controller: ProductsController;
  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  async create(token: string, customData?: IProduct) {
    const body = generateProductData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Product;
  }
}

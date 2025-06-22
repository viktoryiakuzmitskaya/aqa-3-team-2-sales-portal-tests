import { test as base } from '@playwright/test';
import { IProductFromResponse } from '../types/products.types';
import { ICustomerFromResponse } from '../types/customer.types';
import { generateProductData } from '../data/products/generateProduct.data';
import { generateCustomerData } from '../data/customers/generateCustomer.data';
import { ProductsApiService } from '../api/services/products.api-service';
import { CustomersApiService } from '../api/services/customers.api-service';
import { SignInApiService } from '../api/services/signIn.api-service';

interface IDataFixtures {
  product: IProductFromResponse;
  customer: ICustomerFromResponse;
}

export const test = base.extend<IDataFixtures>({
  product: async ({ request }, use) => {
    const signInService = new SignInApiService(request);
    const productService = new ProductsApiService(request);

    const token = await signInService.loginAsLocalUser();
    const product = await productService.create(token, generateProductData());

    await use(product);

    try {
      await productService.delete(product._id, token);
    } catch (error) {
      console.error(`Failed to delete product ${product._id}:`, error);
    }
  },

  customer: async ({ request }, use) => {
    const signInService = new SignInApiService(request);
    const customerService = new CustomersApiService(request);

    const token = await signInService.loginAsLocalUser();
    const customer = await customerService.create(token, generateCustomerData());

    await use(customer);

    try {
      await customerService.delete(customer._id, token);
    } catch (error) {
      console.error(`Failed to delete customer ${customer._id}:`, error);
    }
  },
});

export { expect } from '@playwright/test';

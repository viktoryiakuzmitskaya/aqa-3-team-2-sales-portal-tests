import { test as base } from '@playwright/test';
import { CustomersApiService } from '../api/services/customers.api-service';
import { ProductsApiService } from '../api/services/products.api-service';
import { SignInApiService } from '../api/services/signIn.api-service';
import { NotificationsApiService } from '../api/services/notifications.api-service';
import { OrdersApiService } from '../api/services/orders.api-service';
import { IProductFromResponse } from '../types/products.types';
import { generateProductData } from '../data/products/generateProduct.data';
import { ICustomerFromResponse } from '../types/customer.types';
import { generateCustomerData } from '../data/customers/generateCustomer.data';

interface IServiceFixtures {
  customerService: CustomersApiService;
  productService: ProductsApiService;
  signInService: SignInApiService;
  notificationService: NotificationsApiService;
  orderService: OrdersApiService;
  product: IProductFromResponse;
  customer: ICustomerFromResponse;
}

export const test = base.extend<IServiceFixtures>({
  customerService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  productService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
  signInService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },
  notificationService: async ({ request }, use) => {
    await use(new NotificationsApiService(request));
  },
  orderService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },
  product: async ({ productService, signInService }, use) => {
    const token = await signInService.loginAsLocalUser();
    const product = await productService.create(token, generateProductData());
    await use(product);
    try {
      await productService.delete(product._id, token);
    } catch (error) {
      console.error(`Failed to delete product ${product._id}:`, error);
    }
  },
  customer: async ({ customerService, signInService }, use) => {
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

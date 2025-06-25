import { APIRequestContext } from '@playwright/test';
import { OrdersController } from 'api/controllers/orders.controller';
import { ORDER_STATUSES } from 'data/orders/orders.data';
import { STATUS_CODES } from 'data/status.code';
import { ICreateOrdersData, IDelivery, IOrderOptions } from 'types/orders.type';
import {
  validateDeleteResponse,
  validateResponse,
} from 'utils/notifications/validations/responseValidation';
import { logStep } from 'utils/reporter.utils';
import { CustomersApiService } from './customers.api-service';
import { ProductsApiService } from './products.api-service';
import { generateDelivery } from 'data/orders/generateOrder.data';
import { generateCommentText } from 'data/orders/genereteComment.data';

export class OrdersApiService {
  controller: OrdersController;
  customerService: CustomersApiService;
  productService: ProductsApiService;
  constructor(request: APIRequestContext) {
    this.controller = new OrdersController(request);
    this.customerService = new CustomersApiService(request);
    this.productService = new ProductsApiService(request);
  }

  @logStep('Creating an order via API')
  async create(token: string, body: ICreateOrdersData) {
    const response = await this.controller.createOrder(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Order;
  }

  @logStep('Creating an order draft')
  async createDraftOrder(token: string, numberOFProducts = 1) {
    if (typeof numberOFProducts !== 'number' || numberOFProducts > 5 || numberOFProducts < 1) {
      throw new Error('Incorrect number of Products');
    }
    const customer = await this.customerService.create(token);
    const product = await this.productService.create(token);
    const orderData: ICreateOrdersData = {
      customer: customer._id,
      products: [],
    };

    for (let i = 1; i <= numberOFProducts; i++) {
      orderData.products.push(product._id);
    }
    return await this.create(token, orderData);
  }

  @logStep('Creating an order draft with delivery')
  async createDraftOrderWithDelivery(
    token: string,
    numberOFProducts = 1,
    deliveryData?: Partial<IDelivery>,
  ) {
    const body = generateDelivery(deliveryData);
    const createdOrder = await this.createDraftOrder(token, numberOFProducts);
    const response = await this.controller.updateDelivery(createdOrder._id, body, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Create in prosess order via API')
  async createInProsessOrder(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createDraftOrderWithDelivery(token, numberOFProducts);
    const response = await this.controller.updateStatus(
      createdOrder._id,
      ORDER_STATUSES.IN_PROCESS,
      token,
    );
    return response.body.Order;
  }

  @logStep('Create in partially received order via API')
  async createOrderInPartiallyReceivedStatus(token: string, numberOFProducts = 2) {
    if (numberOFProducts < 2 || numberOFProducts > 5) throw new Error('Incorrect number');
    const createdOrder = await this.createInProsessOrder(token, numberOFProducts);
    const response = await this.controller.receiveOrder(
      createdOrder._id,
      [createdOrder.products[0]._id],
      token,
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Create Recive order via API')
  async createOrderInRecivedStatus(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createInProsessOrder(token, numberOFProducts);
    const response = await this.controller.receiveOrder(
      createdOrder._id,
      createdOrder.products.map((product) => product._id),
      token,
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Get by id order via API')
  async getByID(id: string, token: string) {
    const response = await this.controller.getByIdOrder(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Update delivery via API')
  async updateDelivery(orderId: string, delivery: IDelivery, token: string) {
    const response = await this.controller.updateDelivery(orderId, delivery, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Update status via API')
  async updateStatus(orderId: string, status: ORDER_STATUSES, token: string) {
    const response = await this.controller.updateStatus(orderId, status, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Delete order via API')
  async delete(id: string, token: string) {
    const response = await this.controller.deleteOrder(id, token);
    validateDeleteResponse(response);
  }

  @logStep('Delete order with customer and products')
  async fullDelete(orderId: string, token: string) {
    const order = await this.getByID(orderId, token);
    await this.delete(orderId, token);
    await this.customerService.delete(order.customer._id, token);
    const productIds = [...new Set(order.products.map((product) => product._id))];
    for (const id of productIds) {
      await this.productService.delete(id, token);
    }
  }

  @logStep('Add comment via API')
  async postComment(orderId: string, token: string, comment?: string) {
    const text = comment ?? generateCommentText();
    const commentPayload = { comment: text };
    const response = await this.controller.postComment(orderId, commentPayload, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Delete Comment via API')
  async deleteComment(orderId: string, commentId: string, token: string) {
    const response = await this.controller.deleteComment(orderId, commentId, token);
    validateResponse(response, STATUS_CODES.DELETED, true, null);
  }

  @logStep('Create canceled order w/o delivery and get order via API')
  async createCanceled(token: string, options?: IOrderOptions) {
    const productCount = options?.productCount ?? 1;
    const draftOrder = await this.createDraftOrder(token, productCount);
    return await this.updateStatus(draftOrder._id, ORDER_STATUSES.CANCELED, token);
  }

  @logStep('Assign manager to order via API')
  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.controller.updateAssignManager(orderId, managerId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep('Unassign manager from order via API')
  async unassignManager(orderId: string, token: string) {
    const response = await this.controller.unassignManager(orderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }
}

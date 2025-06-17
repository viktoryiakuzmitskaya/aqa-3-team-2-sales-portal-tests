import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/api-config';
import { IRequestOptions } from 'types/api.types';
import { IOrderResponse, IComment, IDelivery, IProductOrder } from 'types/orders.type';
import { ORDER_STATUSES } from 'data/orders/orders.data';
import { logStep } from 'utils/reporter.utils';

export class OrdersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  //create order ... assign manager

  @logStep()
  async unassignManager(orderId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UNASSIGN_MANAGER(orderId),
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep()
  async postComment(orderId: string, comment: IComment, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.POST_COMMENT(orderId),
      method: 'post',
      data: comment,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep()
  async deleteComment(orderId: string, commentId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.DELETE_COMMENT(orderId, commentId),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep()
  async updateDelivery(orderId: string, delivery: IDelivery, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UPDATE_DELIVERY(orderId),
      method: 'post',
      data: delivery,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep()
  async receiveOrder(orderId: string, products: IProductOrder[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.RECEIVE_ORDER(orderId),
      method: 'post',
      data: { products: products },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep()
  async updateStatus(orderId: string, status: ORDER_STATUSES, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UPDATE_STATUS(orderId),
      method: 'put',
      data: { status },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }
}

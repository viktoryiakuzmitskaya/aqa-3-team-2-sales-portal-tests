import { APIRequestContext } from '@playwright/test';
import { apiConfig } from 'config/api-config';
import { RequestApi } from 'api/apiClients/request';
import { IRequestOptions } from 'types/api.types';
import { logStep } from 'utils/reporter.utils';
import { INotificationsResponse } from 'types/notifications.types';

export class NotificationsController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep()
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATIONS,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }

  @logStep()
  async markAsRead(notificationId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATION_BY_ID(notificationId),
      method: 'patch',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }

  @logStep()
  async markAllAsRead(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.NOTIFICATIONS_READ_ALL,
      method: 'patch',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<INotificationsResponse>(options);
  }
}
import { APIRequestContext } from '@playwright/test';
import { NotificationsController } from 'api/controllers/notifications.controller';
import { STATUS_CODES } from 'data/status.code';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { logStep } from 'utils/reporter.utils';

export class NotificationsApiService {
  controller: NotificationsController;
  constructor(request: APIRequestContext) {
    this.controller = new NotificationsController(request);
  }

  @logStep('Get all notifications via API')
  async getAll(token: string) {
    const response = await this.controller.getAll(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Notifications;
  }

  @logStep('Mark notification as read via API')
  async markAsRead(notificationId: string, token: string) {
    const response = await this.controller.markAsRead(notificationId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    const updatedNotification = response.body.Notifications.find(n => n._id === notificationId);
    return updatedNotification;
  }

  @logStep('Mark all notifications as read via API')
  async markAllAsRead(token: string) {
    const response = await this.controller.markAllAsRead(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Notifications;
  }
}
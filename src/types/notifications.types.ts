import { IResponseFields } from './api.types';

export interface INotification {
  userId: string;
  type: NotificationType;
  orderId: string;
  message: NotificationMessage;
  read: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationFromResponse extends INotification {
  _id: string;
}

export interface INotificationsResponse extends IResponseFields {
  Notifications: INotificationFromResponse[];
}

export type NotificationType = 'unassigned' | 'assigned';

export type NotificationMessage =
  | 'You have been unassigned from order'
  | 'You have been assigned to order';

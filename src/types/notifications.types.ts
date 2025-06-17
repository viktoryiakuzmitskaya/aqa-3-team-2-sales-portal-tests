import { IResponseFields } from './api.types';

export interface INotification {
  userId: string;
  type: NotificationType;
  orderId: string;
  message: NOTIFICATION_MESSAGE;
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

export enum NOTIFICATION_MESSAGE {
  UNASSIGNED = 'You have been unassigned from order',
  ASSIGNED = 'You have been assigned to order',
}

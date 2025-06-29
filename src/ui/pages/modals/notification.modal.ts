import { logStep } from 'utils/reporter.utils';
import { Modal } from './modal.page';

export class NotificationsModalPage extends Modal {
  readonly modal = this.page.locator('#notification-popover-container');
  readonly uniqueElement = this.modal.locator('span.fw-bold', { hasText: 'Notifications' });
  readonly closeButton = this.modal.locator('button.btn-close');
  readonly markAllReadButton = this.modal.locator('#mark-all-read');

  readonly notificationItems = this.modal.locator('#notification-list > li');
  readonly notificationTexts = this.notificationItems.locator('[data-testid="notification-text"]');
  readonly notificationDates = this.notificationItems.locator('[data-testid="notification-date"]');
  readonly notificationLinks = this.notificationItems.locator('[data-testid="order-details-link"]');

  @logStep('Wait for notifications modal to be visible')
  async waitForOpen() {
    await this.modal.waitFor({ state: 'visible' });
    await this.waitForNotifications();
  }

  @logStep('Check if notifications modal is visible')
  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  @logStep('Close notifications modal')
  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  @logStep('Mark all notifications as read')
  async markAllAsRead() {
    try {
      await this.markAllReadButton.click();
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/notifications/read-all') && response.status() === 200,
      );
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error}`);
    }
  }

  @logStep('Wait for notifications to load')
  async waitForNotifications() {
    await this.page.waitForSelector('#notification-list > li', { state: 'attached' });
  }

  @logStep('Get count of notifications')
  async getNotificationCount(): Promise<number> {
    return this.notificationItems.count();
  }

  @logStep('Get notification text by index')
  async getNotificationText(index: number): Promise<string> {
    await this.ensureNotificationExists(index);
    return this.notificationTexts.nth(index).innerText();
  }

  @logStep('Find notification index by text')
  async findNotificationIndexByText(searchText: string): Promise<number | null> {
    const count = await this.getNotificationCount();
    for (let i = 0; i < count; i++) {
      const text = await this.getNotificationText(i);
      if (text.includes(searchText)) {
        return i;
      }
    }
    return null;
  }

  @logStep('Get notification date by index')
  async getNotificationDate(index: number): Promise<string> {
    await this.ensureNotificationExists(index);
    return this.notificationDates.nth(index).innerText();
  }

  @logStep('Click on notification by index')
  async clickNotification(index: number) {
    await this.ensureNotificationExists(index);
    await this.notificationItems.nth(index).locator('div[data-read]').click();
  }

  @logStep('Click on order details link by notification index')
  async clickOrderDetailsLink(index: number) {
    await this.ensureNotificationExists(index);
    await this.notificationLinks.nth(index).click();
  }

  @logStep('Check if notification is read by index')
  async isNotificationRead(index: number): Promise<boolean> {
    await this.ensureNotificationExists(index);
    const readAttr = await this.notificationItems
      .nth(index)
      .locator('div[data-read]')
      .getAttribute('data-read');
    return readAttr === 'true';
  }

  @logStep('Get unread notifications count')
  async getUnreadCount(): Promise<number> {
    const count = await this.getNotificationCount();
    let unread = 0;
    for (let i = 0; i < count; i++) {
      if (!(await this.isNotificationRead(i))) unread++;
    }
    return unread;
  }

  @logStep('Check if mark all read button is enabled')
  async isMarkAllReadEnabled(): Promise<boolean> {
    return this.markAllReadButton.isEnabled();
  }

  private async ensureNotificationExists(index: number) {
    const count = await this.getNotificationCount();
    if (index >= count) {
      throw new Error(`No notification found at index ${index}. Total available: ${count}`);
    }
  }
}

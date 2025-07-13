import { expect } from '@playwright/test';
import { Modal } from '../modal.page';
import { logStep } from 'utils/reporter.utils';
import { OrderBarOption } from 'data/orders/orders.data';

export class OrderDetailsHeader extends Modal {
  readonly headerContainer = this.page.locator('#title');
  uniqueElement = this.headerContainer;
  readonly title = this.uniqueElement.locator('.page-header-flex .ml-20');
  readonly orderNumber = this.uniqueElement.locator('.d-flex.justify-content-start > .fst-italic');
  readonly assignedManager = this.uniqueElement.locator('u[onclick*="renderAssigneManagerModal"]');
  readonly editAssignedButton = this.uniqueElement
    .locator('#assigned-manager-container')
    .getByTitle('Edit Assigned Manager');
  readonly removeAssignedButton = this.uniqueElement
    .locator('#assigned-manager-container')
    .getByTitle('Remove Assigned Manager');
  readonly cancelOrderButton = this.uniqueElement.locator('#cancel-order');
  readonly reopenOrderButton = this.uniqueElement.locator('#reopen-order');
  readonly refreshOrderButton = this.uniqueElement.locator('#refresh-order');
  readonly orderStatusBarContainer = this.page.locator('#order-status-bar-container');
  private readonly orderBarSelector = '#order-status-bar-container';
  readonly orderStatus = this.orderStatusBarContainer
    .locator('div:has(span.fw-bold:has-text("Order Status")) > span')
    .nth(1);
  readonly totalPrice = this.uniqueElement.locator(
    `${this.orderBarSelector}>:nth-child(${OrderBarOption.TotalPrice}) >.text-primary`,
  );
  readonly deliveryDate = this.uniqueElement.locator(
    `${this.orderBarSelector}>:nth-child(${OrderBarOption.DeliveryDate}) >.text-primary`,
  );
  readonly createdOn = this.uniqueElement.locator(
    `${this.orderBarSelector}>:nth-child(${OrderBarOption.CreatedOn}) >.text-primary`,
  );
  readonly assignedManagerLink = this.uniqueElement.locator('#assigned-manager-link');

  @logStep('Get Title Order Details')
  async getTitle() {
    return await this.title.innerText();
  }

  @logStep('Get Order Number from Order Details header')
  async getOrderNumber() {
    return await this.orderNumber.innerText();
  }

  @logStep('Get Assigned Manager name from Order Details header')
  async getAssignedManagerName() {
    if (await this.assignedManagerLink.isVisible()) {
      return await this.assignedManagerLink.innerText();
    }
    return await this.assignedManager.innerText();
  }

  @logStep('Get Order Status name from Order Details header')
  async getOrderStatus() {
    return await this.orderStatus.innerText();
  }

  @logStep('Get Total Price name from Order Details header')
  async getTotalPrice() {
    return await this.totalPrice.innerText();
  }

  @logStep('Get Delivery Date name from Order Details header')
  async getDeliveryDate() {
    return await this.deliveryDate.innerText();
  }

  @logStep('Get CreatedOn Date name from Order Details header')
  async getCreatedOn() {
    return await this.createdOn.innerText();
  }

  @logStep('Click Assign Manager button in Order Details header')
  async clickEditAssigned() {
    expect.soft(this.assignedManager).toBeVisible();
    expect.soft(this.assignedManager).toBeEnabled();
    await this.assignedManager.click();
  }

  @logStep('Click Remove Assigned Manager button in Order Details header')
  async clickRemoveAssigned() {
    expect.soft(this.removeAssignedButton).toBeVisible();
    expect.soft(this.removeAssignedButton).toBeEnabled();
    await this.removeAssignedButton.click();
  }

  @logStep('Click Cancel Order Button in Order Details header')
  async clickCancelOrder() {
    expect.soft(this.cancelOrderButton).toBeVisible();
    expect.soft(this.cancelOrderButton).toBeEnabled();
    await this.cancelOrderButton.click();
  }

  @logStep('Click Reopen Order Button in Order Details header')
  async clickReopenOrder() {
    expect.soft(this.reopenOrderButton).toBeVisible();
    expect.soft(this.reopenOrderButton).toBeEnabled();
    await this.reopenOrderButton.click();
  }

  @logStep('Click Refresh Order Button in Order Details header')
  async clickRefreshOrder() {
    expect.soft(this.refreshOrderButton).toBeVisible();
    expect.soft(this.refreshOrderButton).toBeEnabled();
    await this.refreshOrderButton.click();
  }
}

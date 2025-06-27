import { Tab } from './tab.page';
import { Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { IDelivery } from 'types/orders.type';
import { DeliveryDetail } from 'types/deliveryDetails.types';
import { DELIVERY_CONDITIONS } from 'data/orders/orders.data';
import { COUNTRIES } from 'data/customers/countries.data';

export class DeliverTab extends Tab {
  readonly uniqueElement = this.page.locator('#delivery');
  readonly deliveryButton = this.uniqueElement.locator('#delivery-btn');
  deliveryDetailValue(label: DeliveryDetail): Locator {
    return this.page.locator(`.c-details:has(span:has-text("${label}")) span.s-span`).nth(1);
  }

  @logStep('Click Delivery button')
  async clickDeliveryButton(): Promise<void> {
    await this.deliveryButton.click();
  }

  async getDeliveryButtonText(): Promise<string> {
    return (await this.deliveryButton.textContent()) || '';
  }

  @logStep('Get Delivery Information')
  async getDeliveryDetails(): Promise<IDelivery> {
    const [country, city, street, house, flat, finalDate, condition] = await Promise.all([
      this.deliveryDetailValue('Country').innerText(),
      this.deliveryDetailValue('City').innerText(),
      this.deliveryDetailValue('Street').innerText(),
      this.deliveryDetailValue('House').innerText(),
      this.deliveryDetailValue('Flat').innerText(),
      this.deliveryDetailValue('Delivery Date').innerText(),
      this.deliveryDetailValue('Delivery Type').innerText(),
    ]);
    return {
      address: {
        country: country as COUNTRIES,
        city,
        street,
        house: +house,
        flat: +flat,
      },
      finalDate,
      condition: condition as DELIVERY_CONDITIONS,
    };
  }
}

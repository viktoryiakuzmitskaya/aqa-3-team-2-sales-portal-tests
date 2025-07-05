import { expect, Locator } from '@playwright/test';
import { COUNTRIES } from 'data/customers/countries.data';
import {
  DataInEditDeliveryModal,
  DeliveryDataPickerMonths,
  DeliveryLocation,
  DeliveryType,
} from 'types/deliveryDetails.types';
import { Modal } from 'ui/pages/modals/modal.page';
import { getRandromEnumValue } from 'utils/enum.utils';
import { logStep } from 'utils/reporter.utils';

export abstract class DeliveryModal extends Modal {
  readonly uniqueElement: Locator = this.page.locator('#delivery-container');
  readonly title = this.uniqueElement.locator('#title');
  readonly deliveryType = this.uniqueElement.locator('#inputType');

  readonly dateInput = this.uniqueElement.locator('#date-input');
  readonly dataPickerContainer = this.uniqueElement.locator('.datepicker');
  readonly dataPickerDays = this.dataPickerContainer.locator(
    ' .datepicker-days > .table-condensed',
  );
  readonly dataPickerDaysTr = this.dataPickerDays.locator(' tbody tr');
  readonly dataPickerDaysTd = this.dataPickerDaysTr.locator(' .day');
  readonly selectDay = async (day: string) =>
    await this.dataPickerDaysTr
      .filter({ has: this.dataPickerDaysTr.getByText(day) })
      .locator(' .day')
      .click();

  readonly dataPickerMonths = this.dataPickerContainer.locator(
    ' .datepicker-months > .table-condensed',
  );
  readonly dataPickerMonthHeaderClick = async () =>
    await this.dataPickerMonths.locator(' thead :nth-child(2) :nth-child(2)').click();
  readonly dataPickerMonthsTr = this.dataPickerMonths.locator(' tbody tr');
  readonly dataPickerMonthsTd = this.dataPickerMonthsTr.locator(' td');
  readonly selectMonth = async (month: DeliveryDataPickerMonths) =>
    await this.dataPickerMonthsTd
      .locator(' span')
      .filter({ has: this.dataPickerMonthsTd.getByText(month) })
      .click();

  readonly location = this.uniqueElement.locator('#inputLocation');
  readonly countryInput = this.uniqueElement.locator('#inputCountry');
  readonly countryOption = this.uniqueElement.locator('#selectCountry');
  readonly cityInput = this.uniqueElement.locator('#inputCity');
  readonly streetInput = this.uniqueElement.locator('#inputStreet');
  readonly houseInput = this.uniqueElement.locator('#inputHouse');
  readonly flatInput = this.uniqueElement.locator('#inputFlat');
  readonly saveButton = this.uniqueElement.locator('#save-delivery');
  readonly cancelButton = this.uniqueElement.locator('#back-to-order-details-page');

  @logStep('Select Delivery Type')
  async selectDeliveryType(value: DeliveryType) {
    await this.deliveryType.selectOption(value);
  }

  @logStep('Select Location')
  async selectLocation(value: DeliveryLocation) {
    await this.deliveryType.selectOption(value);
  }

  @logStep('Select Country')
  async selectCountryOption(value: COUNTRIES = getRandromEnumValue(COUNTRIES)) {
    await this.countryOption.selectOption(value);
  }

  @logStep('Fill Country in input')
  async fillCountry(value: string) {
    await this.countryInput.fill(value);
  }

  @logStep('Fill City in input')
  async fillCity(value: string) {
    await this.cityInput.fill(value);
  }

  @logStep('Fill Street in input')
  async fillStreet(value: string) {
    await this.streetInput.fill(value);
  }

  @logStep('Fill House in input')
  async fillHouse(value: string) {
    await this.houseInput.fill(value);
  }

  @logStep('Fill Flat in input')
  async fillFlat(value: string) {
    await this.flatInput.fill(value);
  }
  @logStep('Click on Save button')
  async clickSave() {
    await this.saveButton.click();
  }
  @logStep('Click on Cancel button')
  async clickCancel() {
    await this.cancelButton.click();
  }
  @logStep('Click on Date Picker')
  async clickDateInput() {
    await this.dateInput.click();
    expect.soft(this.dataPickerContainer).toBeVisible();
  }

  @logStep('Select data in data picker')
  async selectDate(day: string, month?: DeliveryDataPickerMonths) {
    await this.clickDateInput();
    if (month) {
      await this.dataPickerMonthHeaderClick();
      await this.selectMonth(month);
    }
    if (day) {
      await this.selectDay(day);
    }
  }

  @logStep('Fill all inputs in modal')
  async fillDeliveryInputs(Data: DataInEditDeliveryModal) {
    if (Data.day) {
      await this.selectDate(Data.day, Data.month);
    }
    if (this.countryOption) {
      await this.selectCountryOption(Data.country);
    }
    if (this.cityInput) {
      await this.fillCity(Data.city);
    }
    if (this.streetInput) {
      await this.fillStreet(Data.street);
    }
    if (this.houseInput) {
      await this.fillHouse(Data.house.toString());
    }
    if (this.flatInput) {
      await this.fillFlat(Data.flat.toString());
    }
  }
}

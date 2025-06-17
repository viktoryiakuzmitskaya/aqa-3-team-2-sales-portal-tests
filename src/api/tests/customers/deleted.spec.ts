import { ERRORS } from 'data/errorMessages';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tags';
import { expect, test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateResponse } from 'utils/notifications/validations/responseValidation';

test.describe('[API] [Customers] [DELETE]', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeAll('Create customer with smoke data and Controller', async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
  });
  test.beforeEach(async ({ customerService }) => {
    customer = await customerService.create(token);
  });
  test(
    'Should DELETE the customer by correct ID',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const response = await customerController.delete(customer._id, token);
      expect.soft(response.status).toBe(STATUS_CODES.DELETED);
      expect(response.body).toBe('');

      const response2 = await customerController.getById(customer._id, token);
      validateResponse(
        response2,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.CUSTOMER_NOT_FOUND(customer._id),
      );
    },
  );
  test(
    'Should NOT delete the customer again after it has been deleted',
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      // Удаляем первый раз
      await customerController.delete(customer._id, token);

      // Пытаемся повторно
      const secondDeleteResponse = await customerController.delete(customer._id, token);
      expect.soft(secondDeleteResponse.status).toBe(STATUS_CODES.NOT_FOUND);
    },
  );
  test(
    'Should NOT allow deletion without authorization',
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const unauthorizedToken = '';
      const response = await customerController.delete(customer._id, unauthorizedToken);
      expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    },
  );
});

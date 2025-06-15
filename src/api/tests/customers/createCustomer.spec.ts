import { validTestCases } from 'data/customers/customer-valid.data';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import {
  invalidTestCases,
  invalidTestCasesWithoutToken,
} from 'data/customers/customer-invalid.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tages';
import { expect, test } from 'fixtures';
import { validateResponse } from 'utils/notifications/validations/responseValidation';

test.describe('[API] [Customers] Create a new customer', () => {
  let token = '';
  let id = '';

  test.beforeEach(async ({ signInService }) => {
    token = await signInService.loginAsLocalUser();
    id = '';
  });

  test.afterEach(async ({ customerService }) => {
    if (id) {
      await customerService.delete(id, token);
      id = '';
    }
  });

  test.describe('Positive', () => {
    validTestCases.forEach(({ name, data }) => {
      test(
        `Should create customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customerService }) => {
          const customerResponse = await customerService.create(token, data);
          id = customerResponse._id;
        },
      );
    });
  });

  test.describe('Negative', () => {
    invalidTestCases.forEach(({ name, data, expectedError }) => {
      test(
        `Should NOT create customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
        async ({ customerController }) => {
          const response = await customerController.create(data, token);
          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, expectedError);
        },
      );
    });

    invalidTestCasesWithoutToken.forEach(({ name, token, expectedMessage }) => {
      test(
        `Should return 401 error when ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customerController }) => {
          const data = generateCustomerData();
          const response = await customerController.create(data, token);
          validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, expectedMessage);
        },
      );
    });

    test(
      'Should NOT create customer: Duplicate email',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customerController }) => {
        const customer1Data = generateCustomerData();
        const createResponse1 = await customerController.create(customer1Data, token);

        id = createResponse1.body.Customer._id;

        const customer2Data = { ...generateCustomerData(), email: customer1Data.email };
        const createResponse2 = await customerController.create(customer2Data, token);

        validateResponse(
          createResponse2,
          STATUS_CODES.CONFLICT,
          false,
          ERROR_MESSAGES.CUSTOMER_ALREADY_EXISTS(customer2Data.email),
        );
      },
    );
  });
});

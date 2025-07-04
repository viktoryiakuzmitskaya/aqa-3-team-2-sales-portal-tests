import { validTestCases } from 'data/customers/customer-valid.data';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import {
  invalidTestCases,
  invalidTestCasesWithoutToken,
} from 'data/customers/customer-invalid.data';
import { ERRORS } from 'data/errorMessages';
import { STATUS_CODES } from 'data/status.code';
import { test } from 'fixtures';
import { ICustomer } from 'types/customer.types';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';
import { baseSchema } from 'data/schemas/base.schema';
import { putCustomersSchema } from 'data/schemas/customers/update.customers.schema';
import { TAGS } from 'data/tags';

test.describe('[API] [Customers] Update the customer by ID', () => {
  let token = '';
  let id = '';
  let duplicateCustomerID = '';
  let originalData: ICustomer;

  test.beforeEach(async ({ signInService, customerService }) => {
    token = await signInService.loginAsLocalUser();
    originalData = generateCustomerData();
    const customer = await customerService.create(token, originalData);
    id = customer._id;
  });

  test.afterEach(async ({ customerService }) => {
    if (id) {
      await customerService.delete(id, token);
      id = '';
    }
    if (duplicateCustomerID) {
      await customerService.delete(duplicateCustomerID, token);
      duplicateCustomerID = '';
    }
  });

  test.describe('Positive', () => {
    validTestCases.forEach(({ name, data }) => {
      test(
        `Should update customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customerController }) => {
          const response = await customerController.update(id, { ...originalData, ...data }, token);

          validateSchema(putCustomersSchema, response.body);
          validateResponse(response, STATUS_CODES.OK, true, null);
        },
      );
    });
  });

  test.describe('Negative', () => {
    invalidTestCases.forEach(({ name, data, expectedError }) => {
      test(
        `Should NOT update customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
        async ({ customerController }) => {
          const response = await customerController.update(id, { ...originalData, ...data }, token);

          validateSchema(baseSchema, response.body);
          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, expectedError);
        },
      );
    });

    invalidTestCasesWithoutToken.forEach(({ name, token, expectedMessage }) => {
      test(
        `Should return 401 error when ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customerController }) => {
          const newData = generateCustomerData();
          const response = await customerController.update(id, newData, token);

          validateSchema(baseSchema, response.body);
          validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, expectedMessage);
        },
      );
    });

    test(
      'Should NOT update customer: Duplicate email',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customerController, customerService }) => {
        const duplicateData = generateCustomerData();
        const duplicateCustomer = await customerService.create(token, duplicateData);
        duplicateCustomerID = duplicateCustomer._id;

        const response = await customerController.update(
          id,
          { ...originalData, email: duplicateData.email },
          token,
        );

        validateSchema(baseSchema, response.body);
        validateResponse(
          response,
          STATUS_CODES.CONFLICT,
          false,
          ERRORS.CUSTOMER_ALREADY_EXISTS(duplicateData.email),
        );
      },
    );

    test(
      'Should NOT update customer: ID of non-existent customer',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customerController, customerService }) => {
        const data = generateCustomerData();
        const tempCustomer = await customerService.create(token, data);
        const deletedID = tempCustomer._id;

        await customerController.delete(deletedID, token);

        const response = await customerController.update(deletedID, generateCustomerData(), token);

        validateSchema(baseSchema, response.body);
        validateResponse(
          response,
          STATUS_CODES.NOT_FOUND,
          false,
          ERRORS.CUSTOMER_NOT_FOUND(deletedID),
        );
      },
    );
  });
});

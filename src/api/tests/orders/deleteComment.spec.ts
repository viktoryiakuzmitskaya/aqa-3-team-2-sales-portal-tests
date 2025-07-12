import { invalidTestCasesWithoutToken } from 'data/customers/customer-invalid.data';
import { ERRORS } from 'data/errorMessages';
import { baseSchema } from 'data/schemas/base.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tags';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types/orders.type';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';

test.describe('[API] Delete order comment', () => {
  let token = '';
  let orderId = '';
  let commentId = '';
  let order: IOrderFromResponse;
  test.beforeEach(async ({ signInService, orderService }) => {
    token = await signInService.loginAsLocalUser();
    order = await orderService.createDraftOrder(token);
    await orderService.postComment(order._id, token);
    const orderDetails = await orderService.getByID(order._id, token);
    order = orderDetails;
    orderId = order._id;
    commentId = order.comments[0]._id;
  });

  test.afterEach(async ({ orderService }) => {
    await orderService.fullDelete(orderId, token);
  });

  test.describe('Positive cases', () => {
    test(
      'Successful comment deletion',
      { tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE] },
      async ({ orderController }) => {
        const deleteResponse = await orderController.deleteComment(orderId, commentId, token);

        expect(deleteResponse.status).toBe(STATUS_CODES.DELETED);
        expect.soft(deleteResponse.body).toBe('');

        const orderAfterDelete = await orderController.getByIdOrder(orderId, token);
        const commentExists = orderAfterDelete.body.Order.comments.some(
          (c: { _id: string }) => c._id === commentId,
        );
        expect(commentExists).toBeFalsy();
      },
    );
  });

  test.describe('Negative cases', () => {
    test(
      'Delete non-existent comment',
      { tag: [TAGS.API, TAGS.ORDER, TAGS.REGRESSION] },
      async ({ orderController }) => {
        const fakeCommentId = generateUniqueId();
        const response = await orderController.deleteComment(orderId, fakeCommentId, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERRORS.COMMENT_NOT_FOUND);
      },
    );

    test(
      'Delete comment from non-existent order',
      { tag: [TAGS.API, TAGS.ORDER, TAGS.REGRESSION] },
      async ({ orderController }) => {
        const nonExistentOrderId = generateUniqueId();
        const response = await orderController.deleteComment(nonExistentOrderId, commentId, token);

        validateResponse(
          response,
          STATUS_CODES.NOT_FOUND,
          false,
          ERRORS.ORDER_NOT_FOUND(nonExistentOrderId),
        );
      },
    );

    invalidTestCasesWithoutToken.forEach(({ name, token, expectedMessage }) => {
      test(
        `Should return 401 error when ${name}`,
        { tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ orderController }) => {
          const response = await orderController.deleteComment(orderId, commentId, token);
          validateSchema(baseSchema, response.body);
          validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, expectedMessage);
        },
      );
    });
  });
});

import { invalidTestCasesWithoutToken } from 'data/customers/customer-invalid.data';
import { ERRORS } from 'data/errorMessages';
import { commentTestData } from 'data/orders/addCommentCases.data';
import { generateCommentText } from 'data/orders/genereteComment.data';
import { baseSchema } from 'data/schemas/base.schema';
import { orderSchema } from 'data/schemas/orders/order.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tags';
import { expect, test } from 'fixtures';
import { IComment, IOrderFromResponse } from 'types/orders.type';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';

test.describe('[API] [Orders] Add Comment', () => {
  let token = '';
  let orderId = '';
  let order: IOrderFromResponse;

  test.beforeEach(async ({ signInService, orderService }) => {
    token = await signInService.loginAsLocalUser();
    order = await orderService.createDraftOrder(token);
    orderId = order._id;
  });

  test.afterEach(async ({ orderService }) => {
    await orderService.fullDelete(orderId, token);
  });

  test.describe('Positive', () => {
    test(
      'Should create a comment with all valid data (token, orderId, comment string)',
      {
        tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
      },
      async ({ orderService }) => {
        const commentText = generateCommentText();

        const orderWithComment = await orderService.postComment(order._id, token, commentText);
        console.log(orderWithComment);

        validateSchema(orderSchema, orderWithComment);

        const createdComment = orderWithComment.comments.find(
          (comment) => comment.text === commentText,
        );

        expect.soft(createdComment?.text).toMatch(commentText);
      },
    );
  });

  test.describe('Negative', () => {
    commentTestData.forEach(({ testName, body, expectedError }) => {
      test(
        `Should NOT create comment ${testName}`,
        { tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ orderController }) => {
          const response = await orderController.postComment(order._id, body as IComment, token);

          validateSchema(baseSchema, response.body);
          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, expectedError);
        },
      );
    });

    invalidTestCasesWithoutToken.forEach(({ name, token, expectedMessage }) => {
      test(
        `Should return 401 error when ${name}`,
        { tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ orderController }) => {
          const commentText = generateCommentText();
          const orderWithCommentResponse = await orderController.postComment(
            orderId,
            { comment: commentText },
            token,
          );

          validateSchema(baseSchema, orderWithCommentResponse.body);
          validateResponse(
            orderWithCommentResponse,
            STATUS_CODES.UNAUTHORIZED,
            false,
            expectedMessage,
          );
        },
      );
    });

    test(
      'Should not create a comment with orderId invalid (non existing)',
      {
        tag: [TAGS.API, TAGS.ORDER, TAGS.REGRESSION],
      },
      async ({ orderController }) => {
        const commentText = generateCommentText();
        const invalidOrderId = generateUniqueId();

        const orderWithCommentResponse = await orderController.postComment(
          invalidOrderId,
          { comment: commentText },
          token,
        );

        validateResponse(
          orderWithCommentResponse,
          STATUS_CODES.NOT_FOUND,
          false,
          ERRORS.ORDER_NOT_FOUND(invalidOrderId),
        );
        validateSchema(baseSchema, orderWithCommentResponse.body);
      },
    );
  });
});

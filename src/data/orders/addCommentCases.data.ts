export const commentTestData = [
  {
    testName: 'A comment with >250 characters long',
    body: {
      comment: 't'.repeat(251),
    },
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    testName: 'A comment with comment field as empty string',
    body: {
      comment: '',
    },
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
  {
    testName: 'A comment with comment property missing (empty object sending)',
    body: {},
    expectedError: 'Incorrect request body',
    isSuccess: false,
  },
];

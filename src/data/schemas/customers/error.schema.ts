
const apiCustomersError = {
    type: "object",
    properties: {
        IsSuccess: {
            type: "boolean",
          },
          ErrorMessage: {
            type: ["string", "null"],
          },
    },
    required: ["IsSuccess", "ErrorMessage",],
};

export { apiCustomersError }
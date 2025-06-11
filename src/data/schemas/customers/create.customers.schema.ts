import { COUNTRIES } from "data/customers/countries.data";

const postCustomerSchema = {
    type: "object",
    properties: {
      IsSuccess: {
        type: "boolean",
      },
      ErrorMessage: {
        type: ["string", "null"],
      },
      Customer: {
        type: "object",
        properties: {
          email: { type: "string" },
          name : { type: "string" },
          country: {
            type: "array",
            items: {
              type: "string",
              enum: [...Object.values(COUNTRIES)],
            },
          },
          city: { type: "string" },
          street: { type: "string" },
          house: { type: "number" },
          flat: { type: "number" },
          phone: { type: "string" },
          createdOn: { type: "string" },
          notes: { type: "string" },
          _id: { type: "string" },
        },
        required: [
          "email",
          "name",
          "country",
          "city",
          "street",
          "house",
          "flat",
          "phone",
          "createdOn",
        ],
      },
    },
    required: ["IsSuccess", "ErrorMessage", "Customer"],
};

export { postCustomerSchema }

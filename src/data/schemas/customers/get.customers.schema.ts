import { COUNTRIES } from "data/customers/countries.data";

const getCustomersSchema = {
  type: "object",
  properties: {
    Customers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
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
    total: {
      type: "number",
    },
    page: {
      type: "number",
    },
    limit: {
      type: ["number", "null"],
    },
    search: {
      type: "string",
    },
    country: {
      type: "array",
    },
    sorting: {
      type: "object",
      properties: {
        sortField: {
          type: "string",
        },
        sortOrder: {
          type: "string",
        },
      },
      required: ["sortField", "sortOrder"],
    },
    IsSuccess: {
      type: "boolean",
    },
    ErrorMessage: {
      type: ["string", "null"],
    },
  },
  required: [
    "Customers",
    "total",
    "page",
    "limit",
    "search",
    "country",
    "sorting",
    "IsSuccess",
    "ErrorMessage",
  ],
};

export { getCustomersSchema }
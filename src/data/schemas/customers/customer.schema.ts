import { COUNTRIES } from "data/customers/countries.data"

const customerSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    name : { type: "string" },
    country: {
      type: "object",
      enum: Object.values(COUNTRIES),
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
};

export { customerSchema }
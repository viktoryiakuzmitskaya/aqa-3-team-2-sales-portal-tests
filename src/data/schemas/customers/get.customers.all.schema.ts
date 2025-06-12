import { COUNTRIES } from "data/customers/countries.data";
import { baseSchema } from "../base.schema";
import { customerSchema } from "./customer.schema"

const getCustomerSchemaAll = {
    type: "object",
    properties: {
...baseSchema,
Customer: customerSchema,
    },
    required: ["IsSuccess", "ErrorMessage", "Customer"],
};

export { getCustomerSchemaAll }
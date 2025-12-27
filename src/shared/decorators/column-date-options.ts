import { ColumnOptions } from "typeorm";
import columnDateType from "./column-date-type";
import columnDateTransformer from "./column-date-transformer";

export default (type: string): ColumnOptions => ({
  type: columnDateType(type),
  transformer: columnDateTransformer(type)
})
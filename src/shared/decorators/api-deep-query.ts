import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, getSchemaPath } from "@nestjs/swagger";

export function ApiDeepQuery(name: string, type: new() => any) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiQuery({
      name: name,
      required: false,
      style: 'deepObject',
      explode: true,
      type: type,
      schema: {
        $ref: getSchemaPath(type)
      }
    })
  );
}
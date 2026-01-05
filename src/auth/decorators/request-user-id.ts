import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.requestUserId;
  },
);

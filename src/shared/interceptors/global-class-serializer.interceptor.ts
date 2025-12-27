import { ClassSerializerInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GlobalClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(reflector: Reflector) {
    super(reflector, { excludeExtraneousValues: true });
  }

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return super.intercept(context, next);
  }
}
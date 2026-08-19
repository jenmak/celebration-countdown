import { ResponseMessageKey } from '@common/decorators/metadata/response-message.decorator'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response {
  statusCode: number
  message?: string
  data?: object
}

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<
  T,
  Response
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const responseMessage =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? ''

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: responseMessage,
      })),
    )
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const request = context.switchToHttp().getRequest()
    const path = request?.route?.path
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`[${request.method}] ${path}... ${Date.now() - now}ms`),
        ),
      )
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Check if the response contains an array of users
        if (Array.isArray(data) && data.length > 0 && data[0].user) {
          // Remove sensitive information from each user object in the array
          data = data.map((item) => {
            const { id, username } = item.user;
            item.user = { id, username };
            return item;
          });
        }
        return data;
      }),
    );
  }
}

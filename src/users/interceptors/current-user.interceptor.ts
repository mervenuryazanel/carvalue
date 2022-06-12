import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service'; // to find the user that we care about now

@Injectable() //for DI
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) { } //for DI

    async intercept(
        context: ExecutionContext, //like a wrapper around the incoming request
        handler: CallHandler // a reference to actual route handler that is going to run
    ) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user; //now we can have access to the current user inside current-user.decorator.ts
        }

        return handler.handle(); // go ahead and run the actual route handler
    }
}

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (
        data: never, context:ExecutionContext //it is like wrapper around the incoming request
    ) => {

        const request = context.switchToHttp().getRequest(); //now we can accesss the session object
        // console.log(request.session.userId);
        // return ('hi there!');
        //now after implementing current-user.interceptor.ts we can access the current user inside of the request

        console.log(request.currentUser);
        return request.currentUser;
    }
);
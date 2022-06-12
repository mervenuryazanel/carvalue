import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (
        data: any,
        context:ExecutionContext //it is like wrapper around the incoming request
    ) => {

        return ('hi there!');
    }
);
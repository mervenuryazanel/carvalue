import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass } from "class-transformer";

// import { UserDto } from "src/users/dtos/user.dto";

interface ClassConstructor {  // to check if the dto parameter is a class or not ---Serialize(dto : ClassConstructor)---
    new (...args: any[]): {}
}

export function Serialize(dto : ClassConstructor) {
    return UseInterceptors(new SerializerInterceptor(dto));
}
export class SerializerInterceptor implements NestInterceptor{
    constructor(private dto: any) {
        
    }

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        // //Run something before a request is handled by the request handler
        // console.log("I am running before the handler", context);


        return handler.handle().pipe(
            map((data: any) => { //data is the data that we are going to sent out in the outgoing response
                // //Run something before the response is sent out  
                // console.log("I am running before the response is sent out ", data);
                return plainToClass(
                    this.dto,
                    data,
                    { excludeExtraneousValues: true } //this makes visible properties that just have @Expose decorater in the user.dto.ts
                );
            })
        )
    }
}
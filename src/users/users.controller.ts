import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Query,
    Delete,
    NotFoundException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Session
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import { UsersService } from './users.service';

import { SerializerInterceptor } from '../interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

import { AuthService } from './auth.service';

import { CurrentUser } from './decorators/current-user.decorator';

// @Controller('users')
@Controller('auth')
@Serialize(UserDto) //our new custom serializer //Use whenever you want to format outgoing responses

export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    // @Get('/colors/:color')
    // setColor(@Param('color') color:string, @Session() session: any) { //here we are receiving color and updating session object
    //     session.color = color;


    // }

    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }

    // @Post('/signup')
    // createUser(@Body() body: CreateUserDto) {
    //     // console.log(body);

    //     return this.authService.signUp(body.email, body.password);
    // }

    // @Post('/signin')
    // signInUser(@Body() body: CreateUserDto) {

    //     return this.authService.signIn(body.email, body.password);
    // }


   
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // console.log(body);

        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signInUser(@Body() body: CreateUserDto, @Session() session: any) {

        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        console.log(user);

        return user;
        
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     if (!session.userId) {
    //         throw new NotFoundException('there is no signed user');
    //     }
    //     return this.userService.findOne(session.userId); //if the user has already signed in retun user id and email
    // }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: string) {
        return user;
    }

    
    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }


    // @UseInterceptors(ClassSerializerInterceptor) //to hide password
    // @UseInterceptors(new SerializerInterceptor(UserDto)) //to hide password
    // @Serialize(UserDto) //our new custom serializer
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log("handler is running...");
        const user = await this.userService.findOne(+id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;

    }

    @Get('/:email')
    async findUserByEmail(@Param('email') email: string) {
        console.log("handler is running...");
        const user = await this.userService.findOne(+email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;

    }


    // @Get('/')
    // find() {
    //     return  'asdasd'
    // }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(+id, body);
    }


}

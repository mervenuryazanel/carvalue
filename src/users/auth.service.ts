import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService{
    constructor(private usersService: UsersService) { }
    
    async signUp(email: string, password: string) {

        //CHECK IF THE EMAIL IS ALREADY IN USE
        const users = this.usersService.find(email);

        if ((await users).length) {
            throw new BadRequestException('Email is already in use');
        }

        //HASH THE USERS PASSWORD
        //generate a salt
        const salt = randomBytes(8).toString('hex'); //each character of random bytes turn into two charachters while being converted to hex
        
        //Hast the salt and the password together
        const hash = await scrypt(password, salt, 32) as Buffer; // we add "as Buffer" in order to typscript understand type of the hash

        //Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');
        //Create a new user and save it
        const user = await this.usersService.create(email, result);

        //return the user
        return user;


    }

    async signIn(email: string, password: string) {
        //CHECK IF THE EMAIL IS EXIST IN THE DATABASE

        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('The user can not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;

        if (storedHash!== hash.toString('hex')) {
            return new BadRequestException('password not correct');
        } 
        
        return user;


    }
}
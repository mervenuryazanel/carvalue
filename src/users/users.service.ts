import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    // repo: Repository<User>
    // constructor(repo: Repository<User>) {
    //     this.repo = repo;
    // }

    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }


    async create(email: string, password: string) {



        const user =  this.repo.create({ email, password });

        return await this.repo.save(user);
    }


    async findOne(id: number) {

        console.log(id);
        if (!id) {
            return null;
        }
        return await this.repo.findOne({
            where: {
                id: id
            }
        });

    }


    async find(email: string) {
        return await this.repo.find({ where: { email: email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        Object.assign(user, attrs);

        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return this.repo.remove(user)
    }


}

import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Exclude } from "class-transformer";


@Entity()
export class User{ //actually it is User Entity Class (name is optional)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude() //to not to return the password back //now we can use Interceptor instead of exclude
    password: string

    @AfterInsert()
    logInsert() {
        console.log("Inserted user with id: ", this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log("Updated user with id: ", this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log("Removed user with id: ", this.id);

    }
    
    
}
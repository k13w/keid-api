import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @Length(10, 100)
    email: string;

    @Column()
    @Length(8, 60)
    password: string;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    ValidadeEncryptedPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
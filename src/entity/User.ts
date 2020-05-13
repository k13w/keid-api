import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import bcrypt from "bcryptjs";
import { Files } from './Files';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

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

    @OneToMany(type => Files, files => files.user_id)
    files: Files[];

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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Files {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column()
    key: string;

    @Column()
    url: string;

    @ManyToOne(type => User, user => user.files)
    user_id: User;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
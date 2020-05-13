import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
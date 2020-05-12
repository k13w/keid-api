import {MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity/User";

export class CreateAdminUser1584045596684 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.email = "admin@cygni.com";
        user.username = "admin";
        user.password = "admin";
        user.hashPassword();
        user.role = "admnistrator";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}

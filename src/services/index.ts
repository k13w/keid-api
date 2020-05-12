import { getRepository } from "typeorm";
import { User } from '../entity/User';

export default {
    createUser(payload) {
        return getRepository(User).save(payload)
    }
}
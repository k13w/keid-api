import { Request, Response } from "express";
import { getRepository } from 'typeorm';

import { User } from "../entity/User";
import { Files } from '../entity/Files';

class UploadController {
    static uploadFiles = async (req: Request, res: Response) => {

        const { user_id } = req.params;
        const { originalname: name, size, key, location: url = '' } = req.file;

        console.log(user_id)

        const userRepository = getRepository(User);
        const fileRepository = getRepository(Files);

        const findUser = userRepository.findOneOrFail(user_id);

        if (!findUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        let file = new Files();
        file.name = name,
        file.size = size,
        file.key = key,
        file.url = url,
        file.user_id = user_id,

        file = await fileRepository.save(file);

        return res.json(file)
    };

    static files = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        //Get files from database
        const filesRepository = getRepository(Files);
        const files = await filesRepository.find({  
            relations: ["user_id"],
            where: { user_id: user_id } 
        });
        //Send the users object
        res.send(files);
    }
}

export default UploadController;
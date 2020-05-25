import { Request, Response } from "express";
import { getRepository } from 'typeorm';

import { User } from "../entity/User";
import { Boxes } from '../entity/Boxes';
import { Files } from '../entity/Files';

class FileController {
    static uploadFiles = async (req: Request, res: Response) => {

        const { user_id, box_id } = req.params;

        console.log(user_id)
        const { originalname: name, size, key, location: url = '' } = req.file;

        const userRepository = getRepository(User);
        const boxRepository = getRepository(Boxes);
        const fileRepository = getRepository(Files);

        const findUser = userRepository.findOneOrFail(user_id);
        const findBox = boxRepository.findOneOrFail(box_id);

        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!findBox) {
            return res.status(404).json({ error: 'Box not found' });
        }

        let file = new Files();
        file.name = name,
        file.size = size,
        file.key = key,
        file.url = url,
        file.user_id = user_id,
        file.box_id = box_id

        file = await fileRepository.save(file);

        req.io.sockets.in(box_id).emit('file', file);

        return res.json(file)
    };

    static filesUser = async (req: Request, res: Response) => {
        const { user_id } = req.params;

        //Get files from database
        const filesRepository = getRepository(Files);
        const files = await filesRepository.find({  
            relations: ["user_id", "box_id"],
            where: { user_id: user_id } 
        });
        //Send the users object
        res.send(files);
    }

    static filesInBox = async (req: Request, res: Response) => {
        const { box_id } = req.params;

        //Get files from database
        const filesRepository = getRepository(Files);
        const files = await filesRepository.find({  
            relations: ["box_id"],
            where: { box_id: box_id } 
        });
        //Send the users object
        res.send(files);
    }
}

export default FileController;
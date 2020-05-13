import { Request, Response } from "express";
import { getRepository } from 'typeorm';

import { Files } from '../entity/Files';

import B2 from 'backblaze-b2';

class UploadController {
    static files = async (req: Request, res: Response) => {
        
        const { originalname: name, size, key, location: url = '' } = req.file;

        console.log(key)

        const fileRepository = getRepository(Files);

        let file = new Files();
        file.name = name,
        file.size = size,
        file.key = key,
        file.url = url,
            
        file = await fileRepository.save(file);

        return res.json(file)
    };
}

export default UploadController;
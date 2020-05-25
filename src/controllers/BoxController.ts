import { Request, Response } from "express";
import { getRepository } from 'typeorm';

import { Boxes } from '../entity/Boxes';

class BoxController {
    static NewBox = async (req: Request, res: Response) => {

        const { user_id } = req.params;

        const boxRepository = getRepository(Boxes);

        let box = new Boxes();
        box.name = req.body.name;
        box.user_id = user_id;

        box = await boxRepository.save(box);

        return res.json(box)
    };

    static boxes = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        console.log(user_id)
        //Get files from database
        const boxesRepository = getRepository(Boxes);
        const boxes = await boxesRepository.find({  
            relations: ["user_id"],
            where: { user_id: user_id } 
        });
        //Send the users object
        res.send(boxes);
    }
}

export default BoxController;
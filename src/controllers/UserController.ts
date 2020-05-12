import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
          select: ["id", "email", "username", "role"]
        });
      
        //Send the users object
        res.send(users);
      };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: string = req.params.id;
      
        //Get the user from database
        const userRepository = getRepository(User);
        try {
          const user = await userRepository.findOneOrFail(id, {
            select: ["id", "email", "username", "role"] //We dont want to send the password on response
          });
        } catch (error) {
          res.status(404).send({ error: "User not found"} );
        }
      };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { email, username, password, role } = req.body;

        let user = new User();
        user.email = email;
        user.username = username;
        user.password = password;
        user.role = role;

        //Hash the password, to securely store on DB
        user.hashPassword();
      
        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        try {

            const userAlreadyExist = await userRepository.findOne({
                where: { 
                    email: req.body.email
            }})

            if (userAlreadyExist) {
                return res.status(409).send({ error: "email already in use" });
            }
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ error: "username already in use" });
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({ success: "User created with success!" });
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
      
        //Get values from the body
        const { email, username, role } = req.body;
      
        //Try to find user on database
        const userRepository = getRepository(User);
        let user;

        try {
          user = await userRepository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send({ error: "User not found" });
          return;
        }

        //Validate the new values on model
        email.email = email;
        user.username = username;
        user.role = role;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (err) {
            res.status(409).send({ error: "username already in use" });
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
        };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
          
        const userRepository = getRepository(User);
        let user: User;
            
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        userRepository.delete(id);
          
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({ ok: 'deleted' });
    };
}

export default UserController;
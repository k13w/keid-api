import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/jwt";

class AuthController {
  static sessions = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send({ error: 'email or password invalid!' });
    }
    //Get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { email } });
      console.log(user.password)
    } catch (error) {
      res.status(401).send({ error: 'Email dont search in our database!' });
    }

    //Check if encrypted password match
    if (!user.ValidadeEncryptedPassword(password)) {
      res.status(401).send({ error: 'password dont match!' });
      return;
    }

    const token = jwt.sign({
      userId: user.id, username: user.username
    }, config.secret, { expiresIn: '1h' });

    res.send({ user, token });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(401).send({ error: 'password invalid!' });
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (err) {
      res.status(401).send({ error: 'Dont search user in our database!' });
    }

    //Check if old password matchs
    if (!user.ValidadeEncryptedPassword(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send({ success: 'password change with success!' });
  };
}

export default AuthController;
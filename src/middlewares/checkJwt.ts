import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import authConfig from '../config/jwt';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    
    const token = <string>req.headers.authorization;

    let jwtPayload;

    try {
        jwtPayload = await promisify(jwt.verify)(token, authConfig.secret);

        res.locals.jwtPayload = jwtPayload;

    } catch (err) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ error: 'Token invalid' });
    }

    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};
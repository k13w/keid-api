import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config/jwt';

export const checkJwt =  (req: Request, res: Response, next: NextFunction) => {
    
    const token = <string>req.headers['auth'];
    let jwtPayload;
    

    try {
        jwtPayload = jwt.verify(token, config.secret);
        res.locals.jwtPayload = jwtPayload;
    } catch (err) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ error: 'token invalid' });
    }

    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.secret, {
        expiresIn: config.expiresIn
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};
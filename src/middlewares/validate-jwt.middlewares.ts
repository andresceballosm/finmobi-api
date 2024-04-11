import { TITLE_ERROR } from "../constants/messages.constants";
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { User } from '../models/user.model'; 

export const validateJWT = async (req: any, res: any, next: NextFunction) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            error: true,
            message: {
            title: TITLE_ERROR,
            message: 'Missing token'
            },
            response: null
        });
    }

    try {
        const { uid }: any = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                error: true,
                message: {
                title: TITLE_ERROR,
                message: 'Token invalid - user not exist in the DB'
                },
                response: null
            });
        }

        if (!user.active) {
            return res.status(401).json({
                error: true,
                message: {
                title: TITLE_ERROR,
                message: 'Token invalid - user unavailable'
                },
                response: null
            }); 
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            message: {
                title: TITLE_ERROR,
                message: 'Token invalid'
            },
            response: null
        }); 
    }
};
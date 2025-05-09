import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);
        if (error || error === null) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            })
            return
        }
        next();
    };
};

export const validateRequestForQuery = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.query);
        if (error || error === null) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            })
            return
        }
        next();
    };
};
import {body, validationResult} from "express-validator";
import { Request, Response, NextFunction } from 'express';

export const returnBookValidationRules = () => [
    body('score').not().isEmpty().withMessage('Score is required').isFloat({
        min: 1,
        max: 10
    }).withMessage('Score must be between 1 and 10.')
];

export const validateBorrow = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createUserValidationRules = () => [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
];

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

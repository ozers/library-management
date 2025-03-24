import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createBookValidationRules = () => [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters')
];

export const getBookValidationRules = () => [
    param('id')
        .isInt()
        .withMessage('Book ID must be an integer')
];

export const validateBookRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

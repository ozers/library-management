import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const borrowBookValidationRules = () => [
    param('userId').isInt().withMessage('User ID must be an integer'),
    param('bookId').isInt().withMessage('Book ID must be an integer')
];

export const returnBookValidationRules = () => [
    param('userId').isInt().withMessage('User ID must be an integer'),
    param('bookId').isInt().withMessage('Book ID must be an integer'),
    body('score')
        .isFloat({ min: 1, max: 10 })
        .withMessage('Score must be between 1 and 10')
];

export const validateBorrowRequest = (
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
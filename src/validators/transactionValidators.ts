import { param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const transactionValidationRules = () => [
    param('id')
        .isInt()
        .withMessage('Transaction ID must be an integer')
];

export const userTransactionsValidationRules = () => [
    param('userId')
        .isInt()
        .withMessage('User ID must be an integer')
];

export const validateTransactionRequest = (
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
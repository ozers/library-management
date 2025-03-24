import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transactionService';
import { NotFoundError, BusinessLogicError } from '../utils/errors';

export const getUserTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        
        if (isNaN(userId)) {
            throw new BusinessLogicError('Invalid user ID');
        }

        const transactions = await transactionService.findUserTransactions(userId);
        if (!transactions.length) {
            throw new NotFoundError('Transactions for this user');
        }

        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

export const getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const transactionId = Number(req.params.id);
        
        if (isNaN(transactionId)) {
            throw new BusinessLogicError('Invalid transaction ID');
        }

        const transaction = await transactionService.findTransactionById(transactionId);
        if (!transaction) {
            throw new NotFoundError('Transaction');
        }

        res.json(transaction);
    } catch (error) {
        next(error);
    }
}; 
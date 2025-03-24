import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        const transactions = await transactionService.findUserTransactions(userId);
        if (!transactions.length) {
            res.status(404).json({ message: 'No transactions found for this user' });
            return;
        }

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({
            message: 'Failed to retrieve transactions',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactionId = Number(req.params.id);
        
        if (isNaN(transactionId)) {
            res.status(400).json({ message: 'Invalid transaction ID' });
            return;
        }

        const transaction = await transactionService.findTransactionById(transactionId);
        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            message: 'Failed to retrieve transaction',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 
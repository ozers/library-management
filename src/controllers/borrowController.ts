import { Request, Response, NextFunction } from 'express';
import * as borrowService from '../services/borrowService';
import { BusinessLogicError } from '../utils/errors';

export const borrowBook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);

        if (isNaN(userId) || isNaN(bookId)) {
            throw new BusinessLogicError('Invalid user ID or book ID');
        }

        const result = await borrowService.borrowBook(userId, bookId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const returnBook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);
        const score = Number(req.body.score);

        if (isNaN(userId) || isNaN(bookId) || isNaN(score)) {
            throw new BusinessLogicError('Invalid user ID, book ID, or score');
        }

        if (score < 1 || score > 10) {
            throw new BusinessLogicError('Score must be between 1 and 10');
        }

        const result = await borrowService.returnBook(userId, bookId, score);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

import { Request, Response } from 'express';
import * as borrowService from '../services/borrowService';

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);

        if (isNaN(userId) || isNaN(bookId)) {
            res.status(400).json({ message: 'Invalid user ID or book ID' });
            return;
        }

        const result = await borrowService.borrowBook(userId, bookId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(error instanceof Error && error.message.includes('not available') ? 400 : 500)
            .json({ 
                message: "Failed to borrow book",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
    }
};

export const returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);
        const score = Number(req.body.score);

        if (isNaN(userId) || isNaN(bookId) || isNaN(score)) {
            res.status(400).json({ message: 'Invalid user ID, book ID, or score' });
            return;
        }

        const result = await borrowService.returnBook(userId, bookId, score);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(error instanceof Error && 
            (error.message.includes('already been returned') || 
             error.message.includes('No borrowing record found')) ? 400 : 500)
            .json({ 
                message: "Failed to return book",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
    }
};

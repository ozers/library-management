import { Request, Response } from 'express';
import { borrowService } from '../services/borrowService';

export const borrowBook = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    try {
        const result = await borrowService.borrowBook(parseInt(userId), parseInt(bookId));
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to borrow book", error: error.message });
    }
};

export const returnBook = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    const { score } = req.body;
    try {
        const result = await borrowService.returnBook(parseInt(userId), parseInt(bookId), score);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to return book", error: error.message });
    }
};

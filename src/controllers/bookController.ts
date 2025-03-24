import { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/bookService';
import { NotFoundError, BusinessLogicError } from '../utils/errors';

export const getAllBooks = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const books = await bookService.findAllBooks();
        if (!books.length) {
            throw new NotFoundError('Books');
        }
        res.json(books);
    } catch (error) {
        next(error);
    }
};

export const getBookById = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        if (isNaN(bookId)) {
            throw new BusinessLogicError('Invalid book ID');
        }

        const book = await bookService.findBookById(bookId);
        if (!book) {
            throw new NotFoundError('Book');
        }
        res.json(book);
    } catch (error) {
        next(error);
    }
};

export const createBook = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const { name } = req.body;
        const newBook = await bookService.createBook({ name });
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
};

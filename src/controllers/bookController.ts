import { Request, Response } from 'express';
import { bookService } from '../services/bookService';

export const bookController = {
    getAllBooks: async (req: Request, res: Response) => {
        const books = await bookService.findAll();
        res.json(books);
    },
    getBookById: async (req: Request, res: Response) => {
        const book = await bookService.findById(Number(req.params.id));
        res.json(book);
    },
    addBook: async (req: Request, res: Response) => {
        const newBook = await bookService.add(req.body);
        res.status(201).json(newBook);
    }
};

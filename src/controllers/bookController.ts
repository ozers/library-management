import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { Book } from "../models/book";

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await bookService.findAllBooks();
        if (!books.length) {
            res.status(404).json({ message: 'No books found.' });
            return;
        }
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Failed to retrieve books' });
    }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        if (isNaN(bookId)) {
            res.status(400).json({ message: 'Invalid book ID' });
            return;
        }

        const book = await bookService.findBookById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Failed to retrieve book' });
    }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const newBook = await bookService.createBook({ name });
        res.status(201).json(newBook);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Book name must be unique.' });
            return;
        }
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Failed to create book' });
    }
};

import {Request, Response} from 'express';
import {bookService} from '../services/bookService';
import {Book} from "../models/book";

export const bookController = {
    getAllBooks: async (req: Request, res: Response) => {
        try {
            const books = await bookService.findAll();
            if (!books) {
                return res.status(404).json({message: 'No books found.'});
            }
            res.json(books);
        } catch (error: any) {
            console.error('Error fetching books:', error);
            res.status(500).json({message: 'Failed to retrieve books', error: error.message});
        }
    },

    getBookById: async (req: Request, res: Response) => {
        try {
            const book: Book | null = await bookService.findById(Number(req.params.id));
            if (!book) {
                return res.status(404).json({message: 'No books found for this ID'});
            }

            res.json(book);
        } catch (error: any) {
            console.error('Error fetching book:', error);
            res.status(500).json({message: 'Failed to retrieve book', error: error.message});

        }
    },

    addBook: async (req: Request, res: Response) => {
        console.log(req.body)
        try {
            const {name} = req.body;
            const newBook: Book = await bookService.add({name})

            res.status(201).json(newBook);
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({message: 'Book name must be unique.'});
            }

            return res.status(500).json({message: 'Failed to create book.', error: error.message});
        }
    }
};

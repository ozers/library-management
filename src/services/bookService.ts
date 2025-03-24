import { Book, BookModel, BookCreationAttributes } from "../models/book";
import { Transaction } from "sequelize";

export const createBook = async (bookData: BookCreationAttributes): Promise<Book> => {
    const book = await BookModel.create(bookData);
    return book.toJSON() as Book;
};

export const calculateBookRating = (
    newRating: number,
    averageRating: number,
    borrowCount: number
): number => {
    if (borrowCount === 0) return newRating;

    const totalRating = averageRating * borrowCount;
    const newTotalRating = totalRating + newRating;

    return newTotalRating / (borrowCount + 1);
};

export const findAllBooks = async (): Promise<Book[]> => {
    const books = await BookModel.findAll();
    return books.map(book => book.toJSON() as Book);
};

export const findBookById = async (
    id: number,
    transaction?: Transaction
): Promise<Book | null> => {
    const book = await BookModel.findByPk(id, { transaction });
    return book ? book.toJSON() as Book : null;
};

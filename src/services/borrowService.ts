import {Book} from "../models/book";
import sequelize from '../config/database';
import {bookService} from "./bookService";
import {transactionService} from "./transactionService";
import {Transaction} from "../models/transaction";

export const borrowService = {
    borrowBook: async (userId: number, bookId: number) => {
        return sequelize.transaction(async (t) => {
            const book: Book | null = await bookService.findById(bookId);

            if (!book || !book.available) {
                throw new Error('Book is not available for borrowing');
            }

            book.available = false;
            await book.save({transaction: t});

            const transactionRecord: Transaction = await transactionService.createBorrowTransaction({
                userId,
                bookId,
                borrowDate: new Date(),
                returnDate: null,
                status: 'borrowed',
                rating: null
            }, t);

            return {message: "Book borrowed successfully", transactionRecord};
        }).catch(error => {
            console.log(error)
            throw new Error('Failed to borrow book: ' + error.message);
        });
    },

    returnBook: async (userId: number, bookId: number, score: number) => {
        return sequelize.transaction(async (t) => {
            const transaction: Transaction | null = await transactionService.findTransactionByBookAndUser(bookId, userId, t);
            if (!transaction) {
                throw new Error('No borrowing record found for this book and user');
            }

            if (transaction.returnDate) {
                throw new Error('This book has already been returned');
            }

            transaction.returnDate = new Date();
            transaction.status = 'returned';
            transaction.rating = score;
            await transaction.save({transaction: t});

            const book: Book | null = await bookService.findById(bookId, t);
            if (!book) {
                throw new Error('Book not found');
            }

            const currentAverageRating = book.averageRating ?? 0;

            book.averageRating = bookService.calculateRating(score, currentAverageRating, book.borrowCount);
            book.borrowCount = (book.borrowCount) + 1;
            book.available = true;
            await book.save({transaction: t});

            return {message: "Book returned successfully", transaction};
        }).catch(error => {
            throw new Error('Failed to return book: ' + error.message);
        });
    }
};

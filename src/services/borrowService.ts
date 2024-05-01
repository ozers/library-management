import {Book} from "../models/book";
import sequelize from '../config/database';
import {bookService} from "./bookService";
import {transactionService} from "./transactionService";

export const borrowService = {
    borrowBook: async (userId: number, bookId: number) => {
        return sequelize.transaction(async (t) => {
            const book: Book | null = await bookService.findById(bookId);

            if (!book || !book.available) {
                throw new Error('Book is not available for borrowing');
            }

            // Mark the book as not available
            book.available = false;
            await book.save({transaction: t});

            // Create a transaction record
            const transactionRecord = await transactionService.createBorrowTransaction({
                userId,
                bookId,
                borrowDate: new Date(),  // Current date/time as borrow date
                returnDate: null,        // No return date initially
                status: 'borrowed',      // Initial status is 'borrowed'
                rating: null             // No rating initially
            }, t);  // Pass the transaction object to ensure it's part of this transaction

            return {message: "Book borrowed successfully", transactionRecord};
        }).catch(error => {
            console.log(error)
            throw new Error('Failed to borrow book: ' + error.message);
        });
    },

    returnBook: async (userId: number, bookId: number, score: number) => {
        return sequelize.transaction(async (t) => {
            // Find the transaction
            const transaction = await transactionService.findTransactionByBookAndUser(bookId, userId, t);
            if (!transaction) {
                throw new Error('No borrowing record found for this book and user');
            }

            // Check if the book is already returned
            if (transaction.returnDate) {
                throw new Error('This book has already been returned');
            }

            // Update the transaction
            transaction.returnDate = new Date(); // Set the current date as the return date
            transaction.status = 'returned';
            transaction.rating = score; // Set the provided score as the rating
            await transaction.save({ transaction: t });

            // Update the book's availability
            const book = await bookService.findById(bookId, t);
            if (!book) {
                throw new Error('Book not found');
            }
            book.available = true;
            await book.save({ transaction: t });

            return { message: "Book returned successfully", transaction };
        }).catch(error => {
            throw new Error('Failed to return book: ' + error.message);
        });
    }
};

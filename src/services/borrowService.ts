import { Transaction, TransactionModel, TransactionCreationAttributes } from "../models/transaction";
import { BookModel } from "../models/book";
import sequelize from '../config/database';
import { Transaction as SequelizeTransaction } from 'sequelize';
import * as bookService from "./bookService";
import * as validator from "../validators/borrowValidator";

export interface BorrowResult {
    message: string;
    transaction: Transaction;
}

export const findTransactionByBookAndUser = async (
    bookId: number,
    userId: number,
    transaction?: SequelizeTransaction
): Promise<Transaction | null> => {
    validator.validateId(bookId, 'Book');
    validator.validateId(userId, 'User');

    const result = await TransactionModel.findOne({
        where: {
            bookId,
            userId,
            returnDate: null
        },
        transaction
    });
    return result ? result.toJSON() as Transaction : null;
};

export const borrowBook = async (
    userId: number,
    bookId: number
): Promise<BorrowResult> => {
    try {
        validator.validateId(userId, 'User');
        validator.validateId(bookId, 'Book');

        return await sequelize.transaction(async (t) => {
            const book = await bookService.findBookById(bookId, t);

            if (!book || !book.available) {
                throw new Error('Book is not available for borrowing');
            }

            validator.validateBookData(book);

            await BookModel.update(
                { available: false },
                { where: { id: bookId }, transaction: t }
            );

            const transactionData: TransactionCreationAttributes = {
                userId,
                bookId,
                borrowDate: new Date(),
                returnDate: null,
                status: 'borrowed',
                rating: null
            };

            const transactionRecord = await TransactionModel.create(transactionData, { transaction: t });
            const transactionJson = transactionRecord.toJSON() as Transaction;
            validator.validateTransactionData(transactionJson);

            return {
                message: "Book borrowed successfully",
                transaction: transactionJson
            };
        });
    } catch (error) {
        throw new Error(`Failed to borrow book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const returnBook = async (
    userId: number,
    bookId: number,
    score: number
): Promise<BorrowResult> => {
    try {
        validator.validateId(userId, 'User');
        validator.validateId(bookId, 'Book');
        validator.validateRating(score);

        return await sequelize.transaction(async (t) => {
            const transaction = await findTransactionByBookAndUser(bookId, userId, t);
            if (!transaction) {
                throw new Error('No borrowing record found for this book and user');
            }

            if (transaction.returnDate) {
                throw new Error('This book has already been returned');
            }

            validator.validateTransactionData(transaction);

            await TransactionModel.update(
                {
                    returnDate: new Date(),
                    status: 'returned',
                    rating: score
                },
                {
                    where: { id: transaction.id },
                    transaction: t
                }
            );

            const book = await bookService.findBookById(bookId, t);
            if (!book) {
                throw new Error('Book not found');
            }

            validator.validateBookData(book);

            const currentAverageRating = book.averageRating ?? 0;
            const newRating = bookService.calculateBookRating(score, currentAverageRating, book.borrowCount);

            await BookModel.update(
                {
                    averageRating: newRating,
                    borrowCount: book.borrowCount + 1
                },
                { where: { id: bookId }, transaction: t }
            );

            const updatedTransaction = await TransactionModel.findByPk(transaction.id, { transaction: t });
            if (!updatedTransaction) {
                throw new Error('Failed to retrieve updated transaction');
            }

            const updatedTransactionJson = updatedTransaction.toJSON() as Transaction;
            validator.validateTransactionData(updatedTransactionJson);

            return {
                message: "Book returned successfully",
                transaction: updatedTransactionJson
            };
        });
    } catch (error) {
        throw new Error(`Failed to return book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

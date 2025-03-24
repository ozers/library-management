import { Book } from "../models/book";
import { Transaction } from "../models/transaction";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validateId = (id: number, name: string): void => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError(`${name} ID must be a positive integer`);
    }
};

export const validateRating = (rating: number): void => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ValidationError('Rating must be an integer between 1 and 5');
    }
};

export const validateTransactionStatus = (status: string): void => {
    if (!['borrowed', 'returned'].includes(status)) {
        throw new ValidationError('Invalid transaction status');
    }
};

export const validateBookData = (book: Book): void => {
    if (typeof book.averageRating !== 'number' && book.averageRating !== undefined) {
        throw new ValidationError('Invalid book average rating type');
    }
    if (typeof book.borrowCount !== 'number') {
        throw new ValidationError('Invalid book borrow count type');
    }
};

export const validateTransactionData = (transaction: Transaction): void => {
    validateTransactionStatus(transaction.status);
    if (transaction.returnDate !== null && typeof transaction.returnDate !== 'object') {
        throw new ValidationError('Invalid return date type');
    }
}; 
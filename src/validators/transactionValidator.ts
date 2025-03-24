import { Transaction, TransactionStatus } from "../models/transaction";
import { ValidationError } from "./borrowValidator";

export const validateCreateTransactionParams = (params: {
    userId: number;
    bookId: number;
    borrowDate?: Date;
    returnDate?: Date | null;
    status?: TransactionStatus;
    rating?: number | null;
}): void => {
    validateId(params.userId, 'User');
    validateId(params.bookId, 'Book');
    
    if (params.borrowDate && !(params.borrowDate instanceof Date)) {
        throw new ValidationError('Invalid borrow date type');
    }

    if (params.returnDate && !(params.returnDate instanceof Date)) {
        throw new ValidationError('Invalid return date type');
    }

    if (params.status) {
        validateTransactionStatus(params.status);
    }

    if (params.rating !== undefined && params.rating !== null) {
        validateRating(params.rating);
    }
};

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

export const validateUpdateTransactionData = (data: Partial<Transaction>): void => {
    if (data.userId !== undefined) {
        validateId(data.userId, 'User');
    }
    
    if (data.bookId !== undefined) {
        validateId(data.bookId, 'Book');
    }

    if (data.borrowDate !== undefined && !(data.borrowDate instanceof Date)) {
        throw new ValidationError('Invalid borrow date type');
    }

    if (data.returnDate !== undefined && data.returnDate !== null && !(data.returnDate instanceof Date)) {
        throw new ValidationError('Invalid return date type');
    }

    if (data.status !== undefined) {
        validateTransactionStatus(data.status);
    }

    if (data.rating !== undefined && data.rating !== null) {
        validateRating(data.rating);
    }
}; 
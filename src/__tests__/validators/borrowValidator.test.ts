import * as validator from '../../validators/borrowValidator';
import { ValidationError } from '../../validators/borrowValidator';
import { Book } from '../../models/book';
import { Transaction } from '../../models/transaction';

describe('BorrowValidator', () => {
    describe('ValidationError', () => {
        it('should create error with correct name and message', () => {
            const error = new validator.ValidationError('Test error');
            expect(error.name).toBe('ValidationError');
            expect(error.message).toBe('Test error');
        });

        it('should be instance of Error', () => {
            const error = new ValidationError('Test error');
            expect(error).toBeInstanceOf(Error);
        });

        it('should be caught in try-catch block', () => {
            expect(() => {
                try {
                    throw new ValidationError('Test error');
                } catch (error) {
                    if (error instanceof ValidationError) {
                        throw error;
                    }
                }
            }).toThrow(ValidationError);
        });
    });

    describe('validateId', () => {
        it('should not throw for valid ID', () => {
            expect(() => validator.validateId(1, 'Test')).not.toThrow();
            expect(() => validator.validateId(100, 'Test')).not.toThrow();
        });

        it('should throw for non-positive ID', () => {
            expect(() => validator.validateId(0, 'Test')).toThrow('Test ID must be a positive integer');
            expect(() => validator.validateId(-1, 'Test')).toThrow('Test ID must be a positive integer');
        });

        it('should throw for non-integer ID', () => {
            expect(() => validator.validateId(1.5, 'Test')).toThrow('Test ID must be a positive integer');
        });
    });

    describe('validateRating', () => {
        it('should not throw for valid rating', () => {
            [1, 2, 3, 4, 5].forEach(rating => {
                expect(() => validator.validateRating(rating)).not.toThrow();
            });
        });

        it('should throw for out of range rating', () => {
            expect(() => validator.validateRating(0)).toThrow('Rating must be an integer between 1 and 5');
            expect(() => validator.validateRating(6)).toThrow('Rating must be an integer between 1 and 5');
        });

        it('should throw for non-integer rating', () => {
            expect(() => validator.validateRating(3.5)).toThrow('Rating must be an integer between 1 and 5');
        });
    });

    describe('validateTransactionStatus', () => {
        it('should not throw for valid status', () => {
            expect(() => validator.validateTransactionStatus('borrowed')).not.toThrow();
            expect(() => validator.validateTransactionStatus('returned')).not.toThrow();
        });

        it('should throw for invalid status', () => {
            expect(() => validator.validateTransactionStatus('invalid')).toThrow('Invalid transaction status');
            expect(() => validator.validateTransactionStatus('')).toThrow('Invalid transaction status');
        });
    });

    describe('validateBookData', () => {
        const validBook: Book = {
            id: 1,
            name: 'Test Book',
            available: true,
            borrowCount: 0,
            averageRating: 0
        };

        it('should not throw for valid book data', () => {
            expect(() => validator.validateBookData(validBook)).not.toThrow();
            expect(() => validator.validateBookData({ ...validBook, averageRating: undefined })).not.toThrow();
        });

        it('should throw for invalid average rating type', () => {
            expect(() => validator.validateBookData({
                ...validBook,
                averageRating: '4.5' as any
            })).toThrow('Invalid book average rating type');
        });

        it('should throw for invalid borrow count type', () => {
            expect(() => validator.validateBookData({
                ...validBook,
                borrowCount: '0' as any
            })).toThrow('Invalid book borrow count type');
        });
    });

    describe('validateTransactionData', () => {
        const validTransaction: Transaction = {
            id: 1,
            userId: 1,
            bookId: 1,
            borrowDate: new Date(),
            returnDate: null,
            status: 'borrowed',
            rating: null
        };

        it('should not throw for valid transaction data', () => {
            expect(() => validator.validateTransactionData(validTransaction)).not.toThrow();
            expect(() => validator.validateTransactionData({
                ...validTransaction,
                returnDate: new Date(),
                status: 'returned'
            })).not.toThrow();
        });

        it('should throw for invalid status', () => {
            expect(() => validator.validateTransactionData({
                ...validTransaction,
                status: 'invalid' as any
            })).toThrow('Invalid transaction status');
        });

        it('should throw for invalid return date type', () => {
            expect(() => validator.validateTransactionData({
                ...validTransaction,
                returnDate: 'invalid' as any
            })).toThrow('Invalid return date type');
        });
    });
}); 
import * as validator from '../../validators/transactionValidator';
import { Transaction } from '../../models/transaction';

describe('TransactionValidator', () => {
    describe('validateCreateTransactionParams', () => {
        const validParams = {
            userId: 1,
            bookId: 1,
            borrowDate: new Date(),
            returnDate: null,
            status: 'borrowed' as const,
            rating: null
        };

        it('should not throw for valid params', () => {
            expect(() => validator.validateCreateTransactionParams(validParams)).not.toThrow();
        });

        it('should throw for invalid user ID', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                userId: -1
            })).toThrow('User ID must be a positive integer');
        });

        it('should throw for invalid book ID', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                bookId: 0
            })).toThrow('Book ID must be a positive integer');
        });

        it('should throw for invalid borrow date', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                borrowDate: 'invalid' as any
            })).toThrow('Invalid borrow date type');
        });

        it('should throw for invalid return date', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                returnDate: 'invalid' as any
            })).toThrow('Invalid return date type');
        });

        it('should throw for invalid status', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                status: 'invalid' as any
            })).toThrow('Invalid transaction status');
        });

        it('should throw for invalid rating', () => {
            expect(() => validator.validateCreateTransactionParams({
                ...validParams,
                rating: 6
            })).toThrow('Rating must be an integer between 1 and 5');
        });
    });

    describe('validateUpdateTransactionData', () => {
        it('should not throw for valid data', () => {
            const validData: Partial<Transaction> = {
                status: 'returned',
                returnDate: new Date(),
                rating: 5
            };
            expect(() => validator.validateUpdateTransactionData(validData)).not.toThrow();
        });

        it('should throw for invalid user ID', () => {
            expect(() => validator.validateUpdateTransactionData({
                userId: -1
            })).toThrow('User ID must be a positive integer');
        });

        it('should throw for invalid book ID', () => {
            expect(() => validator.validateUpdateTransactionData({
                bookId: 0
            })).toThrow('Book ID must be a positive integer');
        });

        it('should throw for invalid borrow date', () => {
            expect(() => validator.validateUpdateTransactionData({
                borrowDate: 'invalid' as any
            })).toThrow('Invalid borrow date type');
        });

        it('should throw for invalid return date', () => {
            expect(() => validator.validateUpdateTransactionData({
                returnDate: 'invalid' as any
            })).toThrow('Invalid return date type');
        });

        it('should throw for invalid status', () => {
            expect(() => validator.validateUpdateTransactionData({
                status: 'invalid' as any
            })).toThrow('Invalid transaction status');
        });

        it('should throw for invalid rating', () => {
            expect(() => validator.validateUpdateTransactionData({
                rating: 6
            })).toThrow('Rating must be an integer between 1 and 5');
        });

        it('should handle empty update data', () => {
            expect(() => validator.validateUpdateTransactionData({})).not.toThrow();
        });
    });

    describe('validateId', () => {
        it('should not throw for valid ID', () => {
            expect(() => validator.validateId(1, 'Test')).not.toThrow();
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
}); 
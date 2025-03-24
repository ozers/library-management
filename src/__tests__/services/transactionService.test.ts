import { Transaction as SequelizeTransaction } from 'sequelize';
import { Transaction, TransactionModel } from '../../models/transaction';
import * as transactionService from '../../services/transactionService';
import * as transactionValidator from '../../validators/transactionValidator';

type TransactionStatus = 'borrowed' | 'returned';

// Mock dependencies
jest.mock('../../models/transaction', () => ({
  TransactionModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('../../models/book', () => ({
  BookModel: {
    findByPk: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../../models/user', () => ({
  UserModel: {
    findByPk: jest.fn()
  }
}));

jest.mock('../../validators/transactionValidator');

jest.mock('../../models/transaction');
jest.mock('../../validators/transactionValidator', () => ({
    validateCreateTransactionParams: jest.fn(),
    validateId: jest.fn(),
    validateUpdateTransactionData: jest.fn()
}));

const mockDBTransaction = {} as SequelizeTransaction;
const FIXED_DATE = new Date('2024-01-01');

const mockTransaction: Transaction = {
    id: 1,
    userId: 1,
    bookId: 1,
    borrowDate: new Date(),
    returnDate: null,
    status: 'borrowed' as TransactionStatus,
    rating: null
};

describe('TransactionService', () => {
    let realDate: DateConstructor;

    beforeAll(() => {
        realDate = global.Date;
        global.Date = class extends Date {
            constructor(date?: string | number | Date) {
                if (date) {
                    super(date);
                } else {
                    super(FIXED_DATE);
                }
            }
        } as DateConstructor;
    });

    afterAll(() => {
        global.Date = realDate;
    });

    describe('createTransaction', () => {
        const validParams = {
            userId: 1,
            bookId: 1,
            borrowDate: new Date(),
            returnDate: null,
            status: 'borrowed' as TransactionStatus,
            rating: null
        };

        it('should create a transaction successfully', async () => {
            const params = {
                userId: 1,
                bookId: 1,
                borrowDate: new Date(),
                returnDate: null,
                status: 'borrowed' as TransactionStatus,
                rating: null
            };

            const mockResult = {
                toJSON: () => ({
                    id: 1,
                    ...params
                } as Transaction)
            };

            (TransactionModel.create as jest.Mock).mockResolvedValueOnce(mockResult);

            const result = await transactionService.createTransaction(params, mockDBTransaction);

            expect(TransactionModel.create).toHaveBeenCalledWith(params, { transaction: mockDBTransaction });
            expect(result).toEqual({
                id: 1,
                ...params
            });
        });

        it('should use default values when not provided', async () => {
            const mockResult = {
                toJSON: () => ({
                    id: 1,
                    userId: validParams.userId,
                    bookId: validParams.bookId,
                    borrowDate: FIXED_DATE,
                    returnDate: null,
                    status: 'borrowed' as TransactionStatus,
                    rating: null
                } as Transaction)
            };

            (TransactionModel.create as jest.Mock).mockResolvedValueOnce(mockResult);

            const result = await transactionService.createTransaction(validParams, mockDBTransaction);

            expect(TransactionModel.create).toHaveBeenCalledWith({
                ...validParams,
                borrowDate: FIXED_DATE,
                returnDate: null,
                status: 'borrowed' as TransactionStatus,
                rating: null
            }, { transaction: mockDBTransaction });

            expect(result).toEqual({
                id: 1,
                ...validParams,
                borrowDate: FIXED_DATE,
                returnDate: null,
                status: 'borrowed' as TransactionStatus,
                rating: null
            });
        });

        it('should handle all falsy values for borrowDate and status', async () => {
            const falsyValues = [undefined, null, false, 0, ''];
            
            for (const falsyValue of falsyValues) {
                const params = {
                    ...validParams,
                    borrowDate: falsyValue as any,
                    status: falsyValue as any
                };

                const mockResult = {
                    toJSON: () => ({
                        id: 1,
                        ...validParams,
                        borrowDate: FIXED_DATE,
                        returnDate: null,
                        status: 'borrowed' as TransactionStatus,
                        rating: null
                    } as Transaction)
                };

                (TransactionModel.create as jest.Mock).mockResolvedValueOnce(mockResult);

                const result = await transactionService.createTransaction(params, mockDBTransaction);

                expect(TransactionModel.create).toHaveBeenCalledWith({
                    ...validParams,
                    borrowDate: FIXED_DATE,
                    returnDate: null,
                    status: 'borrowed' as TransactionStatus,
                    rating: null
                }, { transaction: mockDBTransaction });

                expect(result).toEqual({
                    id: 1,
                    ...validParams,
                    borrowDate: FIXED_DATE,
                    returnDate: null,
                    status: 'borrowed' as TransactionStatus,
                    rating: null
                });
            }
        });

        it('should handle database errors', async () => {
            (TransactionModel.create as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

            await expect(transactionService.createTransaction(validParams, mockDBTransaction))
                .rejects
                .toThrow('Failed to create transaction: DB Error');

            expect(TransactionModel.create).toHaveBeenCalledWith({
                ...validParams,
                borrowDate: FIXED_DATE,
                returnDate: null,
                status: 'borrowed' as TransactionStatus,
                rating: null
            }, { transaction: mockDBTransaction });
        });

        it('should handle non-Error database errors', async () => {
            (TransactionModel.create as jest.Mock).mockRejectedValueOnce('DB Error');

            await expect(transactionService.createTransaction(validParams, mockDBTransaction))
                .rejects
                .toThrow('Failed to create transaction: Unknown error');
        });

        it('should handle null database errors', async () => {
            (TransactionModel.create as jest.Mock).mockRejectedValueOnce(null);

            await expect(transactionService.createTransaction(validParams, mockDBTransaction))
                .rejects
                .toThrow('Failed to create transaction: Unknown error');
        });

        it('should use provided returnDate and rating', async () => {
            const returnDate = new Date('2024-02-01');
            const params = {
                userId: 1,
                bookId: 1,
                returnDate,
                rating: 5
            };

            const mockResult = {
                toJSON: () => ({
                    id: 1,
                    ...params,
                    borrowDate: FIXED_DATE,
                    status: 'borrowed' as TransactionStatus
                } as Transaction)
            };

            (TransactionModel.create as jest.Mock).mockResolvedValueOnce(mockResult);

            const result = await transactionService.createTransaction(params, mockDBTransaction);

            expect(TransactionModel.create).toHaveBeenCalledWith({
                ...params,
                borrowDate: FIXED_DATE,
                status: 'borrowed' as TransactionStatus
            }, { transaction: mockDBTransaction });

            expect(result).toEqual({
                id: 1,
                ...params,
                borrowDate: FIXED_DATE,
                status: 'borrowed' as TransactionStatus
            });
        });
    });

    describe('findActiveTransactionByBookAndUser', () => {
        it('should find active transaction successfully', async () => {
            (TransactionModel.findOne as jest.Mock).mockResolvedValueOnce({
                toJSON: () => mockTransaction
            });

            const result = await transactionService.findActiveTransactionByBookAndUser(1, 1, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledTimes(2);
            expect(TransactionModel.findOne).toHaveBeenCalledWith({
                where: {
                    bookId: 1,
                    userId: 1,
                    status: 'borrowed' as TransactionStatus,
                    returnDate: null
                },
                transaction: mockDBTransaction
            });
            expect(result).toEqual(mockTransaction);
        });

        it('should return null when no active transaction found', async () => {
            (TransactionModel.findOne as jest.Mock).mockResolvedValueOnce(null);

            const result = await transactionService.findActiveTransactionByBookAndUser(1, 1, mockDBTransaction);

            expect(result).toBeNull();
        });

        it('should handle validation errors', async () => {
            (transactionValidator.validateId as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid ID');
            });

            await expect(transactionService.findActiveTransactionByBookAndUser(1, 1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find active transaction: Invalid ID');
        });

        it('should handle non-Error database errors', async () => {
            (TransactionModel.findOne as jest.Mock).mockRejectedValueOnce('DB Error');

            await expect(transactionService.findActiveTransactionByBookAndUser(1, 1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find active transaction: Unknown error');
        });
    });

    describe('findTransactionById', () => {
        it('should find transaction by ID successfully', async () => {
            (TransactionModel.findByPk as jest.Mock).mockResolvedValueOnce({
                toJSON: () => mockTransaction
            });

            const result = await transactionService.findTransactionById(1, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledWith(1, 'Transaction');
            expect(TransactionModel.findByPk).toHaveBeenCalledWith(1, { transaction: mockDBTransaction });
            expect(result).toEqual(mockTransaction);
        });

        it('should return null when transaction not found', async () => {
            (TransactionModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

            const result = await transactionService.findTransactionById(1, mockDBTransaction);

            expect(result).toBeNull();
        });

        it('should handle validation errors', async () => {
            (transactionValidator.validateId as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid ID');
            });

            await expect(transactionService.findTransactionById(1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find transaction: Invalid ID');
        });

        it('should handle non-Error database errors', async () => {
            (TransactionModel.findByPk as jest.Mock).mockRejectedValueOnce('DB Error');

            await expect(transactionService.findTransactionById(1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find transaction: Unknown error');
        });
    });

    describe('updateTransaction', () => {
        const updateData = {
            status: 'returned' as TransactionStatus,
            returnDate: new Date(),
            rating: 5
        };

        it('should update transaction successfully', async () => {
            (TransactionModel.update as jest.Mock).mockResolvedValueOnce([1]);
            (TransactionModel.findByPk as jest.Mock).mockResolvedValueOnce({
                toJSON: () => ({ ...mockTransaction, ...updateData })
            });

            const result = await transactionService.updateTransaction(1, updateData, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledWith(1, 'Transaction');
            expect(transactionValidator.validateUpdateTransactionData).toHaveBeenCalledWith(updateData);
            expect(TransactionModel.update).toHaveBeenCalledWith(updateData, {
                where: { id: 1 },
                transaction: mockDBTransaction
            });
            expect(result).toEqual({ ...mockTransaction, ...updateData });
        });

        it('should handle partial updates', async () => {
            const partialUpdate = { status: 'returned' as TransactionStatus };
            (TransactionModel.update as jest.Mock).mockResolvedValueOnce([1]);
            (TransactionModel.findByPk as jest.Mock).mockResolvedValueOnce({
                toJSON: () => ({ ...mockTransaction, ...partialUpdate })
            });

            const result = await transactionService.updateTransaction(1, partialUpdate, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledWith(1, 'Transaction');
            expect(transactionValidator.validateUpdateTransactionData).toHaveBeenCalledWith(partialUpdate);
            expect(TransactionModel.update).toHaveBeenCalledWith(partialUpdate, {
                where: { id: 1 },
                transaction: mockDBTransaction
            });
            expect(result).toEqual({ ...mockTransaction, ...partialUpdate });
        });

        it('should handle validation errors', async () => {
            (transactionValidator.validateId as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid ID');
            });

            await expect(transactionService.updateTransaction(1, updateData, mockDBTransaction))
                .rejects
                .toThrow('Failed to update transaction: Invalid ID');
        });

        it('should handle database errors', async () => {
            (TransactionModel.update as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

            await expect(transactionService.updateTransaction(1, updateData, mockDBTransaction))
                .rejects
                .toThrow('Failed to update transaction: DB Error');
        });

        it('should handle non-Error database errors', async () => {
            (TransactionModel.update as jest.Mock).mockRejectedValueOnce('DB Error');

            await expect(transactionService.updateTransaction(1, updateData, mockDBTransaction))
                .rejects
                .toThrow('Failed to update transaction: Unknown error');
        });

        it('should handle null database errors', async () => {
            (TransactionModel.update as jest.Mock).mockRejectedValueOnce(null);

            await expect(transactionService.updateTransaction(1, updateData, mockDBTransaction))
                .rejects
                .toThrow('Failed to update transaction: Unknown error');
        });
    });

    describe('findUserTransactions', () => {
        it('should return transactions when found', async () => {
            (TransactionModel.findAll as jest.Mock).mockResolvedValueOnce([
                { toJSON: () => mockTransaction }
            ]);

            const result = await transactionService.findUserTransactions(1, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledWith(1, 'User');
            expect(TransactionModel.findAll).toHaveBeenCalledWith({
                where: { userId: 1 },
                transaction: mockDBTransaction
            });
            expect(result).toEqual([mockTransaction]);
        });

        it('should return empty array when no transactions found', async () => {
            (TransactionModel.findAll as jest.Mock).mockResolvedValueOnce([]);

            const result = await transactionService.findUserTransactions(1, mockDBTransaction);

            expect(transactionValidator.validateId).toHaveBeenCalledWith(1, 'User');
            expect(TransactionModel.findAll).toHaveBeenCalledWith({
                where: { userId: 1 },
                transaction: mockDBTransaction
            });
            expect(result).toEqual([]);
        });

        it('should handle validation errors', async () => {
            (transactionValidator.validateId as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Invalid ID');
            });

            await expect(transactionService.findUserTransactions(1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find user transactions: Invalid ID');
        });

        it('should handle database errors', async () => {
            (TransactionModel.findAll as jest.Mock).mockRejectedValueOnce('DB Error');

            await expect(transactionService.findUserTransactions(1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find user transactions: Unknown error');
        });

        it('should handle null error', async () => {
            (TransactionModel.findAll as jest.Mock).mockRejectedValueOnce(null);

            await expect(transactionService.findUserTransactions(1, mockDBTransaction))
                .rejects
                .toThrow('Failed to find user transactions: Unknown error');
        });
    });
}); 
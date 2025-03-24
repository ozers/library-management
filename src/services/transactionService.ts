import { Transaction as DBTransaction } from 'sequelize';
import { Transaction, TransactionModel, TransactionStatus } from "../models/transaction";
import * as validator from "../validators/transactionValidator";

interface CreateTransactionParams {
    userId: number;
    bookId: number;
    borrowDate?: Date;
    returnDate?: Date | null;
    status?: TransactionStatus;
    rating?: number | null;
}

export const createTransaction = async (
    params: CreateTransactionParams,
    transaction?: DBTransaction
): Promise<Transaction> => {
    try {
        validator.validateCreateTransactionParams(params);

        const transactionData = {
            userId: params.userId,
            bookId: params.bookId,
            borrowDate: params.borrowDate ?? new Date(),
            returnDate: params.returnDate ?? null,
            status: params.status ?? 'borrowed',
            rating: params.rating ?? null
        };

        const result = await TransactionModel.create(transactionData, { transaction });
        return result.toJSON() as Transaction;
    } catch (error) {
        throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const findActiveTransactionByBookAndUser = async (
    bookId: number,
    userId: number,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
    try {
        validator.validateId(bookId, 'Book');
        validator.validateId(userId, 'User');

        const result = await TransactionModel.findOne({
            where: {
                bookId,
                userId,
                status: 'borrowed',
                returnDate: null
            },
            transaction
        });
        return result ? result.toJSON() as Transaction : null;
    } catch (error) {
        throw new Error(`Failed to find active transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const findTransactionById = async (
    id: number,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
    try {
        validator.validateId(id, 'Transaction');

        const result = await TransactionModel.findByPk(id, { transaction });
        return result ? result.toJSON() as Transaction : null;
    } catch (error) {
        throw new Error(`Failed to find transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const updateTransaction = async (
    id: number,
    data: Partial<Transaction>,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
    try {
        validator.validateId(id, 'Transaction');
        validator.validateUpdateTransactionData(data);

        await TransactionModel.update(data, {
            where: { id },
            transaction
        });

        return findTransactionById(id, transaction);
    } catch (error) {
        throw new Error(`Failed to update transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const findUserTransactions = async (
    userId: number,
    transaction?: DBTransaction
): Promise<Transaction[]> => {
    try {
        validator.validateId(userId, 'User');

        const results = await TransactionModel.findAll({
            where: { userId },
            transaction
        });
        return results.map(result => result.toJSON() as Transaction);
    } catch (error) {
        throw new Error(`Failed to find user transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

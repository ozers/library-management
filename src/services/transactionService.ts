import { Transaction as DBTransaction } from 'sequelize';
import { Transaction, TransactionModel, TransactionStatus } from "../models/transaction";

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
    const transactionData = {
        userId: params.userId,
        bookId: params.bookId,
        borrowDate: params.borrowDate || new Date(),
        returnDate: params.returnDate ?? null,
        status: params.status || 'borrowed',
        rating: params.rating ?? null
    };

    const result = await TransactionModel.create(transactionData, { transaction });
    return result.toJSON() as Transaction;
};

export const findActiveTransactionByBookAndUser = async (
    bookId: number,
    userId: number,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
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
};

export const findTransactionById = async (
    id: number,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
    const result = await TransactionModel.findByPk(id, { transaction });
    return result ? result.toJSON() as Transaction : null;
};

export const updateTransaction = async (
    id: number,
    data: Partial<Transaction>,
    transaction?: DBTransaction
): Promise<Transaction | null> => {
    await TransactionModel.update(data, {
        where: { id },
        transaction
    });

    return findTransactionById(id, transaction);
};

export const findUserTransactions = async (
    userId: number,
    transaction?: DBTransaction
): Promise<Transaction[]> => {
    const results = await TransactionModel.findAll({
        where: { userId },
        transaction
    });
    return results.map(result => result.toJSON() as Transaction);
};

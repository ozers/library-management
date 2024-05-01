import {Transaction as DBTransaction} from 'sequelize';
import {Transaction} from "../models/transaction";

interface BorrowTransactionParams {
    userId: number;
    bookId: number;
    borrowDate?: Date;
    returnDate?: Date | null;
    status?: string;
    rating?: number | null;
}

export const transactionService = {
    createBorrowTransaction: async ({
                                        userId,
                                        bookId,
                                        borrowDate = new Date(),
                                        returnDate = null,
                                        status = 'borrowed',
                                        rating = null
                                    }: BorrowTransactionParams,
                                    transaction?: DBTransaction): Promise<Transaction> => {
        return await Transaction.create({
            userId,
            bookId,
            borrowDate,
            returnDate,
            status,
            rating
        }, {transaction});
    },

    findTransactionByBookAndUser: async (bookId: number, userId: number, transaction: DBTransaction): Promise<(Transaction | null)> => {
        return await Transaction.findOne({
            where: {
                bookId: bookId,
                userId: userId,
                status: 'borrowed',
                returnDate: null  // Assuming you want to find transactions that have not been closed
            },
            transaction: transaction
        });
    }


};

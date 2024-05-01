import {Transaction as DBTransaction} from 'sequelize';
import {Transaction} from "../models/transaction";

// Define an interface for the input parameters
interface BorrowTransactionParams {
    userId: number;
    bookId: number;
    borrowDate?: Date;
    returnDate?: Date | null;
    status?: string;
    rating?: number | null;
}

export const transactionService = {
    /**
     * Creates a record in the transactions table to log the borrowing of a book.
     * @param params An object containing userId, bookId, and other transaction details.
     * @param transaction Optional Sequelize transaction object for transactional integrity.
     * @returns A Promise resolving to the created Transaction record.
     */
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

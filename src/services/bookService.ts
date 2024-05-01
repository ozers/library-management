import {Book} from "../models/book";
import {Transaction} from "sequelize";

export const bookService = {
    add: async (bookData: any) => {
        return await Book.create(bookData);
    },
    calculateRating: (newRating: number, averageRating: number, borrowCount: number): number => {
        if (borrowCount === 0) return newRating

        const totalRating = averageRating * borrowCount;
        const newTotalRating = totalRating + newRating;

        return newTotalRating / (borrowCount + 1);
    },
    findAll: async () => {
        return await Book.findAll();
    },
    findById: async (id: number, transaction?: Transaction) => {
        return await Book.findByPk(id, {transaction});
    }
};

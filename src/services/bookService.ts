import {Book} from "../models/book";
import {Transaction} from "sequelize";

export const bookService = {
    findAll: async () => {
        return await Book.findAll();
    },
    findById: async (id: number, transaction?: Transaction) => {
        return await Book.findByPk(id, {transaction});
    },
    add: async (bookData: any) => {
        return await Book.create(bookData);
    }
};

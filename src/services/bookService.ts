import {Book} from "../models/book";

export const bookService = {
    findAll: async () => {
        return await Book.findAll();
    },
    findById: async (id: number) => {
        return await Book.findByPk(id);
    },
    add: async (bookData: any) => {
        return await Book.create(bookData);
    }
};

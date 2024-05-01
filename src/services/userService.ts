import {User} from "../models/user";

export const userService = {
    findAll: async () => {
        return await User.findAll();
    },

    findById: async (id: number) => {
        return await User.findByPk(id);
    },

    add: async (userData: any) => {
        return await User.create(userData);
    }

}
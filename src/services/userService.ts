import { User, UserModel, UserCreationAttributes } from "../models/user";

export const findAllUsers = async (): Promise<User[]> => {
    const users = await UserModel.findAll();
    return users.map(user => user.toJSON() as User);
};

export const findUserById = async (id: number): Promise<User | null> => {
    const user = await UserModel.findByPk(id);
    return user ? user.toJSON() as User : null;
};

export const createUser = async (userData: UserCreationAttributes): Promise<User> => {
    const user = await UserModel.create(userData);
    return user.toJSON() as User;
};
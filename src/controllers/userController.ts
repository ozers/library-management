import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { NotFoundError, BusinessLogicError } from '../utils/errors';

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await userService.findAllUsers();
        if (!users.length) {
            throw new NotFoundError('Users');
        }
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            throw new BusinessLogicError('Invalid user ID');
        }

        const user = await userService.findUserById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email } = req.body;
        const newUser = await userService.createUser({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

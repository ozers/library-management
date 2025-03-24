import {Request, Response} from 'express';
import {User} from '../models/user';
import * as userService from '../services/userService';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.findAllUsers();
        if (!users.length) {
            res.status(404).json({message: 'No users found.'});
            return;
        }
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: 'Failed to retrieve users'});
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            res.status(400).json({message: 'Invalid user ID'});
            return;
        }

        const user = await userService.findUserById(userId);
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({message: 'Failed to retrieve user'});
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, email} = req.body;
        const newUser = await userService.createUser({name, email});
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({message: 'Email must be unique.'});
            return;
        }
        console.error('Error creating user:', error);
        res.status(500).json({message: 'Failed to create user'});
    }
};

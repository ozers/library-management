import {Request, Response} from 'express';
import {User} from '../models/user';
import {userService} from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.findAll();
        if (!users) {
            return res.status(404).json({message: 'No users found.'});
        }

        res.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: 'Failed to retrieve users', error: error.message});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user: User | null = await userService.findById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (error: any) {
        console.error('Error fetching user:', error);
        res.status(500).json({message: 'Failed to retrieve user', error: error.message});
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email} = req.body;
        const newUser = await userService.add({name, email});
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({message: 'Email must be unique.'});
        }

        res.status(500).json({message: 'Failed to create user', error: error.message});
    }
};

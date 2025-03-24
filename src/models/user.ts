import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface User {
    id: number;
    name: string;
    email: string;
}

export const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'users',
    timestamps: false
});

export type UserCreationAttributes = Omit<User, 'id'>;

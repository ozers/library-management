import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface Book {
    id: number;
    name: string;
    available: boolean;
    averageRating?: number;
    borrowCount: number;
}

export const BookModel = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: null,
        allowNull: true,
        field: 'average_rating'
    },
    borrowCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'borrow_count'
    }
}, {
    tableName: 'books',
    timestamps: false
});

export type BookCreationAttributes = Omit<Book, 'id' | 'available' | 'averageRating' | 'borrowCount'>;

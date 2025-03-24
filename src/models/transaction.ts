import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

export type TransactionStatus = 'borrowed' | 'returned';

export interface Transaction {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: Date;
    returnDate: Date | null;
    status: TransactionStatus;
    rating: number | null;
}

export const TransactionModel = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'book_id',
        references: {
            model: 'books',
            key: 'id'
        }
    },
    borrowDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'borrow_date'
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'return_date'
    },
    status: {
        type: DataTypes.ENUM('borrowed', 'returned'),
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'transactions',
    timestamps: false
});

export type TransactionCreationAttributes = Omit<Transaction, 'id'>;

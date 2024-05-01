import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database'; // Ensure your sequelize instance is imported

export class Transaction extends Model {
    public id!: number;
    public userId!: number;
    public bookId!: number;
    public borrowDate!: Date;
    public returnDate?: Date;
    public status!: string;
    public rating?: number;
}

Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {model: 'users', key: 'id'},
        field: 'user_id',
        allowNull: false
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {model: 'books', key: 'id'},
        field: 'book_id',
        allowNull: false
    },
    borrowDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'borrow_date'
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'return_date'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: false
});

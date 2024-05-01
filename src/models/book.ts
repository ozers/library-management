import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database';

export class Book extends Model {
    public id!: number;
    public name!: string;
    public available!: boolean;
    public averageRating?: number;
    public borrowCount!: number;
}

Book.init({
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
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    timestamps: false
});

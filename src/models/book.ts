import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database'; // Adjust the import path as necessary

export class Book extends Model {
    public id!: number;
    public name!: string;
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
    average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: null, // Explicitly set default as null
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Book',
    tableName: 'books', // Ensure the table name is correct
    timestamps: false   // Set to false if you do not have timestamp fields like createdAt or updatedAt
});

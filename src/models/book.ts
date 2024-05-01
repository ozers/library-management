import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Adjust the import path as necessary

export class Book extends Model {}

Book.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING(13),
        unique: true,
        allowNull: true // ISBN can be null, adjust based on your business logic
    },
    published_date: {
        type: DataTypes.DATEONLY,
        allowNull: true // Allow null if published_date can be unspecified
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

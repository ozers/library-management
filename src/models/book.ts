import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database';

export class Book extends Model {
    public id!: number;
    public name!: string;
    public available!: boolean;
    public averageRating?: number;
    // public calculateAverageRating!: () => Promise<number | null>;
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
    tableName: 'books',
    timestamps: false
});
//
// Book.prototype.calculateAverageRating = async () => {
//     const {sequelize} = this.constructor as typeof Model;
//     const result = await sequelize.models.Transaction.findAll({
//         attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
//         where: {bookId: this.id}
//     });
//     return result[0].getDataValue('avgRating');
// };

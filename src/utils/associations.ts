import { UserModel } from '../models/user';
import { BookModel } from '../models/book';
import { TransactionModel } from '../models/transaction';

export default function setupAssociations(): void {
    UserModel.hasMany(TransactionModel, { 
        foreignKey: 'userId',
        as: 'transactions'
    });
    
    TransactionModel.belongsTo(UserModel, { 
        foreignKey: 'userId',
        as: 'user'
    });

    BookModel.hasMany(TransactionModel, { 
        foreignKey: 'bookId',
        as: 'transactions'
    });
    
    TransactionModel.belongsTo(BookModel, { 
        foreignKey: 'bookId',
        as: 'book'
    });
}

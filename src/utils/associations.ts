import { User } from '../models/user';
import { Book } from '../models/book';
import { Transaction } from '../models/transaction';

export default function setupAssociations() {
    // User can have many transactions
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    // Book can have many transactions
    Book.hasMany(Transaction, { foreignKey: 'bookId' });
    Transaction.belongsTo(Book, { foreignKey: 'bookId' });
}

import { User } from '../models/user';
import { Book } from '../models/book';
import { Transaction } from '../models/transaction';

export default function setupAssociations() {
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    Book.hasMany(Transaction, { foreignKey: 'bookId' });
    Transaction.belongsTo(Book, { foreignKey: 'bookId' });
}

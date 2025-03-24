import { TransactionModel } from '../../models/transaction';
import { BookModel } from '../../models/book';
import * as bookService from '../../services/bookService';
import * as borrowService from '../../services/borrowService';
import sequelize from '../../config/database';

// Mock dependencies
jest.mock('../../models/transaction', () => ({
  TransactionModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../models/book', () => ({
  BookModel: {
    update: jest.fn(),
  },
}));

jest.mock('../../services/bookService', () => ({
  findBookById: jest.fn(),
  calculateBookRating: jest.fn(),
}));

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(),
  },
}));

// Mock findTransactionByBookAndUser
jest.spyOn(borrowService, 'findTransactionByBookAndUser');

describe('BorrowService', () => {
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockImplementation((callback) => callback(mockTransaction));
  });

  describe('findTransactionByBookAndUser', () => {
    it('should return transaction when found', async () => {
      const mockTransactionData = {
        id: 1,
        bookId: 1,
        userId: 1,
        returnDate: null,
        toJSON: () => ({
          id: 1,
          bookId: 1,
          userId: 1,
          returnDate: null,
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockTransactionData);

      const result = await borrowService.findTransactionByBookAndUser(1, 1);

      expect(TransactionModel.findOne).toHaveBeenCalledWith({
        where: {
          bookId: 1,
          userId: 1,
          returnDate: null,
        },
        transaction: undefined,
      });
      expect(result).toEqual({
        id: 1,
        bookId: 1,
        userId: 1,
        returnDate: null,
      });
    });

    it('should return null when no transaction found', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await borrowService.findTransactionByBookAndUser(1, 1);

      expect(result).toBeNull();
    });
  });

  describe('borrowBook', () => {
    const mockBook = {
      id: 1,
      name: 'Test Book',
      available: true,
      averageRating: undefined,
      borrowCount: 0,
      toJSON: () => ({ 
        id: 1, 
        name: 'Test Book',
        available: true,
        averageRating: undefined,
        borrowCount: 0
      }),
    };

    it('should borrow book successfully', async () => {
      const mockTransactionData = {
        id: 1,
        userId: 1,
        bookId: 1,
        borrowDate: new Date(),
        returnDate: null,
        status: 'borrowed',
        rating: null,
        toJSON: () => ({
          id: 1,
          userId: 1,
          bookId: 1,
          borrowDate: new Date(),
          returnDate: null,
          status: 'borrowed',
          rating: null,
        }),
      };

      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (TransactionModel.create as jest.Mock).mockResolvedValue(mockTransactionData);

      const result = await borrowService.borrowBook(1, 1);

      expect(bookService.findBookById).toHaveBeenCalledWith(1, mockTransaction);
      expect(BookModel.update).toHaveBeenCalledWith(
        { available: false },
        { where: { id: 1 }, transaction: mockTransaction }
      );
      expect(TransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          bookId: 1,
          status: 'borrowed',
          rating: null,
        }),
        { transaction: mockTransaction }
      );
      expect(result.message).toBe('Book borrowed successfully');
      expect(result.transaction).toMatchObject({
        id: 1,
        userId: 1,
        bookId: 1,
        status: 'borrowed',
        rating: null,
      });
    });

    it('should throw error when book is not available', async () => {
      const unavailableBook = { ...mockBook, available: false };
      (bookService.findBookById as jest.Mock).mockResolvedValue(unavailableBook);

      await expect(borrowService.borrowBook(1, 1)).rejects.toThrow('Book is not available for borrowing');
    });

    it('should throw error when book is not found', async () => {
      (bookService.findBookById as jest.Mock).mockResolvedValue(null);

      await expect(borrowService.borrowBook(1, 1)).rejects.toThrow('Book is not available for borrowing');
    });

    it('should handle database error during book update', async () => {
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (BookModel.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(borrowService.borrowBook(1, 1))
        .rejects.toThrow('Failed to borrow book: Database error');
    });

    it('should handle database error during transaction creation', async () => {
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (BookModel.update as jest.Mock).mockResolvedValue([1]);
      (TransactionModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(borrowService.borrowBook(1, 1))
        .rejects.toThrow('Failed to borrow book: Database error');
    });

    it('should handle invalid user ID type', async () => {
      // @ts-expect-error Testing invalid type
      await expect(borrowService.borrowBook('invalid', 1))
        .rejects.toThrow('Invalid user ID');
    });

    it('should handle invalid book ID type', async () => {
      // @ts-expect-error Testing invalid type
      await expect(borrowService.borrowBook(1, 'invalid'))
        .rejects.toThrow('Invalid book ID');
    });

    it('should handle negative user ID', async () => {
      await expect(borrowService.borrowBook(-1, 1))
        .rejects.toThrow('Failed to borrow book:');
    });

    it('should handle negative book ID', async () => {
      await expect(borrowService.borrowBook(1, -1))
        .rejects.toThrow('Failed to borrow book:');
    });

    it('should handle zero user ID', async () => {
      await expect(borrowService.borrowBook(0, 1))
        .rejects.toThrow('Failed to borrow book:');
    });

    it('should handle zero book ID', async () => {
      await expect(borrowService.borrowBook(1, 0))
        .rejects.toThrow('Failed to borrow book:');
    });

    it('should handle non-Error object in catch block', async () => {
      (bookService.findBookById as jest.Mock).mockImplementation(() => {
        throw 'Non-error object';  // Throwing a string instead of Error
      });

      await expect(borrowService.borrowBook(1, 1))
        .rejects.toThrow('Failed to borrow book: Unknown error');
    });
  });

  describe('returnBook', () => {
    const mockBook = {
      id: 1,
      available: false,
      averageRating: 4.5,
      borrowCount: 2,
      toJSON: () => ({ id: 1, available: false, averageRating: 4.5, borrowCount: 2 }),
    };

    const mockBorrowTransaction = {
      id: 1,
      userId: 1,
      bookId: 1,
      returnDate: null,
      status: 'borrowed',
      rating: null,
      toJSON: () => ({
        id: 1,
        userId: 1,
        bookId: 1,
        returnDate: null,
        status: 'borrowed',
        rating: null,
      }),
    };

    const mockUpdatedTransaction = {
      id: 1,
      userId: 1,
      bookId: 1,
      returnDate: new Date(),
      status: 'returned',
      rating: 5,
      toJSON: () => ({
        id: 1,
        userId: 1,
        bookId: 1,
        returnDate: new Date(),
        status: 'returned',
        rating: 5,
      }),
    };

    it('should return book successfully', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (bookService.calculateBookRating as jest.Mock).mockReturnValue(4.7);
      (TransactionModel.findByPk as jest.Mock).mockResolvedValue(mockUpdatedTransaction);

      const result = await borrowService.returnBook(1, 1, 5);

      expect(TransactionModel.findOne).toHaveBeenCalledWith({
        where: {
          bookId: 1,
          userId: 1,
          returnDate: null,
        },
        transaction: mockTransaction,
      });
      expect(TransactionModel.update).toHaveBeenCalledWith(
        expect.objectContaining({
          returnDate: expect.any(Date),
          status: 'returned',
          rating: 5,
        }),
        {
          where: { id: 1 },
          transaction: mockTransaction,
        }
      );
      expect(BookModel.update).toHaveBeenCalledWith(
        {
          averageRating: 4.7,
          borrowCount: 3,
          available: true,
        },
        {
          where: { id: 1 },
          transaction: mockTransaction,
        }
      );
      expect(result.message).toBe('Book returned successfully');
      expect(result.transaction).toMatchObject({
        id: 1,
        userId: 1,
        bookId: 1,
        status: 'returned',
        rating: 5,
        returnDate: expect.any(Date),
      });
    });

    it('should throw error when no borrowing record found', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(borrowService.returnBook(1, 1, 5)).rejects.toThrow('No borrowing record found for this book and user');
    });

    it('should throw error when book is already returned', async () => {
      const returnedTransaction = {
        ...mockBorrowTransaction,
        returnDate: new Date(),
        toJSON: () => ({
          ...mockBorrowTransaction.toJSON(),
          returnDate: new Date(),
        }),
      };
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(returnedTransaction);

      await expect(borrowService.returnBook(1, 1, 5)).rejects.toThrow('This book has already been returned');
    });

    it('should throw error when book is not found during return', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(null);

      await expect(borrowService.returnBook(1, 1, 5)).rejects.toThrow('Book not found');
    });

    it('should throw error when updated transaction is not found', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (bookService.calculateBookRating as jest.Mock).mockReturnValue(4.7);
      (TransactionModel.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(borrowService.returnBook(1, 1, 5)).rejects.toThrow('Failed to retrieve updated transaction');
    });

    it('should handle database error during transaction update', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (TransactionModel.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book: Database error');
    });

    it('should handle database error during book update', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (TransactionModel.update as jest.Mock).mockResolvedValue([1]);
      (BookModel.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book: Database error');
    });

    it('should handle database error during final transaction fetch', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (TransactionModel.update as jest.Mock).mockResolvedValue([1]);
      (BookModel.update as jest.Mock).mockResolvedValue([1]);
      (TransactionModel.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book: Database error');
    });

    it('should handle invalid user ID type', async () => {
      // @ts-expect-error Testing invalid type
      await expect(borrowService.returnBook('invalid', 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle invalid book ID type', async () => {
      // @ts-expect-error Testing invalid type
      await expect(borrowService.returnBook(1, 'invalid', 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle invalid rating type', async () => {
      // @ts-expect-error Testing invalid type
      await expect(borrowService.returnBook(1, 1, 'invalid'))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle negative rating', async () => {
      await expect(borrowService.returnBook(1, 1, -1))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle rating above maximum (5)', async () => {
      await expect(borrowService.returnBook(1, 1, 6))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle decimal rating', async () => {
      await expect(borrowService.returnBook(1, 1, 4.5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle transaction with invalid status', async () => {
      const invalidStatusTransaction = {
        ...mockBorrowTransaction,
        status: 'invalid_status',
        toJSON: () => ({
          ...mockBorrowTransaction.toJSON(),
          status: 'invalid_status',
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(invalidStatusTransaction);

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle book with invalid average rating type', async () => {
      const invalidBook = {
        ...mockBook,
        averageRating: 'invalid',
        toJSON: () => ({
          ...mockBook.toJSON(),
          averageRating: 'invalid',
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(invalidBook);

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle book with invalid borrow count type', async () => {
      const invalidBook = {
        ...mockBook,
        borrowCount: 'invalid',
        toJSON: () => ({
          ...mockBook.toJSON(),
          borrowCount: 'invalid',
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(invalidBook);

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle transaction with invalid return date type', async () => {
      const invalidTransaction = {
        ...mockBorrowTransaction,
        returnDate: 'invalid_date',
        toJSON: () => ({
          ...mockBorrowTransaction.toJSON(),
          returnDate: 'invalid_date',
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(invalidTransaction);

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle non-Error object in catch block', async () => {
      (TransactionModel.findOne as jest.Mock).mockImplementation(() => {
        throw 'Non-error object';  // Throwing a string instead of Error
      });

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book: Unknown error');
    });

    it('should handle transaction update with non-array result', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (TransactionModel.update as jest.Mock).mockResolvedValue(null); // Non-array result

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to return book:');
    });

    it('should handle final transaction fetch with undefined result', async () => {
      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(mockBook);
      (TransactionModel.update as jest.Mock).mockResolvedValue([1]);
      (BookModel.update as jest.Mock).mockResolvedValue([1]);
      (TransactionModel.findByPk as jest.Mock).mockResolvedValue(undefined);

      await expect(borrowService.returnBook(1, 1, 5))
        .rejects.toThrow('Failed to retrieve updated transaction');
    });

    it('should handle book with undefined average rating', async () => {
      const bookWithUndefinedRating = {
        ...mockBook,
        averageRating: undefined,
        toJSON: () => ({
          ...mockBook.toJSON(),
          averageRating: undefined,
        }),
      };

      (TransactionModel.findOne as jest.Mock).mockResolvedValue(mockBorrowTransaction);
      (bookService.findBookById as jest.Mock).mockResolvedValue(bookWithUndefinedRating);
      (bookService.calculateBookRating as jest.Mock).mockReturnValue(5);
      (TransactionModel.findByPk as jest.Mock).mockResolvedValue(mockUpdatedTransaction);

      const result = await borrowService.returnBook(1, 1, 5);
      expect(bookService.calculateBookRating).toHaveBeenCalledWith(5, 0, 2);
      expect(result.message).toBe('Book returned successfully');
    });
  });
}); 
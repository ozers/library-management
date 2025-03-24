import { Book, BookModel, BookCreationAttributes } from '../../src/models/book';
import { createBook, calculateBookRating, findAllBooks, findBookById } from '../../src/services/bookService';
import { Transaction } from 'sequelize';

// Mock BookModel
jest.mock('../../src/models/book', () => ({
  BookModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('BookService', () => {
  // Her test öncesi mock'ları sıfırla
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateBookRating', () => {
    it('should return new rating when borrow count is 0', () => {
      const newRating = 5;
      const averageRating = 0;
      const borrowCount = 0;

      const result = calculateBookRating(newRating, averageRating, borrowCount);
      expect(result).toBe(5);
    });

    it('should calculate new average rating correctly', () => {
      const newRating = 4;
      const averageRating = 3;
      const borrowCount = 2;

      // (3 * 2 + 4) / 3 = 3.33...
      const result = calculateBookRating(newRating, averageRating, borrowCount);
      expect(result).toBeCloseTo(3.33, 2);
    });

    it('should handle zero ratings correctly', () => {
      const newRating = 0;
      const averageRating = 0;
      const borrowCount = 5;

      const result = calculateBookRating(newRating, averageRating, borrowCount);
      expect(result).toBe(0);
    });
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      const mockBookData: BookCreationAttributes = {
        name: 'Test Book',
      };

      const mockBook = {
        id: 1,
        name: 'Test Book',
        available: true,
        borrowCount: 0,
        toJSON: () => ({ id: 1, name: 'Test Book', available: true, borrowCount: 0 }),
      };

      (BookModel.create as jest.Mock).mockResolvedValue(mockBook);

      const result = await createBook(mockBookData);

      expect(BookModel.create).toHaveBeenCalledWith(mockBookData);
      expect(result).toEqual({ id: 1, name: 'Test Book', available: true, borrowCount: 0 });
    });
  });

  describe('findAllBooks', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', available: true, borrowCount: 0, toJSON: () => ({ id: 1, name: 'Book 1', available: true, borrowCount: 0 }) },
        { id: 2, name: 'Book 2', available: true, borrowCount: 0, toJSON: () => ({ id: 2, name: 'Book 2', available: true, borrowCount: 0 }) },
      ];

      (BookModel.findAll as jest.Mock).mockResolvedValue(mockBooks);

      const result = await findAllBooks();

      expect(BookModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Book 1', available: true, borrowCount: 0 },
        { id: 2, name: 'Book 2', available: true, borrowCount: 0 },
      ]);
    });
  });

  describe('findBookById', () => {
    it('should return book when found', async () => {
      const mockBook = {
        id: 1,
        name: 'Test Book',
        available: true,
        borrowCount: 0,
        toJSON: () => ({ id: 1, name: 'Test Book', available: true, borrowCount: 0 }),
      };

      (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);

      const result = await findBookById(1);

      expect(BookModel.findByPk).toHaveBeenCalledWith(1, { transaction: undefined });
      expect(result).toEqual({ id: 1, name: 'Test Book', available: true, borrowCount: 0 });
    });

    it('should return null when book not found', async () => {
      (BookModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await findBookById(999);

      expect(BookModel.findByPk).toHaveBeenCalledWith(999, { transaction: undefined });
      expect(result).toBeNull();
    });

    it('should pass transaction when provided', async () => {
      const mockTransaction = {} as Transaction;
      const mockBook = {
        id: 1,
        name: 'Test Book',
        available: true,
        borrowCount: 0,
        toJSON: () => ({ id: 1, name: 'Test Book', available: true, borrowCount: 0 }),
      };

      (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);

      await findBookById(1, mockTransaction);

      expect(BookModel.findByPk).toHaveBeenCalledWith(1, { transaction: mockTransaction });
    });
  });
}); 
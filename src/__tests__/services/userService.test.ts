import { UserModel, UserCreationAttributes } from '../../models/user';
import { findAllUsers, findUserById, createUser } from '../../services/userService';

// Mock UserModel
jest.mock('../../models/user', () => ({
  UserModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('UserService', () => {
  // Her test öncesi mock'ları sıfırla
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUserData: UserCreationAttributes = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const mockUser = {
        id: 1,
        ...mockUserData,
        toJSON: () => ({ id: 1, ...mockUserData }),
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser(mockUserData);

      expect(UserModel.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual({ id: 1, ...mockUserData });
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { 
          id: 1, 
          name: 'John Doe', 
          email: 'john@example.com',
          toJSON: () => ({ id: 1, name: 'John Doe', email: 'john@example.com' }),
        },
        { 
          id: 2, 
          name: 'Jane Doe', 
          email: 'jane@example.com',
          toJSON: () => ({ id: 2, name: 'Jane Doe', email: 'jane@example.com' }),
        },
      ];

      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await findAllUsers();

      expect(UserModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ]);
    });

    it('should return empty array when no users exist', async () => {
      (UserModel.findAll as jest.Mock).mockResolvedValue([]);

      const result = await findAllUsers();

      expect(UserModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        toJSON: () => ({ id: 1, name: 'John Doe', email: 'john@example.com' }),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserById(1);

      expect(UserModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
    });

    it('should return null when user not found', async () => {
      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await findUserById(999);

      expect(UserModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
}); 
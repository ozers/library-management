import { Request, Response, NextFunction } from 'express';
import { createBookValidationRules, getBookValidationRules, validateBookRequest } from '../../src/validators/bookValidators';
import * as expressValidator from 'express-validator';

const chainedValidationMock = {
    trim: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis()
};

jest.mock('express-validator', () => ({
    body: jest.fn().mockImplementation(() => chainedValidationMock),
    param: jest.fn().mockImplementation(() => chainedValidationMock),
    validationResult: jest.fn()
}));

describe('Book Validators', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('createBookValidationRules', () => {
        it('should return validation rules array', () => {
            const rules = createBookValidationRules();
            expect(Array.isArray(rules)).toBe(true);
            expect(rules.length).toBe(1); // name
        });

        it('should include name validation rules', () => {
            createBookValidationRules();
            expect(expressValidator.body).toHaveBeenCalledWith('name');
            expect(chainedValidationMock.trim).toHaveBeenCalled();
            expect(chainedValidationMock.notEmpty).toHaveBeenCalled();
            expect(chainedValidationMock.isLength).toHaveBeenCalledWith({ min: 1, max: 255 });
            expect(chainedValidationMock.withMessage).toHaveBeenCalledWith('Name is required');
            expect(chainedValidationMock.withMessage).toHaveBeenCalledWith('Name must be between 1 and 255 characters');
        });

        it('should handle whitespace-only name values', () => {
            mockRequest.body = {
                name: '   '
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Name is required', param: 'name' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Name is required', param: 'name' }]
            });
        });

        it('should handle empty name value', () => {
            mockRequest.body = {
                name: ''
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Name is required', param: 'name' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Name is required', param: 'name' }]
            });
        });
    });

    describe('getBookValidationRules', () => {
        it('should return validation rules array', () => {
            const rules = getBookValidationRules();
            expect(Array.isArray(rules)).toBe(true);
            expect(rules.length).toBe(1); // id
        });

        it('should include id validation rules', () => {
            getBookValidationRules();
            expect(expressValidator.param).toHaveBeenCalledWith('id');
            expect(chainedValidationMock.isInt).toHaveBeenCalled();
            expect(chainedValidationMock.withMessage).toHaveBeenCalledWith('Book ID must be an integer');
        });

        it('should handle negative ID values', () => {
            mockRequest.params = {
                id: '-1'
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Book ID must be an integer', param: 'id' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Book ID must be an integer', param: 'id' }]
            });
        });

        it('should handle non-integer ID values', () => {
            mockRequest.params = {
                id: 'abc'
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Book ID must be an integer', param: 'id' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Book ID must be an integer', param: 'id' }]
            });
        });

        it('should handle missing ID parameter', () => {
            mockRequest.params = {};
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Book ID must be an integer', param: 'id' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Book ID must be an integer', param: 'id' }]
            });
        });
    });

    describe('validateBookRequest', () => {
        it('should call next() when no validation errors', () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it('should return 400 status with errors when validation fails', () => {
            const mockErrors = [
                { msg: 'Name is required', param: 'name' },
                { msg: 'Name must be between 1 and 255 characters', param: 'name' }
            ];
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => mockErrors
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: mockErrors
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should handle empty validation errors array', () => {
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => []
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateBookRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: []
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
}); 
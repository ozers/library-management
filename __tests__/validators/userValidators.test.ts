import { Request, Response, NextFunction } from 'express';
import { userValidationRules, validateUserRequest } from '../../src/validators/userValidators';
import * as expressValidator from 'express-validator';

const chainedValidationMock = {
    trim: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis()
};

jest.mock('express-validator', () => ({
    body: jest.fn().mockImplementation(() => chainedValidationMock),
    validationResult: jest.fn()
}));

describe('User Validators', () => {
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

    describe('userValidationRules', () => {
        it('should return validation rules array', () => {
            const rules = userValidationRules();
            expect(Array.isArray(rules)).toBe(true);
            expect(rules.length).toBe(2); // name and email rules
        });

        it('should include name validation rules', () => {
            userValidationRules();
            expect(expressValidator.body).toHaveBeenCalledWith('name');
            expect(chainedValidationMock.trim).toHaveBeenCalled();
            expect(chainedValidationMock.notEmpty).toHaveBeenCalled();
            expect(chainedValidationMock.withMessage).toHaveBeenCalledWith('Name is required');
        });

        it('should include email validation rules', () => {
            userValidationRules();
            expect(expressValidator.body).toHaveBeenCalledWith('email');
            expect(chainedValidationMock.trim).toHaveBeenCalled();
            expect(chainedValidationMock.notEmpty).toHaveBeenCalled();
            expect(chainedValidationMock.isEmail).toHaveBeenCalled();
            expect(chainedValidationMock.normalizeEmail).toHaveBeenCalled();
            expect(chainedValidationMock.withMessage).toHaveBeenCalledWith('Email is required');
        });

        it('should handle whitespace-only name values', () => {
            mockRequest.body = {
                name: '   ',
                email: 'test@example.com'
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Name is required', param: 'name' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateUserRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Name is required', param: 'name' }]
            });
        });

        it('should handle invalid email format', () => {
            mockRequest.body = {
                name: 'Test User',
                email: 'invalid-email'
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Email is required', param: 'email' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateUserRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Email is required', param: 'email' }]
            });
        });

        it('should handle empty email value', () => {
            mockRequest.body = {
                name: 'Test User',
                email: ''
            };
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => [{ msg: 'Email is required', param: 'email' }]
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateUserRequest(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [{ msg: 'Email is required', param: 'email' }]
            });
        });
    });

    describe('validateUserRequest', () => {
        it('should call next() when no validation errors', () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateUserRequest(
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
                { msg: 'Email is required', param: 'email' }
            ];
            const mockValidationResult = {
                isEmpty: () => false,
                array: () => mockErrors
            };
            (expressValidator.validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

            validateUserRequest(
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

            validateUserRequest(
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
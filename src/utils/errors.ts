import { ValidationError } from 'express-validator';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public errors?: ValidationError[]
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
    }
}

export class ValidationFailedError extends AppError {
    constructor(errors: ValidationError[]) {
        super(400, 'Validation failed', errors);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(401, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
    }
}

export class DatabaseError extends AppError {
    constructor(operation: string, error: Error) {
        super(500, `Database error during ${operation}: ${error.message}`);
    }
}

export class BusinessLogicError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
} 
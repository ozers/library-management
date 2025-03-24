import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

interface SequelizeError {
    path: string;
    message: string;
}

interface SequelizeUniqueConstraintError extends Error {
    name: 'SequelizeUniqueConstraintError';
    errors?: SequelizeError[];
}

export const errorLogger = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        timestamp: new Date().toISOString()
    });
    next(error);
};

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors || undefined
        });
    }

    // Sequelize specific errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 'error',
            message: 'Resource already exists',
            errors: ((err as SequelizeUniqueConstraintError).errors || []).map((e) => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Default error response
    return res.status(500).json({
        status: 'error',
        message: err.message
    });
}; 
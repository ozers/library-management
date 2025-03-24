import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

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
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
            errors: error.errors || undefined
        });
    }

    // Sequelize specific errors
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 'error',
            message: 'Resource already exists',
            errors: (error as any).errors?.map((e: any) => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Default error response
    return res.status(500).json({
        status: 'error',
        message: error.message
    });
}; 
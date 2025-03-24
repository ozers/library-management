import express from 'express';
import * as borrowController from '../controllers/borrowController';
import {
    borrowBookValidationRules,
    returnBookValidationRules,
    validateBorrowRequest
} from '../validators/borrowValidators';

const router = express.Router();

router.post(
    '/:userId/borrow/:bookId',
    borrowBookValidationRules(),
    validateBorrowRequest,
    borrowController.borrowBook
);

router.post(
    '/:userId/return/:bookId',
    returnBookValidationRules(),
    validateBorrowRequest,
    borrowController.returnBook
);

export default router; 
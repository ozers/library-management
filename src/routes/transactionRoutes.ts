import express from 'express';
import * as transactionController from '../controllers/transactionController';
import {
    transactionValidationRules,
    userTransactionsValidationRules,
    validateTransactionRequest
} from '../validators/transactionValidators';

const router = express.Router();

router.get(
    '/user/:userId',
    userTransactionsValidationRules(),
    validateTransactionRequest,
    transactionController.getUserTransactions
);

router.get(
    '/:id',
    transactionValidationRules(),
    validateTransactionRequest,
    transactionController.getTransactionById
);

export default router; 
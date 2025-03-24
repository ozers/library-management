import express from 'express';
import * as bookController from '../controllers/bookController';
import {
    createBookValidationRules,
    getBookValidationRules,
    validateBookRequest
} from "../validators/bookValidators";

const router = express.Router();

router.get('/', bookController.getAllBooks);

router.get(
    '/:id',
    getBookValidationRules(),
    validateBookRequest,
    bookController.getBookById
);

router.post(
    '/',
    createBookValidationRules(),
    validateBookRequest,
    bookController.createBook
);

export default router;

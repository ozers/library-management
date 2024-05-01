import express from 'express';
import {bookController} from '../controllers/bookController';
import {bookValidationRules, validate} from "../validators/bookValidators";

const router = express.Router();

router.get('/', bookController.getAllBooks);
router.post('/', bookValidationRules(), validate, bookController.addBook);
router.get('/:id', bookController.getBookById);

export default router;

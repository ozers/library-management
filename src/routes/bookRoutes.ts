import express from 'express';
import { bookController } from '../controllers/bookController';

const router = express.Router();

router.get('/', bookController.getAllBooks);
router.post('/', bookController.addBook);
router.get('/:id', bookController.getBookById);

export default router;

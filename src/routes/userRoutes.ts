import express from 'express';
import * as userController from '../controllers/userController';
import {createUserValidationRules, validateUser} from '../validators/userValidators';
import * as borrowController from '../controllers/borrowController';
import {returnBookValidationRules, validateBorrow} from "../validators/borrowValidators";

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserValidationRules(), validateUser, userController.createUser);

router.post('/:userId/borrow/:bookId', borrowController.borrowBook);
router.post('/:userId/return/:bookId', returnBookValidationRules(), validateBorrow, borrowController.returnBook);

export default router;

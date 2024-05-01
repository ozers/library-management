import express from 'express';
import * as userController from '../controllers/userController';
import {createUserValidationRules, validateUser} from '../validators/userValidators';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserValidationRules(), validateUser, userController.createUser);

export default router;

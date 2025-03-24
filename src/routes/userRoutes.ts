import express from 'express';
import * as userController from '../controllers/userController';
import { userValidationRules, validateUserRequest } from '../validators/userValidators';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userValidationRules(), validateUserRequest, userController.createUser);

export default router;

import express from 'express';
import { check } from 'express-validator';
import { signup, login } from '../controllers/users-controller';

const userRouter = express.Router();

// router.get('/', usersController.getUsers);

userRouter.post(
  '/signup',
  [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  signup
);

userRouter.post('/login', login);

export default userRouter;

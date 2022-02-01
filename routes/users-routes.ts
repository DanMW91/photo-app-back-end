import express from 'express';
import { check } from 'express-validator';
import usersController = require('../controllers/users-controller');

const userRouter = express.Router();

// router.get('/', usersController.getUsers);

userRouter.post(
  '/signup',
  [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  usersController.signup
);

userRouter.post('/login', usersController.login);

export default userRouter;

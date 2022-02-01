import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import User, { UserInterface } from '../models/user';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError(`${errors} is invalid.`, 422));
  }
  const { username, email, password }: UserInterface = req.body;
  let existingUser: UserInterface | null;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signup failed, try again.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead',
      422
    );
    return next(error);
  }
  const newUser = new User({
    username,
    email,
    password,
    photos: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError('Failed to create user, try again later.', 500);
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: { email: string; password: string } = req.body;
  let existingUser: UserInterface | null;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'An error occured while logging in, try again.',
      500
    );
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid login credentials, please try again.',
      401
    );
    return next(error);
  }
  res.json({ message: 'logged in successfully', user: existingUser });
};

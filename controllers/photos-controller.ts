import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import User, { UserInterface } from '../models/user';
import Photo, { PhotoInterface } from '../models/photo';

export const getPhotosForMarker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const locationId = req.params.locationId;

  let photos: HydratedDocument<PhotoInterface>[] | undefined;
  try {
    photos = await Photo.find({ location: locationId }).populate('user');
  } catch (err) {
    const error = new HttpError('failed to fetch photos for location', 500);
    next(error);
  }
  res.json({
    photos: photos?.map((photo) => photo.toObject({ getters: true })),
  });
};

export const getPhotosForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  let photoObj: {
    username: string;
    photos: PhotoInterface[];
  } = { username: '', photos: [] };
  try {
    const user: HydratedDocument<UserInterface> | null = await User.findById(
      userId
    ).populate({
      path: 'photos',
      populate: {
        path: 'location',
      },
    });
    if (user) {
      photoObj.photos = user.photos;
      photoObj.username = user.username;
    } else {
      return next(new HttpError(`Could not find user for id ${userId}.`, 404));
    }
  } catch (err) {
    const error = new HttpError('failed to find user', 404);
  }
  res.json(photoObj);
};

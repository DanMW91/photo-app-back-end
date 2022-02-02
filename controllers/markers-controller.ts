import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import Marker, { MarkerInterface } from '../models/marker';
import Photo, { PhotoInterface } from '../models/photo';
import User from '../models/user';

export const newMarker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: any = validationResult(req);
  console.log(req.body);
  // console.log(errors);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError(`${errors} is invalid.`, 422));
  }

  const { coords, name, description } = req.body.marker;

  const newMarker: HydratedDocument<MarkerInterface> = new Marker({
    coords,
    name,
    description,
    photos: [],
  });

  const {
    user: userId,
    title,
    description: photoDescription,
    url,
  } = req.body.photo;

  const newPhoto: HydratedDocument<PhotoInterface> = new Photo({
    title,
    description: photoDescription,
    url,
  });

  try {
    const creator = await User.findById(userId);
    if (creator !== null) {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newMarker.save({ session: sess });
      newPhoto.location = newMarker;
      newPhoto.user = creator;
      await newPhoto.save({ session: sess });
      newMarker.photos.push(newPhoto);
      await newMarker.save({ session: sess });
      creator.photos.push(newPhoto);
      await creator.save({ session: sess });
      await sess.commitTransaction();
      console.log('success maybe');
    } else {
      console.log('creator == null');
      throw 'Internal Error, try again';
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError('creating place failed', 500);
    return next(error);
  }
  res.status(201).json({ marker: newMarker.toObject({ getters: true }) });
};

export const getAllMarkers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let markers: HydratedDocument<MarkerInterface>[];
  try {
    markers = await Marker.find({});
  } catch (err) {
    const error = new HttpError('failed to fetch markers', 500);
    return next(error);
  }

  if (!markers || markers.length === 0) {
    return next(new HttpError('Could not find any markers.', 404));
  }

  res.json({
    markers: markers.map((marker) => marker.toObject({ getters: true })),
  });
};

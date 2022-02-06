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

  const { markerLat: lat, markerLng: lng, markerName, markerDesc } = req.body;

  const newMarker: HydratedDocument<MarkerInterface> = new Marker({
    coords: {
      lat,
      lng,
    },
    name: markerName,
    description: markerDesc,
    photos: [],
  });

  const {
    photoUser: userId,
    photoTitle,
    photoDesc: description,
    file,
  } = req.body;

  let newPhoto: HydratedDocument<PhotoInterface>;

  if (req?.file?.path) {
    newPhoto = new Photo({
      title: photoTitle,
      description,
      file: req.file.path,
    });
  } else {
    const error = new HttpError('no photo provided', 500);
    return next(error);
  }
  console.log(newMarker);

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
    } else {
      throw 'Cannot find current user, try again';
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError('creating place failed', 500);
    return next(error);
  }
  // console.log(newMarker.toObject({ getters: true }));
  // console.log(newMarker);
  res.status(201).json({ message: 'success' });
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

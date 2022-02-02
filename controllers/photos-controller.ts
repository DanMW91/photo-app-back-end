import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import Marker, { MarkerInterface } from '../models/marker';
import Photo, { PhotoInterface } from '../models/photo';

export const getPhotosForMarker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const locationId = req.params.locationId;
  console.log(locationId);
  let photos: HydratedDocument<PhotoInterface>[] | undefined;
  try {
    photos = await Photo.find({ location: locationId }).populate('user');
    console.log(photos);
  } catch (err) {
    const error = new HttpError('failed to fetch photos for location', 500);
    next(error);
  }
  res.json({
    photos: photos?.map((photo) => photo.toObject({ getters: true })),
  });

  // try {
  //   markers = await Marker.find({});
  // } catch (err) {
  //   const error = new HttpError('failed to fetch markers', 500);
  //   return next(error);
  // }

  // if (!markers || markers.length === 0) {
  //   return next(new HttpError('Could not find any markers.', 404));
  // }

  // res.json({
  //   markers: markers.map((marker) => marker.toObject({ getters: true })),
  // });
};

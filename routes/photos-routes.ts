import express from 'express';

import {
  getPhotosForMarker,
  getPhotosForUser,
} from '../controllers/photos-controller';

const photoRouter = express.Router();

photoRouter.get('/location/:locationId', getPhotosForMarker);
photoRouter.get('/user/:userId', getPhotosForUser);

export default photoRouter;

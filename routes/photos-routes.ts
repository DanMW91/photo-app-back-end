import express from 'express';

import { getPhotosForMarker } from '../controllers/photos-controller';

const photoRouter = express.Router();

photoRouter.get('/location/:locationId', getPhotosForMarker);

export default photoRouter;

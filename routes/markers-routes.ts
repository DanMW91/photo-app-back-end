import express from 'express';
import { check } from 'express-validator';
import { getAllMarkers, newMarker } from '../controllers/markers-controller';
import fileUpload from '../middleware/file-upload';

const markerRouter = express.Router();

markerRouter.post('/new', fileUpload.single('photoFile'), newMarker);
markerRouter.get('/all', getAllMarkers);

export default markerRouter;

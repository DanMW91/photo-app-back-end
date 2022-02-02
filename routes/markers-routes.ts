import express from 'express';
import { check } from 'express-validator';
import { getAllMarkers, newMarker } from '../controllers/markers-controller';

const markerRouter = express.Router();

markerRouter.post('/new', newMarker);
markerRouter.get('/all', getAllMarkers);

export default markerRouter;

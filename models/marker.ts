import mongoose from 'mongoose';
import { PhotoInterface } from './photo';

const Schema = mongoose.Schema;

export interface MarkerInterface {
  title: string;
  description: string;
  location: { lat: number; lng: number };
  photos: PhotoInterface[];
}

const markerSchema = new Schema<MarkerInterface>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  photos: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Photo' }],
});

const Marker = mongoose.model('Marker', markerSchema);

export default Marker;

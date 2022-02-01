import mongoose from 'mongoose';
import { MarkerInterface } from './marker';
import { UserInterface } from './user';

const Schema = mongoose.Schema;

export interface PhotoInterface {
  title: string;
  description: string;
  image: string;
  location: MarkerInterface;
  user: UserInterface;
}

const photoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: mongoose.Types.ObjectId, required: true, ref: 'Marker' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;

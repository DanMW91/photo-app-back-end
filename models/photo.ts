import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: mongoose.Types.ObjectId, required: true, ref: 'Location' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

const Place = mongoose.model('Photo', photoSchema);

export default Place;

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const markerSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  photos: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Photo' }],
});

const Marker = mongoose.model('Marker', markerSchema);

export default Marker;

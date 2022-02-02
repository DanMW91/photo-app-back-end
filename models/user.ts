import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { PhotoInterface } from './photo';
const Schema = mongoose.Schema;

export interface UserInterface {
  username: string;
  email: string;
  password: string;
  photos: PhotoInterface[];
}

const userSchema = new Schema<UserInterface>({
  username: { type: String, required: true, minLength: 4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  photos: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Photo' }],
});

// userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

export default User;

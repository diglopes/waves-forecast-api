import mongoose, { Document, Model } from 'mongoose';

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserModel extends Document, Omit<User, '_id'> {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const User: Model<UserModel> = mongoose.model('User', schema);
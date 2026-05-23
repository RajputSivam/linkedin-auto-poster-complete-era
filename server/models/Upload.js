import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const uploadSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User' },
    url: String,
    publicId: String,
    type: String,
  },
  { timestamps: true }
);

export default model('Upload', uploadSchema);

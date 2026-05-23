import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const postSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    content: String,
    status: { type: String, enum: ['pending', 'published', 'skipped'], default: 'pending' },
    mediaUrl: String,
    feedbackMessage: String,
    feedbackScore: Number,
    weekStart: Date,
  },
  { timestamps: true }
);

export default model('Post', postSchema);

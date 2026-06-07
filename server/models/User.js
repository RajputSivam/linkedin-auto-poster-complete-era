import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    linkedinId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    accessTokenExpiresAt: Date,
    postingMode: { type: String, enum: ['auto-post', 'ask-first'], default: 'ask-first' },
    githubUsername: String,
    leetcodeUsername: String,
    codeforcesHandle: String,
    codechefUsername: String,
    hackerrankUsername: String,
    gfgUsername: String,
    atcoderUsername: String,
    kaggleUsername: String,
  },
  { timestamps: true }
);

export default model('User', userSchema);

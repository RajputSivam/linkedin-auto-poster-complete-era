import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    folder: 'linkedin-auto-poster',
  });

  await fs.promises.unlink(filePath);
  return { url: result.secure_url, publicId: result.public_id };
};

export default { uploadToCloudinary };

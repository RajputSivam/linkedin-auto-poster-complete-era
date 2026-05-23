import fs from 'fs';
import path from 'path';
import Upload from '../models/Upload.js';
import cloudinaryService from '../services/cloudinaryService.js';

export const uploadFile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadResult = await cloudinaryService.uploadToCloudinary(req.file.path);

    const upload = await Upload.create({
      userId: user._id,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      type: req.file.mimetype,
    });

    res.json({ url: upload.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

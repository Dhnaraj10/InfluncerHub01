import cloudinary from '../utils/cloudinary.js';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DatauriParser();

export const uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Better error handling for file extension
    const extName = path.extname(req.file.originalname).toString();
    console.log('File extension:', extName);
    console.log('File mimetype:', req.file.mimetype);
    console.log('File size:', req.file.size);
    
    // Check if extension is valid
    if (!extName) {
      return res.status(400).json({ msg: 'Invalid file type. Please upload an image file.' });
    }

    // Properly format the file for DatauriParser
    console.log('Formatting file with DatauriParser');
    const file64 = parser.format(extName, req.file.buffer);
    console.log('DatauriParser result:', file64);
    
    // Check if file64 was properly created
    if (!file64 || !file64.content) {
      console.error('Failed to format file with DatauriParser');
      return res.status(400).json({ msg: 'Failed to process image file' });
    }

    let folderName = 'general_uploads'; // Default folder
    if (req.user && req.user.role) {
      if (req.user.role === 'influencer') {
        folderName = 'influencer_hub_avatars';
      } else if (req.user.role === 'brand') {
        folderName = 'brand_hub_logos'; // New folder for brand logos
      }
    }

    console.log('Uploading to Cloudinary folder:', folderName);
    
    const result = await cloudinary.uploader.upload(file64.content, {
      folder: folderName,
      resource_type: 'image',
    });

    console.log('Cloudinary upload result:', result);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    console.error('Request user:', req.user);
    console.error('Request file:', req.file);
    res.status(500).json({ 
      msg: 'Server error during upload',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export default {
  uploadImage,
};
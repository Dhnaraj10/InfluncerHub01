// backend/routes/upload.js
import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', auth, upload.single('image'), uploadController.uploadImage);

export default router;

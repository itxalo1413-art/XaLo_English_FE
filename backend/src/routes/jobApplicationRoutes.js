import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import JobApplication from '../models/jobApplicationModel.js';
import {
    createJobApplication,
    getAllJobApplications,
    getJobApplicationById,
    updateJobApplication,
    deleteJobApplication,
    getApplicationsByPosition,
} from '../controllers/jobApplicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/applications');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

const router = express.Router();

// Public routes
router.post(
    '/',
    upload.fields([
        { name: 'resumePdf', maxCount: 1 },
        { name: 'certificatesPdf', maxCount: 1 },
    ]),
    createJobApplication
);

// Admin routes
router.get('/', protect, admin, getAllJobApplications);
router.get('/:id', protect, admin, getJobApplicationById);
router.put('/:id', protect, admin, updateJobApplication);
router.delete('/:id', protect, admin, deleteJobApplication);
router.get('/position/:position', protect, admin, getApplicationsByPosition);

// Download file endpoint
router.get('/download/:applicationId', protect, admin, asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    
    // Get application from database
    const application = await JobApplication.findById(applicationId);
    
    if (!application || !application.resumePdf) {
        return res.status(404).json({ message: 'File not found' });
    }
    
    const filepath = path.join(__dirname, '../../uploads/applications', application.resumePdf.filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }
    
    res.download(filepath, application.resumePdf.originalName);
}));

// Download certificates endpoint
router.get('/download-certificates/:applicationId', protect, admin, asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await JobApplication.findById(applicationId);

    if (!application || !application.certificatesPdf) {
        return res.status(404).json({ message: 'File not found' });
    }

    const filepath = path.join(__dirname, '../../uploads/applications', application.certificatesPdf.filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filepath, application.certificatesPdf.originalName);
}));

export default router;

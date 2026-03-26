import express from 'express';
import {
    createJobPosition,
    getAllJobPositions,
    getAllJobPositionsAdmin,
    getJobPositionById,
    updateJobPosition,
    deleteJobPosition,
} from '../controllers/jobPositionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobPositions);

// Admin routes (must be before /:id route)
router.get('/admin/all', protect, admin, getAllJobPositionsAdmin);

// Generic routes
router.get('/:id', getJobPositionById);
router.post('/', protect, admin, createJobPosition);
router.put('/:id', protect, admin, updateJobPosition);
router.delete('/:id', protect, admin, deleteJobPosition);

export default router;

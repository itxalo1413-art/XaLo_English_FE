import asyncHandler from 'express-async-handler';
import JobPosition from '../models/jobPositionModel.js';

// @desc    Create a new job position
// @route   POST /api/v1/job-positions
// @access  Private/Admin
const createJobPosition = asyncHandler(async (req, res) => {
    const { title, description, requirements, benefits, salary, location, type } = req.body;

    // Validate required fields
    if (!title || !description) {
        res.status(400);
        throw new Error('Vui lòng cung cấp tiêu đề và mô tả công việc');
    }

    // Check if position already exists
    const existingPosition = await JobPosition.findOne({ title });
    if (existingPosition) {
        res.status(400);
        throw new Error('Vị trí công việc này đã tồn tại');
    }

    const jobPosition = new JobPosition({
        title,
        description,
        requirements: requirements || [],
        benefits: benefits || [],
        salary,
        location,
        type,
    });

    const createdPosition = await jobPosition.save();
    res.status(201).json(createdPosition);
});

// @desc    Get all job positions
// @route   GET /api/v1/job-positions
// @access  Public
const getAllJobPositions = asyncHandler(async (req, res) => {
    const positions = await JobPosition.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(positions);
});

// @desc    Get all job positions (Admin - including inactive)
// @route   GET /api/v1/job-positions/admin/all
// @access  Private/Admin
const getAllJobPositionsAdmin = asyncHandler(async (req, res) => {
    const positions = await JobPosition.find().sort({ createdAt: -1 });
    res.status(200).json(positions);
});

// @desc    Get single job position
// @route   GET /api/v1/job-positions/:id
// @access  Public
const getJobPositionById = asyncHandler(async (req, res) => {
    const position = await JobPosition.findById(req.params.id);

    if (!position) {
        res.status(404);
        throw new Error('Không tìm thấy vị trí công việc');
    }

    res.status(200).json(position);
});

// @desc    Update job position
// @route   PUT /api/v1/job-positions/:id
// @access  Private/Admin
const updateJobPosition = asyncHandler(async (req, res) => {
    const { title, description, requirements, benefits, salary, location, type, isActive } = req.body;

    const position = await JobPosition.findById(req.params.id);

    if (!position) {
        res.status(404);
        throw new Error('Không tìm thấy vị trí công việc');
    }

    // Check if new title already exists (if changing title)
    if (title && title !== position.title) {
        const existingPosition = await JobPosition.findOne({ title });
        if (existingPosition) {
            res.status(400);
            throw new Error('Tiêu đề này đã được sử dụng bởi công việc khác');
        }
    }

    position.title = title || position.title;
    position.description = description || position.description;
    position.requirements = requirements !== undefined ? requirements : position.requirements;
    position.benefits = benefits !== undefined ? benefits : position.benefits;
    position.salary = salary || position.salary;
    position.location = location || position.location;
    position.type = type || position.type;
    position.isActive = isActive !== undefined ? isActive : position.isActive;

    const updatedPosition = await position.save();
    res.status(200).json(updatedPosition);
});

// @desc    Delete job position
// @route   DELETE /api/v1/job-positions/:id
// @access  Private/Admin
const deleteJobPosition = asyncHandler(async (req, res) => {
    const position = await JobPosition.findById(req.params.id);

    if (!position) {
        res.status(404);
        throw new Error('Không tìm thấy vị trí công việc');
    }

    await JobPosition.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa vị trí công việc thành công' });
});

export {
    createJobPosition,
    getAllJobPositions,
    getAllJobPositionsAdmin,
    getJobPositionById,
    updateJobPosition,
    deleteJobPosition,
};

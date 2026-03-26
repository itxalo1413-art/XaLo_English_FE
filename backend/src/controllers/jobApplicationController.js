import asyncHandler from 'express-async-handler';
import JobApplication from '../models/jobApplicationModel.js';

// @desc    Create a new job application
// @route   POST /api/v1/job-applications
// @access  Public
const createJobApplication = asyncHandler(async (req, res) => {
    const { fullName, email, phone, jobPosition, coverLetter } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !jobPosition || !coverLetter) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const resumePdf = req.file ? {
        filename: req.file.filename,
        path: `/uploads/applications/${req.file.filename}`,
        originalName: req.file.originalname
    } : null;

    const jobApplication = new JobApplication({
        fullName,
        email,
        phone,
        jobPosition,
        coverLetter,
        resumePdf,
    });

    const createdApplication = await jobApplication.save();

    res.status(201).json(createdApplication);
});

// @desc    Get all job applications
// @route   GET /api/v1/job-applications
// @access  Private/Admin
const getAllJobApplications = asyncHandler(async (req, res) => {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
});

// @desc    Get single job application
// @route   GET /api/v1/job-applications/:id
// @access  Private/Admin
const getJobApplicationById = asyncHandler(async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Job application not found');
    }

    res.status(200).json(application);
});

// @desc    Update job application status
// @route   PUT /api/v1/job-applications/:id
// @access  Private/Admin
const updateJobApplication = asyncHandler(async (req, res) => {
    const { status, notes } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
        req.params.id,
        { status, notes },
        { new: true, runValidators: true }
    );

    if (!application) {
        res.status(404);
        throw new Error('Job application not found');
    }

    res.status(200).json(application);
});

// @desc    Delete job application
// @route   DELETE /api/v1/job-applications/:id
// @access  Private/Admin
const deleteJobApplication = asyncHandler(async (req, res) => {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Job application not found');
    }

    res.status(200).json({ message: 'Job application deleted successfully' });
});

// @desc    Get applications by job position
// @route   GET /api/v1/job-applications/position/:position
// @access  Private/Admin
const getApplicationsByPosition = asyncHandler(async (req, res) => {
    const applications = await JobApplication.find({ jobPosition: req.params.position }).sort({ createdAt: -1 });
    res.status(200).json(applications);
});

export {
    createJobApplication,
    getAllJobApplications,
    getJobApplicationById,
    updateJobApplication,
    deleteJobApplication,
    getApplicationsByPosition,
};

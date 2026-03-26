import mongoose from 'mongoose';

const jobApplicationSchema = mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        jobPosition: { type: String, required: true },
        coverLetter: { type: String, required: true },
        resumePdf: {
            filename: { type: String },
            path: { type: String },
            originalName: { type: String },
        },
        status: {
            type: String,
            enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
            default: 'new',
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

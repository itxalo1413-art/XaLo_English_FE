import mongoose from 'mongoose';

const jobPositionSchema = mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        requirements: [{ type: String }], // Array of requirements
        benefits: [{ type: String }], // Array of benefits
        salary: { type: String }, // e.g., "8-15 triệu"
        location: { type: String, default: 'Hà Nội' },
        type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

const JobPosition = mongoose.model('JobPosition', jobPositionSchema);

export default JobPosition;

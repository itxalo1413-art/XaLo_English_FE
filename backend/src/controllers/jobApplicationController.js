import asyncHandler from 'express-async-handler';
import JobApplication from '../models/jobApplicationModel.js';
import sendEmail from '../utils/sendEmail.js';

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

    const resumeFile = req.files?.resumePdf?.[0];
    const certificatesFile = req.files?.certificatesPdf?.[0];

    const resumePdf = resumeFile
        ? {
              filename: resumeFile.filename,
              path: `/uploads/applications/${resumeFile.filename}`,
              originalName: resumeFile.originalname,
          }
        : null;

    const certificatesPdf = certificatesFile
        ? {
              filename: certificatesFile.filename,
              path: `/uploads/applications/${certificatesFile.filename}`,
              originalName: certificatesFile.originalname,
          }
        : null;

    const jobApplication = new JobApplication({
        fullName,
        email,
        phone,
        jobPosition,
        coverLetter,
        resumePdf,
        certificatesPdf,
    });

    const createdApplication = await jobApplication.save();

    // Send email notification to HR
    try {
        const hrEmail = process.env.HR_EMAIL || 'hr@xalo.edu.vn';
        const subject = `[ỨNG TUYỂN MỚI] - ${jobPosition} - ${fullName}`;
        
        const emailMessage = `
            Có một ứng viên mới vừa nộp hồ sơ:
            - Họ tên: ${fullName}
            - Vị trí: ${jobPosition}
            - Email: ${email}
            - Số điện thoại: ${phone}
            - Thư giới thiệu: ${coverLetter}
            
            Vui lòng kiểm tra trang quản trị để xem chi tiết và tải CV.
        `;

        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #1a73e8;">Thông báo Tuyển dụng mới</h2>
                <p>Hệ thống vừa nhận được một hồ sơ ứng tuyển mới:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Họ tên:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${fullName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Vị trí:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${jobPosition}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Số điện thoại:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
                    </tr>
                </table>
                <p style="margin-top: 20px;"><b>Thư giới thiệu:</b></p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #1a73e8;">
                    ${coverLetter.replace(/\n/g, '<br/>')}
                </div>
                <p style="margin-top: 30px;">
                    <a href="${process.env.ADMIN_URL || 'https://www.xalo.edu.vn/admin'}/applications" style="background: #1a73e8; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Xem chi tiết trên Trang Quản Trị
                    </a>
                </p>
            </div>
        `;

        await sendEmail({
            email: hrEmail,
            subject: subject,
            message: emailMessage,
            html: htmlMessage,
        });
    } catch (error) {
        console.error('HR notification email failed:', error.message);
    }

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

import 'dotenv/config';
import mongoose from 'mongoose';
import JobApplication from './src/models/jobApplicationModel.js';
import { createJobApplication } from './src/controllers/jobApplicationController.js';

// Mocking the request and response objects
const req = {
    body: {
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0987654321',
        jobPosition: 'Giáo viên Tiếng Anh',
        coverLetter: 'Tôi rất yêu thích công việc này.'
    },
    file: null
};

const res = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        this.data = data;
        return this;
    }
};

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- TESTING HR NOTIFICATION ---');
        
        // We override the process.env just for the test if needed
        process.env.HR_EMAIL = 'test-hr@xalo.edu.vn';

        await createJobApplication(req, res);
        
        console.log('Response status:', res.statusCode);
        console.log('Application created:', res.data.fullName);
        console.log('Check console logs above for "Message sent" or "HR notification email failed"');

        // Cleanup the test data
        if (res.data && res.data._id) {
            await JobApplication.findByIdAndDelete(res.data._id);
            console.log('Test application cleaned up.');
        }

        await mongoose.connection.close();
        console.log('--- TEST FINISHED ---');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

runTest();

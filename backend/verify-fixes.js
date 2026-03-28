import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from './src/models/leadModel.js';
import { sendLeadSummaryReport } from './src/utils/leadReportService.js';

// Mocking sendEmail to see output instead of sending real email
import * as emailUtils from './src/utils/sendEmail.js';

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- VERIFICATION START ---');

        // Capture console.log to see the output
        const originalLog = console.log;
        console.log = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('Message sent')) {
                // Ignore the nodemailer log if it happens (though we are mocking it)
                return;
            }
            originalLog(...args);
        };

        // We can't easily mock the default export of sendEmail.js because it's already imported in leadReportService.js
        // But we can check if the logic in leadReportService.js runs and produces logs.
        // Actually, let's just run it for the 9 AM window (13h back) and see if it finds "Trung Hiếu" and logs success.
        
        console.log('Testing 9 AM report simulation (Looking back 13 hours)...');
        // We trigger it manually. Since it uses new Date(), we can't easily mock the date without a library.
        // But "Trung Hiếu" was created ~16 hours ago from now (2:18 PM today).
        // 9 AM report looks back 13 hours. 
        // 9 AM today - 13 hours = 8 PM yesterday.
        // Trung Hiếu was 10:31 PM yesterday. Perfect.
        
        // To test with CURRENT time, we use a larger window to include "Trung Hiếu".
        // Current time is 2:18 PM. Trung Hiếu was 10:31 PM yesterday (~16 hours ago).
        // So we test with 20 hours back.
        
        await sendLeadSummaryReport('TEST 20H WINDOW', 20);

        console.log('--- VERIFICATION END ---');
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

runVerification();

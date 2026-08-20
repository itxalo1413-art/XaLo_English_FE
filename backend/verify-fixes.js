import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from './src/models/leadModel.js';
import { sendLeadNotification } from './src/utils/leadReportService.js';

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

        const latestLead = await Lead.findOne().sort({ createdAt: -1 });

        if (!latestLead) {
            console.log('Không có lead nào trong DB để test.');
        } else {
            console.log(`Testing immediate notification for lead: ${latestLead.name}`);
            await sendLeadNotification(latestLead);
        }

        console.log('--- VERIFICATION END ---');
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

runVerification();

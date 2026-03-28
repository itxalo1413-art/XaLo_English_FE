import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from './src/models/leadModel.js';

const testQuery = async (hoursBack) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const sinceDate = new Date();
        const originalDate = new Date(sinceDate);
        sinceDate.setHours(sinceDate.getHours() - hoursBack);

        console.log(`Current Time (UTC/Local): ${originalDate.toISOString()}`);
        console.log(`Looking back ${hoursBack} hours to: ${sinceDate.toISOString()}`);

        const newLeads = await Lead.find({
            createdAt: { $gte: sinceDate },
        }).sort({ createdAt: -1 });

        console.log(`Found ${newLeads.length} leads.`);
        if (newLeads.length > 0) {
            newLeads.forEach((l, i) => {
                console.log(`${i+1}. ${l.name} - ${l.createdAt.toISOString()}`);
            });
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

// Test with 24 hours back to see if anything is found at all
testQuery(24);

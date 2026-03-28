import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from './src/models/leadModel.js';

/**
 * Mocking the report generation logic to see what it finds for the 9 AM slot
 */
const simulateReport = async (reportLabel, hoursBack, mockNow) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const now = mockNow || new Date();
        const sinceDate = new Date(now);
        sinceDate.setHours(sinceDate.getHours() - hoursBack);

        console.log(`Simulation for: ${reportLabel}`);
        console.log(`Assumed Execution Time: ${now.toISOString()}`);
        console.log(`Calculated sinceDate: ${sinceDate.toISOString()}`);

        const newLeads = await Lead.find({
            createdAt: { $gte: sinceDate },
        }).sort({ createdAt: -1 });

        console.log(`Found ${newLeads.length} leads.`);
        
        if (newLeads.length > 0) {
            const leadCount = newLeads.length;
            const leadDetails = newLeads.map((lead, index) => (
                `${index + 1}. **${lead.name}** - ${lead.phone} (${lead.email})\n` +
                `   - Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
            )).join('\n\n');

            console.log('--- EMAIL CONTENT ---');
            console.log(`Subject: [BÁO CÁO] ${leadCount} Lead mới lúc ${reportLabel}`);
            console.log('Body:');
            console.log(leadDetails);
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

// Simulate today's 9 AM report (2026-03-28 09:00 VN -> 2026-03-28 02:00 UTC)
const today9AM = new Date('2026-03-28T02:00:00Z');
simulateReport('9h sáng', 13, today9AM);

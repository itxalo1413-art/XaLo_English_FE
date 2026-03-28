import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from './src/models/leadModel.js';
import appendLeadToSheet from './src/utils/googleSheets.js';

// We just test if appendLeadToSheet runs with a mock lead
const testSheetAppend = async () => {
    try {
        const mockLead = {
            name: 'TEST LEAD AG',
            email: 'test@example.com',
            phone: '0123456789',
            message: 'Testing AG fixes',
            goals: ['IELTS'],
            consultationTime: ['Tối thứ 2'],
            status: 'new'
        };

        console.log('Testing Google Sheets append with mock lead...');
        await appendLeadToSheet(mockLead);
        console.log('Sheet append logic executed.');
    } catch (err) {
        console.error('Sheet append failed:', err.message);
    }
};

testSheetAppend();

import { google } from 'googleapis';

const appendLeadToSheet = async (leadData) => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: (process.env.GOOGLE_PRIVATE_KEY?.startsWith('LS0t') 
                    ? Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf8') 
                    : process.env.GOOGLE_PRIVATE_KEY)?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Get current month in Vietnam (Asia/Ho_Chi_Minh)
        const now = new Date();
        const month = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh',
        }).format(now);

        const sheetName = `Tháng ${month}`;
        const range = `${sheetName}!A:G`; // Range is now specific to the month tab

        // Create a consolidated message including goals and consultation time
        const fullMessage = [
            leadData.message ? `Lời nhắn: ${leadData.message}` : '',
            Array.isArray(leadData.goals) && leadData.goals.length > 0 ? `Mục tiêu: ${leadData.goals.join(', ')}` : '',
            Array.isArray(leadData.consultationTime) && leadData.consultationTime.length > 0 ? `Thời gian tư vấn: ${leadData.consultationTime.join(', ')}` : ''
        ].filter(Boolean).join('\n');

        const valueInputOption = 'USER_ENTERED';
        const resource = {
            values: [
                [
                    String(leadData.name || ''),
                    String(leadData.email || ''),
                    String(leadData.phone || ''),
                    fullMessage,
                    String(leadData.status || 'new'),
                    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                ],
            ],
        };

        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });

        console.log('%d cells appended.', result.data.updates.updatedCells);
    } catch (error) {
        console.error('Error appending to Google Sheet:', error.message);
    }
};

export default appendLeadToSheet;

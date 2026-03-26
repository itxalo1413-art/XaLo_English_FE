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
        if (!spreadsheetId) {
            throw new Error('Missing GOOGLE_SHEET_ID in environment');
        }

        // Get current month in Vietnam (Asia/Ho_Chi_Minh)
        const now = new Date();
        const monthNumeric = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh',
        }).format(now);

        const monthNumber = String(parseInt(monthNumeric, 10)); // e.g. "02" -> "2"
        const sheetNameCandidates = [
            `Tháng ${monthNumber}`, // "Tháng 3"
            `Tháng ${monthNumeric}`, // "Tháng 03"
        ];

        // Create a consolidated message including goals and consultation time
        const fullMessage = [
            leadData.message ? `Lời nhắn: ${leadData.message}` : '',
            Array.isArray(leadData.goals) && leadData.goals.length > 0 ? `Mục tiêu: ${leadData.goals.join(', ')}` : '',
            Array.isArray(leadData.consultationTime) && leadData.consultationTime.length > 0 ? `Thời gian tư vấn: ${leadData.consultationTime.join(', ')}` : ''
        ].filter(Boolean).join('\n');

        const valueInputOption = 'USER_ENTERED';
        const rowValues = [
            String(leadData.name || ''),
            String(leadData.email || ''),
            String(leadData.phone || ''),
            fullMessage,
            String(leadData.status || 'new'),
            new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        ];

        let lastError;
        for (const sheetName of sheetNameCandidates) {
            const range = `'${sheetName}'!A:G`; // quote sheet name (spaces) for A1 notation

            try {
                const result = await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range,
                    valueInputOption,
                    requestBody: { values: [rowValues] },
                });

                console.log(`%d cells appended. (sheet: ${sheetName})`, result.data.updates.updatedCells);
                return;
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('Unknown error appending to Google Sheet');

    } catch (error) {
        console.error('Error appending to Google Sheet:', error.message);
    }
};

export default appendLeadToSheet;

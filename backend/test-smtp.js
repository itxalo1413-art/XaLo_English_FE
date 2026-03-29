import 'dotenv/config';
import sendEmail from './src/utils/sendEmail.js';

const testEmail = async () => {
    try {
        console.log('--- TESTING SMTP CONNECTION ---');
        console.log(`Host: ${process.env.SMTP_HOST}`);
        console.log(`Port: ${process.env.SMTP_PORT}`);
        console.log(`User: ${process.env.SMTP_EMAIL}`);
        console.log(`Recipient: ${process.env.ADMIN_EMAIL}`);
        
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: 'Test SMTP Connection - Xalo English',
            message: 'This is a test email to verify that the SMTP connection is working correctly with port 587 and IPv4.',
            html: '<h3>Xalo English</h3><p>SMTP connection test successful!</p>'
        });
        
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Test email failed:', error.message);
    }
};

testEmail();

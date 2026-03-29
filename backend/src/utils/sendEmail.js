import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        // Force IPv4 to avoid ECONNREFUSED ::1 (loopback) errors
        family: 4,
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Xalo English'} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error(`Email sending failed to ${options.email}:`, error.message);
        console.error(`Host: ${process.env.SMTP_HOST}, Port: ${process.env.SMTP_PORT}`);
        throw error;
    }
};

export default sendEmail;

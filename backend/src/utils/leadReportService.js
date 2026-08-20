import sendEmail from './sendEmail.js';

const formatGoals = (goals) =>
    Array.isArray(goals) && goals.length > 0 ? goals.join(', ') : 'Không có';

const formatConsultationTime = (consultationTime) =>
    Array.isArray(consultationTime) && consultationTime.length > 0
        ? consultationTime.join(', ')
        : 'Không có';

const formatLeadPlainText = (lead) => {
    const goals = formatGoals(lead.goals);
    const consultationTime = formatConsultationTime(lead.consultationTime);

    return `${lead.name} - ${lead.phone} (${lead.email})\n` +
        `   - Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
        `   - Mục tiêu: ${goals}\n` +
        `   - Thời gian tư vấn: ${consultationTime}\n` +
        `   - Lời nhắn: ${lead.message || 'Không có'}`;
};

const formatLeadHtml = (lead) => {
    const goals = formatGoals(lead.goals);
    const consultationTime = formatConsultationTime(lead.consultationTime);

    return `
        <b>${lead.name}</b> - ${lead.phone} (<a href="mailto:${lead.email}">${lead.email}</a>)<br/>
        <i>Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</i><br/>
        <span><b>Mục tiêu:</b> ${goals}</span><br/>
        <span><b>Thời gian tư vấn:</b> ${consultationTime}</span><br/>
        <span><b>Lời nhắn:</b> ${lead.message || '<i>Không có</i>'}</span>
    `;
};

/**
 * Sends an immediate notification when a new lead is submitted.
 */
export const sendLeadNotification = async (lead) => {
    try {
        const emailMessage = `
            Có lead mới vừa nộp form:
            --------------------------------------------------
            ${formatLeadPlainText(lead)}
            --------------------------------------------------
        `;

        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h3 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">Lead mới từ form đăng ký</h3>
                <div style="padding: 15px; background: #f8f9fa; border-left: 5px solid #1a73e8;">
                    ${formatLeadHtml(lead)}
                </div>
                <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-left: 5px solid #1a73e8;">
                    <p style="margin: 0;"><i>Vui lòng truy cập Google Sheet hoặc trang quản trị để xử lý lead này.</i></p>
                </div>
            </div>
        `;

        console.log(`[Lead mới] Gửi thông báo tới: ${process.env.ADMIN_EMAIL}`);

        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `[LEAD MỚI] ${lead.name} - ${lead.phone}`,
            message: emailMessage,
            html: htmlMessage,
        });

        console.log(`[Lead mới] Đã gửi thông báo cho lead: ${lead.name}`);
    } catch (error) {
        console.error('Error sending lead notification:', error.message);
    }
};

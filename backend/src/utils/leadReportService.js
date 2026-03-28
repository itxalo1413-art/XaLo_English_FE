import Lead from '../models/leadModel.js';
import sendEmail from './sendEmail.js';

/**
 * Sends a summary report of new leads created since the last reporting window.
 * 
 * @param {string} reportLabel - Label for the report (e.g., "9h sáng", "15h chiều", "20h tối")
 * @param {number} hoursBack - Number of hours to look back for new leads
 */
export const sendLeadSummaryReport = async (reportLabel, hoursBack) => {
    try {
        const sinceDate = new Date();
        // Add a 2-minute safety buffer to ensure no leads are missed due to cron trigger delays
        sinceDate.setHours(sinceDate.getHours() - hoursBack);
        sinceDate.setMinutes(sinceDate.getMinutes() - 2);

        const newLeads = await Lead.find({
            createdAt: { $gte: sinceDate },
        }).sort({ createdAt: -1 });

        if (newLeads.length === 0) {
            console.log(`[${reportLabel}] Không có lead mới nào phát sinh.`);
            return;
        }

        const leadCount = newLeads.length;

        // Formatting for Plain Text
        const leadDetails = newLeads.map((lead, index) => {
            const goals = Array.isArray(lead.goals) && lead.goals.length > 0 ? lead.goals.join(', ') : 'Không có';
            const consultationTime = Array.isArray(lead.consultationTime) && lead.consultationTime.length > 0 ? lead.consultationTime.join(', ') : 'Không có';
            
            return `${index + 1}. **${lead.name}** - ${lead.phone} (${lead.email})\n` +
                   `   - Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
                   `   - Mục tiêu: ${goals}\n` +
                   `   - Thời gian tư vấn: ${consultationTime}\n` +
                   `   - Lời nhắn: ${lead.message || 'Không có'}`;
        }).join('\n\n');

        // Formatting for HTML
        const htmlDetails = newLeads.map((lead, index) => {
            const goals = Array.isArray(lead.goals) && lead.goals.length > 0 ? lead.goals.join(', ') : 'Không có';
            const consultationTime = Array.isArray(lead.consultationTime) && lead.consultationTime.length > 0 ? lead.consultationTime.join(', ') : 'Không có';

            return `<li>
                <b>${index + 1}. ${lead.name}</b> - ${lead.phone} (${lead.email})<br/>
                <i>Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</i><br/>
                <span><b>Mục tiêu:</b> ${goals}</span><br/>
                <span><b>Thời gian tư vấn:</b> ${consultationTime}</span><br/>
                <span><b>Lời nhắn:</b> ${lead.message || '<i>Không có</i>'}</span>
            </li>`;
        }).join('<hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;"/>');

        const emailMessage = `
            Báo cáo định kỳ lúc ${reportLabel}:
            Tổng số lead mới: ${leadCount}

            Chi tiết các lead mới nhận được:
            --------------------------------------------------
            ${leadDetails}
            --------------------------------------------------
        `;

        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h3 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">Báo cáo Lead định kỳ (${reportLabel})</h3>
                <p style="font-size: 16px;">Trong ${hoursBack} giờ qua, hệ thống đã nhận được <b style="color: #d93025; font-size: 18px;">${leadCount}</b> lead mới.</p>
                <ul style="list-style: none; padding: 0;">
                    ${htmlDetails}
                </ul>
                <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-left: 5px solid #1a73e8;">
                    <p style="margin: 0;"><i>Vui lòng truy cập Google Sheet hoặc trang quản trị để xử lý các lead này.</i></p>
                </div>
            </div>
        `;

        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `[BÁO CÁO] ${leadCount} Lead mới lúc ${reportLabel}`,
            message: emailMessage,
            html: htmlMessage,
        });

        console.log(`[${reportLabel}] Đã gửi báo cáo tổng hợp ${leadCount} lead.`);
    } catch (error) {
        console.error(`Error sending lead summary report (${reportLabel}):`, error.message);
    }
};

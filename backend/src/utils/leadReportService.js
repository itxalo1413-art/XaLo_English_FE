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
        sinceDate.setHours(sinceDate.getHours() - hoursBack);

        const newLeads = await Lead.find({
            createdAt: { $gte: sinceDate },
        }).sort({ createdAt: -1 });

        if (newLeads.length === 0) {
            console.log(`[${reportLabel}] Không có lead mới nào phát sinh.`);
            return;
        }

        const leadCount = newLeads.length;
        const leadDetails = newLeads.map((lead, index) => (
            `${index + 1}. **${lead.name}** - ${lead.phone} (${lead.email})\n` +
            `   - Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
        )).join('\n\n');

        const htmlDetails = newLeads.map((lead, index) => (
            `<li><b>${lead.name}</b> - ${lead.phone} (${lead.email})<br/>` +
            `<i>Lúc: ${new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</i><br/>`
        )).join('<br/><hr/>');

        const emailMessage = `
            Báo cáo định kỳ lúc ${reportLabel}:
            Tổng số lead mới: ${leadCount}

            Chi tiết:
            ${leadDetails}
        `;

        const htmlMessage = `
            <h3>Báo cáo Lead định kỳ (${reportLabel})</h3>
            <p>Trong ${hoursBack} giờ qua, hệ thống đã nhận được <b>${leadCount}</b> lead mới.</p>
            <hr/>
            <ul>
                ${htmlDetails}
            </ul>
            <p><i>Vui lòng kiểm tra Google Sheet để biết thêm chi tiết.</i></p>
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

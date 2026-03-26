import 'dotenv/config';
import mongoose from 'mongoose';
import JobPosition from './src/models/jobPositionModel.js';

const seedJobPositions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xalo');
        console.log('MongoDB connected');

        // Clear existing positions (optional)
        // await JobPosition.deleteMany({});

        const positions = [
            {
                title: 'HR',
                description: 'Hỗ trợ tuyển dụng: Đăng tin tuyển dụng trên các kênh tuyển dụng; Sàng lọc hồ sơ ứng viên theo tiêu chí tuyển dụng; Liên hệ ứng viên, sắp xếp lịch phỏng vấn.\n\nHỗ trợ vận hành: Cập nhật và quản lý dữ liệu nhân sự (hồ sơ, hợp đồng, thông tin nhân viên,...); Hỗ trợ theo dõi tình hình nhân sự của các phòng ban; Hỗ trợ các thủ tục liên quan đến onboarding nhân viên mới, chuẩn bị báo cáo nhân sự định kỳ.\n\nHỗ trợ quản trị hiệu suất: Thu thập và tổng hợp dữ liệu KPI của các bộ phận.\n\nHỗ trợ các hoạt động nội bộ: Tổ chức các hoạt động gắn kết nhằm đảm bảo động lực nhân sự và văn hóa công ty.\n\nKhác: Thực hiện các công việc hành chính nhân sự khác theo phân công.',
                requirements: [
                    'Sinh viên năm 3, năm 4 hoặc mới tốt nghiệp các ngành Quản trị nhân sự, Quản trị kinh doanh, Tâm lý học',
                    'Kỹ năng giao tiếp và làm việc nhóm tốt',
                    'Có khả năng tổ chức công việc và quản lý thời gian',
                    'Thành thạo Microsoft Office hoặc Google Workspace là lợi thế',
                    'Cẩn thận, chủ động và có tinh thần học hỏi',
                    'Ở HCM'
                ],
                benefits: [
                    'Mức trợ cấp: 3 triệu VNĐ/tháng',
                    'Hỗ trợ dấu mộc và xác nhận báo cáo thực tập',
                    'Được đào tạo và trải nghiệm thực tế trong các hoạt động nhân sự',
                    'Môi trường làm việc chuyên nghiệp, cởi mở, năng động, tôn trọng và tạo điều kiện phát huy giá trị cá nhân',
                    'Được hưởng quyền lợi theo chính sách của công ty'
                ],
                salary: '3 triệu VNĐ/tháng',
                location: 'Hồ Chí Minh',
                type: 'Full-time',
                isActive: true,
            },
            {
                title: 'Grader (IELTS)',
                description: 'Chấm bài Speaking, Writing và các bài kiểm tra đầu vào/đầu ra theo quy chuẩn.\n\nThu thập, xử lý và phân tích kết quả bài kiểm tra từ các lớp/khóa học.\n\nThực hiện hỗ trợ các nghiên cứu liên quan đến nội dung giảng dạy, chất lượng kiểm tra, phương pháp tiếp cận.\n\nThu thập dữ liệu từ học viên, giáo viên hoặc kết quả các kỳ kiểm tra, kỳ thi. Cập nhật tài liệu liên quan vào hệ thống.\n\nĐề xuất cải tiến bộ đề, hệ thống bài tập, tiêu chí đánh giá hoặc quy trình kiểm tra.',
                requirements: [
                    'Độ tuổi: ưu tiên các ứng viên từ 19-25 tuổi',
                    'Có chứng chỉ IELTS từ 7.0 trở lên, kỹ năng Speaking và Writing từ 7.0 trở lên',
                    'Thành thạo tin học văn phòng (Word, Excel/Google Sheets, PowerPoint)',
                    'Có khả năng phân tích và tổng hợp dữ liệu',
                    'Tỉ mỉ, cẩn thận, trung thực',
                    'Kỹ năng giao tiếp, phối hợp nội bộ và phản hồi thông tin tốt',
                    'Có trách nhiệm, tuân thủ quy trình làm việc'
                ],
                benefits: [
                    'Thu nhập: Thỏa thuận theo năng lực',
                    'Được tài trợ khóa học nâng cao kỹ năng chuyên môn, kỹ năng mềm hoặc phương pháp đánh giá',
                    'Có cơ hội trở thành KOL/đại sứ học thuật nếu phù hợp chân dung',
                    'Làm việc trong môi trường trẻ, tôn trọng năng lực, đề cao chất lượng chuyên môn',
                    'Được hưởng đầy đủ chế độ, phúc lợi theo chính sách của công ty (nghỉ phép, thưởng, BHXH,...)'
                ],
                salary: 'Thỏa thuận theo năng lực',
                location: 'Hồ Chí Minh',
                type: 'Full-time',
                isActive: true,
            }
        ];

        // Insert positions
        const result = await JobPosition.insertMany(positions);
        console.log(`✅ Successfully added ${result.length} job positions:`);
        result.forEach(pos => {
            console.log(`  - ${pos.title}`);
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding positions:', error.message);
        process.exit(1);
    }
};

seedJobPositions();

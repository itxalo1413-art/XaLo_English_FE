import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import cron from 'node-cron';
import { sendLeadSummaryReport } from './src/utils/leadReportService.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import blogPostRoutes from './src/routes/blogPostRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import mentorRoutes from './src/routes/mentorRoutes.js';
import studentResultRoutes from './src/routes/studentResultRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import settingRoutes from './src/routes/settingRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import programRoutes from './src/routes/programRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

connectDB();

// --- Lập lịch gửi báo cáo (Giữ nguyên từ bản mới nhất của bạn) ---
cron.schedule('0 9 * * *', () => { sendLeadSummaryReport('9h sáng', 13); }, { timezone: "Asia/Ho_Chi_Minh" });
cron.schedule('0 15 * * *', () => { sendLeadSummaryReport('15h chiều', 6); }, { timezone: "Asia/Ho_Chi_Minh" });
cron.schedule('0 20 * * *', () => { sendLeadSummaryReport('20h tối', 5); }, { timezone: "Asia/Ho_Chi_Minh" });

const app = express();

// --- Cấu hình CORS bảo mật (Lấy từ bản cũ sang) ---
app.use(cors({
    origin: ['https://xaloenglish.vercel.app', 'https://www.xalo.edu.vn', 'https://xalo.edu.vn'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blog-posts', blogPostRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/mentors', mentorRoutes);
app.use('/api/v1/student-results', studentResultRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/settings', settingRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// --- Xử lý Production (Phục vụ FE từ BE nếu cần) ---
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    // Catch-all route to serve index.html for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => { res.send('Xalo English API is running...'); });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
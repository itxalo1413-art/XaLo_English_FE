import React from 'react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import ApplicationForm from '../admin/components/ApplicationForm';
import client from '../api/client';
import { DollarSign, Smile, Plane, Gift } from 'lucide-react';
import slider_khac from '../assets/slider/sliderKhac.png'


const CareersPage = () => {
    const benefits = [
        {
            image: "salary.png",
            title: "Mức lương cao trong thị trường tuyển dụng"
        },
        {
            image: "dynamic.png",
            title: "Môi trường làm việc trẻ, cởi mở, năng động, tôn trọng và tạo điều kiện phát huy giá trị bản thân"
        },
        {
            image: "travel.png",
            title: "Mỗi năm đi du lịch 2-3 lần"
        },
        {
            image: "policy.png",
            title: "Được hưởng các quyền lợi theo chính sách của công ty"
        }
    ];

    const [activeTab, setActiveTab] = React.useState('job-openings');
    const [applicationForm, setApplicationForm] = React.useState({ isOpen: false, position: '' });
    const hardcodedJobTitlesJobOpenings = ['Cộng Tác Viên Sales', 'Nhân Viên Tư Vấn Khóa Học'];
    const hardcodedAcademicTitles = ['Giáo viên IELTS'];
    const [jobPositions, setJobPositions] = React.useState([]);
    const [jobPositionsLoading, setJobPositionsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const loadPositions = async () => {
            try {
                const response = await client.get('/job-positions');
                if (!isMounted) return;
                setJobPositions(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Failed to fetch job positions:', err);
                if (!isMounted) return;
                setJobPositions([]);
            } finally {
                if (!isMounted) return;
                setJobPositionsLoading(false);
            }
        };

        loadPositions();
        return () => {
            isMounted = false;
        };
    }, []);

    const isIeltsRole = (pos) => {
        // User requirement: roles with IELTS requirements should appear in tab ACADEMIC.
        const requirementsText = Array.isArray(pos?.requirements) ? pos.requirements.join(' ') : '';
        const requirementsLower = requirementsText.toLowerCase();
        if (requirementsLower.includes('ielts')) return true;

        // Fallback: if requirements are empty/absent, use title/description to avoid missing roles.
        if (!requirementsLower.trim()) {
            const titleText = (pos?.title || '').toLowerCase();
            const descriptionText = (pos?.description || '').toLowerCase();
            return `${titleText} ${descriptionText}`.includes('ielts');
        }

        return false;
    };

    const additionalJobPositions = jobPositions.filter((pos) => {
        if (!pos?.title) return false;
        if (hardcodedJobTitlesJobOpenings.includes(pos.title)) return false;
        if (hardcodedAcademicTitles.includes(pos.title)) return false;
        return true;
    });

    const academicAdditionalJobPositions = additionalJobPositions.filter(isIeltsRole);
    const jobOpeningsAdditionalJobPositions = additionalJobPositions.filter((pos) => !isIeltsRole(pos));

    return (
        <div className="pt-20 bg-white">
            <ApplicationForm 
                jobPosition={applicationForm.position}
                isOpen={applicationForm.isOpen}
                onClose={() => setApplicationForm({ isOpen: false, position: '' })}
            />
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[60vh]"
                style={{
                    backgroundImage: `url(${slider_khac})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-primary-dark opacity-70"></div>

                <div className="container mx-auto px-4 relative z-10">

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 uppercase tracking-widest drop-shadow-md">Tuyển dụng tại <br />Xa Lộ English</h1>
                </div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
            </section>


            {/* Benefits Section */}
            <Section className='mt-16'>
                <h2 className="text-center mb-16 text-3xl font-bold text-primary-dark uppercase tracking-wide">ĐỒNG HÀNH VỚI XA LỘ ENGLISH, bạn sẽ nhận được</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {benefits.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4 group">
                            <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                                <img src={item.image} alt={item.title} className="w-24 h-24 object-contain" />
                            </div>
                            <p className="text-text-primary font-medium leading-relaxed">{item.title}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Job Openings Section */}
            <Section className="mb-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex border-b border-gray-200 mb-8">
                        <button
                            className={`py-4 px-8 font-bold text-lg uppercase tracking-wide transition-colors duration-300 ${activeTab === 'job-openings' ? 'text-primary-dark border-b-4 border-primary-dark' : 'text-text-secondary hover:text-primary-dark'}`}
                            onClick={() => setActiveTab('job-openings')}
                        >
                            JOB OPENINGS
                        </button>
                        <button
                            className={`py-4 px-8 font-bold text-lg uppercase tracking-wide transition-colors duration-300 ${activeTab === 'academic' ? 'text-primary-dark border-b-4 border-primary-dark' : 'text-text-secondary hover:text-primary-dark'}`}
                            onClick={() => setActiveTab('academic')}
                        >
                            ACADEMIC
                        </button>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
                        {activeTab === 'job-openings' && (
                            <>
                                {/* Cộng Tác Viên Sales */}
                                <div className="border-b border-gray-100 pb-8 mb-8">
                                    <h3 className="text-2xl font-bold text-primary-dark mb-6">Cộng Tác Viên Sales</h3>

                                    {/* Job Description */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Mô tả công việc</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Tiếp nhận & xử lý data học viên từ Marketing và BD</li>
                                            <li>Tư vấn khóa học theo đúng kịch bản, chính sách & giá bán</li>
                                            <li>Thực hiện quy trình bán hàng: tư vấn, chốt đăng ký, hướng dẫn thanh toán, hoàn tất hợp đồng</li>
                                            <li>Cập nhật trạng thái lead, thông tin học viên & doanh thu trên hệ thống</li>
                                            <li>Phản hồi chất lượng lead, báo cáo tỉ lệ chốt & lý do không chốt</li>
                                            <li>Phối hợp Marketing & BD để tối ưu hiệu quả bán hàng</li>
                                            <li>Thực hiện các công việc được cấp trên yêu cầu trong lĩnh vực chuyên môn</li>
                                        </ul>
                                    </div>

                                    {/* Candidate Requirements */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Yêu cầu ứng viên</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Có kinh nghiệm Sale/Tư vấn (ưu tiên giáo dục, dịch vụ)</li>
                                            <li>Giao tiếp tốt, giọng nói rõ ràng, thuyết phục</li>
                                            <li>Có tư duy doanh số, chịu được áp lực KPI</li>
                                            <li>Thành thạo tin học văn phòng cơ bản, cập nhật CRM nhanh</li>
                                            <li>Chủ động, kiên trì, có tinh thần học hỏi</li>
                                        </ul>
                                    </div>

                                    {/* Salary */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Thu nhập</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Thu nhập: 8 - 10 triệu VND</li>
                                            <li>Lương cứng không phụ thuộc doanh số</li>
                                        </ul>
                                    </div>

                                    {/* Benefits */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Quyền lợi</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Hoa hồng + thưởng doanh số</li>
                                            <li>Được đào tạo kịch bản & kỹ năng chốt sale bài bản (với dữ liệu có sẵn từ đội ngũ Marketing)</li>
                                            <li>Lộ trình thăng tiến rõ ràng</li>
                                        </ul>
                                    </div>

                                    <Button variant="primary" size="small" className="shadow-md hover:shadow-lg" onClick={() => setApplicationForm({ isOpen: true, position: 'Cộng Tác Viên Sales' })}>Apply now</Button>
                                </div>

                                {/* Nhân Viên Tư Vấn Khóa Học */}
                                <div className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
                                    <h3 className="text-2xl font-bold text-primary-dark mb-6">Nhân Viên Tư Vấn Khóa Học</h3>

                                    {/* Job Description */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Mô tả công việc</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Tiếp nhận và xử lý data khách hàng từ các nguồn khác nhau của công ty</li>
                                            <li>Tư vấn khóa học tiếng Anh (IELTS, giao tiếp, chương trình thiếu nhi,...) phù hợp với nhu cầu của học viên</li>
                                            <li>Thuyết phục và chốt đăng ký khóa học</li>
                                            <li>Chăm sóc khách hàng trước – trong – sau khi đăng ký</li>
                                            <li>Phối hợp với team học thuật để đảm bảo chất lượng trải nghiệm học viên</li>
                                            <li>Cập nhật thông tin khách hàng trên hệ thống</li>
                                        </ul>
                                    </div>

                                    {/* Candidate Requirements */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Yêu cầu ứng viên</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Nữ, có ngoại hình, độ tuổi từ 22-30</li>
                                            <li>Ưu tiên ứng viên có kinh nghiệm làm việc trong môi trường giáo dục</li>
                                            <li>Tốt nghiệp Cao đẳng trở lên</li>
                                            <li>Kỹ năng giao tiếp và thuyết phục tốt</li>
                                            <li>Thái độ nhiệt tình, kiên nhẫn và chuyên nghiệp</li>
                                        </ul>
                                    </div>

                                    {/* Salary */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Thu nhập</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Thu nhập khi đạt 100% KPI: Thoả thuận</li>
                                            <li>Thu nhập tính theo tỷ lệ đạt KPI</li>
                                            <li>Lương cứng không phụ thuộc doanh số</li>
                                        </ul>
                                    </div>

                                    {/* Benefits */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Quyền lợi</h4>
                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                            <li>Mức lương: thỏa thuận theo năng lực</li>
                                            <li>Thưởng theo doanh số và hiệu quả công việc tháng/quý/năm</li>
                                            <li>Cơ hội thăng tiến rõ ràng theo năng lực</li>
                                            <li>Môi trường làm việc chuyên nghiệp, năng động và thân thiện</li>
                                            <li>Chế độ bảo hiểm đầy đủ, nghỉ phép, nghỉ lễ theo quy định của pháp luật</li>
                                            <li>Bảo hiểm xã hội, Bảo hiểm sức khỏe, Thưởng tháng 13</li>
                                        </ul>
                                    </div>

                                    <Button variant="primary" size="small" className="shadow-md hover:shadow-lg" onClick={() => setApplicationForm({ isOpen: true, position: 'Nhân Viên Tư Vấn Khóa Học' })}>Apply now</Button>
                                </div>

                                {!jobPositionsLoading && jobOpeningsAdditionalJobPositions.length > 0 && (
                                    <>
                                        {jobOpeningsAdditionalJobPositions.map((pos) => (
                                            <div
                                                key={pos._id || pos.title}
                                                className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0"
                                            >
                                                <h3 className="text-2xl font-bold text-primary-dark mb-6">
                                                    {pos.title}
                                                </h3>

                                                {/* Job Description */}
                                                <div className="mb-6">
                                                    <h4 className="text-lg font-bold text-primary-dark mb-4">Mô tả công việc</h4>
                                                    {pos.description ? (
                                                        <p className="text-text-secondary whitespace-pre-line">
                                                            {pos.description}
                                                        </p>
                                                    ) : (
                                                        <p className="text-text-secondary">N/A</p>
                                                    )}
                                                </div>

                                                {/* Candidate Requirements */}
                                                {Array.isArray(pos.requirements) && pos.requirements.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Yêu cầu ứng viên</h4>
                                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                            {pos.requirements.map((req, idx) => (
                                                                <li key={`${pos.title}-req-${idx}`}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Salary */}
                                                <div className="mb-6">
                                                    <h4 className="text-lg font-bold text-primary-dark mb-4">Thu nhập</h4>
                                                    <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                        <li>{pos.salary || 'Thương lượng'}</li>
                                                    </ul>
                                                </div>

                                                {/* Benefits */}
                                                {Array.isArray(pos.benefits) && pos.benefits.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Quyền lợi</h4>
                                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                            {pos.benefits.map((benefit, idx) => (
                                                                <li key={`${pos.title}-benefit-${idx}`}>{benefit}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <Button
                                                    variant="primary"
                                                    size="small"
                                                    className="shadow-md hover:shadow-lg"
                                                    onClick={() => setApplicationForm({ isOpen: true, position: pos.title })}
                                                >
                                                    Apply now
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'academic' && (
                            <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                                <h3 className="text-2xl font-bold text-primary-dark mb-6">
                                    <a href="https://xalo.edu.vn/giao-vien-ielts" className="hover:underline">Giáo viên IELTS</a>
                                </h3>

                                {/* Job Description */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-primary-dark mb-4">MÔ TẢ CÔNG VIỆC</h4>
                                    <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                        <li>Phụ trách các công tác quản lý và giảng dạy cho các lớp học đào tạo IELTS của trung tâm (có 2 loại hình lớp, bao gồm: lớp nhóm và lớp 1-1)</li>
                                        <li>Hình thức giảng dạy: ONLINE hoặc OFFLINE tại trung tâm (đường Nguyễn Đình Chính, phường Phú Nhuận, Tp. HCM)</li>
                                        <li>Thời gian làm việc: Lớp nhóm: 2-4-6 hoặc 3-5-7 với hai khung giờ sau: 18h-19h45 và 19h45-21h30; Lớp 1-1: được sắp xếp dựa trên thời gian rảnh của giáo viên và học viên tối thiểu 4-6 tiếng/tuần</li>
                                    </ul>
                                </div>

                                {/* Candidate Requirements */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-primary-dark mb-4">YÊU CẦU ỨNG VIÊN</h4>
                                    <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                        <li>Độ tuổi: ưu tiên các ứng viên có độ tuổi từ 21-28 tuổi</li>
                                        <li>Tốt nghiệp từ cao đẳng/đại học trở lên (Ưu tiên các ngành liên quan đến ngôn ngữ/sư phạm)</li>
                                        <li>Có chứng chỉ IELTS từ 8.0 trở lên (không có kỹ năng nào dưới 7.0)</li>
                                        <li>Có chứng chỉ TESOL (hoặc các chứng chỉ tương đương khác)</li>
                                        <li>Phát âm chuẩn, giao tiếp rõ ràng, dễ hiểu</li>
                                        <li>Có đam mê giảng dạy, nguồn năng lượng vui vẻ, dễ chia sẻ và quản lý lớp tốt là lợi thế lớn</li>
                                        <li>Tác phong chuyên nghiệp, đúng giờ, tuân thủ quy trình và cam kết với chất lượng dạy học</li>
                                        <li>Có tinh thần học hỏi, cầu tiến và hợp tác với các bộ phận liên quan</li>
                                    </ul>
                                </div>

                                {/* Benefits */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-primary-dark mb-4">CHÍNH SÁCH ĐÃI NGỘ</h4>
                                    <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                        <li>Mức lương: 250,000 - 450,000 VND/giờ (tùy theo năng lực & kinh nghiệm)</li>
                                        <li>Thưởng theo thành tích</li>
                                        <li>Trung tâm tài trợ mỗi năm thi IELTS miễn phí</li>
                                        <li>Được tài trợ các khoá học để nâng cao kỹ năng mềm và kỹ năng giảng dạy</li>
                                        <li>Môi trường làm việc trẻ, chuyên nghiệp, cởi mở, năng động, tôn trọng và tạo điều kiện phát huy giá trị bản thân</li>
                                        <li>Được hưởng các quyền lợi theo chính sách của công ty</li>
                                    </ul>
                                </div>

                                <Button variant="primary" size="small" className="shadow-md hover:shadow-lg" onClick={() => setApplicationForm({ isOpen: true, position: 'Giáo viên IELTS' })}>Apply now</Button>

                                {!jobPositionsLoading && academicAdditionalJobPositions.length > 0 && (
                                    <>
                                        {academicAdditionalJobPositions.map((pos) => (
                                            <div
                                                key={pos._id || pos.title}
                                                className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0"
                                            >
                                                <h3 className="text-2xl font-bold text-primary-dark mb-6">
                                                    {pos.title}
                                                </h3>

                                                <div className="mb-6">
                                                    <h4 className="text-lg font-bold text-primary-dark mb-4">Mô tả công việc</h4>
                                                    {pos.description ? (
                                                        <p className="text-text-secondary whitespace-pre-line">
                                                            {pos.description}
                                                        </p>
                                                    ) : (
                                                        <p className="text-text-secondary">N/A</p>
                                                    )}
                                                </div>

                                                {Array.isArray(pos.requirements) && pos.requirements.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Yêu cầu ứng viên</h4>
                                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                            {pos.requirements.map((req, idx) => (
                                                                <li key={`${pos.title}-req-${idx}`}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="mb-6">
                                                    <h4 className="text-lg font-bold text-primary-dark mb-4">Thu nhập</h4>
                                                    <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                        <li>{pos.salary || 'Thương lượng'}</li>
                                                    </ul>
                                                </div>

                                                {Array.isArray(pos.benefits) && pos.benefits.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-lg font-bold text-primary-dark mb-4">Quyền lợi</h4>
                                                        <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                                                            {pos.benefits.map((benefit, idx) => (
                                                                <li key={`${pos.title}-benefit-${idx}`}>{benefit}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <Button
                                                    variant="primary"
                                                    size="small"
                                                    className="shadow-md hover:shadow-lg"
                                                    onClick={() => setApplicationForm({ isOpen: true, position: pos.title })}
                                                >
                                                    Apply now
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default CareersPage;

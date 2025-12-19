import React from 'react';
import { ArrowRight, CheckCircle, Award, Users, BookOpen } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import CourseCard from '../components/features/CourseCard';
import ReviewCard from '../components/features/ReviewCard';

import CourseCategories from '../components/features/CourseCategories';
import TeachersCarousel from '../components/features/TeachersCarousel';
import ReferenceMaterials from '../components/features/ReferenceMaterials';
import CTASection from '../components/features/CTASection';
import HomePopup from '../components/features/HomePopup';
import StudentResultModal from '../components/features/StudentResultModal';

import { useState, useEffect } from 'react';
import client from '../api/client';
import CoursesTabs from '../components/features/CoursesTabs';

const HomePage = () => {
  const [studentResults, setStudentResults] = useState([]);
  const [programTracks, setProgramTracks] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, tracksRes] = await Promise.all([
          client.get('/student-results'),
          client.get('/programs/tracks')
        ]);

        const resultsData = resultsRes.data;
        const resultsArray = Array.isArray(resultsData) ? resultsData : (resultsData?.results ?? resultsData?.data ?? []);

        const tracksData = tracksRes.data;
        const tracksArray = Array.isArray(tracksData) ? tracksData : (tracksData?.tracks ?? tracksData?.data ?? []);

        setStudentResults(resultsArray.slice(0, 3));
        setProgramTracks(tracksArray.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowResult = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  return (
    <div className="pt-20">
      <HomePopup />
      {/* Hero Section */}
      <section className="relative min-h-[600px] h-auto flex items-center text-white overflow-hidden py-12">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[120%] bg-gradient-to-br from-primary-light to-primary-dark rounded-l-full opacity-10 z-0"></div>
        <div className="container mx-auto px-4 md:px-8 xl:px-24 2xl:px-32 relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-primary leading-tight">
              Chinh Phục Tiếng Anh <br />
              <span className="text-primary">Mất Gốc</span> Cùng Xalo
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-xl">
              Phương pháp <strong>Chấn - Chữa</strong> độc quyền. Giúp bạn lấy lại căn bản,
              tự tin giao tiếp và đạt điểm cao IELTS chỉ sau một lộ trình.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="primary" size="large" onClick={() => window.location.href = '/courses'}>
                Khám Phá Khóa Học <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button variant="secondary" size="large" onClick={() => window.location.href = '/about'}>
                Về Chúng Tôi
              </Button>
            </div>
            <div className="flex gap-12 border-t border-border pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-dark">1000+</span>
                <span className="text-sm text-text-secondary uppercase tracking-wider">Học Viên</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-dark">98%</span>
                <span className="text-sm text-text-secondary uppercase tracking-wider">Đạt Mục Tiêu</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-dark">8.0+</span>
                <span className="text-sm text-text-secondary uppercase tracking-wider">IELTS Mentor</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
            <img src={"carousel.png" || "https://placehold.co/800x600?text=Carousel"} alt="Xalo English Student" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Courses Categories Section */}
      <div className='max-w-5xl mx-auto'>

      <CourseCategories />
      </div>

      {/* Features Section */}
      <Section className="py-24 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 uppercase tracking-tight">
            TẠI SAO BẠN NÊN CHỌN XA LỘ ENGLISH?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item 1: Full Width */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="p-8 md:w-1/2 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="bg-[#e9d5ff] text-[#7e22ce] font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg mr-4 shadow-sm">1</div>
                  <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                    Quy trình "Chấn - Chữa" giúp học viên định vị bản thân rõ ràng
                  </h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-justify">
                  Xa Lộ English tin rằng muốn học đúng cách thì trước hết phải hiểu đúng mình. Bằng quy trình "Chấn - Chữa", học viên sẽ được "chấn" để nhìn ra điểm mạnh, điểm yếu, cũng như những rào cản trên hành trình IELTS. Từ đó, giáo viên sẽ "chữa" bằng việc xây dựng lộ trình học tập phù hợp với trình độ và mục tiêu cá nhân. Cách tiếp cận này giống như đi khám bệnh: chỉ khi chẩn đúng, thì chữa mới trúng. Nhờ vậy, học viên có định hướng rõ ràng, tránh học sai cách và nhanh chóng đạt được kết quả mong muốn.
                </p>
              </div>
              <div className="md:w-1/2 relative min-h-[300px]">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/ZsJGAdcC-5U" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer hover:bg-black/30 transition-all">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#fbcfe8] text-[#be185d] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">2</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1 leading-tight">
                  Học để dùng - cốt lõi của ngôn ngữ và nền tảng bền vững cho tương lai
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <img
                    src="https://xalo.edu.vn/image/cache/catalog/services/hinhweb-artboard-1-copy-200x210.png"
                    alt="Illustration"
                    className="w-full h-auto rounded-lg mb-4 md:mb-0"
                  />
                </div>
                <p className="text-text-secondary leading-relaxed text-justify md:w-1/2 text-sm">
                  IELTS không chỉ là một kỳ thi, mà còn là cơ hội để người học rèn luyện khả năng sử dụng tiếng Anh trong đời sống và công việc. Tại Xa Lộ English, học viên được hướng dẫn "học để dùng" thay vì chạy theo mẹo vặt ngắn hạn. Trên lớp, các bạn được khuyến khích thảo luận, tranh luận và ứng dụng kiến thức vào tình huống thực tế.
                </p>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#e9d5ff] text-[#7e22ce] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">3</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                  Mở ra nhiều cơ hội học tập và sự nghiệp
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-justify">
                Khi đã học đúng cách và có nền tảng ngôn ngữ vững vàng, học viên tại Xa Lộ English không chỉ đạt được band điểm IELTS như mong muốn, mà còn mở ra nhiều cơ hội lớn hơn: từ du học, học bổng, thi cử trong nước đến phát triển sự nghiệp và hội nhập quốc tế. IELTS trở thành chiếc chìa khóa, còn năng lực tiếng Anh thực tiễn chính là hành trang lâu dài.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#fbcfe8] text-[#be185d] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">4</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                  Lớp học quy mô nhỏ, theo sát từng học viên
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-justify">
                Để đảm bảo mỗi học viên đều được "chấn" và hỗ trợ kịp thời, Xa Lộ English giữ quy mô lớp học nhỏ: tối đa 8 học viên với lớp offline và 10 học viên với lớp online. Quy mô này giúp giáo viên dễ dàng quan sát tiến độ của từng bạn, can thiệp khi cần thiết và tạo ra môi trường học tập gần gũi, nhiều tương tác.
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#e9d5ff] text-[#7e22ce] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">5</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                  Đội ngũ giáo viên tận tâm, nhiều năm kinh nghiệm
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <p className="text-text-secondary leading-relaxed text-justify md:w-1/2 text-sm">
                  Đội ngũ giáo viên tại Xa Lộ English đều có chứng chỉ quốc tế và kinh nghiệm giảng dạy thực tế phong phú. Đội ngũ giáo viên không chỉ truyền đạt kiến thức, mà còn đồng hành cùng với học viên: động viên, giải đáp thắc mắc, chia sẻ tài liệu và giúp học viên giữ được tinh thần bền bỉ.
                </p>
                <div className="md:w-1/2">
                  <img
                    src="https://xalo.edu.vn/image/cache/catalog/services/hinhweb-artboard-1-0x0.png"
                    alt="Teachers"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item 6 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#e9d5ff] text-[#7e22ce] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">6</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                  Cam kết đầu ra bằng hợp đồng rõ ràng
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3">
                  <img
                    src="https://xalo.edu.vn/image/cache/catalog/services/hinh-iconmoney-0x0.png"
                    alt="Commitment"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <p className="text-text-secondary leading-relaxed text-justify md:w-2/3 text-sm">
                  Xa Lộ English là một trong số ít trung tâm ký hợp đồng cam kết chất lượng với học viên. Sau mỗi khóa học, học viên được đảm bảo tăng từ 0.5 đến 1.5 band điểm. Đây không chỉ là lời khẳng định về năng lực giảng dạy, mà còn là minh chứng cho sự đồng hành và trách nhiệm.
                </p>
              </div>
            </div>
          </div>

          {/* Item 7 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start mb-6">
                <div className="bg-[#fbcfe8] text-[#be185d] font-bold text-xl w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 shadow-sm">7</div>
                <h3 className="bg-[#312e81] text-white font-bold text-lg py-3 px-6 rounded-r-full -ml-4 pr-8 shadow-md flex-1">
                  Lộ trình tiết kiệm thời gian và chi phí
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-justify">
                Với việc học tập dựa trên sự thấu hiểu bản thân và tập trung vào đúng vấn đề, học viên tại Xa Lộ English có thể rút ngắn tới 40% thời gian học so với cách học thông thường. Điều này đồng nghĩa với việc tiết kiệm chi phí trong dài hạn, đồng thời đạt được hiệu quả nhanh chóng và bền vững.
              </p>
            </div>
          </div>

        </div>
      </Section>

      {/* Student Achievements Section */}
      <section className="py-24 bg-[#e0e7ff]/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#312e81] mb-12 text-center uppercase">
            BẢNG VÀNG HỌC VIÊN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {studentResults.map((result) => (
              <div key={result._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
                {/* <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-purple-500 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={result.profileImgURL || "https://placehold.co/100x100?text=Avatar"}
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div> */}
                <div className="flex justify-between items-end w-full mb-4 px-2">
                  <h3 className="text-lg font-bold text-gray-800 uppercase">{result.name}</h3>
                  <span className="text-4xl font-extrabold text-gray-700">{Number(result.overall).toFixed(1)}</span>
                </div>
                <div className="flex gap-4 text-left mb-6">
                  <div className="w-1/3 flex-shrink-0">
                    <img
                      src={result.certificateImageUrl || "https://placehold.co/150x200?text=IELTS"}
                      alt="Certificate"
                      className="w-full h-auto rounded shadow-sm border border-gray-200"
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm text-gray-600 italic line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: result.testimonial }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleShowResult(result)}
                  className="mt-auto bg-[#5b5e98] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a4d85] transition-colors shadow-md w-full md:w-auto"
                >
                  Xem thêm
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a href="/achievements" className="text-[#312e81] font-bold hover:underline text-lg inline-flex items-center gap-2">
              Xem thêm các thành tích khác của học viên tại Xa Lộ English
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Teachers Carousel Section */}
      <TeachersCarousel />


      {/* Popular Courses Preview */}
      <Section className="bg-gray-50 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Khóa Học Nổi Bật</h2>
            <p className="text-text-secondary text-lg">Lộ trình học được thiết kế cá nhân hóa.</p>
          </div>
          <Button variant="ghost" onClick={() => window.location.href = '/courses'}>
            Xem Tất Cả <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programTracks.map((track) => (
            <CourseCard
              key={track._id}
              title={track.name}
              image={track.detailIllustrationUrl || "https://placehold.co/400x300/6366f1/ffffff?text=Course"}
              features={track.syllabusItems?.slice(0, 3).map(s => s.title) || []}
              link={`/course-details/${track.slug}`}
              hideFeatures={true}
            />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="py-24">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-dark mb-12">Học Viên Nói Gì Về Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReviewCard
            name="Nguyễn Văn A"
            role="Học viên Foundation"
            rating={5}
            content="Mình mất gốc tiếng Anh hoàn toàn nhưng sau khóa Foundation tại Xalo, mình đã tự tin hơn rất nhiều. Giáo viên cực kỳ nhiệt tình!"
            image="https://placehold.co/100x100?text=A"
          />
          <ReviewCard
            name="Trần Thị B"
            role="Học viên IELTS"
            rating={5}
            content="Phương pháp dạy rất hay, không gây nhàm chán. Mình đã đạt 6.5 IELTS chỉ sau 3 tháng ôn luyện tại đây."
            image="https://placehold.co/100x100?text=B"
          />
          <ReviewCard
            name="Lê Văn C"
            role="Học viên Giao tiếp"
            rating={5}
            content="Môi trường học tập năng động, các bạn cùng lớp rất hòa đồng. Thầy cô luôn support 24/7."
            image="https://placehold.co/100x100?text=C"
          />
        </div>
      </Section>



      {/* Reference Materials Section */}
      <ReferenceMaterials />

      {/* CTA Section */}
      <CTASection />

      <StudentResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={selectedResult}
      />
    </div >
  );
};

export default HomePage;

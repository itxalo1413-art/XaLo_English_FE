import React, { useState } from 'react';
import client from '../../api/client';

const DEFAULT_TITLE = 'CHẨN BỆNH TIẾNG ANH CÙNG XA LỘ ENGLISH ĐỂ ĐẠT MỤC TIÊU NGAY BÂY GIỜ!';
const DEFAULT_SUBTITLE = 'Chẩn bệnh tiếng Anh cùng Xa Lộ English để đạt được mục tiêu ngay bây giờ!';

const CTASection = ({ title, subtitle, buttonText } = {}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    goals: [],
    consultationTime: [],
    otherGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentList = prev[field];
      if (checked) {
        return { ...prev, [field]: [...currentList, value] };
      } else {
        return { ...prev, [field]: currentList.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    // Combine otherGoal into goals if present
    const finalGoals = [...formData.goals];
    if (formData.otherGoal) {
      finalGoals.push(`Khác: ${formData.otherGoal}`);
    }

    try {
      await client.post('/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        goals: finalGoals,
        consultationTime: formData.consultationTime
      });
      setMessage({ type: 'success', text: 'Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        goals: [],
        consultationTime: [],
        otherGoal: ''
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark uppercase mb-4">
            {title || DEFAULT_TITLE}
          </h2>
          <p className="text-text-secondary">
            {subtitle || DEFAULT_SUBTITLE}
          </p>
        </div>

        <div className="bg-[#5b5e98] rounded-3xl p-8 md:p-12 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Survey */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="mb-8">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Mục đích học tiếng Anh/ IELTS của bạn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                  {['Đi du học', 'Định cư nước ngoài', 'Đầu vào/ đầu ra đại học', 'Thăng tiến trong công việc', 'Rất yêu thích tiếng Anh'].map((goal) => (
                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={goal}
                        checked={formData.goals.includes(goal)}
                        onChange={(e) => handleCheckboxChange(e, 'goals')}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700 text-sm">{goal}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.otherGoal}
                      readOnly
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700 text-sm">Lí do khác:
                      <input
                        type="text"
                        name="otherGoal"
                        value={formData.otherGoal}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-primary outline-none w-20 text-sm ml-1"
                      />
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4">Bạn muốn Xa Lộ English tư vấn vào khung thời gian nào</h3>
                <div className="space-y-3">
                  {['Buổi sáng (9a.m. - 12p.m.)', 'Buổi chiều (12p.m - 18p.m)', 'Buổi tối (18p.m. - 23p.m.)'].map((time) => (
                    <label key={time} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={time}
                        checked={formData.consultationTime.includes(time)}
                        onChange={(e) => handleCheckboxChange(e, 'consultationTime')}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700 text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact Info */}
            <div className="flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">Tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Tên"
                    className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-pink-300 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">Điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Điện thoại"
                    className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-pink-300 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-pink-300 outline-none bg-white"
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#e9a6c5] hover:bg-[#d68baf] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors uppercase disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : buttonText || 'Đăng ký tư vấn'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiExternalLink } from 'react-icons/fi';

const InternalAvailability = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  // Google Form URL - Replace with your actual form URL
  const GOOGLE_FORM_URL = process.env.REACT_APP_GOOGLE_FORM_URL || 'https://forms.gle/your-form-id';

  const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Lịch rảnh</h1>
        <p className="text-gray-600">Điền lịch rảnh của bạn để sắp xếp buổi tập</p>
      </div>

      {/* Google Form Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Điền lịch rảnh</h2>
            <p className="text-gray-600">
              Sử dụng Google Form để điền lịch rảnh của bạn. Dữ liệu sẽ được tự động lưu vào Google Sheets.
            </p>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Mở Google Form</span>
            <FiExternalLink />
          </a>
        </div>
      </motion.div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedWeek.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Tuần trước
            </button>
            <button
              onClick={() => setSelectedWeek(new Date())}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hôm nay
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Tuần sau →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="font-semibold text-gray-700">Giờ</div>
              {weekDates.map((date, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold text-gray-700">{daysOfWeek[date.getDay()]}</div>
                  <div className="text-sm text-gray-500">{date.getDate()}/{date.getMonth() + 1}</div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {timeSlots.map((time, timeIndex) => (
                <div key={timeIndex} className="grid grid-cols-8 gap-2">
                  <div className="text-sm text-gray-600 py-2">{time}</div>
                  {weekDates.map((date, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="h-12 border border-gray-200 rounded hover:bg-primary-50 cursor-pointer transition-colors"
                      title={`${daysOfWeek[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1} - ${time}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Lưu ý:</strong> Lịch này chỉ mang tính chất tham khảo. 
            Để cập nhật lịch rảnh chính xác, vui lòng sử dụng Google Form ở trên.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InternalAvailability;


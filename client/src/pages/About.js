import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';

const About = () => {
  const [stats, setStats] = useState({ members: 0, events: 0, photos: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, eventsRes, galleryRes] = await Promise.all([
          api.get('/members'),
          api.get('/events'),
          api.get('/gallery')
        ]);
        setStats({
          members: membersRes.data.length,
          events: eventsRes.data.length,
          photos: galleryRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Về S.O.W Club
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Câu lạc bộ múa S.O.W (Soul On Wings) được thành lập với sứ mệnh mang đến 
              không gian để các bạn trẻ thể hiện đam mê và tài năng của mình thông qua nghệ thuật múa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Thành viên', value: stats.members, icon: '👥' },
              { label: 'Sự kiện', value: stats.events, icon: '🎭' },
              { label: 'Ảnh & Video', value: stats.photos, icon: '📸' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}+</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-gray-700 leading-relaxed"
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-800">Câu chuyện của chúng tôi</h2>
              
              <p>
                CLB S.O.W được thành lập với mong muốn tạo ra một cộng đồng nơi mọi người có thể 
                tự do thể hiện bản thân thông qua nghệ thuật múa. Chúng tôi tin rằng mỗi người đều 
                có một câu chuyện riêng để kể, và múa là cách tuyệt vời nhất để kể câu chuyện đó.
              </p>

              <p>
                Từ những buổi tập đầu tiên đến những màn biểu diễn lớn, chúng tôi đã cùng nhau 
                trải qua nhiều thử thách và thành công. Mỗi thành viên đều đóng góp một phần 
                quan trọng vào hành trình phát triển của câu lạc bộ.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Sứ mệnh</h3>
              <p>
                Tạo ra một môi trường nơi mọi người có thể phát triển kỹ năng múa, xây dựng tình bạn 
                bền chặt, và cùng nhau tạo ra những màn biểu diễn đáng nhớ.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Tầm nhìn</h3>
              <p>
                Trở thành một trong những câu lạc bộ múa hàng đầu, nơi nuôi dưỡng tài năng và 
                lan tỏa tình yêu nghệ thuật đến cộng đồng.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


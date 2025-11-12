import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';
import { FiImage } from 'react-icons/fi';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGallery();
  }, [filter]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gallery');
      let filtered = response.data;
      
      if (filter !== 'all') {
        filtered = filtered.filter(item => item.category === filter);
      }
      
      setGallery(filtered);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'performance', label: 'Biểu diễn' },
    { value: 'practice', label: 'Tập luyện' },
    { value: 'behind-scenes', label: 'Hậu trường' },
    { value: 'event', label: 'Sự kiện' }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Thư viện ảnh
          </motion.h1>
          <p className="text-xl opacity-90">
            Những khoảnh khắc đẹp nhất của S.O.W Club
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-20">
            <FiImage size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Chưa có ảnh nào trong danh mục này</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.imageUrl?.startsWith('http') 
                    ? item.imageUrl 
                    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.imageUrl || item.thumbnailUrl}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={selectedImage.imageUrl?.startsWith('http') 
                ? selectedImage.imageUrl 
                : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedImage.imageUrl || selectedImage.thumbnailUrl}`}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;


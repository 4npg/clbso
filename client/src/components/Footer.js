import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              S.O.W Club
            </h3>
            <p className="text-gray-400 text-sm">
              Soul On Wings - Nơi đam mê và tài năng gặp nhau. 
              Chúng tôi tin rằng mỗi bước nhảy đều kể một câu chuyện.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Thư viện ảnh
                </Link>
              </li>
              <li>
                <Link to="/members" className="hover:text-white transition-colors">
                  Thành viên
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Lịch hoạt động
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <FiMail />
                <span>clbsowtruongthptdh@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/s.o.w_clbmuac3dh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FiInstagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61579095361256"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <FiYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} S.O.W Club - Soul On Wings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


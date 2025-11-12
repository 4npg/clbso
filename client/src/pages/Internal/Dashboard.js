import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { FiFileText, FiCalendar, FiDollarSign, FiImage, FiTrendingUp, FiUsers } from 'react-icons/fi';

const InternalDashboard = () => {
  const [stats, setStats] = useState({
    reports: 0,
    finances: { income: 0, expense: 0, balance: 0 },
    events: 0,
    gallery: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reportsRes, financeRes, eventsRes, galleryRes] = await Promise.all([
        api.get('/reports'),
        api.get('/finance/stats'),
        api.get('/events'),
        api.get('/gallery')
      ]);

      setStats({
        reports: reportsRes.data.length,
        finances: financeRes.data,
        events: eventsRes.data.length,
        gallery: galleryRes.data.length
      });

      // Get recent reports
      const recent = reportsRes.data.slice(0, 5);
      setRecentReports(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Báo cáo',
      value: stats.reports,
      icon: FiFileText,
      color: 'primary',
      link: '/internal/reports'
    },
    {
      title: 'Sự kiện',
      value: stats.events,
      icon: FiCalendar,
      color: 'secondary',
      link: '/events'
    },
    {
      title: 'Thu - Chi',
      value: `${stats.finances.balance.toLocaleString('vi-VN')} đ`,
      icon: FiDollarSign,
      color: stats.finances.balance >= 0 ? 'green' : 'red',
      link: '/internal/finance'
    },
    {
      title: 'Ảnh nội bộ',
      value: stats.gallery,
      icon: FiImage,
      color: 'primary',
      link: '/internal/gallery'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động của S.O.W Club</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const colorClass = stat.color === 'primary' 
                ? 'bg-primary-600' 
                : stat.color === 'secondary'
                ? 'bg-secondary-600'
                : stat.color === 'green'
                ? 'bg-green-600'
                : 'bg-red-600';

              return (
                <Link key={index} to={stat.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${colorClass} text-white`}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Finance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tài chính</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Tổng thu</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.finances.totalIncome?.toLocaleString('vi-VN') || 0} đ
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Tổng chi</span>
                  <span className="text-2xl font-bold text-red-600">
                    {stats.finances.totalExpense?.toLocaleString('vi-VN') || 0} đ
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-semibold">Số dư</span>
                  <span className={`text-2xl font-bold ${
                    stats.finances.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.finances.balance?.toLocaleString('vi-VN') || 0} đ
                  </span>
                </div>
              </div>
              <Link
                to="/internal/finance"
                className="mt-4 inline-block text-primary-600 font-semibold hover:underline"
              >
                Xem chi tiết →
              </Link>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Báo cáo gần đây</h2>
              {recentReports.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có báo cáo nào</p>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <Link
                      key={report._id}
                      to="/internal/reports"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-semibold text-sm text-gray-800 line-clamp-1">
                        {report.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/internal/reports"
                className="mt-4 inline-block text-primary-600 font-semibold hover:underline text-sm"
              >
                Xem tất cả →
              </Link>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default InternalDashboard;


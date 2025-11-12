import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const InternalFinance = () => {
  const { user, isAdmin } = useAuth();
  const [finances, setFinances] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFinances();
    fetchStats();
  }, [filter]);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get('/finance', { params });
      setFinances(response.data);
    } catch (error) {
      console.error('Error fetching finances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/finance/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (editingFinance) {
        await api.put(`/finance/${editingFinance._id}`, data);
      } else {
        await api.post('/finance', data);
      }
      setShowModal(false);
      setEditingFinance(null);
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchFinances();
      fetchStats();
    } catch (error) {
      console.error('Error saving finance:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleEdit = (finance) => {
    setEditingFinance(finance);
    setFormData({
      type: finance.type,
      category: finance.category,
      amount: finance.amount.toString(),
      description: finance.description,
      date: new Date(finance.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bản ghi này?')) return;
    try {
      await api.delete(`/finance/${id}`);
      fetchFinances();
      fetchStats();
    } catch (error) {
      console.error('Error deleting finance:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/finance/${id}`, { status: 'approved' });
      fetchFinances();
      fetchStats();
    } catch (error) {
      console.error('Error approving finance:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý Thu - Chi</h1>
          <p className="text-gray-600">Theo dõi và quản lý tài chính của CLB</p>
        </div>
        <button
          onClick={() => {
            setEditingFinance(null);
            setFormData({
              type: 'expense',
              category: '',
              amount: '',
              description: '',
              date: new Date().toISOString().split('T')[0]
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Tổng thu</span>
            <FiTrendingUp className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalIncome?.toLocaleString('vi-VN') || 0} đ
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Tổng chi</span>
            <FiTrendingDown className="text-red-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {stats.totalExpense?.toLocaleString('vi-VN') || 0} đ
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Số dư</span>
            <FiDollarSign className="text-blue-600" size={24} />
          </div>
          <p className={`text-3xl font-bold ${
            stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.balance?.toLocaleString('vi-VN') || 0} đ
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        {['all', 'income', 'expense'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === type
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {type === 'all' ? 'Tất cả' : type === 'income' ? 'Thu' : 'Chi'}
          </button>
        ))}
      </div>

      {/* Finance List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : finances.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <FiDollarSign size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Chưa có bản ghi nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {finances.map((finance, index) => (
            <motion.div
              key={finance._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      finance.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {finance.type === 'income' ? 'Thu' : 'Chi'}
                    </span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {finance.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(finance.status)}`}>
                      {getStatusLabel(finance.status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {finance.description}
                  </h3>
                  <p className={`text-2xl font-bold mb-2 ${
                    finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {finance.type === 'income' ? '+' : '-'}
                    {finance.amount.toLocaleString('vi-VN')} đ
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(finance.date).toLocaleDateString('vi-VN')} • 
                    Tạo bởi: {finance.createdBy?.name || 'N/A'}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {isAdmin && finance.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(finance._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Duyệt"
                    >
                      ✓
                    </button>
                  )}
                  {(isAdmin || finance.createdBy._id === user?.id) && (
                    <>
                      <button
                        onClick={() => handleEdit(finance)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(finance._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingFinance ? 'Chỉnh sửa' : 'Thêm mới'} Thu - Chi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="income">Thu</option>
                  <option value="expense">Chi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="VD: Phí tập luyện, Thuê trang phục..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFinance(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingFinance ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InternalFinance;


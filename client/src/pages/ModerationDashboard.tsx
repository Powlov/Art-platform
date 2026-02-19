import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { 
  Shield, CheckCircle, XCircle, Clock, AlertCircle,
  Eye, User, Calendar, DollarSign, Filter, Search,
  TrendingUp, Activity, FileText, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

type StatusFilter = 'pending' | 'approved' | 'rejected';

const ModerationDashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch statistics
  const { data: stats } = trpc.moderation.getStats.useQuery();

  // Fetch artworks by status
  const { data: artworks, refetch } = trpc.moderation.getArtworksByStatus.useQuery({
    status: statusFilter,
    limit: 50,
  });

  // Approve mutation
  const approveMutation = trpc.moderation.approveArtwork.useMutation({
    onSuccess: () => {
      toast.success('Произведение одобрено!');
      setSelectedArtwork(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });

  // Reject mutation
  const rejectMutation = trpc.moderation.rejectArtwork.useMutation({
    onSuccess: () => {
      toast.success('Произведение отклонено');
      setShowRejectDialog(false);
      setSelectedArtwork(null);
      setRejectReason('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });

  const handleApprove = (artworkId: number) => {
    approveMutation.mutate({ artworkId });
  };

  const handleReject = () => {
    if (!selectedArtwork) return;
    if (rejectReason.trim().length < 10) {
      toast.error('Пожалуйста, укажите причину отклонения (минимум 10 символов)');
      return;
    }
    rejectMutation.mutate({ 
      artworkId: selectedArtwork.id, 
      reason: rejectReason 
    });
  };

  const filteredArtworks = artworks?.filter(artwork => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      artwork.title?.toLowerCase().includes(query) ||
      artwork.artistName?.toLowerCase().includes(query) ||
      artwork.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Модерация произведений</h1>
              <p className="text-gray-600 mt-1">Управление и контроль качества контента</p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ожидают модерации</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Одобрено</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Отклонено</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Всего</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Ожидают ({stats?.pending || 0})
                  </button>
                  <button
                    onClick={() => setStatusFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Одобрено ({stats?.approved || 0})
                  </button>
                  <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Отклонено ({stats?.rejected || 0})
                  </button>
                </div>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию или автору..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks && filteredArtworks.length > 0 ? (
            filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={artwork.imageUrl || 'https://via.placeholder.com/400?text=No+Image'}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {statusFilter === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Ожидает
                      </span>
                    )}
                    {statusFilter === 'approved' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Одобрено
                      </span>
                    )}
                    {statusFilter === 'rejected' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Отклонено
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {artwork.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>{artwork.artistName || 'Unknown Artist'}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {artwork.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">
                        ${((artwork.basePrice || 0) / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{artwork.year || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {statusFilter === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(artwork.id)}
                        disabled={approveMutation.isLoading}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow flex items-center justify-center space-x-1 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Одобрить</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedArtwork(artwork);
                          setShowRejectDialog(true);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Отклонить</span>
                      </motion.button>
                    </div>
                  )}

                  {statusFilter === 'rejected' && artwork.moderationNotes && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-red-800 mb-1">Причина отклонения:</p>
                          <p className="text-xs text-red-700">{artwork.moderationNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {statusFilter === 'approved' && artwork.moderatorName && (
                    <div className="mt-3 text-xs text-gray-500">
                      Одобрено: {artwork.moderatorName}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Произведений не найдено
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Попробуйте изменить поисковый запрос'
                  : `Нет произведений со статусом "${statusFilter}"`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <AnimatePresence>
        {showRejectDialog && selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRejectDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Отклонить произведение</h3>
                  <p className="text-sm text-gray-600">{selectedArtwork.title}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Причина отклонения *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="Укажите причину отклонения (минимум 10 символов)..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectReason.length} / 10 символов минимум
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isLoading || rejectReason.length < 10}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {rejectMutation.isLoading ? 'Отклонение...' : 'Отклонить'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModerationDashboard;

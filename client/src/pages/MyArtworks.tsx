import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { 
  Palette, Plus, Edit2, Trash2, Eye, DollarSign, 
  Clock, CheckCircle, XCircle, AlertCircle, Filter, Search,
  Grid, List, MoreVertical, ExternalLink, TrendingUp, Share2
} from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'draft';

const MyArtworks: React.FC = () => {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);

  // Fetch user's artworks
  const { data: artworks, isLoading, refetch } = trpc.artwork.getMyArtworks.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
    limit: 50
  });

  // Delete artwork mutation
  const deleteMutation = trpc.artwork.delete.useMutation({
    onSuccess: () => {
      toast.success('Произведение успешно удалено');
      refetch();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это произведение?')) {
      deleteMutation.mutate({ artworkId: id });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; color: string; bg: string; text: string }> = {
      pending: { 
        icon: Clock, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50 border-yellow-200', 
        text: 'На модерации' 
      },
      approved: { 
        icon: CheckCircle, 
        color: 'text-green-600', 
        bg: 'bg-green-50 border-green-200', 
        text: 'Одобрено' 
      },
      rejected: { 
        icon: XCircle, 
        color: 'text-red-600', 
        bg: 'bg-red-50 border-red-200', 
        text: 'Отклонено' 
      },
      draft: { 
        icon: AlertCircle, 
        color: 'text-gray-600', 
        bg: 'bg-gray-50 border-gray-200', 
        text: 'Черновик' 
      }
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const stats = {
    total: artworks?.length || 0,
    pending: artworks?.filter(a => a.status === 'pending').length || 0,
    approved: artworks?.filter(a => a.status === 'approved').length || 0,
    rejected: artworks?.filter(a => a.status === 'rejected').length || 0,
    totalValue: artworks?.reduce((sum, a) => sum + (a.basePrice || 0), 0) || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Мои произведения</h1>
                <p className="text-gray-600 mt-1">Управление вашими работами</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/artworks/submit')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить работу</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Всего работ</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Palette className="w-8 h-8 text-purple-500" />
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
                  <p className="text-sm text-gray-600">На модерации</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
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
                  <p className="text-sm text-gray-600">Одобрено</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm text-gray-600">Отклонено</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Общая стоимость</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(stats.totalValue / 100).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Все статусы</option>
                  <option value="draft">Черновики</option>
                  <option value="pending">На модерации</option>
                  <option value="approved">Одобрено</option>
                  <option value="rejected">Отклонено</option>
                </select>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию, описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Artworks List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : artworks && artworks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'relative aspect-square'}>
                  <img
                    src={artwork.imageUrl || 'https://via.placeholder.com/400?text=No+Image'}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(artwork.status || 'draft')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {artwork.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-gray-900">
                        ${((artwork.basePrice || 0) / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{artwork.views || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/artwork/${artwork.id}`)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Просмотр</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/artworks/edit/${artwork.id}`)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(artwork.id)}
                      disabled={deleteMutation.isLoading}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Palette className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              У вас пока нет произведений
            </h3>
            <p className="text-gray-600 mb-6">
              Начните с добавления вашей первой работы
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/artworks/submit')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить произведение</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyArtworks;

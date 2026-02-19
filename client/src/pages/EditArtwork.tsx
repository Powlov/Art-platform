import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { 
  Save, X, Upload, Palette, Calendar, Ruler, 
  DollarSign, Image as ImageIcon, FileText, Loader
} from 'lucide-react';
import { toast } from 'sonner';

const EditArtwork: React.FC = () => {
  const [, navigate] = useLocation();
  const params = useParams();
  const artworkId = parseInt(params.id || '0');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    technique: '',
    dimensions: '',
    medium: '',
    basePrice: '',
    imageUrl: '',
  });

  // Fetch artwork data
  const { data: artwork, isLoading } = trpc.artwork.getById.useQuery({ id: artworkId });

  // Update mutation
  const updateMutation = trpc.artwork.update.useMutation({
    onSuccess: () => {
      toast.success('Произведение успешно обновлено!');
      navigate('/artworks/my');
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        description: artwork.description || '',
        year: artwork.year || new Date().getFullYear(),
        technique: artwork.technique || '',
        dimensions: artwork.dimensions || '',
        medium: artwork.medium || '',
        basePrice: artwork.basePrice ? String(artwork.basePrice / 100) : '',
        imageUrl: artwork.imageUrl || '',
      });
    }
  }, [artwork]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Пожалуйста, укажите название произведения');
      return;
    }

    updateMutation.mutate({
      artworkId,
      title: formData.title,
      description: formData.description || undefined,
      year: formData.year || undefined,
      technique: formData.technique || undefined,
      dimensions: formData.dimensions || undefined,
      medium: formData.medium || undefined,
      basePrice: formData.basePrice || undefined,
      imageUrl: formData.imageUrl || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Произведение не найдено</h2>
          <button
            onClick={() => navigate('/artworks/my')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold"
          >
            Вернуться к моим работам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Редактирование произведения</h1>
                <p className="text-gray-600 mt-1">Обновите информацию о вашей работе</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/artworks/my')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
        >
          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="mb-6">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={formData.imageUrl}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Название произведения *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Например: Звёздная ночь"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Описание</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Расскажите о вашем произведении..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Year */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Год создания</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Medium */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4" />
                <span>Материал</span>
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                placeholder="Например: Холст, масло"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Technique */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4" />
                <span>Техника</span>
              </label>
              <input
                type="text"
                name="technique"
                value={formData.technique}
                onChange={handleChange}
                placeholder="Например: Импрессионизм"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-4 h-4" />
                <span>Размеры</span>
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="Например: 80 x 100 см"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Base Price */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Базовая цена (USD)</span>
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4" />
                <span>URL изображения</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/artworks/my')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Отмена
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={updateMutation.isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {updateMutation.isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Сохранить изменения</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditArtwork;

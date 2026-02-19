import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadComplete: (urls: {
    original: string;
    large: string;
    medium: string;
    thumbnail: string;
  }) => void;
  onUploadStart?: () => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  showPreview?: boolean;
  multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  onUploadStart,
  maxSizeMB = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  showPreview = true,
  multiple = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if upload is configured
  const { data: config } = trpc.upload.isConfigured.useQuery();

  // Upload mutation
  const uploadMutation = trpc.upload.uploadArtworkImage.useMutation({
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadProgress(100);
      toast.success('Изображение загружено успешно!');
      onUploadComplete(data.urls);
      
      // Clear preview after short delay
      setTimeout(() => {
        setPreview(null);
        setUploadProgress(0);
      }, 2000);
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(`Ошибка загрузки: ${error.message}`);
    },
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Недопустимый тип файла. Разрешены: ${allowedTypes.join(', ')}`,
      };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Размер файла превышает ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Show preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Convert to base64 and upload
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsUploading(true);
      setUploadProgress(10);
      onUploadStart?.();
    };
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 50; // First 50% is reading
        setUploadProgress(progress);
      }
    };

    reader.onloadend = () => {
      setUploadProgress(60); // Reading complete
      
      const base64Data = reader.result as string;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      uploadMutation.mutate({
        imageData: base64Data,
        filename: file.name,
        contentType: file.type,
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Ошибка чтения файла');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [allowedTypes, maxSizeMB]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [allowedTypes, maxSizeMB]
  );

  const clearPreview = () => {
    setPreview(null);
    setUploadProgress(0);
  };

  if (!config?.configured) {
    return (
      <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">
              Загрузка файлов не настроена
            </h3>
            <p className="text-sm text-yellow-800">
              Для загрузки изображений необходимо настроить Cloudflare R2. 
              Пожалуйста, обратитесь к администратору.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence>
        {preview && showPreview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative mb-4"
          >
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Upload Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">Загрузка...</p>
                    <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-white text-sm mt-2">{Math.round(uploadProgress)}%</p>
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {uploadProgress === 100 && !isUploading && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <CheckCircle className="w-16 h-16 text-white mx-auto mb-2" />
                    </motion.div>
                    <p className="text-white font-semibold text-lg">Загружено!</p>
                  </div>
                </div>
              )}

              {/* Clear Button */}
              {!isUploading && uploadProgress !== 100 && (
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Upload Area */}
      {!preview && (
        <motion.div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? '#8b5cf6' : '#e5e7eb',
            backgroundColor: isDragging ? '#f5f3ff' : '#ffffff',
          }}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 hover:border-purple-400 hover:bg-purple-50
            ${isDragging ? 'border-purple-500 bg-purple-50' : ''}
          `}
        >
          <input
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileInput}
            multiple={multiple}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              {isDragging ? (
                <ImageIcon className="w-8 h-8 text-purple-600" />
              ) : (
                <Upload className="w-8 h-8 text-purple-600" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragging
                ? 'Отпустите файл для загрузки'
                : 'Перетащите изображение сюда'}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              или нажмите, чтобы выбрать файл
            </p>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>Максимум {maxSizeMB}MB</span>
              <span>•</span>
              <span>JPEG, PNG, WebP</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};


import React, { useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="image-upload"
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="cursor-pointer mt-2 flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 hover:border-purple-500 hover:bg-gray-700 transition-all"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon />
            <p className="mt-2 text-sm">
              <span className="font-semibold text-purple-400">クリックしてアップロード</span>またはドラッグ＆ドロップ
            </p>
            <p className="text-xs">PNG, JPG, GIFなど</p>
          </div>
        )}
      </label>
    </div>
  );
};

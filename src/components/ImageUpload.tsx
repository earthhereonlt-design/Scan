import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "relative border-2 border-dashed rounded-[32px] p-16 text-center transition-all duration-300 ease-out cursor-pointer",
                isDragging 
                  ? "border-slate-800 bg-white/80 scale-[1.02] shadow-xl" 
                  : "border-slate-800/20 hover:border-slate-800/40 bg-white/60 hover:bg-white/80"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-white/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-7 h-7 text-slate-800" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Upload an image</h3>
                <p className="text-sm text-slate-500 mt-1.5">Drag and drop or click to browse</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl shadow-md hover:bg-slate-700 transition-colors"
              >
                Select File
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview-zone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 relative overflow-hidden group"
          >
            <button
              onClick={clearSelection}
              disabled={isLoading}
              className="absolute top-6 right-6 z-10 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full backdrop-blur-sm transition-colors disabled:opacity-50 shadow-sm border border-white/50"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div 
              onClick={handleSubmit}
              className={cn(
                "relative rounded-2xl overflow-hidden bg-white/50 aspect-video flex items-center justify-center mb-8 border border-white/60 shadow-inner transition-all duration-300",
                !isLoading && "cursor-pointer hover:ring-4 hover:ring-slate-800/10 hover:border-slate-800/20"
              )}
            >
              <img 
                src={preview} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
              {!isLoading && (
                <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                    <ImageIcon className="w-4 h-4 text-slate-800" />
                    <span className="text-xs font-bold text-slate-800">Click to Analyze</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-white/60">
                  <ImageIcon className="w-5 h-5 text-slate-800" strokeWidth={1.5} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-800 truncate">{file?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{(file!.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

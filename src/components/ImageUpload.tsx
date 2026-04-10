import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, X, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        
        // Convert dataUrl to File object
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const capturedFile = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFile(capturedFile);
          });
        
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        {isCameraOpen ? (
          <motion.div
            key="camera-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-6 relative overflow-hidden flex flex-col items-center"
          >
            <button
              onClick={stopCamera}
              className="absolute top-6 right-6 z-10 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full backdrop-blur-sm transition-colors shadow-sm border border-white/50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-6 border border-white/20 shadow-2xl">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={takePhoto}
                className="w-16 h-16 bg-white rounded-full border-4 border-slate-800 flex items-center justify-center shadow-xl"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-full" />
              </motion.button>
              <p className="text-sm font-bold text-slate-800">Capture Photo</p>
            </div>
          </motion.div>
        ) : !preview ? (
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
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                  fileInputRef.current?.click();
                }
              }}
            >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-white/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-7 h-7 text-slate-800" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Upload an image</h3>
                <p className="text-sm text-slate-500 mt-1.5">Drag and drop or choose an option below</p>
              </div>
              
              {cameraError && (
                <p className="text-xs text-red-500 font-medium">{cameraError}</p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl shadow-md hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <ImageIcon size={16} />
                  Select File
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Try native camera first for better mobile support
                    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                      cameraInputRef.current?.click();
                    } else {
                      startCamera();
                    }
                  }}
                  className="px-6 py-2.5 bg-white text-slate-800 border border-slate-200 text-sm font-medium rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Camera size={16} />
                  Take Photo
                </motion.button>
              </div>
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
                  <p className="text-sm font-bold text-slate-800 truncate">{file?.name || 'Captured Photo'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {file ? (file.size / 1024 / 1024).toFixed(2) : '0.00'} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearSelection}
                  disabled={isLoading}
                  className="p-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={18} />
                </motion.button>
                
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

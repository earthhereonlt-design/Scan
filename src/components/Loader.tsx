import { motion } from 'motion/react';

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 border-4 border-slate-200/50 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-slate-800 rounded-full border-b-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
        </motion.div>
      </div>
      <div className="text-center space-y-2">
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-slate-800"
        >
          Analyzing Content
        </motion.p>
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-medium text-slate-500"
        >
          Gemini is processing your image...
        </motion.p>
      </div>
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="flex gap-4 p-5 rounded-3xl bg-white/40 border border-white/60 overflow-hidden relative group">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
        animate={{ translateX: ['100%', '-100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="w-10 h-10 rounded-2xl bg-slate-200/60 shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-slate-200/60 rounded-full w-3/4" />
        <div className="h-4 bg-slate-200/60 rounded-full w-1/2" />
        <div className="h-4 bg-slate-200/60 rounded-full w-5/6" />
      </div>
    </div>
  );
}

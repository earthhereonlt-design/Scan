import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface AnalysisData {
  description: string;
  objects: string[];
  tags: string[];
  useCases: Array<{ title: string; description: string }>;
}

interface AnalysisPanelProps {
  data: AnalysisData;
}

export function AnalysisPanel({ data }: AnalysisPanelProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-6"
    >
      {/* Description Card */}
      <motion.div variants={item} className="glass-panel p-6 md:p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            AI
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Image Analysis</h3>
        <p className="text-slate-500 text-xs md:text-sm mb-6">Overview of the uploaded content</p>
        <p className="text-slate-700 leading-relaxed text-sm md:text-[15px]">
          {data.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objects Detected */}
        <motion.div variants={item} className="glass-panel p-6 md:p-8">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Objects Detected</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl md:text-4xl font-bold text-slate-800">{data.objects.length}</span>
            <span className="text-sm text-emerald-600 font-medium">+100%</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.objects.map((obj, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-slate-100 hover:bg-white/90 transition-all group"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform" />
                <span className="text-sm font-medium text-slate-700 truncate">{obj}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div variants={item} className="glass-panel p-6 md:p-8">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Tags</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl md:text-4xl font-bold text-slate-800">{data.tags.length}</span>
            <span className="text-sm text-rose-600 font-medium">-5.67%</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-white/80 text-slate-700 text-xs md:text-[13px] font-medium rounded-lg border border-slate-200 shadow-sm cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Use Cases */}
      <motion.div variants={item} className="glass-panel p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Potential Use Cases</span>
          <motion.span 
            whileHover={{ x: 3 }}
            className="text-xs text-slate-700 font-medium flex items-center gap-1 cursor-pointer hover:text-orange-500 transition-colors"
          >
            Full list <ChevronRight className="w-3 h-3" />
          </motion.span>
        </div>
        
        <div className="space-y-3">
          {data.useCases.map((useCase, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/60 border border-slate-200 hover:shadow-sm transition-all gap-4 cursor-pointer"
            >
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-1 text-sm md:text-base">{useCase.title}</h4>
                <p className="text-xs md:text-[13px] text-slate-500 leading-relaxed line-clamp-1">{useCase.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn(
                  "px-2.5 py-1 rounded-full border text-[11px] font-medium",
                  i % 3 === 0 ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                  i % 3 === 1 ? "border-amber-200 text-amber-700 bg-amber-50" :
                  "border-rose-200 text-rose-700 bg-rose-50"
                )}>
                  {i % 3 === 0 ? 'Low' : i % 3 === 1 ? 'Medium' : 'High'}
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {useCase.title.substring(0, 2).toUpperCase()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

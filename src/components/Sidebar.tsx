import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, CheckSquare, Library, Heart, X, MessageSquare, Activity, BarChart3, Zap, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewType } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  history: Array<{ id: string; title: string; date: string }>;
}

export function Sidebar({ isOpen, onClose, onNewChat, currentView, setView, history }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'statistic', label: 'Statistic', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Zap },
  ];

  const handleViewChange = (view: ViewType) => {
    setView(view);
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative inset-y-0 left-0 z-[100] w-72 md:w-64 flex flex-col p-6 md:p-8 border-r border-white/10 bg-white/10 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-2xl bg-white/80 shadow-lg hover:bg-white transition-all md:hidden text-slate-800 active:scale-90"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-10 font-bold text-2xl px-4 italic text-slate-800 tracking-tighter flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-600" fill="currentColor" />
          <span>AI Studio App</span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "#334155" }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="mb-8 w-full bg-slate-800 text-white p-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-700 transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
          <span className="font-semibold text-sm">New Analysis</span>
        </motion.button>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mb-4 px-4">Main Menu</p>
          
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.button 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewChange(item.id as ViewType)}
                className={cn(
                  "w-full p-3 rounded-2xl flex items-center gap-3 transition-all",
                  currentView === item.id 
                    ? "bg-white/80 shadow-sm text-slate-800 font-semibold ring-1 ring-black/5" 
                    : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
                )}
              >
                <item.icon size={18} strokeWidth={currentView === item.id ? 2.5 : 1.5} /> 
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="pt-6 space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mb-4 px-4">Workspace</p>
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewChange('tasks')}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-2xl transition-all",
                currentView === 'tasks' ? "bg-white/80 text-slate-800 font-semibold ring-1 ring-black/5" : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
              )}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={18} strokeWidth={currentView === 'tasks' ? 2.5 : 1.5} /> 
                <span className="text-sm">Tasks</span>
              </div>
              <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">5</span>
            </motion.button>

            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewChange('libraries')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                currentView === 'libraries' ? "bg-white/80 text-slate-800 font-semibold ring-1 ring-black/5" : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
              )}
            >
              <Library size={18} strokeWidth={currentView === 'libraries' ? 2.5 : 1.5} /> 
              <span className="text-sm">Libraries</span>
            </motion.button>

            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewChange('saved')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                currentView === 'saved' ? "bg-white/80 text-slate-800 font-semibold ring-1 ring-black/5" : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
              )}
            >
              <Heart size={18} strokeWidth={currentView === 'saved' ? 2.5 : 1.5} /> 
              <span className="text-sm">Saved</span>
            </motion.button>
          </div>
        </nav>

        {history.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mb-4 px-4">Recent</p>
            <div className="space-y-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange('dashboard')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 shadow-sm border border-white/60">
                    <MessageSquare className="w-4 h-4 text-slate-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider">{item.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

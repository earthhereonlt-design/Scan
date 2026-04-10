import { Menu, Search, Zap } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  userName: string;
}

export function Navbar({ onMenuClick, userName }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-transparent px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-white/30 transition-colors md:hidden text-slate-800"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="md:hidden font-bold text-lg md:text-xl italic text-slate-800 tracking-tighter flex items-center gap-1">
          <Zap className="w-5 h-5 text-orange-600" fill="currentColor" />
          <span>V.AI</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl px-4 md:px-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Ask Vision AI anything..." 
            className="w-full bg-white/60 backdrop-blur-md border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 ring-orange-200 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 pl-5 border-l border-white/30">
          <span className="text-sm font-semibold text-slate-800 hidden sm:block">{userName}</span>
          <div className="w-9 h-9 rounded-full bg-orange-100 border border-white/50 overflow-hidden shadow-sm">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || 'Peter'}`} 
              alt="User avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

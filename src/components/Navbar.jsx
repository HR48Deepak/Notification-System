import { Bell } from 'lucide-react';

export default function Navbar({ unreadCount, onOpen }) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg" />
          <span className="font-bold text-xl tracking-tight">Notification System</span>
        </div>

        <button 
          onClick={onOpen}
          className="relative p-2.5 rounded-full hover:bg-slate-100 transition-all active:scale-90"
        >
          <Bell className="w-6 h-6 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
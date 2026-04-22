import { X, Inbox } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkRead }) {
  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-[70] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Your updates</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Inbox className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">All caught up!</p>
                <p className="text-slate-400 text-sm">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <NotificationItem 
                  key={notif._id} 
                  notif={notif} 
                  onMarkRead={onMarkRead} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
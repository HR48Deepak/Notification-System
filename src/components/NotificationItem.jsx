import { Mail, MessageSquare, Info, Circle } from 'lucide-react';

const icons = {
  EMAIL: <Mail className="w-4 h-4" />,
  SMS: <MessageSquare className="w-4 h-4" />,
  IN_APP: <Info className="w-4 h-4" />
};

export default function NotificationItem({ notif, onMarkRead }) {
  return (
    <div className={`group relative p-5 border-b border-slate-50 transition-all hover:bg-slate-50/80 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
      <div className="flex gap-4">
        <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notif.isRead ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
          {icons[notif.type] || icons.IN_APP}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className={`text-sm leading-tight truncate ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
              {notif.title}
            </h3>
            {!notif.isRead && (
              <button 
                onClick={() => onMarkRead(notif._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-indigo-600 uppercase tracking-tighter hover:underline"
              >
                Mark Read
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {notif.message}
          </p>
          <span className="text-[10px] font-medium text-slate-400 mt-3 block uppercase tracking-wide">
            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {!notif.isRead && (
          <Circle className="w-2 h-2 fill-indigo-500 text-indigo-500 mt-2 self-start" />
        )}
      </div>
    </div>
  );
}
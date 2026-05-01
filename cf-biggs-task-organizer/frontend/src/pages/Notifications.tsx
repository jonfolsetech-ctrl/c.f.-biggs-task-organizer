import { useEffect, useState } from 'react';
import { api } from '../api';
import { NotificationItem } from '../types';

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  async function load() {
    const res = await api.get('/notifications');
    setItems(res.data.notifications);
  }

  async function markRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cfnavy">Notifications</h2>
        <p className="text-slate-500">Task reminders and deadline alerts.</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? <p className="rounded-2xl bg-white p-5 text-slate-500">No notifications yet.</p> : items.map((n) => (
          <div key={n.id} className={`rounded-2xl bg-white p-5 shadow-sm ${!n.read_at ? 'border-l-4 border-cfgold' : ''}`}>
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-bold text-cfnavy">{n.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read_at && (
                <button onClick={() => markRead(n.id)} className="h-fit rounded-xl bg-cfnavy px-4 py-2 text-sm font-semibold text-white">
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

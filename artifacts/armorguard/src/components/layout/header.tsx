import { Bell, Search, X, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface Notification {
  id: string;
  type: 'scan' | 'threat' | 'report' | 'alert';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'scan', title: 'Scan Completed', body: 'Full scan on example.com finished. Risk score: 82.', time: '2m ago', read: false },
  { id: '2', type: 'threat', title: 'Critical Vulnerability', body: 'SQL Injection detected on api.corp.io/login.', time: '15m ago', read: false },
  { id: '3', type: 'report', title: 'Report Downloaded', body: 'armorguard-report-example.com.pdf saved.', time: '1h ago', read: true },
  { id: '4', type: 'alert', title: 'New Finding', body: 'Open port 3306 exposed on db.example.com.', time: '3h ago', read: true },
];

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  const clearAll = () => setNotifications([]);
  const markRead = (id: string) => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));

  const typeColor = (type: string) => {
    if (type === 'threat' || type === 'alert') return 'bg-red-100 text-red-600';
    if (type === 'scan') return 'bg-green-100 text-green-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <header className="h-14 border-b border-border bg-white/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-sm font-medium text-muted-foreground">
        Workspace <span className="text-foreground font-semibold">/ Production</span>
      </div>

      <div className="flex-1 max-w-sm mx-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources... (Cmd+K)"
            className="w-full bg-muted border border-border rounded-md pl-9 pr-12 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              showNotifications ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            data-testid="button-notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-border shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="font-semibold text-sm text-foreground">Notifications</div>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
                ) : notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "px-4 py-3 cursor-pointer hover:bg-muted transition-colors",
                      !n.read && "bg-accent/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 shrink-0", typeColor(n.type))}>
                        {n.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-accent rounded-full mt-1.5 shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/profile">
          <Avatar className="w-8 h-8 cursor-pointer border border-border hover:border-accent/50 transition-colors">
            <AvatarFallback className="bg-accent/10 text-accent text-xs font-bold">AG</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
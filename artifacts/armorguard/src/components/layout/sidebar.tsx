import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, Scan, FileText, Shield, Bot, Clock, User, Settings, Search, ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { format } from "date-fns";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Scan", href: "/scans?new=true", icon: Plus },
  { name: "Scans", href: "/scans", icon: Scan },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Threats", href: "/threats", icon: Shield },
  { name: "Fixes", href: "/fixes", icon: Wrench },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "History", href: "/history", icon: Clock },
];

const BOTTOM_ITEMS = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const { scans } = useStore();

  const recentScans = scans.filter(s => s.status === 'completed').slice(0, 5);
  const filteredScans = recentScans.filter(s =>
    s.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 ease-in-out z-20 h-screen sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center shrink-0">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        {!collapsed && <span className="ml-3 font-bold text-foreground tracking-tight text-sm">ArmorGuard</span>}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-3 pb-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search scans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted border border-border rounded pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href.split('?')[0]));
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors relative group text-sm",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Recent Scan History */}
      {!collapsed && (
        <div className="flex-1 px-3 overflow-y-auto">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">Recent Scans</div>
          <div className="space-y-0.5">
            {(search ? filteredScans : recentScans).map(scan => (
              <Link key={scan.id} href="/history">
                <div className="px-3 py-2 rounded-md cursor-pointer hover:bg-secondary transition-colors group">
                  <div className="text-xs font-medium text-foreground truncate">{scan.target}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{scan.type} · {format(new Date(scan.startTime), 'MMM d')}</div>
                </div>
              </Link>
            ))}
            {(search ? filteredScans : recentScans).length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">No scans found</div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors relative text-sm",
                isActive ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />}
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </div>
            </Link>
          );
        })}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
          {!collapsed && <span className="ml-3">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
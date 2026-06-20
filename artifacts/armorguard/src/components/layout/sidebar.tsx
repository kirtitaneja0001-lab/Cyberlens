import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, Scan, FileText, Shield, Bot, Clock, User, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Scan", href: "/scans?new=true", icon: Plus },
  { name: "Scans", href: "/scans", icon: Scan },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Threats", href: "/threats", icon: Shield },
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

  return (
    <aside className={cn(
      "bg-[#0A0A0A] border-r border-[#111111] flex flex-col transition-all duration-200 ease-in-out z-20 h-screen sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-[#111111]">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="ml-3 font-bold text-white tracking-tight">ArmorGuard</span>}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors relative group",
                isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="p-2 border-t border-[#111111] space-y-1">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors relative",
                isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          );
        })}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-2 text-muted-foreground hover:bg-white/5 hover:text-white rounded-md transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
          {!collapsed && <span className="ml-3 text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

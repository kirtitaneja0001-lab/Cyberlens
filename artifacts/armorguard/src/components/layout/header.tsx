import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-14 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 text-sm font-medium text-white">
        Workspace / Production
      </div>

      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources... (Cmd+K)" 
            className="w-full bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-md pl-10 pr-4 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-[rgba(255,255,255,0.1)] bg-[#1A1A1A] px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-[#0A0A0A]"></span>
        </button>
        <Avatar className="w-8 h-8 cursor-pointer border border-[rgba(255,255,255,0.1)]">
          <AvatarFallback className="bg-[#111111] text-xs text-white">AG</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

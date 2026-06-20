import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { Search, Filter, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Threats() {
  const { threats } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredThreats = threats.filter(t => 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'High': return 'bg-accent/10 text-accent border-accent/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Threat Intelligence</h1>
          <p className="text-sm text-muted-foreground">Live feed of discovered vulnerabilities and threats</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-4 bg-card border border-border p-2 rounded-md">
            <Search className="w-4 h-4 text-muted-foreground ml-2" />
            <input
              type="text"
              placeholder="Search threats by type or target..."
              className="flex-1 bg-transparent border-none text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm hover:bg-secondary transition-colors text-foreground">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Threat Type</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Discovered</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-secondary transition-colors cursor-pointer group">
                  <td className="px-4 py-4 text-center">
                    <AlertTriangle className={cn("w-4 h-4 opacity-50", 
                      threat.severity === 'Critical' ? "text-red-500" : 
                      threat.severity === 'High' ? "text-accent" : "text-muted-foreground"
                    )} />
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium border inline-block min-w-[70px] text-center",
                      getSeverityColor(threat.severity)
                    )}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">{threat.type}</td>
                  <td className="px-4 py-4 text-muted-foreground font-mono text-xs">{threat.target}</td>
                  <td className="px-4 py-4 text-muted-foreground">{threat.discovered}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{threat.status}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredThreats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No threats found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
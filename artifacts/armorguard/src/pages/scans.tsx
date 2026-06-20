import { MainLayout } from "@/components/layout/main-layout";
import { useStore, Scan } from "@/hooks/use-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Play, Shield, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Scans() {
  const { scans, addScan } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [newScanTarget, setNewScanTarget] = useState("");
  const [newScanType, setNewScanType] = useState("Quick");

  const filteredScans = scans.filter(s => 
    s.target.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartScan = () => {
    if (!newScanTarget) return;
    const newScan: Scan = {
      id: Math.random().toString(36).substring(7),
      target: newScanTarget,
      startTime: new Date().toISOString(),
      duration: "0m",
      riskScore: 0,
      status: "running",
      type: newScanType,
      findings: []
    };
    addScan(newScan);
    setIsNewScanOpen(false);
    setNewScanTarget("");
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Scans</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor security scans</p>
          </div>
          <Dialog open={isNewScanOpen} onOpenChange={setIsNewScanOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Scan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-foreground">
              <DialogHeader>
                <DialogTitle>Configure New Scan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Domain/IP</label>
                  <Input 
                    placeholder="e.g., example.com or 192.168.1.1" 
                    value={newScanTarget}
                    onChange={(e) => setNewScanTarget(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scan Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Quick', 'Full', 'Stealth'].map((type) => (
                      <div 
                        key={type}
                        onClick={() => setNewScanType(type)}
                        className={cn(
                          "cursor-pointer border rounded-md p-3 text-center transition-colors text-sm",
                          newScanType === type 
                            ? "border-accent bg-accent/10 text-accent" 
                            : "border-border hover:border-foreground/30 text-muted-foreground"
                        )}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-white mt-4"
                  onClick={handleStartScan}
                  disabled={!newScanTarget}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Initiate Scan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-md">
          <Search className="w-4 h-4 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search scans by target or status..."
            className="flex-1 bg-transparent border-none text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Risk Score</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-secondary transition-colors group">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {scan.target}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5",
                      scan.status === 'completed' && "bg-green-500/10 text-green-600 border border-green-500/20",
                      scan.status === 'running' && "bg-accent/10 text-accent border border-accent/20",
                      scan.status === 'failed' && "bg-red-500/10 text-red-600 border border-red-500/20"
                    )}>
                      {scan.status === 'running' && <Activity className="w-3 h-3 animate-pulse" />}
                      {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{scan.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            scan.riskScore > 80 ? "bg-red-500" : scan.riskScore > 40 ? "bg-accent" : "bg-green-500"
                          )} 
                          style={{ width: `\${scan.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{scan.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(scan.startTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{scan.duration}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-muted-foreground hover:text-foreground">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredScans.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No scans found matching your criteria.
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
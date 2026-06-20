import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { Shield, AlertTriangle, Bot, Target, Clock, Terminal as TerminalIcon, FileText, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200; // 1.2s

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}</span>;
}

function MindMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const renderNode = (id: string, label: string, severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' = 'Info') => {
    const isSelected = selectedNode === id;
    let colorClass = "text-white";
    let borderClass = "border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]";
    let bgClass = "bg-[#111111]";

    if (severity === 'Critical') {
      colorClass = "text-red-400";
      borderClass = "border-red-500/30 hover:border-red-500/60";
      if (isSelected) bgClass = "bg-red-500/10";
    } else if (severity === 'High') {
      colorClass = "text-accent";
      borderClass = "border-accent/30 hover:border-accent/60";
      if (isSelected) bgClass = "bg-accent/10";
    } else if (severity === 'Medium') {
      colorClass = "text-yellow-400";
      borderClass = "border-yellow-500/30 hover:border-yellow-500/60";
      if (isSelected) bgClass = "bg-yellow-500/10";
    } else if (severity === 'Low') {
      colorClass = "text-blue-400";
      borderClass = "border-blue-500/30 hover:border-blue-500/60";
      if (isSelected) bgClass = "bg-blue-500/10";
    } else {
      if (isSelected) bgClass = "bg-white/5 text-white";
    }

    return (
      <div 
        className={cn(
          "inline-block px-2 py-1 rounded cursor-pointer transition-all duration-200 border",
          borderClass, bgClass, colorClass,
          isSelected && "ring-1 ring-white/20"
        )}
        onClick={() => setSelectedNode(isSelected ? null : id)}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs overflow-hidden relative">
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div className="text-center leading-loose whitespace-pre">
          {renderNode('internet', 'Internet')}
          {"\n   |\n   ▼\n"}
          {renderNode('target', 'Target Website')}
          {"\n   |\n┌──┴────┐\n│       │       │\n▼       ▼       ▼\n"}
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center">
              {renderNode('port3306', '3306')}
              {"\n |\n ▼\n"}
              {renderNode('vuln1', 'Critical', 'Critical')}
            </div>
            <div className="flex flex-col items-center">
              {renderNode('admin', '/admin')}
              {"\n |\n ▼\n"}
              {renderNode('vuln2', 'High', 'High')}
            </div>
            <div className="flex flex-col items-center">
              {renderNode('csp', 'CSP')}
              {"\n\n\n"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded p-3 shadow-xl">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Node Details</div>
          <div className="text-white">
            {selectedNode === 'internet' && "External Network Origin"}
            {selectedNode === 'target' && "Primary Target Domain: example.com"}
            {selectedNode === 'port3306' && "Open Port 3306 (MySQL) detected on primary interface."}
            {selectedNode === 'admin' && "Directory /admin discovered via forced browsing."}
            {selectedNode === 'csp' && "Content Security Policy missing on main document."}
            {selectedNode === 'vuln1' && "Unauthenticated remote code execution (RCE) via SQL Injection."}
            {selectedNode === 'vuln2' && "Default administrative credentials found."}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { scans, threats, agents } = useStore();

  const threatData = [
    { name: 'Critical', count: threats.filter(t => t.severity === 'Critical').length, color: '#f87171' },
    { name: 'High', count: threats.filter(t => t.severity === 'High').length, color: '#F26A2E' },
    { name: 'Medium', count: threats.filter(t => t.severity === 'Medium').length, color: '#facc15' },
    { name: 'Low', count: threats.filter(t => t.severity === 'Low').length, color: '#60a5fa' },
  ];

  const recentEvents = [
    { time: '10:42 AM', type: 'Agent', msg: 'PortScanner initiated on 10.0.0.0/24' },
    { time: '10:41 AM', type: 'Alert', msg: 'High severity vulnerability found on api.corp.io' },
    { time: '10:35 AM', type: 'Scan', msg: 'Quick scan completed on staging.app.co' },
    { time: '10:15 AM', type: 'Agent', msg: 'VulnAnalyzer completed analysis' },
  ];

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ArmorGuard</h1>
            <p className="text-sm text-muted-foreground mt-1">Mission control overview</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-xs font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Risk Score", value: 82, trend: "+12", icon: Shield },
            { label: "Threats Found", value: threats.length, trend: "-2", icon: AlertTriangle },
            { label: "Active Agents", value: agents.filter(a => a.status === 'running').length, trend: "0", icon: Bot },
            { label: "Findings", value: 142, trend: "+24", icon: Target },
            { label: "Elapsed Time", value: "2h 15m", trend: "", icon: Clock, noAnim: true },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-accent transition-colors">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="flex items-end justify-between mt-4">
                <div className="text-3xl font-semibold font-mono text-white">
                  {stat.noAnim ? stat.value : <AnimatedCounter value={stat.value as number} />}
                </div>
                {stat.trend && (
                  <div className={cn("text-xs mb-1", stat.trend.startsWith('+') ? (i === 0 || i === 1 || i === 3 ? 'text-red-400' : 'text-accent') : 'text-green-400')}>
                    {stat.trend}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg flex flex-col h-[400px]">
              <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4" />
                  Network Visualization
                </h2>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
              </div>
              <div className="flex-1 bg-[#0A0A0A] relative m-2 rounded border border-[rgba(255,255,255,0.03)] overflow-hidden">
                <MindMap />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 h-[400px] flex flex-col">
               <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4" />
                 Live Events
               </h2>
               <div className="flex-1 overflow-auto space-y-4 pr-2">
                 {recentEvents.map((ev, i) => (
                   <div key={i} className="flex gap-3 text-sm">
                     <div className="w-12 shrink-0 text-muted-foreground font-mono text-xs pt-0.5">{ev.time}</div>
                     <div className="relative">
                       <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                       {i !== recentEvents.length - 1 && <div className="absolute top-4 left-1 bottom-[-20px] w-px bg-[rgba(255,255,255,0.1)]" />}
                     </div>
                     <div className="flex-1 pb-4">
                       <div className={cn(
                         "text-xs font-medium mb-0.5 inline-block px-1.5 py-0.5 rounded",
                         ev.type === 'Alert' ? "bg-red-500/10 text-red-400" : 
                         ev.type === 'Scan' ? "bg-green-500/10 text-green-400" : "bg-white/5 text-muted-foreground"
                       )}>{ev.type}</div>
                       <div className="text-white text-xs leading-relaxed">{ev.msg}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 h-[300px] flex flex-col">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <TerminalIcon className="w-4 h-4" />
              Terminal Output
            </h2>
            <div className="flex-1 bg-[#0A0A0A] rounded border border-[rgba(255,255,255,0.03)] p-3 font-mono text-xs text-muted-foreground overflow-auto">
              <div>&gt; Initializing ReconAgent... [OK]</div>
              <div>&gt; Mapping subdomains for example.com...</div>
              <div>&gt; Found 12 active endpoints.</div>
              <div>&gt; Initiating port scan on 10.0.0.0/24...</div>
              <div className="text-accent">&gt; [WARN] Port 3306 open on db.example.com</div>
              <div>&gt; PayloadTester queuing vulnerability checks...</div>
              <div className="animate-pulse">_</div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 h-[300px] flex flex-col">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Threat Distribution</h2>
            <div className="flex-1 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Recent Reports
              </h2>
              <span className="text-xs text-accent cursor-pointer hover:underline">View All</span>
            </div>
            <div className="flex-1 overflow-auto space-y-2">
              {scans.filter(s => s.status === 'completed').slice(0, 4).map(scan => (
                <div key={scan.id} className="flex items-center justify-between p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-[rgba(255,255,255,0.05)]">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{scan.target}</span>
                    <span className="text-xs text-muted-foreground">{scan.type} Scan</span>
                  </div>
                  <div className={cn("text-xs font-mono px-2 py-1 rounded", scan.riskScore > 80 ? "bg-red-500/10 text-red-400" : "bg-accent/10 text-accent")}>
                    {scan.riskScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

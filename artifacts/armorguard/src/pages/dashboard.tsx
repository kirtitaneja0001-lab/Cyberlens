import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { Shield, AlertTriangle, Bot, Target, Clock, Terminal as TerminalIcon, FileText, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { format } from "date-fns";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{count}</span>;
}

function MindMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodeDetails: Record<string, { label: string; desc: string; severity: string }> = {
    internet: { label: 'Internet', desc: 'External network origin — public internet.', severity: 'Info' },
    target: { label: 'Target Website', desc: 'Primary target domain: example.com (IP: 93.184.216.34)', severity: 'Info' },
    port3306: { label: '3306', desc: 'MySQL port 3306 exposed to public internet. Unauthenticated access possible.', severity: 'Critical' },
    admin: { label: '/admin', desc: 'Admin panel discovered via forced browsing. Default credentials accepted.', severity: 'High' },
    csp: { label: 'CSP', desc: 'Content-Security-Policy header missing from main document.', severity: 'Medium' },
    vuln1: { label: 'Critical', desc: 'RCE via SQL Injection — unauthenticated remote code execution on DB host.', severity: 'Critical' },
    vuln2: { label: 'High', desc: 'Default admin credentials accepted. Full panel access granted.', severity: 'High' },
  };

  const renderNode = (id: string, severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' = 'Info') => {
    const isSelected = selectedNode === id;
    const { label } = nodeDetails[id];
    const colors = {
      Critical: cn("border-red-200 text-red-700 bg-red-50", isSelected && "bg-red-100 border-red-400 ring-1 ring-red-300"),
      High: cn("border-orange-200 text-accent bg-orange-50", isSelected && "bg-orange-100 border-accent ring-1 ring-accent/30"),
      Medium: cn("border-yellow-200 text-yellow-700 bg-yellow-50", isSelected && "bg-yellow-100 border-yellow-400 ring-1 ring-yellow-300"),
      Low: cn("border-blue-200 text-blue-700 bg-blue-50", isSelected && "bg-blue-100 border-blue-400 ring-1 ring-blue-300"),
      Info: cn("border-border text-foreground bg-card", isSelected && "bg-secondary border-foreground/20 ring-1 ring-foreground/10"),
    };
    return (
      <span
        className={cn(
          "inline-block px-2 py-0.5 rounded border cursor-pointer transition-all duration-150 text-xs font-mono hover:scale-105",
          colors[severity]
        )}
        onClick={() => setSelectedNode(isSelected ? null : id)}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm relative">
      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        <div className="text-center leading-loose whitespace-pre">
          {renderNode('internet', 'Info')}
          {"\n   |\n   ▼\n"}
          {renderNode('target', 'Info')}
          {"\n   |\n┌──┴────┐\n│       │       │\n▼       ▼       ▼\n"}
          <div className="flex justify-center gap-6 mt-1">
            <div className="flex flex-col items-center gap-1">
              {renderNode('port3306', 'Critical')}
              <span className="text-muted-foreground text-xs">|</span>
              <span className="text-muted-foreground text-xs">▼</span>
              {renderNode('vuln1', 'Critical')}
            </div>
            <div className="flex flex-col items-center gap-1">
              {renderNode('admin', 'High')}
              <span className="text-muted-foreground text-xs">|</span>
              <span className="text-muted-foreground text-xs">▼</span>
              {renderNode('vuln2', 'High')}
            </div>
            <div className="flex flex-col items-center gap-1">
              {renderNode('csp', 'Medium')}
            </div>
          </div>
        </div>
      </div>

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white border border-border rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Node Details — {nodeDetails[selectedNode].severity}</div>
              <div className="text-sm text-foreground leading-relaxed">{nodeDetails[selectedNode].desc}</div>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground ml-3 shrink-0 text-xs">✕</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { scans, threats, agents } = useStore();

  const threatData = [
    { name: 'Critical', count: threats.filter(t => t.severity === 'Critical').length + 1, color: '#ef4444' },
    { name: 'High', count: threats.filter(t => t.severity === 'High').length + 2, color: '#F26A2E' },
    { name: 'Medium', count: threats.filter(t => t.severity === 'Medium').length + 3, color: '#eab308' },
    { name: 'Low', count: threats.filter(t => t.severity === 'Low').length + 1, color: '#3b82f6' },
  ];

  const recentEvents = [
    { time: '10:42', type: 'Agent', msg: 'PortScanner initiated on 10.0.0.0/24', color: 'bg-secondary text-muted-foreground' },
    { time: '10:41', type: 'Alert', msg: 'High severity vulnerability found on api.corp.io', color: 'bg-red-100 text-red-700' },
    { time: '10:35', type: 'Scan', msg: 'Quick scan completed on staging.app.co', color: 'bg-green-100 text-green-700' },
    { time: '10:15', type: 'Agent', msg: 'VulnAnalyzer completed analysis phase', color: 'bg-secondary text-muted-foreground' },
  ];

  const stats = [
    { label: "Risk Score", value: 82, trend: "+12", icon: Shield, trendUp: true, bad: true },
    { label: "Threats Found", value: threats.length, trend: "-2", icon: AlertTriangle, trendUp: false, bad: false },
    { label: "Active Agents", value: agents.filter(a => a.status === 'running').length, trend: "0", icon: Bot, trendUp: false, bad: false },
    { label: "Findings", value: 142, trend: "+24", icon: Target, trendUp: true, bad: true },
    { label: "Elapsed", value: "2h 15m", icon: Clock, noAnim: true },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-6"
      >
        {/* Hero */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">Mission status.</h1>
            <h1 className="text-3xl font-bold tracking-tight text-accent leading-tight">Real-time.</h1>
            <p className="text-sm text-muted-foreground mt-2">Every scan action verified against declared intent. Tamper-evident audit in progress.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-lg p-4 relative overflow-hidden group hover:shadow-sm transition-shadow"
            >
              <div className="absolute top-3 right-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {stat.noAnim ? stat.value : <AnimatedCounter value={stat.value as number} />}
                </div>
                {stat.trend && (
                  <div className={cn("text-xs mb-0.5 font-medium", stat.bad && stat.trendUp ? 'text-red-500' : !stat.bad && !stat.trendUp ? 'text-green-600' : 'text-muted-foreground')}>
                    {stat.trend}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle: Attack Surface Map + Live Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden h-[380px] flex flex-col">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  Attack Surface Map
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
              </div>
              <div className="flex-1 bg-background relative overflow-hidden">
                <MindMap />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-card border border-border rounded-lg p-4 h-[380px] flex flex-col">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-accent" />
                Live Events
              </h2>
              <div className="flex-1 overflow-auto space-y-3">
                {recentEvents.map((ev, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-10 shrink-0 text-muted-foreground font-mono text-[10px] pt-0.5">{ev.time}</div>
                    <div className="relative pt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                      {i !== recentEvents.length - 1 && <div className="absolute top-3.5 left-[3px] bottom-[-14px] w-px bg-border" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded mr-1.5 uppercase", ev.color)}>{ev.type}</span>
                      <div className="text-xs text-foreground mt-1 leading-relaxed">{ev.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Terminal */}
          <div className="bg-card border border-border rounded-lg overflow-hidden h-[260px] flex flex-col">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
              <TerminalIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Terminal</span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
            </div>
            <div className="flex-1 bg-foreground rounded-b-lg p-3 font-mono text-xs overflow-auto">
              <div className="text-green-400">&gt; Initializing ReconAgent... <span className="text-green-300">[OK]</span></div>
              <div className="text-gray-300">&gt; Mapping subdomains for example.com...</div>
              <div className="text-gray-300">&gt; Found 12 active endpoints.</div>
              <div className="text-gray-300">&gt; Port scan on 10.0.0.0/24...</div>
              <div className="text-orange-400">&gt; [WARN] Port 3306 open on db.example.com</div>
              <div className="text-gray-300">&gt; PayloadTester queuing checks...</div>
              <div className="text-green-400 animate-pulse">█</div>
            </div>
          </div>

          {/* Threat Distribution */}
          <div className="bg-card border border-border rounded-lg p-4 h-[260px] flex flex-col">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Threat Distribution</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatData} layout="vertical" margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0,0%,40%)', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(0,0%,96%)' }}
                    contentStyle={{ backgroundColor: '#fff', borderColor: 'hsl(0,0%,88%)', color: '#000', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={14}>
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-card border border-border rounded-lg p-4 h-[260px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-accent" />
                Recent Reports
              </h2>
              <Link href="/reports">
                <span className="text-xs text-accent cursor-pointer hover:underline">View All</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto space-y-1.5">
              {scans.filter(s => s.status === 'completed').slice(0, 4).map(scan => (
                <div key={scan.id} className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 hover:bg-secondary transition-colors cursor-pointer group border border-transparent hover:border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">{scan.target}</div>
                    <div className="text-xs text-muted-foreground">{scan.type} · {format(new Date(scan.startTime), 'MMM d')}</div>
                  </div>
                  <div className={cn("text-xs font-bold font-mono px-2 py-1 rounded", scan.riskScore > 80 ? "bg-red-100 text-red-700" : "bg-orange-100 text-accent")}>
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
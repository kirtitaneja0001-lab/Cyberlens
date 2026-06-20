import React, { createContext, useContext, useState, useEffect } from 'react';

// Data Models
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ScanStatus = 'completed' | 'running' | 'failed';
export type AgentStatus = 'running' | 'idle' | 'complete';

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  target: string;
}

export interface Scan {
  id: string;
  target: string;
  startTime: string;
  duration: string;
  riskScore: number;
  status: ScanStatus;
  type: string;
  findings: Finding[];
}

export interface Threat {
  id: string;
  severity: Severity;
  type: string;
  target: string;
  discovered: string;
  status: string;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  currentTask: string;
  progress: number;
  lastPing: string;
}

interface AppState {
  scans: Scan[];
  threats: Threat[];
  agents: Agent[];
  addScan: (scan: Scan) => void;
  updateAgentStatus: (id: string, status: AgentStatus) => void;
}

// Initial Fake Data
const initialScans: Scan[] = [
  { id: '1', target: 'example.com', startTime: '2023-10-25T10:00:00Z', duration: '45m', riskScore: 82, status: 'completed', type: 'Full', findings: [] },
  { id: '2', target: 'api.corp.io', startTime: '2023-10-26T14:30:00Z', duration: '12m', riskScore: 45, status: 'completed', type: 'Quick', findings: [] },
  { id: '3', target: 'staging.app.co', startTime: '2023-10-27T09:15:00Z', duration: '1h 20m', riskScore: 91, status: 'failed', type: 'Stealth', findings: [] },
];

const initialThreats: Threat[] = [
  { id: '1', severity: 'Critical', type: 'SQL Injection', target: 'api.corp.io/login', discovered: '2 hours ago', status: 'Active' },
  { id: '2', severity: 'High', type: 'Open Port 3306', target: 'db.example.com', discovered: '1 day ago', status: 'Investigating' },
  { id: '3', severity: 'Medium', type: 'Missing CSP', target: 'example.com', discovered: '3 days ago', status: 'Active' },
];

const initialAgents: Agent[] = [
  { id: '1', name: 'ReconAgent', status: 'idle', currentTask: 'Awaiting orders', progress: 100, lastPing: '1m ago' },
  { id: '2', name: 'PortScanner', status: 'running', currentTask: 'Scanning 10.0.0.0/24', progress: 65, lastPing: '5s ago' },
  { id: '3', name: 'VulnAnalyzer', status: 'running', currentTask: 'Analyzing CVE-2023-XYZ', progress: 32, lastPing: '12s ago' },
];

const StoreContext = createContext<AppState | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<Scan[]>(() => {
    const saved = localStorage.getItem('armorguard_scans');
    return saved ? JSON.parse(saved) : initialScans;
  });

  const [threats] = useState<Threat[]>(initialThreats);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  useEffect(() => {
    localStorage.setItem('armorguard_scans', JSON.stringify(scans));
  }, [scans]);

  const addScan = (scan: Scan) => setScans([scan, ...scans]);
  
  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents(agents.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <StoreContext.Provider value={{ scans, threats, agents, addScan, updateAgentStatus }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

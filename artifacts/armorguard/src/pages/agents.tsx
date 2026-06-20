import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { Bot, Play, Square, RefreshCcw, Search, Clock, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Agents() {
  const { agents, updateAgentStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-sm text-muted-foreground">Monitor and control autonomous scanning agents</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-[rgba(255,255,255,0.1)] hover:bg-white/5 bg-transparent">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Restart All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-5 flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0A0A0A] rounded-md border border-[rgba(255,255,255,0.05)] relative">
                    <Bot className="w-5 h-5 text-white" />
                    {agent.status === 'running' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#111111] animate-pulse"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{agent.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" />
                      Last ping: {agent.lastPing}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 text-sm">
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Current Task</span>
                  <span className="font-mono text-xs">{agent.progress}%</span>
                </div>
                <div className="text-white truncate" title={agent.currentTask}>{agent.currentTask}</div>
              </div>

              <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `\${agent.progress}%` }}
                />
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                {agent.status === 'running' ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => updateAgentStatus(agent.id, 'idle')}
                  >
                    <Square className="w-4 h-4 mr-2" /> Stop
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    onClick={() => updateAgentStatus(agent.id, 'running')}
                  >
                    <Play className="w-4 h-4 mr-2" /> Start
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                  <Activity className="w-4 h-4 mr-2" /> Logs
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

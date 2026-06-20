import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { Clock, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { scans } = useStore();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scan History</h1>
          <p className="text-sm text-muted-foreground">Chronological timeline of all security events</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {scans.map((scan, i) => (
              <div key={scan.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground group-hover:text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                  {scan.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                   scan.status === 'failed' ? <XCircle className="w-5 h-5 text-red-500" /> : 
                   <Clock className="w-5 h-5 text-accent animate-spin-slow" />}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-muted/40 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground">{scan.type} Scan on {scan.target}</div>
                    <time className="text-xs text-muted-foreground font-mono">{format(new Date(scan.startTime), 'MMM d, HH:mm')}</time>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Status: {scan.status} • Duration: {scan.duration}
                  </div>
                  {scan.status === 'completed' && (
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/50 border border-border">
                      <ShieldAlert className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-foreground">Risk Score: {scan.riskScore}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
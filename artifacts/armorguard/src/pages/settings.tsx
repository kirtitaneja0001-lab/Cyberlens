import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Bell, CreditCard, Save } from "lucide-react";

export default function Settings() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            {['General', 'Security', 'Notifications', 'API Keys', 'Billing'].map((tab, i) => (
              <button 
                key={tab}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${i === 0 ? 'bg-white/10 text-white font-medium' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 space-y-6">
            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium border-b border-[rgba(255,255,255,0.06)] pb-4">Workspace Settings</h2>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-white">Workspace Name</label>
                  <Input defaultValue="Production" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)] max-w-md" />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-white">Default Scan Type</label>
                  <select className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-accent max-w-md">
                    <option>Quick Scan</option>
                    <option>Full Scan</option>
                    <option>Stealth Scan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium border-b border-[rgba(255,255,255,0.06)] pb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Email Reports</div>
                    <div className="text-xs text-muted-foreground">Send scan reports automatically</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Slack Integration</div>
                    <div className="text-xs text-muted-foreground">Post alerts to #security-alerts</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Auto-update Agents</div>
                    <div className="text-xs text-muted-foreground">Keep AI scanning agents updated</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

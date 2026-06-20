import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Bell, CreditCard, Save, Copy, Eye, EyeOff, Trash2, RefreshCw, Plus, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const TABS = ['General', 'Security', 'Notifications', 'API Keys', 'Billing'];

function GeneralTab() {
  const [wsName, setWsName] = useState(() => localStorage.getItem('ag_ws_name') || 'Production');
  const [scanType, setScanType] = useState(() => localStorage.getItem('ag_scan_type') || 'Quick Scan');
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const save = () => {
    localStorage.setItem('ag_ws_name', wsName);
    localStorage.setItem('ag_scan_type', scanType);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Theme */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Appearance</h2>
        <div>
          <div className="text-sm font-medium text-foreground mb-3">Theme</div>
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {(['light', 'dark'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  theme === t
                    ? "border-accent bg-accent/5"
                    : "border-border bg-background hover:border-border/60"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  t === 'light' ? "bg-amber-100 text-amber-600" : "bg-slate-800 text-slate-200"
                )}>
                  {t === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <span className={cn("text-xs font-semibold capitalize", theme === t ? "text-accent" : "text-muted-foreground")}>
                  {t}
                </span>
                {theme === t && (
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Workspace Settings</h2>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Workspace Name</label>
            <Input value={wsName} onChange={e => setWsName(e.target.value)} className="bg-background border-border max-w-md" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Default Scan Type</label>
            <select
              value={scanType}
              onChange={e => setScanType(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent max-w-md"
            >
              <option>Quick Scan</option>
              <option>Full Scan</option>
              <option>Stealth Scan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Preferences</h2>
        {[
          { label: 'Email Reports', desc: 'Send scan reports automatically', key: 'ag_pref_email' },
          { label: 'Slack Integration', desc: 'Post alerts to #security-alerts', key: 'ag_pref_slack' },
          { label: 'Auto-update Agents', desc: 'Keep AI scanning agents updated', key: 'ag_pref_agents' },
        ].map(pref => {
          const [checked, setChecked] = useState(() => localStorage.getItem(pref.key) !== 'false');
          return (
            <div key={pref.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{pref.label}</div>
                <div className="text-xs text-muted-foreground">{pref.desc}</div>
              </div>
              <Switch checked={checked} onCheckedChange={v => { setChecked(v); localStorage.setItem(pref.key, String(v)); }} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={save} className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [twoFa, setTwoFa] = useState(() => localStorage.getItem('ag_2fa') === 'true');
  const [sessionTimeout, setSessionTimeout] = useState(() => localStorage.getItem('ag_timeout') || '30');
  const [pwSaved, setPwSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const activeSessions = [
    { device: 'Chrome on macOS', ip: '192.168.1.42', lastActive: '2 minutes ago', current: true },
    { device: 'Firefox on Windows', ip: '10.0.0.15', lastActive: '3 days ago', current: false },
  ];

  const savePassword = () => {
    if (!currentPw) { setPwError('Current password is required.'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" /> Change Password
        </h2>
        <div className="grid gap-3 max-w-sm">
          <Input placeholder="Current Password" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
          <Input placeholder="New Password" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
          <Input placeholder="Confirm New Password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
          {pwError && <p className="text-xs text-red-500">{pwError}</p>}
          <Button onClick={savePassword} className="bg-accent hover:bg-accent/90 text-white">
            {pwSaved ? 'Password Updated!' : 'Update Password'}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Enable 2FA</div>
            <div className="text-xs text-muted-foreground">Add an extra layer of security to your account</div>
          </div>
          <Switch checked={twoFa} onCheckedChange={v => { setTwoFa(v); localStorage.setItem('ag_2fa', String(v)); }} />
        </div>
        {twoFa && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            2FA is enabled. Your account is protected with an authenticator app.
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Session Management</h2>
        <div className="grid gap-2 mb-4">
          <label className="text-sm font-medium text-foreground">Session Timeout (minutes)</label>
          <select
            value={sessionTimeout}
            onChange={e => { setSessionTimeout(e.target.value); localStorage.setItem('ag_timeout', e.target.value); }}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent max-w-xs"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="480">8 hours</option>
          </select>
        </div>
        <div className="space-y-3">
          {activeSessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div>
                <div className="text-sm font-medium text-foreground flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">CURRENT</span>}
                </div>
                <div className="text-xs text-muted-foreground">IP: {s.ip} · {s.lastActive}</div>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const prefs = [
    { label: 'Email notifications', desc: 'Receive notifications via email', key: 'ag_notif_email' },
    { label: 'Desktop notifications', desc: 'Browser push notifications', key: 'ag_notif_desktop' },
    { label: 'Scan completed', desc: 'Notify when any scan finishes', key: 'ag_notif_scan' },
    { label: 'Critical alerts', desc: 'Immediate alerts for critical vulnerabilities', key: 'ag_notif_critical' },
    { label: 'Weekly report digest', desc: 'Summary email every Monday', key: 'ag_notif_weekly' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" /> Notification Preferences
        </h2>
        {prefs.map(pref => {
          const [checked, setChecked] = useState(() => localStorage.getItem(pref.key) !== 'false');
          return (
            <div key={pref.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{pref.label}</div>
                <div className="text-xs text-muted-foreground">{pref.desc}</div>
              </div>
              <Switch checked={checked} onCheckedChange={v => { setChecked(v); localStorage.setItem(pref.key, String(v)); }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApiKeysTab() {
  interface ApiKey { id: string; name: string; key: string; created: string; lastUsed: string; }
  const [keys, setKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('ag_api_keys');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Production API', key: 'ag_sk_prod_xK9mN2pQ8rL5vT3wY7zD1sF4hJ6cB0', created: 'Jun 1, 2026', lastUsed: '2 hours ago' },
      { id: '2', name: 'CI/CD Pipeline', key: 'ag_sk_ci_aM3nR7uX1eW6tP9bG2kH5jL8cZ4vQ0', created: 'May 15, 2026', lastUsed: '1 day ago' },
    ];
  });
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const save = (updated: ApiKey[]) => {
    setKeys(updated);
    localStorage.setItem('ag_api_keys', JSON.stringify(updated));
  };

  const generateKey = () => {
    if (!newName.trim()) return;
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newName,
      key: `ag_sk_${rand}`,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
    };
    save([...keys, newKey]);
    setNewName('');
  };

  const copyKey = (key: ApiKey) => {
    navigator.clipboard.writeText(key.key);
    setCopied(key.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const deleteKey = (id: string) => save(keys.filter(k => k.id !== id));

  const regenerate = (id: string) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    save(keys.map(k => k.id === id ? { ...k, key: `ag_sk_${rand}` } : k));
  };

  const mask = (key: string) => key.slice(0, 10) + '••••••••••••••••••••' + key.slice(-4);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground flex items-center gap-2">
          <Key className="w-4 h-4 text-accent" /> API Keys
        </h2>
        <div className="flex gap-2">
          <Input placeholder="Key name (e.g. Staging)" value={newName} onChange={e => setNewName(e.target.value)} className="max-w-xs" />
          <Button onClick={generateKey} className="bg-accent hover:bg-accent/90 text-white gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Generate Key
          </Button>
        </div>

        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-foreground">{k.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Created {k.created} · Last used {k.lastUsed}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setVisible(v => ({ ...v, [k.id]: !v[k.id] }))} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    {visible[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => copyKey(k)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => regenerate(k.id)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteKey(k.id)} className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs bg-background border border-border rounded px-3 py-2 text-foreground flex items-center justify-between">
                <span>{visible[k.id] ? k.key : mask(k.key)}</span>
                {copied === k.id && <span className="text-green-600 text-[10px] font-sans font-medium">Copied!</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent" /> Current Plan
        </h2>
        <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div>
            <div className="text-sm font-bold text-foreground">Pro Plan</div>
            <div className="text-xs text-muted-foreground mt-0.5">$49 / month · Renews Jul 20, 2026</div>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-white text-xs">Upgrade to Enterprise</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Reports Used', value: '12 / 50' },
            { label: 'Storage', value: '2.4 GB / 10 GB' },
            { label: 'API Calls', value: '8,431 / 25,000' },
          ].map(m => (
            <div key={m.label} className="p-3 border border-border rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="text-sm font-semibold text-foreground mt-1">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Payment Method</h2>
        <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
          <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center">
            <span className="text-background text-[9px] font-bold">VISA</span>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">•••• •••• •••• 4242</div>
            <div className="text-xs text-muted-foreground">Expires 12/27</div>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto text-xs text-muted-foreground">Update</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold border-b border-border pb-4 text-foreground">Invoices</h2>
        {[
          { date: 'Jun 1, 2026', amount: '$49.00', status: 'Paid' },
          { date: 'May 1, 2026', amount: '$49.00', status: 'Paid' },
          { date: 'Apr 1, 2026', amount: '$49.00', status: 'Paid' },
        ].map((inv, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="text-sm text-foreground">{inv.date}</div>
            <div className="text-sm font-medium text-foreground">{inv.amount}</div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{inv.status}</span>
            <Button variant="ghost" size="sm" className="text-xs text-accent hover:text-accent/80">Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-0.5">
            {TABS.map(tab => (
              <button
                key={tab}
                data-testid={`tab-${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  activeTab === tab
                    ? "bg-secondary text-foreground font-medium border-l-2 border-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            {activeTab === 'General' && <GeneralTab />}
            {activeTab === 'Security' && <SecurityTab />}
            {activeTab === 'Notifications' && <NotificationsTab />}
            {activeTab === 'API Keys' && <ApiKeysTab />}
            {activeTab === 'Billing' && <BillingTab />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

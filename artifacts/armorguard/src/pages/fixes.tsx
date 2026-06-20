import { MainLayout } from "@/components/layout/main-layout";
import { useStore } from "@/hooks/use-store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, ChevronDown, ChevronRight, AlertTriangle, Shield,
  CheckCircle2, Code, Globe, Lock, Database, FileWarning, Wifi
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low";

interface Fix {
  id: string;
  threatId: string;
  title: string;
  severity: Severity;
  target: string;
  owasp: string;
  cvss: number;
  description: string;
  impact: string;
  steps: string[];
  codeExample?: { before: string; after: string };
  headers?: { name: string; value: string }[];
}

const FIXES: Fix[] = [
  {
    id: "fix-1",
    threatId: "1",
    title: "SQL Injection in Authentication Endpoint",
    severity: "Critical",
    target: "api.corp.io/login",
    owasp: "A03:2021 – Injection",
    cvss: 9.8,
    description:
      "User-supplied input is passed directly to SQL queries without sanitization, allowing an attacker to manipulate query logic, extract data, or execute arbitrary commands on the database.",
    impact:
      "Full database compromise, credential theft, authentication bypass, potential remote code execution on the database host.",
    steps: [
      "Replace all raw string concatenation in SQL queries with parameterized queries or prepared statements.",
      "Implement an ORM (e.g. Prisma, Drizzle) that escapes inputs automatically.",
      "Add input validation — reject inputs containing SQL metacharacters (', --, ;, /*) at the API boundary.",
      "Apply the principle of least privilege to your database user — the app account should only have SELECT/INSERT/UPDATE on the tables it needs.",
      "Enable a Web Application Firewall (WAF) rule to block common SQL injection patterns.",
      "Audit all database query construction code and add automated SAST checks to your CI pipeline.",
    ],
    codeExample: {
      before: `// ❌ Vulnerable — raw string interpolation
const user = await db.query(
  \`SELECT * FROM users WHERE email = '\${email}'\`
);`,
      after: `// ✅ Fixed — parameterized query
const user = await db.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);`,
    },
  },
  {
    id: "fix-2",
    threatId: "2",
    title: "MySQL Port 3306 Exposed to Public Internet",
    severity: "High",
    target: "db.example.com:3306",
    owasp: "A05:2021 – Security Misconfiguration",
    cvss: 8.1,
    description:
      "The MySQL database port (3306) is reachable from the public internet. This dramatically increases the attack surface, allowing brute-force attempts, credential stuffing, and exploitation of MySQL vulnerabilities directly.",
    impact:
      "Direct database access attempts, credential brute-force, exploitation of unpatched MySQL CVEs, data exfiltration.",
    steps: [
      "Immediately update firewall/security group rules to block inbound traffic on port 3306 from all public IPs.",
      "Restrict MySQL access to only the private IP range of your application servers (e.g. 10.0.0.0/8).",
      "If remote database access is needed, require it to go through an SSH tunnel or VPN.",
      "Disable the MySQL root account's ability to log in remotely (set host to 'localhost' only).",
      "Ensure MySQL bind-address is set to 127.0.0.1 or the private network interface only.",
      "Enable MySQL audit logging to detect any unauthorized access attempts.",
    ],
    codeExample: {
      before: `# ❌ my.cnf — binds to all interfaces
[mysqld]
bind-address = 0.0.0.0`,
      after: `# ✅ my.cnf — binds to localhost only
[mysqld]
bind-address = 127.0.0.1`,
    },
  },
  {
    id: "fix-3",
    threatId: "3",
    title: "Missing Content Security Policy Header",
    severity: "Medium",
    target: "example.com",
    owasp: "A05:2021 – Security Misconfiguration",
    cvss: 5.4,
    description:
      "The application does not set a Content-Security-Policy (CSP) header. Without CSP, browsers have no policy to enforce, making the application vulnerable to Cross-Site Scripting (XSS) attacks where injected scripts can run freely.",
    impact:
      "XSS attacks can steal session cookies, redirect users, capture keystrokes, and exfiltrate sensitive data from the page.",
    steps: [
      "Add a Content-Security-Policy header to all HTTP responses from your server.",
      "Start with a strict policy and loosen only what is needed: default-src 'self'.",
      "Add Strict-Transport-Security (HSTS) to enforce HTTPS.",
      "Add X-Frame-Options: DENY to prevent clickjacking.",
      "Add X-Content-Type-Options: nosniff to prevent MIME sniffing.",
      "Use a CSP evaluator tool (csp-evaluator.withgoogle.com) to verify your policy.",
      "Consider using a nonce-based CSP for inline scripts instead of 'unsafe-inline'.",
    ],
    headers: [
      { name: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" },
      { name: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { name: "X-Frame-Options", value: "DENY" },
      { name: "X-Content-Type-Options", value: "nosniff" },
      { name: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { name: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  },
  {
    id: "fix-4",
    threatId: "scan-1",
    title: "Admin Panel Accessible with Default Credentials",
    severity: "High",
    target: "example.com/admin",
    owasp: "A07:2021 – Identification and Authentication Failures",
    cvss: 7.5,
    description:
      "The /admin panel was discovered via directory enumeration and accepts default credentials (admin/admin or admin/password). This gives an attacker immediate administrative access to the application.",
    impact:
      "Full administrative control of the application, ability to create accounts, modify data, exfiltrate all user information, and pivot to further attacks.",
    steps: [
      "Immediately change all default credentials on admin accounts.",
      "Enforce a strong password policy (minimum 12 characters, mixed case, numbers, symbols).",
      "Restrict admin panel access to specific IP ranges using firewall rules or middleware.",
      "Require Multi-Factor Authentication (MFA) for all administrative logins.",
      "Rename or move the admin panel path from /admin to a non-guessable path.",
      "Implement account lockout after 5 failed login attempts.",
      "Add rate limiting on the admin login endpoint.",
      "Enable audit logging for all admin actions.",
    ],
  },
  {
    id: "fix-5",
    threatId: "scan-2",
    title: "Server Version Disclosure via Response Headers",
    severity: "Low",
    target: "api.corp.io",
    owasp: "A05:2021 – Security Misconfiguration",
    cvss: 3.1,
    description:
      "The server discloses its software name and version in HTTP response headers (e.g. Server: nginx/1.18.0, X-Powered-By: Express 4.17.1). This provides attackers with fingerprinting data to target known vulnerabilities.",
    impact:
      "Enables targeted attacks based on known CVEs for the disclosed software versions. Reduces attacker effort significantly.",
    steps: [
      "Remove or obfuscate the Server header in your web server configuration.",
      "Remove X-Powered-By headers (in Express: app.disable('x-powered-by')).",
      "Remove any version information from error pages.",
      "Keep all server software updated to latest stable versions regardless of disclosure.",
    ],
    codeExample: {
      before: `// ❌ Express — advertises framework version
app.use(express.json());
// Response: X-Powered-By: Express`,
      after: `// ✅ Express — removes header
app.disable('x-powered-by');
app.use(express.json());
// Response: (no X-Powered-By header)`,
    },
  },
  {
    id: "fix-6",
    threatId: "scan-3",
    title: "Cross-Site Scripting (XSS) via Unsanitized Input",
    severity: "High",
    target: "staging.app.co/search",
    owasp: "A03:2021 – Injection",
    cvss: 7.2,
    description:
      "User-supplied input from the search query parameter is reflected in the HTML response without encoding. An attacker can inject JavaScript that executes in victims' browsers when they visit a crafted URL.",
    impact:
      "Session hijacking, credential theft, malware distribution, defacement, phishing via the trusted domain.",
    steps: [
      "HTML-encode all user-supplied data before rendering it in HTML output.",
      "Use a templating engine with auto-escaping enabled (React, Angular, Vue all do this by default).",
      "Never use innerHTML, document.write, or eval() with user-controlled data.",
      "Implement the Content-Security-Policy header (see CSP fix above) to reduce XSS impact.",
      "Use DOMPurify to sanitize any HTML that must be rendered.",
      "Validate and whitelist expected input formats on the server side.",
    ],
    codeExample: {
      before: `// ❌ Vulnerable — raw HTML injection
res.send(\`<h1>Results for: \${req.query.q}</h1>\`);`,
      after: `// ✅ Fixed — escaped output
import { escape } from 'html-escaper';
res.send(\`<h1>Results for: \${escape(req.query.q)}</h1>\`);`,
    },
  },
];

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; border: string; icon: typeof Shield }> = {
  Critical: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle },
  High: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: Shield },
  Medium: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: FileWarning },
  Low: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle2 },
};

const THREAT_ICONS: Record<string, typeof Globe> = {
  "SQL Injection": Database,
  "Open Port": Wifi,
  "Missing CSP": Globe,
  "XSS": Code,
  "Admin Panel": Lock,
  default: Globe,
};

function FixCard({ fix }: { fix: Fix }) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[fix.severity];
  const SevIcon = cfg.icon;

  return (
    <div className={cn("border rounded-xl overflow-hidden transition-shadow", open ? "shadow-md" : "shadow-sm hover:shadow-md", cfg.border)}>
      {/* Header — always visible */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 bg-card text-left"
        onClick={() => setOpen(o => !o)}
        data-testid={`fix-card-${fix.id}`}
      >
        <div className={cn("p-2 rounded-lg shrink-0", cfg.bg)}>
          <SevIcon className={cn("w-4 h-4", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{fix.title}</span>
            <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full border", cfg.bg, cfg.color, cfg.border)}>
              {fix.severity}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="font-mono">{fix.target}</span>
            <span>·</span>
            <span>{fix.owasp}</span>
            <span>·</span>
            <span className={cn("font-semibold", fix.cvss >= 9 ? "text-red-600" : fix.cvss >= 7 ? "text-orange-600" : fix.cvss >= 4 ? "text-yellow-600" : "text-blue-600")}>
              CVSS {fix.cvss}
            </span>
          </div>
        </div>
        <div className={cn("shrink-0 transition-transform duration-200", open ? "rotate-90" : "")}>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border bg-background space-y-5">
              {/* Description + Impact */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Description</div>
                  <p className="text-sm text-foreground leading-relaxed">{fix.description}</p>
                </div>
                <div className={cn("p-4 rounded-lg border", cfg.bg, cfg.border)}>
                  <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5", cfg.color)}>
                    <AlertTriangle className="w-3 h-3" /> Impact
                  </div>
                  <p className={cn("text-sm leading-relaxed", cfg.color)}>{fix.impact}</p>
                </div>
              </div>

              {/* Fix Steps */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Wrench className="w-3 h-3" /> Remediation Steps
                </div>
                <ol className="space-y-2">
                  {fix.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className={cn("shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5", cfg.bg, cfg.color, "border", cfg.border)}>
                        {i + 1}
                      </span>
                      <span className="text-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Security Headers */}
              {fix.headers && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Recommended Security Headers</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {fix.headers.map((h, i) => (
                      <div key={i} className={cn("flex gap-3 px-4 py-2.5 text-xs font-mono", i % 2 === 0 ? "bg-muted/40" : "bg-card")}>
                        <span className="text-accent font-semibold shrink-0 w-52">{h.name}:</span>
                        <span className="text-foreground break-all">{h.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Example */}
              {fix.codeExample && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Code Fix</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-semibold text-red-500 mb-1.5 uppercase tracking-wider">Before (Vulnerable)</div>
                      <pre className="bg-foreground text-red-300 text-xs p-4 rounded-lg overflow-auto leading-relaxed font-mono whitespace-pre-wrap">{fix.codeExample.before}</pre>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-green-500 mb-1.5 uppercase tracking-wider">After (Fixed)</div>
                      <pre className="bg-foreground text-green-300 text-xs p-4 rounded-lg overflow-auto leading-relaxed font-mono whitespace-pre-wrap">{fix.codeExample.after}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SEVERITY_ORDER: Severity[] = ["Critical", "High", "Medium", "Low"];

export default function Fixes() {
  const { threats } = useStore();
  const [filter, setFilter] = useState<Severity | "All">("All");
  const [expandAll, setExpandAll] = useState(false);

  const counts = SEVERITY_ORDER.reduce((acc, s) => {
    acc[s] = FIXES.filter(f => f.severity === s).length;
    return acc;
  }, {} as Record<Severity, number>);

  const filtered = filter === "All" ? FIXES : FIXES.filter(f => f.severity === filter);

  const totalCvss = FIXES.reduce((sum, f) => sum + f.cvss, 0);
  const avgCvss = (totalCvss / FIXES.length).toFixed(1);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-6 max-w-5xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-accent" />
              Remediation Guide
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-generated fix recommendations for every threat found across your scans.
            </p>
          </div>
          <button
            onClick={() => setExpandAll(e => !e)}
            className="text-xs text-accent hover:underline font-medium"
          >
            {expandAll ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="md:col-span-1 bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Avg CVSS</div>
            <div className="text-2xl font-bold font-mono text-foreground">{avgCvss}</div>
          </div>
          {SEVERITY_ORDER.map(s => {
            const cfg = SEVERITY_CONFIG[s];
            return (
              <div key={s} className={cn("border rounded-lg p-4 cursor-pointer transition-all", filter === s ? cn(cfg.bg, cfg.border, "ring-1", `ring-${cfg.border}`) : "bg-card border-border hover:border-border/80")}
                onClick={() => setFilter(f => f === s ? "All" : s)}>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{s}</div>
                <div className={cn("text-2xl font-bold font-mono", filter === s ? cfg.color : "text-foreground")}>{counts[s]}</div>
              </div>
            );
          })}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Filter:</span>
          {(["All", ...SEVERITY_ORDER] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                filter === s
                  ? "bg-accent text-white border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {s} {s !== "All" && `(${counts[s as Severity]})`}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} fix{filtered.length !== 1 ? "es" : ""} shown</span>
        </div>

        {/* Fix Cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl text-sm">
              No fixes match the current filter.
            </div>
          )}
          {filtered.map((fix, i) => (
            <motion.div
              key={fix.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <FixCard fix={fix} />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground pb-4">
          Fixes are generated based on OWASP Top 10 2021, NIST guidelines, and industry best practices. Always test remediation in a staging environment before applying to production.
        </p>
      </motion.div>
    </MainLayout>
  );
}

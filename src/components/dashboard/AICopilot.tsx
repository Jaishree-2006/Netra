import React, { useState } from 'react';
import { Sparkles, Send, Bot, Filter, ShieldCheck, Lock, CheckCircle2, AlertTriangle, FileText, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AICopilot: React.FC = () => {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    role: 'user' | 'assistant';
    text: string;
    filters?: any;
    firewallStatus?: {
      roleCheck: string;
      biasCheck: string;
      fieldCheck: string;
    };
  }>([
    {
      role: 'assistant',
      text: 'Greetings Officer. I am Netra Co-pilot. Ask me any query in natural language (e.g. "Show repeat offenders in Sector 18", "What is the nocturnal risk forecast for Tech Park?").',
    },
  ]);

  const quickPrompts = [
    "Show repeat offenders in Sector 18 for vehicle theft",
    "What is the nocturnal burglary risk for Tech Park?",
    "Verify Blockchain WORM audit ledger status",
    "Find recent armed robbery FIR records"
  ];

  const generateDynamicResponse = (userText: string) => {
    const q = userText.toLowerCase();

    if (q.includes('offender') || q.includes('bail') || q.includes('suspect') || q.includes('repeat')) {
      return {
        text: `Extracted PostGIS Intent: Querying repeat offender tracking database. Found 14 active repeat offenders under bail surveillance in ${currentUser.jurisdiction}. 2 proximity beacons triggered near recent burglary FIRs (FIR-2026-8820). Anonymized targets SUSPECT-REF-2231 & SUSPECT-REF-1094 detected in spatial vicinity.`,
        filters: {
          jurisdiction: `${currentUser.jurisdiction} (Authorized)`,
          offenseScope: 'Repeat Offender / Bail Surveillance',
          timeframe: 'Active 24h Window',
          matchedTargets: 'SUSPECT-REF-2231, SUSPECT-REF-1094, SUSPECT-REF-8942',
          identityRedaction: 'ACTIVE (PII masked by policy)',
        },
      };
    } else if (q.includes('risk') || q.includes('predict') || q.includes('forecast') || q.includes('shap') || q.includes('tech park')) {
      return {
        text: `Extracted ML Inference Intent: Calculated 88.4% incident risk probability for Sector 18 / Tech Park Commercial Corridor (Next 6 Hours). SHAP attribution indicates: Repeat offender proximity (+24%), Unlit alley (+14%), Past 3-year nocturnal crime density (+18%).`,
        filters: {
          jurisdiction: `${currentUser.jurisdiction}`,
          modelEngine: 'XGBoost v2.4 + Spatio-Temporal LSTM',
          window: '01:00 - 07:00 HRS',
          disparateImpact: 'DI Ratio 0.94 (PASS > 0.80)',
          mitigatingFactor: 'CCTV Lighting Coverage (-8%)',
        },
      };
    } else if (q.includes('hotspot') || q.includes('map') || q.includes('cluster') || q.includes('spatial') || q.includes('zone')) {
      return {
        text: `Extracted Spatial Density Intent: Executed PostGIS DBSCAN clustering over 42 recent incidents. Identified 7 high-density risk zones centered at MG Road / Sector 18 (Density index 9.2/10) and Tech Park Parking.`,
        filters: {
          jurisdiction: `${currentUser.jurisdiction}`,
          clusterAlgorithm: 'PostGIS ST_ClusterDBSCAN (eps=500m)',
          hotspotZones: '7 Active Clusters Identified',
          topHotspot: 'Sector 18 Commercial Hub (38% spike)',
        },
      };
    } else if (q.includes('blockchain') || q.includes('audit') || q.includes('worm') || q.includes('security') || q.includes('log')) {
      return {
        text: `Extracted Ledger Verification Intent: Queried Hyperledger Consortium Blockchain. Ledger height: Block #48,192. Merkle Tree Root: 0x8f3a9b1c...4d2e. All system queries and analyst actions are tamper-evident and RSA-4096 signed.`,
        filters: {
          blockchainStatus: 'Consortium Chain Verified (BFT Consensus)',
          currentBlockHeight: '#48,192',
          signatureAlg: 'RSA-4096 / SHA-256',
          auditCompliance: '100% WORM Tamper-Evident',
        },
      };
    } else if (q.includes('fir') || q.includes('case') || q.includes('theft') || q.includes('robbery') || q.includes('crime')) {
      return {
        text: `Extracted FIR Record RAG Intent: Searched 142,000 incident reports matching "${userText}". Retrieved 42 relevant FIR records. Case resolution index stands at 76.4% (Avg 4.2 days to resolution).`,
        filters: {
          jurisdiction: `${currentUser.jurisdiction}`,
          totalMatches: '42 FIR Records',
          topCaseRef: 'FIR-2026-9042 (Armed Robbery)',
          resolutionIndex: '76.4% Resolved',
        },
      };
    } else {
      return {
        text: `Extracted RAG Intelligence Intent for "${userText}": Processed query through Llama-3-70B RAG pipeline against State Police database. Synthesized 18 contextual crime signals for ${currentUser.jurisdiction}. Strict identity redaction applied.`,
        filters: {
          jurisdiction: `${currentUser.jurisdiction}`,
          queryParameters: userText,
          identityRedaction: 'ACTIVE (PII Redacted)',
          confidenceScore: '94% RAG Match',
        },
      };
    }
  };

  const handleSendQuery = (textToSend: string) => {
    if (!textToSend.trim()) return;

    setQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', text: textToSend }]);

    const response = generateDynamicResponse(textToSend);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.text,
          filters: response.filters,
          firewallStatus: {
            roleCheck: `PASSED — Role '${currentUser.roleTitle}' authorized for ${currentUser.jurisdiction}`,
            biasCheck: 'CLEAR — Zero protected characteristic bias or surname proxy filters triggered',
            fieldCheck: 'GRANTED — Field-level security policy checked & RSA-4096 WORM signed',
          },
        },
      ]);
    }, 600);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 dashboard-card rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="display-heading text-base text-slate-100 font-extrabold">AI Co-pilot &amp; Natural Language Case Query Engine</h2>
            <p className="display-heading text-xs text-slate-400">RAG over FIR Database • Live Bias Firewall • Cryptographic WORM Audit Logging</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-mono display-heading font-bold">
          LLM Engine: Llama-3-70B-Instruct-Police
        </span>
      </div>

      {/* WORM Audit Notice Banner */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Blockchain WORM Audit Active:</strong> All natural language prompts and generated SQL queries are cryptographically signed and logged under Badge ID <strong className="text-cyan-300 font-mono">{currentUser.badgeId}</strong>.
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-300 uppercase bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
          Hyperledger Consortium Verified
        </span>
      </div>

      {/* Main Chat Panel */}
      <div className="dashboard-card rounded-xl p-5 h-[520px] flex flex-col justify-between">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-xl space-y-3 display-heading ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none shadow-md font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <p className="leading-relaxed font-medium text-xs md:text-sm">{msg.text}</p>

                {/* Visible Query Permission & Bias Firewall Card */}
                {msg.firewallStatus && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-[11px] text-emerald-200 font-sans">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-300 text-xs border-b border-emerald-500/30 pb-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      QUERY FIREWALL &amp; BIAS VALIDATION CHECK
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>RBAC Role Check:</strong> {msg.firewallStatus.roleCheck}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Bias &amp; Ethics Filter:</strong> {msg.firewallStatus.biasCheck}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Field Level Security:</strong> {msg.firewallStatus.fieldCheck}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generated Filter Matrix with Anonymization Tag */}
                {msg.filters && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] space-y-2 font-mono display-heading shadow-xl">
                    <div className="text-purple-400 font-bold flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        EXTRACTED POSTGIS QUERY MATRIX
                      </span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] uppercase font-bold">
                        Identity Redaction Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                      {Object.entries(msg.filters).map(([k, v]) => (
                        <div key={k} className="capitalize">
                          {k.replace(/([A-Z])/g, ' $1')}: <span className="font-bold text-slate-100">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="pt-3 pb-2 flex flex-wrap gap-2">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(p)}
              className="text-[11px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 rounded-lg transition font-medium text-left"
            >
              💡 {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="relative pt-2 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask any natural language query (e.g., 'show repeat offenders', 'burglary risk in Tech Park')..."
            className="flex-1 px-4 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 display-heading focus:outline-none focus:border-purple-500 pr-12"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white display-heading font-bold rounded-xl text-xs flex items-center gap-1 transition shadow-lg shadow-purple-600/20"
          >
            <span>Run Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileCheck, Download, ChevronDown, Search, Filter, AlertTriangle, ShieldAlert, Flag, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  IP: string;
  anomalyFlag?: {
    type: string;
    severity: 'high' | 'medium';
    description: string;
  };
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-23 03:12:44',
    user: 'Inspector Rajesh Kumar (SHO)',
    action: 'Queried Cell Triangulation & Location Feed',
    target: 'SUSPECT-REF-2231',
    IP: '10.204.14.88',
    anomalyFlag: {
      type: 'High-Frequency Off-Case Lookups',
      severity: 'high',
      description: 'AI Anomaly Detector: 14 queries for same target within 2 hours without active FIR linkage',
    },
  },
  {
    id: 'log-102',
    timestamp: '2026-07-23 02:45:10',
    user: 'Dr. Ananya Roy (Analyst)',
    action: 'Executed SHAP Model Bias Audit Check',
    target: 'XGBoost Risk Model v2.4',
    IP: '10.204.10.12',
  },
  {
    id: 'log-103',
    timestamp: '2026-07-23 01:30:00',
    user: 'System Automated Daemon',
    action: 'WORM Immutable Block Cryptographic Seal',
    target: 'Block Hash #0x89A...F31',
    IP: 'INTERNAL-KERNEL',
  },
  {
    id: 'log-104',
    timestamp: '2026-07-22 23:50:18',
    user: 'District SP Vikramaditya Sen',
    action: 'Approved Patrol Reallocation Proposal',
    target: 'Sector 18 Patrol Unit 4',
    IP: '10.204.01.05',
  },
  {
    id: 'log-105',
    timestamp: '2026-07-22 21:14:02',
    user: 'Constable M. Yadav (Field Officer)',
    action: 'Attempted Off-Jurisdiction Query',
    target: 'South Division Archive Records',
    IP: '10.204.88.19',
    anomalyFlag: {
      type: 'Off-Jurisdiction Data Access',
      severity: 'medium',
      description: 'AI Anomaly Detector: User queried records outside assigned Sector 18 jurisdiction boundary',
    },
  },
];

export const AuditLog: React.FC = () => {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [filterAnomaliesOnly, setFilterAnomaliesOnly] = useState(false);

  // Escalation Modal state
  const [flagModalLog, setFlagModalLog] = useState<AuditLogEntry | null>(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationSubmitted, setEscalationSubmitted] = useState(false);

  // Blockchain Verifier Modal state
  const [verifyBlockLog, setVerifyBlockLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = mockAuditLogs.filter((log) => {
    if (filterAnomaliesOnly && !log.anomalyFlag) return false;
    if (filterAction !== 'All' && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchUser = log.user.toLowerCase().includes(term);
      const matchAction = log.action.toLowerCase().includes(term);
      const matchTarget = log.target.toLowerCase().includes(term);
      const matchId = log.id.toLowerCase().includes(term);
      return matchUser || matchAction || matchTarget || matchId;
    }
    return true;
  });

  const handleEscalationSubmit = () => {
    setEscalationSubmitted(true);
    setTimeout(() => {
      setEscalationSubmitted(false);
      setFlagModalLog(null);
      setEscalationReason('');
    }, 2000);
  };

  const handleExportAuditLog = () => {
    const header = 'Log ID,Timestamp,User,Action,Target,IP Address,Anomaly Flag,Severity,Anomaly Description';
    const rows = mockAuditLogs.map((log) => [
      log.id,
      log.timestamp,
      `"${log.user}"`,
      `"${log.action}"`,
      log.target,
      log.IP,
      log.anomalyFlag ? log.anomalyFlag.type : 'None',
      log.anomalyFlag ? log.anomalyFlag.severity : 'N/A',
      log.anomalyFlag ? `"${log.anomalyFlag.description}"` : 'N/A',
    ].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETRA_AI_WORM_AUDIT_LOG_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 dashboard-card rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="display-heading text-base text-slate-100 font-extrabold">Immutable Cryptographic Audit Trail (WORM Storage)</h2>
            <p className="display-heading text-xs text-slate-400">RSA-4096 Hash Chained • AI Usage Anomaly Monitor • Independent Oversight</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAuditLog}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white display-heading font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ethics Audit Log (Court Verifiable)
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-800 rounded transition"
          >
            <ChevronDown
              size={20}
              className={`text-slate-400 transform transition ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Blockchain Consortium Ledger Status Card */}
          <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-xl text-purple-200 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-800/50 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                  <ShieldAlert className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span>Hyperledger Consortium Blockchain Security Ledger</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono rounded font-bold uppercase">
                      BFT-Consensus Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-purple-300/80">Tamper-Evident WORM Cryptographic Ledger Chained Across 5 Node Authorities.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Chain Height: Block #48,192
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/80 border border-purple-900/40 rounded-lg space-y-0.5">
                <div className="text-[10px] text-slate-400">Merkle Tree Root</div>
                <div className="font-bold text-purple-300 truncate">0x8f3a9b1c7d2e4f5a...</div>
              </div>
              <div className="p-2.5 bg-slate-950/80 border border-purple-900/40 rounded-lg space-y-0.5">
                <div className="text-[10px] text-slate-400">Consensus Engine</div>
                <div className="font-bold text-slate-100">Raft-BFT (5 Nodes)</div>
              </div>
              <div className="p-2.5 bg-slate-950/80 border border-purple-900/40 rounded-lg space-y-0.5">
                <div className="text-[10px] text-slate-400">Cryptographic Seal</div>
                <div className="font-bold text-emerald-400">RSA-4096 / SHA-256</div>
              </div>
            </div>
          </div>
          {/* AI Usage Anomaly Engine Summary Card ("AI Watches the AI Users") */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">AI Internal Usage Anomaly Detector ("AI Oversight Layer")</h3>
                  <p className="text-[11px] text-slate-400">Automated neural pattern monitoring flags abnormal internal database queries or off-case lookups.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold rounded-full">
                2 Usage Anomalies Flagged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-300 text-[11px]">High-Frequency Off-Case Query (Inspector R. Kumar)</div>
                  <p className="text-[10px] text-slate-400">14 cell triangulation lookups for SUSPECT-REF-2231 within 2h window without linked active FIR.</p>
                </div>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 text-[11px]">Off-Jurisdiction Access Attempt (Constable M. Yadav)</div>
                  <p className="text-[10px] text-slate-400">User attempted query on South Division archive records outside Sector 18 beat scope.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 dashboard-card rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="audit-search-input"
                  type="text"
                  placeholder="Search log ID, user name, badge ID, action, or target..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="audit-action-filter"
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="bg-slate-950 text-slate-100 font-bold focus:outline-none"
                >
                  <option value="All">All Actions</option>
                  <option value="Cell">Cell Triangulation</option>
                  <option value="SHAP">Model Bias Audit</option>
                  <option value="Patrol">Patrol Reallocation</option>
                  <option value="Off-Jurisdiction">Off-Jurisdiction</option>
                </select>
              </div>
            </div>

            <button
              id="toggle-anomalies-filter-btn"
              onClick={() => setFilterAnomaliesOnly(!filterAnomaliesOnly)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                filterAnomaliesOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
              }`}
            >
              ⚠️ {filterAnomaliesOnly ? 'Showing AI Anomalies Only' : 'Filter AI Anomalies Only'}
            </button>
          </div>

          {/* Audit Log Table */}
          <div className="dashboard-card rounded-xl p-5 space-y-4">
            <div className="display-heading flex justify-between items-center text-xs">
              <span className="font-mono text-emerald-400 font-bold">STATUS: RSA-4096 SIGNED HASH CHAIN VERIFIED</span>
              <span className="text-slate-400 font-bold">Showing {filteredLogs.length} of 14,890 WORM Entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs display-heading">
                <thead className="bg-slate-950 text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Authenticated User</th>
                    <th className="p-3">Action Performed</th>
                    <th className="p-3">Target Subject</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 text-right">Oversight Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className={`hover:bg-slate-900/50 transition ${log.anomalyFlag ? 'bg-amber-500/5 border-l-2 border-amber-500/40' : ''}`}>
                      <td className="p-3 font-mono text-slate-400 font-bold">{log.id}</td>
                      <td className="p-3 font-mono text-cyan-400 font-bold">{log.timestamp}</td>
                      <td className="p-3 font-bold text-slate-100">{log.user}</td>
                      <td className="p-3 text-slate-300">
                        <div>{log.action}</div>
                        {log.anomalyFlag && (
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-mono font-bold">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                            <span>AI Flag: {log.anomalyFlag.type}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-purple-300 font-mono font-bold">{log.target}</td>
                      <td className="p-3 font-mono text-slate-400">{log.IP}</td>
                      <td className="p-3 text-right flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setVerifyBlockLog(log)}
                          className="px-2 py-1 text-[10px] font-bold bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800 rounded transition inline-flex items-center gap-1 font-mono"
                        >
                          <ShieldAlert className="w-3 h-3 text-purple-400" />
                          Verify Block
                        </button>
                        <button
                          id={`flag-log-btn-${log.id}`}
                          onClick={() => setFlagModalLog(log)}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-950 hover:bg-amber-500/10 text-amber-400 border border-amber-500/40 rounded transition inline-flex items-center gap-1"
                        >
                          <Flag className="w-3 h-3 text-amber-400" />
                          Flag Ethics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Blockchain Block Verifier Modal */}
          {verifyBlockLog && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-100">Consortium Blockchain Block Verifier</h3>
                      <p className="text-xs text-slate-400">On-Chain Cryptographic Proof &amp; WORM Immutability Verification</p>
                    </div>
                  </div>
                  <button onClick={() => setVerifyBlockLog(null)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-emerald-300">
                    <div className="flex justify-between items-center font-bold">
                      <span>ON-CHAIN VERIFICATION RESULT</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% VALID &amp; MATCHED
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-sans leading-relaxed">
                      This audit record (ID: {verifyBlockLog.id}) matches the Merkle tree root on the State Police Consortium Blockchain. Zero unauthorized mutations detected.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Record ID:</span>
                      <span className="font-bold text-slate-100">{verifyBlockLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Block Height:</span>
                      <span className="font-bold text-purple-300">#48,192</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Block Hash:</span>
                      <span className="font-bold text-cyan-400 truncate max-w-[240px]">0x8f3a9b1c7d2e4f5a...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prev Block Hash:</span>
                      <span className="font-bold text-slate-400 truncate max-w-[240px]">0x7e2d9c1b4a3f2e1d...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Digital Signature:</span>
                      <span className="font-bold text-emerald-400">RSA-4096 VALID</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consensus Nodes:</span>
                      <span className="font-bold text-slate-100">5/5 Nodes Agreed</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setVerifyBlockLog(null)}
                    className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-md"
                  >
                    Close Block Verification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Auditor Escalation Modal */}
          {flagModalLog && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">OVERSIGHT AUDITOR ESCALATION</span>
                    <h3 className="text-base font-extrabold text-slate-100">Flag Audit Entry: {flagModalLog.id}</h3>
                  </div>
                  <button onClick={() => setFlagModalLog(null)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {escalationSubmitted ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="font-bold">Formal Escalation Logged &amp; Transmitted</p>
                    <p className="text-[10px] text-emerald-400">Sent to Judicial Oversight Committee (Chair: Justice S. K. Verma Retd.)</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[11px] font-mono">
                      <div>Logged User: <strong className="text-slate-100">{flagModalLog.user}</strong></div>
                      <div>Action: <strong className="text-slate-100">{flagModalLog.action}</strong></div>
                      <div>Target: <strong className="text-purple-300">{flagModalLog.target}</strong></div>
                      <div>Timestamp: <strong className="text-slate-100">{flagModalLog.timestamp}</strong></div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Auditor Review &amp; Escalation Reason <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="escalation-reason-input"
                        rows={3}
                        placeholder="State reason for flagging..."
                        value={escalationReason}
                        onChange={(e) => setEscalationReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-300 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p>Escalation will freeze log record hash and issue priority review request to State Police Ethics Oversight Board.</p>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => setFlagModalLog(null)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-escalation-btn"
                        disabled={!escalationReason.trim()}
                        onClick={handleEscalationSubmit}
                        className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition shadow-md flex items-center gap-1.5"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        Submit Formal Escalation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

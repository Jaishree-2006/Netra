import React from 'react';
import { FileCheck, Download } from 'lucide-react';

const mockAuditLogs = [
  { id: 'log-101', timestamp: '2026-07-23 03:12:44', user: 'Inspector Rajesh Kumar (SHO)', action: 'Queried Repeat Offender Cell Triangulation', target: 'Rashid Khan (Shadow)', IP: '10.204.14.88' },
  { id: 'log-102', timestamp: '2026-07-23 02:45:10', user: 'Dr. Ananya Roy (Analyst)', action: 'Executed SHAP Model Bias Audit Check', target: 'XGBoost Risk Model v2.4', IP: '10.204.10.12' },
  { id: 'log-103', timestamp: '2026-07-23 01:30:00', user: 'System Automated Daemon', action: 'WORM Immutable Block Cryptographic Seal', target: 'Block Hash #0x89A...F31', IP: 'INTERNAL-KERNEL' },
  { id: 'log-104', timestamp: '2026-07-22 23:50:18', user: 'District SP Vikramaditya Sen', action: 'Approved Patrol Reallocation Order', target: 'Sector 18 Patrol Unit 4', IP: '10.204.01.05' },
];

export const AuditLog: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Immutable Cryptographic Audit Trail (WORM Storage)</h2>
            <p className="text-xs text-slate-400">Write-Once-Read-Many Compliance Storage • Independent Oversight Access</p>
          </div>
        </div>

        <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition">
          <Download className="w-3.5 h-3.5" />
          Export Ethics Audit Log (Court Verifiable)
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-emerald-400">STATUS: ALL AUDIT BLOCKS SIGNED WITH RSA-4096 HASH CHAIN</span>
          <span className="text-slate-400">Total Entries: 14,890</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Authenticated User</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Target Subject</th>
                <th className="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono text-slate-400">{log.id}</td>
                  <td className="p-3 font-mono text-cyan-400">{log.timestamp}</td>
                  <td className="p-3 font-medium text-slate-100">{log.user}</td>
                  <td className="p-3 text-slate-300">{log.action}</td>
                  <td className="p-3 text-purple-300 font-mono">{log.target}</td>
                  <td className="p-3 font-mono text-slate-500">{log.IP}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

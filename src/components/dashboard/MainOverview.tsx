import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../../data/mockData';
import {
  ShieldAlert, AlertTriangle, TrendingUp, Users, CheckCircle2, MapPin,
  Activity, ArrowUpRight, ArrowDownRight, RotateCcw, Info, Lock, Eye, EyeOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';

const trendData = [
  { time: '00:00', incidents: 4, predictedRisk: 42 },
  { time: '03:00', incidents: 9, predictedRisk: 78 },
  { time: '06:00', incidents: 3, predictedRisk: 30 },
  { time: '09:00', incidents: 2, predictedRisk: 25 },
  { time: '12:00', incidents: 5, predictedRisk: 40 },
  { time: '15:00', incidents: 6, predictedRisk: 52 },
  { time: '18:00', incidents: 8, predictedRisk: 65 },
  { time: '21:00', incidents: 12, predictedRisk: 88 },
];

// Aggregate data shown to command/district roles — no individual cases
const zoneAggregates = [
  { zone: 'Sector 18 PS', open: 12, critical: 4, avgRisk: 84 },
  { zone: 'Old Town PS', open: 7, critical: 2, avgRisk: 71 },
  { zone: 'Cyber Crime Cell', open: 5, critical: 1, avgRisk: 62 },
  { zone: 'Green Park PS', open: 3, critical: 0, avgRisk: 38 },
  { zone: 'North Gate PS', open: 6, critical: 2, avgRisk: 76 },
];

// Roles that may see individual case rows in the FIR table
const CASE_DETAIL_ROLES = ['super_admin', 'sho', 'analyst', 'auditor'];
// Roles that may see Assigned Officer name
const OFFICER_VISIBLE_ROLES = ['super_admin', 'sho', 'district_head'];

export const MainOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { pendingApprovalCases, approveCaseBySho, verifiedCases } = useCases();
  const [closureInfoOpen, setClosureInfoOpen] = useState(false);

  const canSeeCaseDetail = CASE_DETAIL_ROLES.includes(currentUser.role);
  const canSeeOfficerName = OFFICER_VISIBLE_ROLES.includes(currentUser.role);
  const isCommandView = currentUser.role === 'command_level' || currentUser.role === 'district_head';

  return (
    <div className="space-y-6 select-none">

      {/* ── Alert Banner (Dark Mode High Contrast) ──────────────────── */}
      <div className="p-5 bg-slate-900 border border-red-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/40 animate-pulse shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">NOCTURNAL ANOMALY ALERT</span>
              <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-300 rounded font-bold border border-red-500/30">SECTOR 18</span>
            </div>
            <p className="display-heading text-[1.15rem] md:text-[1.3rem] font-extrabold text-slate-100 mt-0.5">
              Overnight Spikes in Vehicle Theft &amp; Armed Robbery (+38% vs 30-day baseline)
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('geospatial')}
          className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition shadow-md border border-slate-700 shrink-0 flex items-center gap-1.5"
        >
          View Hotspot Heatmap
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* ── KPI Cards Grid (Clean Proportional Typography) ───────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="dashboard-card p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>24h Total Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-extrabold text-slate-100">{42 + verifiedCases.length}</span>
              <span className="text-xs font-bold text-slate-400">Incidents</span>
            </div>
            <span className="text-xs font-bold text-red-400 flex items-center gap-0.5">+14% <ArrowUpRight className="w-3 h-3" /></span>
          </div>
          <p className="text-[11px] text-slate-400">18 in Sector 18 PS Jurisdiction</p>
        </div>

        <div className="dashboard-card p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>Active High-Risk Hotspots</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-extrabold text-slate-100">7</span>
              <span className="text-xs font-bold text-slate-400">Zones</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">-2 <ArrowDownRight className="w-3 h-3" /></span>
          </div>
          <p className="text-[11px] text-slate-400">Highest density: Tech Park Parking</p>
        </div>

        <div className="dashboard-card p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>Active Repeat Offenders</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-extrabold text-slate-100">14</span>
              <span className="text-xs font-bold text-slate-400">Flagged</span>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono">Bail Monitored</span>
          </div>
          <p className="text-[11px] text-slate-400">2 proximity signals matched to open FIRs</p>
        </div>

        {/* Case Closure Index */}
        <div className="dashboard-card p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <div className="flex items-center gap-1 relative">
              <span>Case Closure Index</span>
              <button
                id="closure-info-btn"
                onClick={() => setClosureInfoOpen(!closureInfoOpen)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {closureInfoOpen && (
                <div className="absolute z-20 left-0 top-5 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-slate-100 mb-1">Quality-Adjusted Closure Rate</p>
                  <p>Closure rate alone can incentivise premature case marking. Paired with Reopen Rate to detect quality issues before they compound.</p>
                </div>
              )}
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-mono font-extrabold text-slate-100">76.4%</span>
            <span className="text-xs font-bold text-emerald-400">+4.2%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Avg: 4.2 days</span>
            <span className="font-bold text-amber-400 font-mono">Reopen: 3.1%</span>
          </div>
        </div>
      </div>

      {/* ── Chart + AI Anomaly Feed ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 p-6 dashboard-card rounded-2xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="display-heading text-base md:text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                24-Hour Temporal Crime &amp; AI Risk Forecast
              </h3>
              <p className="text-xs text-slate-400">Real-time crime events overlaid with XGBoost 3-hour risk probability</p>
            </div>
            <span className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg font-mono font-bold shrink-0">
              Live Hourly Feed
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={12} fontWeight="bold" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontSize: '12px' }} />
                <Area type="monotone" dataKey="predictedRisk" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="AI Risk Score %" />
                <Area type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#incidentGrad)" name="Actual Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Anomaly Feed */}
        <div className="p-6 dashboard-card rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="display-heading text-base md:text-lg font-extrabold text-slate-100 flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
              AI Pattern Anomaly Feed
            </h3>
            <p className="text-xs text-slate-400 mb-4">Transformer NLP &amp; Clustering detections · Pending analyst review</p>

            <div className="space-y-3">

              {/* Feed item 1 */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between text-cyan-400 font-mono font-bold">
                  <span>PATTERN MATCH #991</span>
                  <span>12m ago</span>
                </div>
                <p className="text-slate-100 font-bold">Modus Operandi Correlation</p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  FIR-2026-8819 &amp; FIR-2026-8820 share RFID signal-jamming signature vectors — potential common origin.
                </p>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                  <span className="font-mono text-xs text-cyan-400 font-bold">Similarity: 87%</span>
                  <button
                    id="anomaly-991-review-btn"
                    onClick={() => onNavigate('network')}
                    className="text-xs text-purple-300 font-bold hover:underline flex items-center gap-1"
                  >
                    Flagged for review →
                  </button>
                </div>
              </div>

              {/* Feed item 2 */}
              <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between text-amber-400 font-mono font-bold">
                  <span>PROXIMITY SIGNAL #447</span>
                  <span>45m ago</span>
                </div>
                <p className="text-slate-100 font-bold">Cell-Signal Proximity Hypothesis</p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-bold">SUSPECT-REF-2231</span> cell-tower
                  proximity detected in Sector 18 during robbery window.
                </p>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-mono font-bold">
                    <Lock className="w-3 h-3" />
                    Warrant #WR-2026-448
                  </div>
                  {canSeeCaseDetail ? (
                    <button
                      id="anomaly-447-case-btn"
                      onClick={() => onNavigate('repeat-offenders')}
                      className="text-xs text-purple-300 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Open case →
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <EyeOff className="w-3 h-3" /> Restricted
                    </span>
                  )}
                </div>
              </div>

          </div>
        </div>

      {/* ── 3-State Data Pipeline: SHO Supervisory Approval Queue ───── */}
      {pendingApprovalCases.length > 0 && (
        <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-3 shadow-md animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/40">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>SHO Supervisory Approval Queue</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded font-bold">
                    {pendingApprovalCases.length} Pending Verification
                  </span>
                </h3>
                <p className="text-[11px] text-amber-200/80">
                  Data Integrity Gate: Only "Verified — Active" FIRs fan out to AI risk models, heatmaps, and public portals.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[10px] font-bold rounded-lg">
              Pending Review → Verified Active → Archived
            </span>
          </div>

          <div className="space-y-2">
            {pendingApprovalCases.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-cyan-400">{c.id}</span>
                    <span className="text-slate-400">• {c.crimeType}</span>
                    <span className="text-slate-400">• {c.station} ({c.beat})</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-semibold">{c.narrative}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Submitted by {c.reportingOfficer} at {c.submittedAt.slice(0, 16)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveCaseBySho(c.id, currentUser.name)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve &amp; Push Downstream
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          <button
            onClick={() => onNavigate('network')}
            className="w-full py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 rounded-lg transition shadow-md"
          >
            Launch Link Graph Analysis →
          </button>
        </div>
      </div>

      {/* ── FIR / Zone Table — role-gated ───────────────────────────────── */}
      <div className="p-6 dashboard-card rounded-2xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="display-heading text-base md:text-lg font-extrabold text-slate-100">
              {isCommandView ? 'Zone-Level Incident Summary' : 'Active Station FIR Backlog'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCommandView
                ? 'Aggregate district view — drill into a zone for case-level detail'
                : 'Filterable cases requiring action &amp; evidence review'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg">
              {isCommandView ? 'COMMAND VIEW' : 'CASE VIEW'}
            </span>
            <button
              onClick={() => onNavigate('geospatial')}
              className="px-3.5 py-1.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 transition"
            >
              View Map Overlay
            </button>
          </div>
        </div>

        {/* Command/District SP — zone aggregate view */}
        {isCommandView ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-300 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Zone / Station</th>
                  <th className="p-3">Open Cases</th>
                  <th className="p-3">Critical</th>
                  <th className="p-3">Avg AI Risk</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {zoneAggregates.map((zone) => (
                  <tr key={zone.zone} className="hover:bg-slate-850 transition">
                    <td className="p-3 font-bold text-slate-100">{zone.zone}</td>
                    <td className="p-3 font-mono font-bold">{zone.open}</td>
                    <td className="p-3">
                      {zone.critical > 0 ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                          {zone.critical} Critical
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${zone.avgRisk}%`,
                              backgroundColor: zone.avgRisk >= 80 ? '#EF4444' : zone.avgRisk >= 60 ? '#F59E0B' : '#10B981',
                            }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-200">{zone.avgRisk}/100</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onNavigate('geospatial')}
                        className="text-xs font-bold text-cyan-400 hover:underline"
                      >
                        Drill in →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Operational roles — case-level table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-300 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">FIR Number</th>
                  <th className="p-3">Crime Type</th>
                  <th className="p-3">Station / Beat</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">AI Risk</th>
                  {canSeeOfficerName && <th className="p-3">Assigned Officer</th>}
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {MOCK_INCIDENTS.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-850 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{inc.firNumber}</td>
                    <td className="p-3 font-bold text-slate-100">{inc.crimeType}</td>
                    <td className="p-3 text-slate-300">{inc.station} • {inc.beat}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                          inc.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onNavigate('predictive-risk')}
                        className="flex items-center gap-1 font-mono font-bold text-red-400 hover:text-red-300 hover:underline"
                        title="Click to view SHAP explanation"
                      >
                        {inc.riskScore}/100 ↗
                      </button>
                    </td>
                    {canSeeOfficerName && (
                      <td className="p-3 text-slate-300 font-medium">{inc.assignedOfficer}</td>
                    )}
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

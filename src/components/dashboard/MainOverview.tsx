import React from 'react';
import { MOCK_INCIDENTS } from '../../data/mockData';
import { ShieldAlert, AlertTriangle, TrendingUp, Users, CheckCircle2, MapPin, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

export const MainOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Alert Bar */}
      <div className="p-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-500/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/40 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">NOCTURNAL ANOMALY ALERT</span>
              <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-300 rounded font-semibold">SECTOR 18</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              Overnight Spikes in Vehicle Theft & Armed Robbery (+38% vs 30-day baseline)
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('geospatial')}
          className="px-4 py-2 text-xs font-semibold bg-red-500 hover:bg-red-400 text-slate-950 rounded-lg transition shadow-lg shadow-red-500/20 shrink-0 flex items-center gap-1.5"
        >
          View Hotspot Heatmap
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>24h Total Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">42</span>
            <span className="text-xs font-medium text-red-400 flex items-center gap-0.5">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">18 in Sector 18 PS Jurisdiction</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Active High-Risk Hotspots</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">7 Zones</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              -2 <ArrowDownRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Highest density: Tech Park Parking</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Active Repeat Offenders Nearby</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">14 Flagged</span>
            <span className="text-xs font-medium text-amber-400 font-mono">Bail Monitored</span>
          </div>
          <p className="text-[11px] text-slate-500">2 Cell Tower pings matched to FIRs</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Case Closure Index</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">76.4%</span>
            <span className="text-xs font-medium text-emerald-400">+4.2%</span>
          </div>
          <p className="text-[11px] text-slate-500">Average resolution: 4.2 days</p>
        </div>
      </div>

      {/* Main Content Area: Chart + Recent Cases Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24-Hour Trend & Predictive Risk Chart */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                24-Hour Temporal Crime & AI Risk Forecast
              </h3>
              <p className="text-xs text-slate-400">Real-time crime events overlaid with XGBoost 3-hour risk probability</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-mono">
              Live Hourly Feed
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="predictedRisk" stroke="#06B6D4" fillOpacity={1} fill="url(#riskGrad)" name="AI Risk Score %" />
                <Area type="monotone" dataKey="incidents" stroke="#EF4444" fillOpacity={1} fill="url(#incidentGrad)" name="Actual Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Anomaly Alert Feed */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Pattern Anomaly Feed
            </h3>
            <p className="text-xs text-slate-400 mb-4">Transformer NLP & Clustering detections</p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-cyan-400 font-mono font-semibold">
                  <span>PATTERN MATCH #991</span>
                  <span>12m ago</span>
                </div>
                <p className="text-slate-200 font-medium">Modus Operandi Correlation</p>
                <p className="text-slate-400 text-[11px]">
                  FIR-2026-8819 and FIR-2026-8820 share identical RFID signal jamming techniques. High confidence gang link.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-amber-400 font-mono font-semibold">
                  <span>RECIDIVISM ALERT</span>
                  <span>45m ago</span>
                </div>
                <p className="text-slate-200 font-medium">Suspect Cell Triangulation</p>
                <p className="text-slate-400 text-[11px]">
                  Rashid Khan (Shadow) active near Sector 18 within 30 mins of robbery window.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('network')}
            className="w-full py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg transition"
          >
            Launch Link Graph Analysis →
          </button>
        </div>
      </div>

      {/* FIR Case Backlog Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Active Station FIR Backlog</h3>
            <p className="text-xs text-slate-400">Filterable cases requiring action & evidence review</p>
          </div>
          <button
            onClick={() => onNavigate('geospatial')}
            className="px-3 py-1.5 text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition"
          >
            View Map Overlay
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">FIR Number</th>
                <th className="p-3">Crime Type</th>
                <th className="p-3">Station / Beat</th>
                <th className="p-3">Severity</th>
                <th className="p-3">AI Risk</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {MOCK_INCIDENTS.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono font-bold text-cyan-400">{inc.firNumber}</td>
                  <td className="p-3 font-medium">{inc.crimeType}</td>
                  <td className="p-3 text-slate-400">{inc.station} • {inc.beat}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inc.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : inc.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-100">{inc.riskScore}/100</td>
                  <td className="p-3 text-slate-300">{inc.status}</td>
                  <td className="p-3 text-slate-400">{inc.assignedOfficer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

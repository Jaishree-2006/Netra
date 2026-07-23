import React from 'react';
import { UserCheck, MapPin } from 'lucide-react';
import { MOCK_OFFENDERS } from '../../data/mockData';

export const RepeatOffenders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Repeat Offender & Recidivism Monitoring Tracker</h2>
            <p className="text-xs text-slate-400">Automated Bail Compliance • Cell Tower Triangulation • Pattern History</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold">
          14 Active Targets Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_OFFENDERS.map((offender) => (
          <div key={offender.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <img src={offender.photoUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold text-slate-100">{offender.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase">
                    {offender.riskCategory}
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-mono">Alias: "{offender.alias}" • Age {offender.age}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Last ping: {offender.lastKnownLocation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Prior Cases</div>
                <div className="font-mono font-bold text-slate-100 text-sm">{offender.totalPriorCases}</div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Associated Gang</div>
                <div className="font-semibold text-slate-200 truncate">{offender.associatedGang}</div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500">Bail Status</div>
                <div className={`font-semibold ${offender.activeBailStatus ? 'text-amber-400' : 'text-slate-400'}`}>
                  {offender.activeBailStatus ? 'On Conditional Bail' : 'No Active Bail'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Recent Intelligence Activity Timeline
              </div>
              <div className="space-y-1.5">
                {offender.recentActivity.map((act, idx) => (
                  <div key={idx} className="p-2 bg-slate-950/70 border border-slate-800/80 rounded text-xs flex justify-between gap-3">
                    <span className="text-slate-300">{act.event}</span>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0">{act.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition">
              View Dossier & Criminal History
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

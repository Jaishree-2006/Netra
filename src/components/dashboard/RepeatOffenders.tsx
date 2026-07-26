import React, { useState } from 'react';
import { UserCheck, MapPin, ChevronDown, ShieldAlert, Lock, Info, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_OFFENDERS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

// Helper to provide realistic legal authorization tags per offender
const LEGAL_BASIS_MAP: Record<string, { basis: string; ref: string; condition: string }> = {
  'off-1': {
    basis: 'Bail Order Authorization',
    ref: 'Bail Order #BO-2026-992',
    condition: 'Condition #4: Geo-fenced perimeter monitoring during active bail',
  },
  'off-2': {
    basis: 'Court Surveillance Order',
    ref: 'Court Warrant #CW-2026-441',
    condition: 'Authorized under CrPC Sec. 93 for vehicle theft investigation',
  },
  'off-3': {
    basis: 'Bail Violation Warrant',
    ref: 'Warrant #BW-2026-118',
    condition: 'Missed mandatory weekly PS check-in — judicial notice issued',
  },
  'off-4': {
    basis: 'Post-Appeal Monitoring',
    ref: 'Order #SO-2026-088',
    condition: 'Cybercrime special registry condition',
  },
  'off-5': {
    basis: 'Interstate Warrant Order',
    ref: 'High Court Warrant #HC-2026-701',
    condition: 'Active multi-district surveillance order',
  },
  'off-6': {
    basis: 'Probation Compliance',
    ref: 'Probation Order #PO-2025-334',
    condition: 'Periodic compliance verification',
  },
};

export const RepeatOffenders: React.FC = () => {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeCaseContext, setActiveCaseContext] = useState<string>('ALL');
  const [unlockedDossiers, setUnlockedDossiers] = useState<Record<string, boolean>>({});
  const [unlockModalOffender, setUnlockModalOffender] = useState<(typeof MOCK_OFFENDERS)[0] | null>(null);
  const [caseJustification, setCaseJustification] = useState('');
  const [auditLogNotice, setAuditLogNotice] = useState<string | null>(null);

  const isHighLevelUser = ['command_level', 'district_head', 'super_admin'].includes(currentUser.role);

  const handleUnlockDossier = (offender: (typeof MOCK_OFFENDERS)[0]) => {
    setUnlockModalOffender(offender);
  };

  const confirmUnlock = () => {
    if (!unlockModalOffender) return;
    setUnlockedDossiers((prev) => ({ ...prev, [unlockModalOffender.id]: true }));
    setAuditLogNotice(`Unlocked dossier for ${unlockModalOffender.alias || unlockModalOffender.name} under case ${activeCaseContext}. Action logged.`);
    setUnlockModalOffender(null);
    setCaseJustification('');
    setTimeout(() => setAuditLogNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 dashboard-card rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="display-heading text-base text-slate-100 font-extrabold">Repeat Offender &amp; Recidivism Monitoring Tracker</h2>
            <p className="display-heading text-xs text-slate-400">Automated Bail Compliance • Authorized Triangulation • Case-Gated Dossiers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono display-heading font-bold">
            14 Active Targets Monitored
          </span>
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
          {/* Presumption of Innocence & Legal Safeguard Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-200">Presumption of Innocence &amp; Actuarial Risk Guidance</p>
              <p className="text-[11px] text-amber-300 leading-relaxed">
                Risk scores are statistical actuarial pattern metrics based on prior recorded cases and bail conditions. They do not constitute legal determinations of guilt, verdict, or future conduct. Location pings are strictly monitored under valid judicial bail orders or court search warrants.
              </p>
            </div>
          </div>

          {/* Active Case Context Bar */}
          <div className="p-4 dashboard-card rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Active Investigation Case Context:</span>
              <select
                id="case-context-select"
                value={activeCaseContext}
                onChange={(e) => setActiveCaseContext(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Cases (No Filter)</option>
                <option value="FIR-2026-8819">FIR-2026-8819 (Sector 18 Robbery)</option>
                <option value="FIR-2026-8820">FIR-2026-8820 (Vehicle Theft)</option>
                <option value="FIR-2026-8750">FIR-2026-8750 (Burglary)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {activeCaseContext !== 'ALL' && (
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold font-mono">
                  {MOCK_OFFENDERS.filter((o) => o.linkedFirs?.includes(activeCaseContext)).length} SUSPECTS LINKED TO {activeCaseContext}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-bold">
                {isHighLevelUser ? 'District Command Mode — Dossier access requires case justification log' : 'Operational Access Mode'}
              </span>
            </div>
          </div>

          {/* Audit Trail Notification Banner */}
          {auditLogNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{auditLogNotice}</span>
            </div>
          )}

          {/* Offender Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_OFFENDERS.filter((offender) =>
              activeCaseContext === 'ALL' ? true : offender.linkedFirs?.includes(activeCaseContext)
            ).map((offender) => {
              const legal = LEGAL_BASIS_MAP[offender.id] || {
                basis: 'Bail Monitoring',
                ref: 'Order #BO-2026-100',
                condition: 'Judicial bail conditions',
              };
              const isUnlocked = unlockedDossiers[offender.id];

              return (
                <div key={offender.id} className="dashboard-card rounded-xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top Row: Mugshot/Avatar + Non-prejudicial Badge + Basic Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={offender.photoUrl}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white/90" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="display-heading text-base font-extrabold text-slate-100">
                            {isUnlocked ? offender.name : `SUSPECT-REF-${offender.id.toUpperCase()}`}
                          </h3>
                          {/* Replaced 'HIGH RECIDIVISM' with objective, non-prejudicial badge */}
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md display-heading shrink-0">
                            Actuarial Risk Score: 92/100
                          </span>
                        </div>

                        <p className="display-heading text-xs text-slate-400 font-mono">
                          Alias: "{offender.alias}" • Age {offender.age}
                        </p>

                        {/* Location Ping with Front-and-Center Legal Authorization Reference */}
                        <div className="space-y-1 pt-1">
                          <p className="display-heading text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Last ping: {offender.lastKnownLocation}</span>
                          </p>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 font-mono">
                            <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>Monitoring Basis: <strong className="text-slate-200">{legal.ref}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-0.5">
                        <div className="display-heading text-[10px] font-bold text-slate-400">Prior Cases</div>
                        <div className="font-mono display-heading font-bold text-slate-100 text-sm">{offender.totalPriorCases}</div>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-0.5">
                        <div className="display-heading text-[10px] font-bold text-slate-400">Associated Gang</div>
                        <div className="display-heading font-bold text-slate-200 truncate text-xs">{offender.associatedGang}</div>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-0.5">
                        <div className="display-heading text-[10px] font-bold text-slate-400">Bail Status</div>
                        <div className={`display-heading font-bold text-xs ${offender.activeBailStatus ? 'text-amber-400' : 'text-slate-400'}`}>
                          {offender.activeBailStatus ? 'Conditional Bail' : 'No Bail'}
                        </div>
                      </div>
                    </div>

                    {/* Legal condition detail */}
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-slate-300 text-[10px] uppercase font-mono">
                        <Info className="w-3 h-3 text-cyan-400" />
                        Legal Authorization Detail
                      </div>
                      <p className="text-[11px] text-slate-400">{legal.condition}</p>
                    </div>

                    {/* Recent Activity Timeline (gated if locked) */}
                    {isUnlocked ? (
                      <div className="space-y-2">
                        <div className="display-heading text-xs font-bold text-slate-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Recent Case Timeline Activity
                        </div>
                        <div className="space-y-1.5">
                          {offender.recentActivity.map((act, idx) => (
                            <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded-lg display-heading text-xs flex justify-between gap-3">
                              <span className="text-slate-300 flex-1 text-[11px]">{act.event}</span>
                              <span className="text-[10px] font-mono text-cyan-400 shrink-0 font-bold">{act.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-center text-slate-400 space-y-1">
                        <Lock className="w-4 h-4 mx-auto text-slate-500" />
                        <p className="font-bold text-slate-300">Detailed Timeline Restricted</p>
                        <p className="text-[10px] text-slate-400">Accessing full activity history requires logging an active investigation case justification.</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Full Dossier Unlocked &amp; Logged
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400">Context: {activeCaseContext}</span>
                      </div>
                    ) : (
                      <button
                        id={`unlock-dossier-btn-${offender.id}`}
                        onClick={() => handleUnlockDossier(offender)}
                        className="w-full py-2.5 text-xs display-heading font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition shadow-md flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Unlock Dossier (Log Case Linkage Justification)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlock Modal */}
          {unlockModalOffender && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider font-bold">AUDIT LOG ACCESS CONTROL</span>
                    <h3 className="text-base font-extrabold text-slate-100">Unlock Dossier: {unlockModalOffender.name}</h3>
                  </div>
                  <button onClick={() => setUnlockModalOffender(null)} className="text-slate-400 hover:text-slate-200">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">
                    You are accessing full PII and historical dossier records for <strong className="text-slate-100">{unlockModalOffender.name}</strong>. State compliance rules require logging an active investigation reference.
                  </p>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="text-slate-400 text-[10px] font-bold">Target Case Context</div>
                    <div className="font-mono font-bold text-slate-100">{activeCaseContext}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Investigation Justification Note <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="unlock-justification-input"
                      rows={3}
                      placeholder="e.g. Suspect identified as potential accomplice in FIR-2026-8819 based on RFID signal jamming signature..."
                      value={caseJustification}
                      onChange={(e) => setCaseJustification(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
                    />
                  </div>

                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>Your badge ID ({currentUser.badgeId}) and justification will be recorded in the WORM Audit Trail.</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setUnlockModalOffender(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-unlock-dossier-btn"
                    disabled={!caseJustification.trim()}
                    onClick={confirmUnlock}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Log &amp; View Dossier
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

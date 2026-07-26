import React, { useState } from 'react';
import { BrainCircuit, Info, ShieldCheck, CheckCircle2, ChevronDown, Lock, FileText, X } from 'lucide-react';
import { MOCK_SHAP_FACTORS } from '../../data/mockData';

// Anonymized SHAP factors for location-level risk transparency
const ANONYMIZED_SHAP_FACTORS = MOCK_SHAP_FACTORS.map((factor) => {
  if (factor.factor.includes('Rashid Khan')) {
    return {
      ...factor,
      factor: 'Presence of Active Repeat Offender on Bail',
      description: 'Known offender signal vector detected within 500m radius of sector boundary',
    };
  }
  return factor;
});

export const PredictiveRisk: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [ethicsReviewModalOpen, setEthicsReviewModalOpen] = useState(false);
  const [ethicsLogged, setEthicsLogged] = useState(false);
  const [reviewerNote, setReviewerNote] = useState('');
  const selectedZone = 'Sector 18 Commercial Corridor';

  const handleEthicsSubmit = () => {
    setEthicsLogged(true);
    setEthicsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 dashboard-card rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="display-heading text-base text-slate-100 font-extrabold">Explainable Predictive Risk &amp; SHAP Feature Attribution</h2>
            <p className="display-heading text-xs text-slate-400">Auditable Machine Learning Models • Anti-Bias Compliance</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Clickable Ethics & Fairness Audit Link */}
          <button
            id="ethics-audit-link-btn"
            onClick={() => setAuditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold display-heading transition shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ethics Audit: <strong>Passed (DI 0.94)</strong></span>
            <span className="text-[10px] text-emerald-400 underline font-mono ml-1">View Details →</span>
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
          {/* CRITICAL HUMAN-IN-THE-LOOP SAFEGUARD HEADER BANNER (Front-and-Center) */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 ${ethicsLogged ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} rounded-lg border shrink-0`}>
                {ethicsLogged ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>MANDATORY SAFEGUARD: Human-in-the-Loop Review</span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono uppercase ${ethicsLogged ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'} border rounded font-semibold`}>
                    {ethicsLogged ? 'Ethics Review Logged & Verified' : 'Automated Dispatch Disabled'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {ethicsLogged ? 'Analyst ethics review logged to WORM Blockchain Audit Ledger (Block #48,193).' : 'Risk scores are decision-support estimates. Operational deployments require explicit authorization by a station commander.'}
                </p>
              </div>
            </div>
            <button
              id="log-ethics-review-top-btn"
              onClick={() => setEthicsReviewModalOpen(true)}
              className={`px-3.5 py-1.5 ${ethicsLogged ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white rounded-lg text-xs font-semibold display-heading transition shrink-0 shadow-sm flex items-center gap-1.5`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{ethicsLogged ? 'View Logged Review' : 'Log Ethics Review'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Score Summary Card */}
            <div className="dashboard-card rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="display-heading text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">PREDICTIVE LOCATION TARGET</span>
                  <h3 className="display-heading text-base font-extrabold text-slate-100">{selectedZone}</h3>
                  <p className="display-heading text-xs text-slate-400">Window: Next 6 Hours (01:00 - 07:00 HRS)</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
                  <div className="display-heading text-xs text-slate-400 font-bold">Calculated Incident Risk Probability</div>
                  <div className="display-heading text-4xl font-extrabold text-red-400 font-mono">88.4%</div>
                  <span className="inline-block px-2.5 py-0.5 text-xs font-bold display-heading bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
                    ELEVATED NOCTURNAL WINDOW
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg display-heading flex justify-between">
                    <span className="text-slate-400">Model Engine:</span>
                    <span className="font-mono text-slate-100 font-bold">XGBoost v2.4 + Spatio-Temporal LSTM</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg display-heading flex justify-between">
                    <span className="text-slate-400">Primary Predicted Offense:</span>
                    <span className="font-bold text-red-400">Commercial Burglary Pattern</span>
                  </div>
                </div>
              </div>

              {/* Safeguard summary footnote */}
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 text-center font-mono">
                Model Checksum: XGB-ST-2026.04 • Audited by Ethics Board
              </div>
            </div>

            {/* SHAP Factor Breakdown Panel */}
            <div className="lg:col-span-2 dashboard-card rounded-xl p-5 space-y-4">
              <div>
                <h3 className="display-heading text-sm font-extrabold text-slate-100 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  SHAP (Shapley Additive exPlanations) Factor Attribution
                </h3>
                <p className="display-heading text-xs text-slate-400 mt-0.5">
                  Transparent decomposition showing exactly why the AI model computed an 88.4% risk score.
                </p>
              </div>

              <div className="space-y-3">
                {ANONYMIZED_SHAP_FACTORS.map((factor, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <div className="display-heading flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-100">{factor.factor}</span>
                      <span
                        className={`font-mono font-bold ${
                          factor.impact > 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {factor.impact > 0 ? `+${factor.impact}% Risk` : `${factor.impact}% Mitigation`}
                      </span>
                    </div>
                    <p className="display-heading text-xs text-slate-400">{factor.description}</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${factor.impact > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.abs(factor.impact) * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Live Model Ethics & Fairness Audit Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Model Ethics &amp; Anti-Bias Audit Record</h3>
                  <p className="text-xs text-slate-400">Independent Board Verification &amp; Disparate Impact Metric</p>
                </div>
              </div>
              <button onClick={() => setAuditModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] font-bold">Model Version</div>
                  <div className="font-mono font-bold text-slate-100">XGBoost v2.4-ST</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] font-bold">Audit Date</div>
                  <div className="font-mono font-bold text-slate-100">2026-06-15</div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-emerald-300 font-bold">
                  <span>Disparate Impact (DI) Ratio</span>
                  <span className="font-mono text-sm text-emerald-300">0.94 (PASS)</span>
                </div>
                <p className="text-[11px] text-emerald-400 leading-relaxed">
                  DI ratio of 0.94 exceeds the legal 80% rule (0.80 minimum threshold) for demographic and spatial equity under State Police AI Guidelines.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-100">Audited Test Population</div>
                <p className="text-slate-400">142,000 historical statewide incident reports (2021–2026 across 12 districts).</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-100">Oversight Body</div>
                <p className="text-slate-400">State Ethics &amp; Algorithmic Transparency Oversight Board (Chair: Justice S. K. Verma Retd.).</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Log Ethics Review Modal */}
      {ethicsReviewModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Submit Independent Ethics &amp; Bias Audit Log</h3>
                  <p className="text-xs text-slate-400">Human-in-the-Loop Verification for Operational Risk Score</p>
                </div>
              </div>
              <button onClick={() => setEthicsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Target Zone</span>
                  <span className="font-bold text-slate-100">{selectedZone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Calculated Risk</span>
                  <span className="font-mono font-bold text-red-400">88.4% (Elevated Burglary Window)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ethics Metric (DI Ratio)</span>
                  <span className="font-mono font-bold text-emerald-400">0.94 (Compliant &gt; 0.80)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Analyst Review Rationale &amp; Operational Context
                </label>
                <textarea
                  rows={3}
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="e.g. Reviewed SHAP factor breakdown. Confirmed non-discriminatory spatial factors. Approved for tactical patrol recommendation..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 placeholder-slate-500 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-[11px] text-amber-300 space-y-1">
                <p className="font-bold">Immutable WORM Audit Commitment:</p>
                <p className="text-slate-400 leading-relaxed">
                  Submitting this review writes a cryptographically signed hash into the Consortium Blockchain Audit Ledger (Block #48,193). It cannot be altered or retroactively erased.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEthicsReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                id="submit-ethics-worm-btn"
                onClick={handleEthicsSubmit}
                className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sign &amp; Log to WORM Blockchain Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

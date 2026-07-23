import React from 'react';
import { BrainCircuit, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MOCK_SHAP_FACTORS } from '../../data/mockData';

export const PredictiveRisk: React.FC = () => {
  const selectedZone = 'Sector 18 Commercial Corridor';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Explainable Predictive Risk & SHAP Feature Attribution</h2>
            <p className="text-xs text-slate-400">Auditable Machine Learning Models • Anti-Bias Compliance Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Ethics & Fairness Audit: Passed (DI Metric 0.94)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase">PREDICTIVE LOCATION TARGET</span>
            <h3 className="text-lg font-bold text-slate-100">{selectedZone}</h3>
            <p className="text-xs text-slate-400">Window: Next 6 Hours (01:00 - 07:00 HRS)</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
            <div className="text-xs text-slate-400">Calculated Incident Risk Probability</div>
            <div className="text-4xl font-extrabold text-red-400 font-mono">88.4%</div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
              HIGH NOCTURNAL THREAT
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between">
              <span className="text-slate-400">Model Engine:</span>
              <span className="font-mono text-slate-200">XGBoost v2.4 + Spatio-Temporal LSTM</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between">
              <span className="text-slate-400">Primary Predicted Offense:</span>
              <span className="font-semibold text-red-400">Nocturnal Commercial Burglary</span>
            </div>
          </div>
        </div>

        {/* SHAP Factor Breakdown Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              SHAP (Shapley Additive exPlanations) Factor Attribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent decomposition showing exactly why the AI model computed an 88.4% risk score.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_SHAP_FACTORS.map((factor, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{factor.factor}</span>
                  <span
                    className={`font-mono font-bold ${
                      factor.impact > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {factor.impact > 0 ? `+${factor.impact}% Risk` : `${factor.impact}% Mitigation`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{factor.description}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${factor.impact > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.abs(factor.impact) * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Human-in-the-Loop Review: Required prior to patrol dispatch</span>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded font-semibold transition">
              Log Ethics Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

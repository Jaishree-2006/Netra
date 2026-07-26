import React, { useState } from 'react';
import { Sliders, TrendingDown, ArrowRight, RotateCcw, ChevronDown, Send, FileText, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WhatIfSimulator: React.FC = () => {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [patrolUnits, setPatrolUnits] = useState(4);
  const [cctvCoverage, setCctvCoverage] = useState(70);
  const [lightingIndex, setLightingIndex] = useState(60);

  // Proposal modal & confirmation banner states
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  // Dynamic simulation logic
  const baselineRisk = 88.4;
  const riskReduction = patrolUnits * 4.2 + (cctvCoverage - 50) * 0.3 + (lightingIndex - 50) * 0.2;
  const simulatedRisk = Math.max(12, Math.round((baselineRisk - riskReduction) * 10) / 10);

  const handleConfirmProposal = () => {
    setProposalModalOpen(false);
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 dashboard-card rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg border border-teal-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="display-heading text-base text-slate-100 font-extrabold">Patrol &amp; Resource Allocation "What-If" Simulator</h2>
            <p className="display-heading text-xs text-slate-400">Sandbox Scenario Planning • Decision Support Recommendation Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPatrolUnits(4);
              setCctvCoverage(70);
              setLightingIndex(60);
            }}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg text-xs display-heading font-bold flex items-center gap-1.5 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
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
          {/* Sandbox Disclaimer Banner */}
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs text-teal-200 flex items-start gap-2.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-teal-200">Simulation Sandbox Mode — Non-Operational</p>
              <p className="text-[11px] text-teal-300 leading-relaxed">
                Adjusting sliders updates speculative risk reduction forecasts in real time. Submitting a proposal sends a recommendation to the Station Duty Officer for human operational review. No live units will be dispatched directly from this sandbox.
              </p>
            </div>
          </div>

          {/* Submission Success Banner */}
          {submittedBanner && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deployment Proposal successfully submitted to Station Duty Officer for Sector 18. Logged in Audit Trail.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Sliders Sandbox */}
            <div className="lg:col-span-2 dashboard-card rounded-xl p-5 space-y-6">
              <h3 className="display-heading text-sm font-extrabold text-slate-100">Resource &amp; Environmental Controls</h3>

              <div className="space-y-5">
                {/* Slider 1: Patrol Units */}
                <div className="space-y-2">
                  <div className="display-heading flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Nocturnal Beat Patrol Vans Dispatched</span>
                    <span className="font-mono font-bold text-teal-400">{patrolUnits} Mobile Units</span>
                  </div>
                  <input
                    id="patrol-units-slider"
                    type="range"
                    min={1}
                    max={12}
                    value={patrolUnits}
                    onChange={(e) => setPatrolUnits(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <p className="display-heading text-[11px] text-slate-400">Reallocating units from Sector 12 to Sector 18</p>
                </div>

                {/* Slider 2: CCTV Density */}
                <div className="space-y-2">
                  <div className="display-heading flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">ANPR / FLOCK Camera Density Coverage</span>
                    <span className="font-mono font-bold text-teal-400">{cctvCoverage}% Active</span>
                  </div>
                  <input
                    id="cctv-density-slider"
                    type="range"
                    min={30}
                    max={100}
                    value={cctvCoverage}
                    onChange={(e) => setCctvCoverage(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <p className="display-heading text-[11px] text-slate-400">Simulating deployment of mobile surveillance towers</p>
                </div>

                {/* Slider 3: Smart Street Lighting */}
                <div className="space-y-2">
                  <div className="display-heading flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Smart Street Lighting Illumination Level</span>
                    <span className="font-mono font-bold text-teal-400">{lightingIndex}% Brightness</span>
                  </div>
                  <input
                    id="lighting-slider"
                    type="range"
                    min={20}
                    max={100}
                    value={lightingIndex}
                    onChange={(e) => setLightingIndex(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <p className="display-heading text-[11px] text-slate-400">Civic municipal coordination grid override</p>
                </div>
              </div>
            </div>

            {/* Forecast Result Card */}
            <div className="dashboard-card rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <span className="display-heading text-[10px] font-mono text-teal-400 uppercase tracking-wider font-bold">SIMULATION OUTCOME</span>
                <h3 className="display-heading text-base font-extrabold text-slate-100 mb-4">Predicted Risk Impact</h3>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="display-heading flex justify-between text-xs text-slate-300">
                    <span>Baseline Hotspot Risk:</span>
                    <span className="font-mono text-red-400 font-bold">{baselineRisk}%</span>
                  </div>
                  <div className="display-heading flex justify-between text-xs text-slate-300">
                    <span>Simulated Forecast:</span>
                    <span className="font-mono text-emerald-400 font-bold">{simulatedRisk}%</span>
                  </div>
                  <div className="display-heading pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-extrabold text-slate-100">
                    <span>Risk Reduction:</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <TrendingDown className="w-4 h-4" />
                      -{(baselineRisk - simulatedRisk).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Demoted Button: Submit Deployment Recommendation */}
              <div className="pt-2 space-y-2">
                <button
                  id="submit-recommendation-btn"
                  onClick={() => setProposalModalOpen(true)}
                  className="w-full py-2.5 display-heading text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Deployment Recommendation to Duty Officer
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Exports scenario proposal to Duty Officer desk — retains human dispatch authority
                </p>
              </div>
            </div>
          </div>

          {/* Proposal Confirmation Modal */}
          {proposalModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">DECISION SUPPORT PROPOSAL</span>
                    <h3 className="text-base font-extrabold text-slate-100">Submit Patrol Recommendation</h3>
                  </div>
                  <button onClick={() => setProposalModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">
                    This scenario proposal will be sent to the Duty Officer at Sector 18 PS. It serves as a recommendation based on your simulation settings.
                  </p>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Proposed Patrol Vans:</span>
                      <span className="font-bold text-teal-400">{patrolUnits} Units (from Sector 12)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Proposed Camera Coverage:</span>
                      <span className="font-bold text-teal-400">{cctvCoverage}% Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Proposed Lighting Brightness:</span>
                      <span className="font-bold text-teal-400">{lightingIndex}% Brightness</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-100 font-bold">
                      <span>Projected Risk Delta:</span>
                      <span className="text-emerald-400">-{(baselineRisk - simulatedRisk).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-300 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>Submission will be logged under Badge ID {currentUser.badgeId} in the WORM Audit Trail.</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setProposalModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-proposal-btn"
                    onClick={handleConfirmProposal}
                    className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Proposal to Duty Officer
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

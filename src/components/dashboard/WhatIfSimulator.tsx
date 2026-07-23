import React, { useState } from 'react';
import { Sliders, TrendingDown, ArrowRight, RotateCcw } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const [patrolUnits, setPatrolUnits] = useState(4);
  const [cctvCoverage, setCctvCoverage] = useState(70);
  const [lightingIndex, setLightingIndex] = useState(60);

  // Dynamic simulation logic
  const baselineRisk = 88.4;
  const riskReduction = patrolUnits * 4.2 + (cctvCoverage - 50) * 0.3 + (lightingIndex - 50) * 0.2;
  const simulatedRisk = Math.max(12, Math.round((baselineRisk - riskReduction) * 10) / 10);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Patrol & Resource Allocation "What-If" Simulator</h2>
            <p className="text-xs text-slate-400">Sandbox Scenario Planning • Dynamic Risk Forecast Engine</p>
          </div>
        </div>

        <button
          onClick={() => {
            setPatrolUnits(4);
            setCctvCoverage(70);
            setLightingIndex(60);
          }}
          className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Sliders Sandbox */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <h3 className="text-sm font-bold text-slate-100">Resource & Environmental Controls</h3>

          <div className="space-y-5">
            {/* Slider 1: Patrol Units */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Nocturnal Beat Patrol Vans Dispatched</span>
                <span className="font-mono font-bold text-teal-400">{patrolUnits} Mobile Units</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={patrolUnits}
                onChange={(e) => setPatrolUnits(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <p className="text-[11px] text-slate-400">Reallocating units from Sector 12 to Sector 18</p>
            </div>

            {/* Slider 2: CCTV Density */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">ANPR / FLOCK Camera Density Coverage</span>
                <span className="font-mono font-bold text-teal-400">{cctvCoverage}% Active</span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={cctvCoverage}
                onChange={(e) => setCctvCoverage(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <p className="text-[11px] text-slate-400">Simulating deployment of mobile surveillance towers</p>
            </div>

            {/* Slider 3: Smart Street Lighting */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Smart Street Lighting Illumination Level</span>
                <span className="font-mono font-bold text-teal-400">{lightingIndex}% Brightness</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={lightingIndex}
                onChange={(e) => setLightingIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <p className="text-[11px] text-slate-400">Civic municipal coordination grid override</p>
            </div>
          </div>
        </div>

        {/* Forecast Result Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-teal-400 uppercase">SIMULATION OUTCOME</span>
            <h3 className="text-base font-bold text-slate-100 mb-4">Predicted Risk Impact</h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Baseline Hotspot Risk:</span>
                <span className="font-mono text-red-400 font-bold">{baselineRisk}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Simulated Forecast:</span>
                <span className="font-mono text-emerald-400 font-bold">{simulatedRisk}%</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-slate-100">
                <span>Risk Reduction:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingDown className="w-4 h-4" />
                  -{(baselineRisk - simulatedRisk).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
            Commit Dispatch Deployment Order
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

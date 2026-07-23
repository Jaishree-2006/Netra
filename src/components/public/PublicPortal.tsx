import React from 'react';
import { Eye, MapPin, Info } from 'lucide-react';

export const PublicPortal: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Public Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <Eye className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-['Space_Grotesk']">
              Public Safety & Transparency Portal
            </h1>
            <p className="text-xs text-slate-400">
              State Police Aggregated & Anonymized Neighborhood Safety Statistics (No Login Required)
            </p>
          </div>
        </div>

        <button
          onClick={onBackToLanding}
          className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
        >
          ← Return to Main Portal
        </button>
      </header>

      {/* Privacy Notice Alert */}
      <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-100">Privacy Notice:</strong> All data displayed on this public portal is aggregated by 1km x 1km grid squares and stripped of personally identifiable information (PII), victim details, exact coordinates, and pending active investigation notes in compliance with State Data Protection Regulations.
        </p>
      </div>

      {/* Public Safety Heatmap & Neighborhood Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Aggregated Neighborhood Safety Heatmap (Metro Central District)
            </h3>
            <span className="px-2 py-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-mono rounded">
              Updated 1h ago
            </span>
          </div>

          <div className="h-80 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Simulated Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(#10B981 1px, transparent 1px)`,
                backgroundSize: '28px 28px'
              }}
            />
            {/* Simulated Safety Heat Clusters */}
            <div className="absolute top-[30%] left-[40%] w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-[60%] left-[70%] w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-2">
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono">
                Grid Cell 4B: Low Crime Index (Safety Score 8.4/10)
              </span>
              <p className="text-xs text-slate-400">Neighborhood: Cyber City Sector 18 Residential Zone</p>
            </div>
          </div>
        </div>

        {/* Anonymized Stats Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Monthly Safety Indices</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Property Crime Index</span>
                <span className="font-mono text-emerald-400 font-bold">Low (12.4 per 10k)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25%]" />
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Patrol Coverage Density</span>
                <span className="font-mono text-cyan-400 font-bold">High (94% Grid Coverage)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[94%]" />
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Average Emergency Response Time</span>
                <span className="font-mono text-slate-100 font-bold">4.8 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Eye, MapPin, Info, ShieldCheck, Sun } from 'lucide-react';

export const PublicPortal: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-[#060913] p-6 space-y-6 font-sans text-slate-100" style={{
      background: `
        radial-gradient(circle at top left, rgba(14, 165, 233, 0.14), transparent 30%),
        radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.12), transparent 35%),
        linear-gradient(135deg, #060913 0%, #0b0f19 50%, #080c16 100%)
      `
    }}>
      {/* Public Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 dashboard-card rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl">
            <Eye className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="display-heading text-lg text-slate-100 font-extrabold">
              Public Safety &amp; Transparency Portal
            </h1>
            <p className="display-heading text-xs text-slate-300">
              State Police Aggregated &amp; Anonymized District Safety Statistics (No Account Required)
            </p>
          </div>
        </div>
      </header>

      {/* Privacy Notice Alert */}
      <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-xl display-heading flex items-start gap-3 text-xs text-slate-200 shadow-md">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-cyan-300">Privacy &amp; Data Protection Compliance Notice:</strong> All data displayed on this public portal is strictly aggregated by 1km x 1km anonymized grid cells. Personal identifiable information (PII), suspect/victim details, specific street-level residential names, internal patrol density schedules, and active investigation notes are completely excluded in accordance with State Data Protection &amp; Public Transparency Guidelines.
        </p>
      </div>

      {/* Public Safety Heatmap & District Grid Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dashboard-card rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="display-heading text-sm font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Aggregated District Grid Safety Map (Metro Central District)
            </h3>
            <span className="px-2 py-1 display-heading text-[10px] bg-emerald-500/20 text-emerald-300 font-mono rounded border border-emerald-500/30 font-bold">
              Updated 1h ago
            </span>
          </div>

          <div className="h-80 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
                backgroundSize: '28px 28px'
              }}
            />
            {/* Safety Heat Clusters */}
            <div className="absolute top-[30%] left-[40%] w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-[60%] left-[70%] w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Anonymized Label without specific residential street names */}
            <div className="relative z-10 text-center space-y-2">
              <span className="px-3.5 py-1.5 display-heading bg-slate-900/90 border border-slate-700 text-slate-100 rounded-lg text-xs font-mono font-bold shadow-xl">
                District Grid Cell METRO-CENTRAL-4B (Safety Score 8.4/10)
              </span>
              <p className="display-heading text-xs text-slate-400 font-mono">1km x 1km Spatial Aggregation Zone • Low Incident Index</p>
            </div>
          </div>
        </div>

        {/* Anonymized Stats Summary Card */}
        <div className="dashboard-card rounded-xl p-5 space-y-4">
          <h3 className="display-heading text-sm font-bold text-slate-100">District Safety Indices</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="display-heading flex justify-between text-slate-300">
                <span>Property Crime Index</span>
                <span className="font-mono text-emerald-400 font-bold">Low (12.4 per 10k)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25%]" />
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="display-heading flex justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Public Street Illumination Index
                </span>
                <span className="font-mono text-amber-400 font-bold">82% Illumination</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[82%]" />
              </div>
              <p className="text-[10px] text-slate-400">Municipal civic infrastructure indicator</p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="display-heading flex justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Community Advisory Level
                </span>
                <span className="font-mono text-emerald-400 font-bold">Normal / Low Advisory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

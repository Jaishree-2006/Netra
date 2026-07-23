import React, { useState } from 'react';
import { MapPin, Filter, Clock, AlertTriangle } from 'lucide-react';
import { MOCK_INCIDENTS } from '../../data/mockData';

export const GeospatialMap: React.FC = () => {
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [timeHour, setTimeHour] = useState<number>(2);
  const [activePin, setActivePin] = useState<string | null>('inc-101');

  const filteredIncidents = MOCK_INCIDENTS.filter((inc) => {
    if (selectedCrimeType !== 'All' && inc.crimeType !== selectedCrimeType) return false;
    if (selectedSeverity !== 'All' && inc.severity !== selectedSeverity) return false;
    return true;
  });

  const activeIncident = MOCK_INCIDENTS.find((inc) => inc.id === activePin) || MOCK_INCIDENTS[0];

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Geospatial Crime Hotspot & Vector Layer</h2>
            <p className="text-xs text-slate-400">PostGIS Spatial Indexing • Mapbox Vector Tile Engine</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Crime Type:</span>
            <select
              value={selectedCrimeType}
              onChange={(e) => setSelectedCrimeType(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Armed Robbery">Armed Robbery</option>
              <option value="Vehicle Theft">Vehicle Theft</option>
              <option value="Commercial Burglary">Commercial Burglary</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
            <span className="text-slate-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map View & Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulated Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl h-[520px] relative overflow-hidden flex flex-col justify-between p-4">
          {/* Simulated Dark Mode Tactical Vector Map BG */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Grid lines representing street grid */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 stroke-[1.5]" pointerEvents="none">
            <line x1="10%" y1="20%" x2="90%" y2="20%" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" />
            <line x1="10%" y1="80%" x2="90%" y2="80%" />
            <line x1="30%" y1="10%" x2="30%" y2="90%" />
            <line x1="70%" y1="10%" x2="70%" y2="90%" />
          </svg>

          {/* Simulated Heatmap Glowing Zones */}
          <div className="absolute top-[25%] left-[32%] w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-[55%] left-[65%] w-40 h-40 bg-amber-500/25 rounded-full blur-2xl pointer-events-none" />

          {/* Map Header Overlay */}
          <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              METRO CENTRAL COMMAND • LAT: 28.4595° N, LNG: 77.0266° E
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold">
                HOTSPOT DENSITY: HIGH
              </span>
            </div>
          </div>

          {/* Map Interactive Incident Markers */}
          <div className="relative z-10 flex-1">
            {filteredIncidents.map((inc, idx) => {
              const positions = [
                { top: '30%', left: '35%' },
                { top: '55%', left: '68%' },
                { top: '22%', left: '20%' },
                { top: '75%', left: '42%' },
                { top: '40%', left: '80%' },
              ];
              const pos = positions[idx % positions.length];
              const isSelected = activePin === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setActivePin(inc.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        inc.severity === 'Critical'
                          ? 'bg-red-500/30 text-red-400 border-2 border-red-500'
                          : 'bg-amber-500/30 text-amber-400 border-2 border-amber-500'
                      } ${isSelected ? 'scale-125 shadow-lg shadow-red-500/50' : 'hover:scale-110'}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <div className="absolute top-10 whitespace-nowrap bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-xl text-xs z-30">
                        <p className="font-bold text-slate-100">{inc.firNumber}</p>
                        <p className="text-[10px] text-cyan-400">{inc.crimeType}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slider Bottom Overlay */}
          <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-lg backdrop-blur-md space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Time Slider Filter (24-Hour Loop)
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {timeHour.toString().padStart(2, '0')}:00 HRS (NOCTURNAL PATROL WINDOW)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              value={timeHour}
              onChange={(e) => setTimeHour(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Selected Incident Details Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">SELECTED INCIDENT INSPECTOR</span>
                <h3 className="text-base font-extrabold text-slate-100 font-mono">{activeIncident.firNumber}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  activeIncident.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {activeIncident.severity}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Crime Type</div>
                <div className="font-bold text-slate-100">{activeIncident.crimeType}</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Location & Beat</div>
                <div className="font-medium text-slate-200">{activeIncident.locationName}</div>
                <div className="text-[11px] text-slate-500">{activeIncident.station} • {activeIncident.beat}</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Investigation Narrative Summary</div>
                <p className="text-slate-300 leading-relaxed">{activeIncident.summary}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Calculated AI Risk Score</span>
                  <span className="font-mono font-bold text-red-400">{activeIncident.riskScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${activeIncident.riskScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-lg shadow-cyan-600/20">
              Dispatch Nearest Beat Patrol Unit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

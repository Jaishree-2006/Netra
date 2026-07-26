import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Filter, Clock, ChevronDown,
  Layers, Info, Lock, CheckCircle2, X, Send, FileText
} from 'lucide-react';
import { MOCK_INCIDENTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

// ── Roles allowed to send duty-officer notifications ──────────────────────────
const NOTIFY_ALLOWED_ROLES = ['super_admin', 'command_level', 'district_head', 'sho'];

// ── Heatmap density blobs — placed at real approximate coords ─────────────────
// These represent KDE-derived hotspot centroids shown as CSS radial-gradient overlays
// We use a Leaflet custom overlay via a DivOverlay alternative: position as CSS absolute
// over the map via a fixed coordinate-to-pixel mapping for the demo viewport.
export const HEATMAP_BLOBS = [
  { id: 'h1', label: 'MG Road / Sector 18', intensity: 'critical', opacity: 0.55, size: 160 },
  { id: 'h2', label: 'Tech Park Parking', intensity: 'high', opacity: 0.42, size: 120 },
  { id: 'h3', label: 'Commercial Hub 9', intensity: 'medium', opacity: 0.30, size: 90 },
];

// ── Leaflet marker colours by severity ───────────────────────────────────────
function severityColor(severity: string) {
  if (severity === 'Critical') return { color: '#EF4444', fillColor: '#FCA5A5' };
  if (severity === 'High') return { color: '#F59E0B', fillColor: '#FCD34D' };
  return { color: '#6366F1', fillColor: '#A5B4FC' };
}

// ── Notify Duty Officer Modal ─────────────────────────────────────────────────
interface NotifyModalProps {
  incident: (typeof MOCK_INCIDENTS)[0];
  onClose: () => void;
  onConfirm: (note: string) => void;
}
const NotifyModal: React.FC<NotifyModalProps> = ({ incident, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-0.5 font-bold">
              Recommendation — Not an automated dispatch
            </p>
            <h3 className="text-base font-bold text-slate-100">Notify Station Duty Officer</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This sends a priority alert to the Duty Officer at <strong className="text-slate-200">{incident.station}</strong>. The Duty Officer retains full authority over any operational response.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 transition shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>FIR Reference</span>
              <span className="font-mono font-bold text-cyan-400">{incident.firNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Crime Type</span>
              <span className="font-medium text-slate-200">{incident.crimeType}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Location</span>
              <span className="font-medium text-slate-200">{incident.locationName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Severity</span>
              <span className={`font-semibold ${incident.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}`}>
                {incident.severity}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">
              Analyst Note <span className="text-slate-400">(optional — included in notification)</span>
            </label>
            <textarea
              id="notify-note-input"
              rows={3}
              placeholder="e.g. Recommend checking ANPR camera 4B footage, possible repeat-offender proximity..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 resize-none text-slate-100 placeholder-slate-500"
            />
          </div>

          {/* Audit trail notice */}
          <div className="flex items-start gap-2 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-[10px] text-amber-300">
            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <p>This notification will be logged in the WORM Audit Trail with your user ID, timestamp, and FIR reference. It cannot be deleted.</p>
          </div>
        </div>

        <div className="p-5 pt-0 flex gap-2 justify-end">
          <button
            id="notify-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            id="notify-confirm-btn"
            onClick={() => onConfirm(note)}
            className="px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            Send to Duty Officer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Sent confirmation banner ───────────────────────────────────────────────────
const SentBanner: React.FC<{ firNumber: string; onClose: () => void }> = ({ firNumber, onClose }) => (
  <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-medium animate-in slide-in-from-bottom">
    <CheckCircle2 className="w-4 h-4 shrink-0" />
    <span>Duty Officer at station notified re: <strong>{firNumber}</strong>. Logged in Audit Trail.</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
export const GeospatialMap: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCrimeType, setSelectedCrimeType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [timeHour, setTimeHour] = useState(2);
  const [activePin, setActivePin] = useState<string | null>('inc-101');
  const [isExpanded, setIsExpanded] = useState(true);

  // Layer toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPins, setShowPins] = useState(true);
  const [showSocioEcon, setShowSocioEcon] = useState(false);

  // Notify modal
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [sentBanner, setSentBanner] = useState(false);

  const canNotify = NOTIFY_ALLOWED_ROLES.includes(currentUser.role);

  const filteredIncidents = MOCK_INCIDENTS.filter((inc) => {
    if (selectedCrimeType !== 'All' && inc.crimeType !== selectedCrimeType) return false;
    if (selectedSeverity !== 'All' && inc.severity !== selectedSeverity) return false;
    return true;
  });

  const activeIncident = MOCK_INCIDENTS.find((inc) => inc.id === activePin) || MOCK_INCIDENTS[0];

  const handleNotifyConfirm = (_note: string) => {
    setNotifyOpen(false);
    setSentBanner(true);
    setTimeout(() => setSentBanner(false), 6000);
  };

  // Map center — Metro Central District, Gurugram-adjacent coords
  const mapCenter: [number, number] = [28.4595, 77.0266];

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="dashboard-card p-4 border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition"
        >
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <h2 className="display-heading text-base font-extrabold text-slate-100">Geospatial Crime Hotspot &amp; Vector Layer</h2>
            <p className="text-xs text-slate-400">OpenStreetMap • KDE Heatmap Overlay • Layer Controls</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* ── Filter + Layer Control Bar ───────────────────────────────── */}
          <div className="p-4 dashboard-card rounded-2xl flex flex-wrap items-center gap-3">
            {/* Crime type filter */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Crime Type:</span>
              <select
                id="crime-type-filter"
                value={selectedCrimeType}
                onChange={(e) => setSelectedCrimeType(e.target.value)}
                className="bg-slate-950 text-slate-100 font-bold focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="Armed Robbery">Armed Robbery</option>
                <option value="Vehicle Theft">Vehicle Theft</option>
                <option value="Commercial Burglary">Commercial Burglary</option>
                <option value="Cyber Extortion">Cyber Extortion</option>
                <option value="Chain Snatching">Chain Snatching</option>
              </select>
            </div>

            {/* Severity filter */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
              <span className="text-slate-400">Severity:</span>
              <select
                id="severity-filter"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-950 text-slate-100 font-bold focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-800 hidden sm:block" />

            {/* Layer toggles */}
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 mr-1 font-bold">Layers:</span>

              <button
                id="layer-heatmap-btn"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                  showHeatmap
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                🌡 KDE Heatmap
              </button>

              <button
                id="layer-pins-btn"
                onClick={() => setShowPins(!showPins)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                  showPins
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                📍 Incident Pins
              </button>

              <button
                id="layer-socio-btn"
                onClick={() => setShowSocioEcon(!showSocioEcon)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                  showSocioEcon
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                📊 Socio-Economic
              </button>
            </div>
          </div>

          {/* ── Map + Inspector ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Real Leaflet Map */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative" style={{ height: '520px' }}>

              <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                {/* Dark OSM tile layer — CartoDB Dark Matter, no API key needed */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={20}
                />

                {/* KDE Heatmap blobs as large, blurred CircleMarkers */}
                {showHeatmap && (
                  <>
                    {/* Primary hotspot — Sector 18 / MG Road area */}
                    <CircleMarker
                      center={[28.4595, 77.0266]}
                      radius={80}
                      pathOptions={{
                        fillColor: '#EF4444',
                        fillOpacity: 0.22,
                        color: '#EF4444',
                        opacity: 0.08,
                        weight: 1,
                      }}
                    />
                    <CircleMarker
                      center={[28.4595, 77.0266]}
                      radius={45}
                      pathOptions={{
                        fillColor: '#EF4444',
                        fillOpacity: 0.38,
                        color: 'transparent',
                        weight: 0,
                      }}
                    />
                    <CircleMarker
                      center={[28.4595, 77.0266]}
                      radius={18}
                      pathOptions={{
                        fillColor: '#EF4444',
                        fillOpacity: 0.65,
                        color: '#EF4444',
                        opacity: 0.5,
                        weight: 1,
                      }}
                    />

                    {/* Secondary hotspot — Tech Park Parking */}
                    <CircleMarker
                      center={[28.4520, 77.0310]}
                      radius={60}
                      pathOptions={{
                        fillColor: '#F59E0B',
                        fillOpacity: 0.18,
                        color: 'transparent',
                        weight: 0,
                      }}
                    />
                    <CircleMarker
                      center={[28.4520, 77.0310]}
                      radius={30}
                      pathOptions={{
                        fillColor: '#F59E0B',
                        fillOpacity: 0.40,
                        color: '#F59E0B',
                        opacity: 0.3,
                        weight: 1,
                      }}
                    />

                    {/* Tertiary — Commercial Hub */}
                    <CircleMarker
                      center={[28.4710, 77.0150]}
                      radius={50}
                      pathOptions={{
                        fillColor: '#8B5CF6',
                        fillOpacity: 0.15,
                        color: 'transparent',
                        weight: 0,
                      }}
                    />
                    <CircleMarker
                      center={[28.4710, 77.0150]}
                      radius={22}
                      pathOptions={{
                        fillColor: '#8B5CF6',
                        fillOpacity: 0.35,
                        color: '#8B5CF6',
                        opacity: 0.3,
                        weight: 1,
                      }}
                    />
                  </>
                )}

                {/* Socio-Economic overlay — CCTV coverage zones */}
                {showSocioEcon && (
                  <>
                    <CircleMarker
                      center={[28.458, 77.028]}
                      radius={55}
                      pathOptions={{
                        fillColor: '#10B981',
                        fillOpacity: 0.12,
                        color: '#10B981',
                        opacity: 0.25,
                        weight: 1.5,
                        dashArray: '4 4',
                      }}
                    >
                      <Popup>
                        <div className="text-xs p-1">
                          <p className="font-bold text-slate-800">High CCTV Coverage Zone</p>
                          <p className="text-slate-600">Socio-econ index: 7.4/10</p>
                          <p className="text-slate-600">Risk mitigation: -12pts</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                    <CircleMarker
                      center={[28.464, 77.022]}
                      radius={40}
                      pathOptions={{
                        fillColor: '#F59E0B',
                        fillOpacity: 0.10,
                        color: '#F59E0B',
                        opacity: 0.20,
                        weight: 1.5,
                        dashArray: '4 4',
                      }}
                    >
                      <Popup>
                        <div className="text-xs p-1">
                          <p className="font-bold text-slate-100">Low Street-Lighting Zone</p>
                          <p className="text-slate-300">Socio-econ index: 4.1/10</p>
                          <p className="text-slate-300">Risk amplifier: +8pts</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </>
                )}

                {/* Incident pins */}
                {showPins && filteredIncidents.map((inc) => {
                  const col = severityColor(inc.severity);
                  return (
                    <CircleMarker
                      key={inc.id}
                      center={inc.coordinates}
                      radius={activePin === inc.id ? 11 : 8}
                      pathOptions={{
                        color: col.color,
                        fillColor: col.fillColor,
                        fillOpacity: 0.9,
                        weight: activePin === inc.id ? 2.5 : 1.5,
                      }}
                      eventHandlers={{ click: () => setActivePin(inc.id) }}
                    >
                      <Popup>
                        <div className="text-xs p-1 min-w-[140px]">
                          <p className="font-bold text-slate-100">{inc.firNumber}</p>
                          <p className="text-slate-300">{inc.crimeType}</p>
                          <p className="text-slate-400 text-[10px]">{inc.locationName}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* Time slider overlay on top of the map */}
              <div className="absolute bottom-4 left-4 right-4 z-[500] bg-slate-900/90 border border-slate-700 p-3 rounded-xl backdrop-blur-md shadow-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Time Slider — 24-Hour Nocturnal Loop
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {timeHour.toString().padStart(2, '0')}:00 HRS
                  </span>
                </div>
                <input
                  id="time-slider"
                  type="range"
                  min={0}
                  max={23}
                  value={timeHour}
                  onChange={(e) => setTimeHour(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                </div>
              </div>

              {/* Map legend */}
              <div className="absolute top-4 right-4 z-[500] bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl backdrop-blur-md text-[10px] text-slate-400 space-y-1.5 shadow-xl">
                <p className="font-mono font-bold text-slate-300 mb-1">LEGEND</p>
                {showHeatmap && (
                  <>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" /> KDE High Density</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block" /> KDE Medium</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-500/70 inline-block" /> KDE Low</div>
                  </>
                )}
                {showPins && (
                  <>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 border-2 border-red-500 inline-block" /> Critical FIR</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-300 border-2 border-amber-500 inline-block" /> High / Medium</div>
                  </>
                )}
                {showSocioEcon && (
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500 inline-block" /> Socio-Econ Zone</div>
                )}
              </div>
            </div>

            {/* ── Incident Inspector Panel ─────────────────────────────── */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">SELECTED INCIDENT INSPECTOR</span>
                    <h3 className="text-base font-extrabold text-slate-100 font-mono">{activeIncident.firNumber}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      activeIncident.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                    <div className="text-slate-400">Location &amp; Beat</div>
                    <div className="font-medium text-slate-200">{activeIncident.locationName}</div>
                    <div className="text-[11px] text-slate-500">{activeIncident.station} • {activeIncident.beat}</div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="text-slate-400">Investigation Narrative</div>
                    <p className="text-slate-300 leading-relaxed">{activeIncident.summary}</p>
                  </div>

                  {/* AI Risk — now has explanation link */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>AI Risk Score</span>
                        <div className="relative group/tooltip">
                          <Info className="w-3 h-3 text-slate-600 cursor-pointer" />
                          <div className="absolute z-10 right-0 top-5 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-300 hidden group-hover/tooltip:block shadow-xl">
                            Score generated by XGBoost model. Click "View SHAP" for factor breakdown.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-400">{activeIncident.riskScore}/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${activeIncident.riskScore}%`,
                          backgroundColor: activeIncident.riskScore >= 80 ? '#EF4444' : activeIncident.riskScore >= 60 ? '#F59E0B' : '#10B981',
                        }}
                      />
                    </div>
                    <a
                      href="#predictive-risk"
                      id={`geo-risk-explain-${activeIncident.id}`}
                      onClick={(e) => { e.preventDefault(); }}
                      className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition font-semibold"
                    >
                      <Info className="w-2.5 h-2.5" /> View SHAP explanation →
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Action: Notify Duty Officer (replaces Dispatch button) ── */}
              <div className="pt-2 space-y-2">
                {canNotify ? (
                  <button
                    id="notify-duty-officer-btn"
                    onClick={() => setNotifyOpen(true)}
                    className="w-full py-2.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition border border-slate-600 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    Notify Station Duty Officer
                  </button>
                ) : (
                  <div className="w-full py-2.5 text-xs text-slate-500 rounded-lg border border-slate-700 flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Notification requires SHO-level access
                  </div>
                )}
                <p className="text-[10px] text-slate-600 text-center">
                  Recommends action — Duty Officer retains dispatch authority
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Modals & Banners ────────────────────────────────────────────── */}
      {notifyOpen && (
        <NotifyModal
          incident={activeIncident}
          onClose={() => setNotifyOpen(false)}
          onConfirm={handleNotifyConfirm}
        />
      )}
      {sentBanner && (
        <SentBanner
          firNumber={activeIncident.firNumber}
          onClose={() => setSentBanner(false)}
        />
      )}
    </div>
  );
};

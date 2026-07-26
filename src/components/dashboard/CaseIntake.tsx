import React, { useState } from 'react';
import {
  FilePlus,
  Lock,
  MapPin,
  User,
  Paperclip,
  CheckCircle2,
  FileText,
  GitCommit,
  UserCheck,
  Send,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CaseContext';

const CRIME_TAXONOMY = [
  'Commercial Burglary',
  'Vehicle Theft (Auto Lifting)',
  'Armed Robbery & Dacoity',
  'Extortion & Syndicate Coercion',
  'Narcotics Offense (NDPS)',
  'Cyber Fraud & Financial Crime',
  'Aggravated Assault',
];

export const CaseIntake: React.FC = () => {
  const { currentUser } = useAuth();
  const { cases, pendingApprovalCases, addNewFir, approveCaseBySho, updateExistingCase } = useCases();
  const [activeMode, setActiveMode] = useState<'new' | 'update' | 'my_cases'>('new');

  // File upload state & ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mode 1 State (New FIR)
  const [crimeType, setCrimeType] = useState(CRIME_TAXONOMY[0]);
  const [incidentTime, setIncidentTime] = useState('2026-07-26T02:30');
  const [reportTime, setReportTime] = useState('2026-07-26T08:15');
  const [locationName, setLocationName] = useState('Sector 18 Market, Main Alley');
  const [coords, setCoords] = useState({ lat: 28.5355, lng: 77.3910 });
  const [narrative, setNarrative] = useState('');
  const [victimName, setVictimName] = useState('');
  const [victimPhone, setVictimPhone] = useState('');
  const [suspectName, setSuspectName] = useState('');
  const [suspectDesc, setSuspectDesc] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceSize, setEvidenceSize] = useState('');

  // Mode 2 State (Update Case)
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'FIR-2026-8819');
  const [caseStatus, setCaseStatus] = useState<'Open' | 'Under Investigation' | 'Charge Sheeted' | 'Closed'>('Under Investigation');
  const [investigationNote, setInvestigationNote] = useState('');
  const [suggestedLinkFir, setSuggestedLinkFir] = useState('');
  const [linkReason, setLinkReason] = useState('');

  // Form submission feedback
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Enabled editing for all roles in demo mode so user can edit and test intake freely
  const canWrite = true;
  const isViewOnly = false;
  const autoFirId = `FIR-2026-${9105 + cases.length}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceName(file.name);
      setEvidenceSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newLat = 28.5300 + (1 - y) * 0.0200;
    const newLng = 77.3850 + x * 0.0200;

    setCoords({ lat: newLat, lng: newLng });
    if (!locationName || locationName === 'Sector 18 Market, Main Alley') {
      const locations = ['Sector 18 Financial Hub', 'Tech Park North Gate', 'MG Road Commercial Belt', 'Central Market Beat 4'];
      setLocationName(locations[Math.floor(x * locations.length)]);
    }
  };

  const handleNewFirSubmit = (isDraft: boolean) => {
    const created = addNewFir(
      {
        station: currentUser.jurisdiction,
        beat: 'Beat 4',
        reportingOfficer: `${currentUser.name} (${currentUser.badgeId})`,
        crimeType,
        incidentTime,
        reportTime,
        locationName: locationName || 'Sector 18 Market Zone',
        coordinates: coords,
        narrative: narrative || 'Overnight shutter breach at retail outlet. NLP indexing activated.',
        victimName: victimName || 'Store Manager',
        victimPhone: victimPhone || '+91-9876543210',
        suspectName: suspectName || 'Unconfirmed — Alleged Target',
        suspectDesc: suspectDesc || 'Height ~5ft 10in, dark jacket',
        evidenceName: evidenceName ? `${evidenceName} (${evidenceSize || '8.4 MB'})` : 'Crime_Scene_Photo_01.jpg (4.2 MB)',
      },
      isDraft
    );

    setSubmitSuccess(
      isDraft
        ? `Draft FIR ${created.id} saved in Holding Pen. WORM Audit Log written.`
        : `SUCCESS! FIR ${created.id} created & logged! Status: "Pending SHO Review". Switched to Holding Pen view.`
    );

    // Reset form fields
    setNarrative('');
    setVictimName('');
    setVictimPhone('');
    setSuspectName('');
    setSuspectDesc('');
    setEvidenceName('');
    setEvidenceSize('');

    // Automatically switch mode tab to Holding Pen so user immediately sees their submitted FIR!
    setActiveMode('my_cases');

    setTimeout(() => setSubmitSuccess(null), 7000);
  };

  const handleUpdateCaseSubmit = () => {
    updateExistingCase(
      selectedCaseId,
      caseStatus === 'Closed' ? 'Closed' : 'Verified — Active',
      investigationNote,
      suggestedLinkFir,
      linkReason
    );

    setSubmitSuccess(
      `Case ${selectedCaseId} updated. Status: "Update Logged / Verified". Note appended & cross-case link proposed.`
    );
    setActiveMode('my_cases');
    setTimeout(() => setSubmitSuccess(null), 7000);
    setInvestigationNote('');
    setLinkReason('');
    setSuggestedLinkFir('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-4 dashboard-card rounded-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="display-heading text-base text-slate-100 font-extrabold">FIR Intake &amp; Field Case Logging System</h2>
            <p className="display-heading text-xs text-slate-400">Official System of Record • PostGIS Spatial Ingestion • SHO Supervisory Verification</p>
          </div>
        </div>

        {/* RBAC Access Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border ${
            canWrite ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {canWrite ? 'WRITE ACCESS: AUTHORIZED' : 'VIEW-ONLY ACCESS: OVERVIEW'} ({currentUser.roleTitle})
          </span>
        </div>
      </div>

      {/* Mandatory Security & Accountability Banner */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <p>
            <strong className="text-cyan-300">Central Crime Database Notice:</strong> This form logs directly into the immutable State Central Crime Database. All entries are auditable, timestamped, and cryptographically signed under Officer Badge ID <strong className="text-slate-100 font-mono">{currentUser.badgeId}</strong> ({currentUser.name}).
          </p>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveMode('new')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeMode === 'new'
              ? 'border-cyan-400 text-cyan-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FilePlus className="w-4 h-4" />
          <span>Mode 1: New Case / FIR Registration</span>
        </button>
        <button
          onClick={() => setActiveMode('update')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeMode === 'update'
              ? 'border-cyan-400 text-cyan-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Mode 2: Update Existing Case</span>
        </button>
        <button
          onClick={() => setActiveMode('my_cases')}
          className={`pb-3 px-2 flex items-center gap-2 transition border-b-2 ${
            activeMode === 'my_cases'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mode 3: Holding Pen &amp; SHO Approval Queue ({pendingApprovalCases.length} Pending)</span>
        </button>
      </div>

      {/* Mode 3: Holding Pen & SHO Approval Queue View */}
      {activeMode === 'my_cases' && (
        <div className="dashboard-card rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <span>Intake Holding Pen &amp; SHO Supervisory Verification Queue</span>
              </h3>
              <p className="text-xs text-slate-400">Cases sit in "Pending SHO Review" holding pen until verified by SHO before fanning out downstream.</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold">
              3-State Pipeline Active
            </span>
          </div>

          <div className="space-y-4">
            {cases.map((c) => (
              <div key={c.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-extrabold text-cyan-400">{c.id}</span>
                    <span className="text-slate-300 font-bold">• {c.crimeType}</span>
                    <span className="text-slate-400">• {c.station} ({c.beat})</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                    c.status === 'Verified — Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    STATE: {c.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-200 font-semibold">{c.narrative}</p>
                    <p className="text-[11px] text-slate-400">Location: {c.locationName} ({c.coordinates.lat.toFixed(4)}°, {c.coordinates.lng.toFixed(4)}°)</p>
                    <p className="text-[11px] text-slate-400">Suspect: <span className="text-amber-300">{c.suspectName}</span> ({c.suspectDesc})</p>
                  </div>
                  <div className="space-y-1 text-right md:text-right">
                    <p className="text-[11px] text-slate-400 font-mono">Submitted by: {c.reportingOfficer}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Time: {c.submittedAt.slice(0, 16)}</p>
                    {c.verifiedBy ? (
                      <p className="text-[11px] text-emerald-400 font-mono font-bold">Verified by {c.verifiedBy} at {c.verifiedAt?.slice(0, 16)}</p>
                    ) : (
                      <p className="text-[11px] text-amber-400 font-mono font-bold">Awaiting SHO Verification Sign-off</p>
                    )}
                  </div>
                </div>

                {c.status === 'Pending SHO Review' && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => approveCaseBySho(c.id, `${currentUser.name} (SHO)`)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve &amp; Verify (Push Downstream to AI &amp; Analytics)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 1: New Case Registration Form */}
      {activeMode === 'new' && (
        <div className="dashboard-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Auto FIR ID */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                FIR Reference ID (System Auto-Assigned)
              </label>
              <input
                type="text"
                value={autoFirId}
                disabled
                className="w-full bg-transparent text-xs font-mono font-bold text-cyan-400 focus:outline-none"
              />
            </div>

            {/* Station & Beat */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                Assigned Station &amp; Beat
              </label>
              <input
                type="text"
                value={`${currentUser.jurisdiction} — Beat 4`}
                disabled
                className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-none"
              />
            </div>

            {/* Reporting Officer */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                Reporting Officer (Session Verified)
              </label>
              <input
                type="text"
                value={`${currentUser.name} (${currentUser.badgeId})`}
                disabled
                className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Controlled Crime Taxonomy */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Crime Type Taxonomy <span className="text-red-400">*</span>
              </label>
              <select
                value={crimeType}
                disabled={isViewOnly}
                onChange={(e) => setCrimeType(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-cyan-500"
              >
                {CRIME_TAXONOMY.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Date/Time of Incident */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Date &amp; Time of Incident <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={incidentTime}
                disabled={isViewOnly}
                onChange={(e) => setIncidentTime(e.target.value)}
                className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Date/Time of Report */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Date &amp; Time of Official Report <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={reportTime}
                disabled={isViewOnly}
                onChange={(e) => setReportTime(e.target.value)}
                className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Location Map Pin Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Incident Location &amp; Spatial Coordinates <span className="text-red-400">*</span></span>
              <span className="font-mono text-[11px] text-cyan-400 font-bold">PostGIS: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter street name or landmark..."
                className="flex-1 p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            {/* Interactive Vector Map Grid Canvas */}
            <div
              onClick={handleMapCanvasClick}
              className="h-40 bg-slate-950 border border-cyan-500/30 rounded-xl relative overflow-hidden cursor-pointer group shadow-inner"
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '28px 28px'
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_#060913_90%)]" />

              {/* Dynamic Placed Pin Indicator */}
              <div
                className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-full z-20"
                style={{
                  left: `${((coords.lng - 77.3850) / 0.0200) * 100}%`,
                  top: `${(1 - (coords.lat - 28.5300) / 0.0200) * 100}%`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="px-2 py-0.5 bg-cyan-500 text-slate-950 text-[9px] font-mono font-extrabold rounded shadow-lg">
                    {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                  </div>
                  <MapPin className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-bounce" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between items-center bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-300 backdrop-blur-md">
                <span className="font-bold text-cyan-400">Click Map Canvas to Pick Location</span>
                <span className="font-mono text-slate-400">Sector 18 Spatial Grid</span>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              FIR Narrative Summary (Indexed for NLP Link Mining) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Describe the incident narrative in detail. NLP engine will extract modus operandi and entity connections..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Victim Details (Access Restricted Subsection) */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" />
                Victim / Complainant Details (Protected Subsection)
              </span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono rounded font-bold uppercase">
                RESTRICTED — Excluded from Analytics Dashboards
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Victim / Complainant Name</label>
                <input
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="Full legal name"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Contact Phone</label>
                <input
                  type="text"
                  value={victimPhone}
                  onChange={(e) => setVictimPhone(e.target.value)}
                  placeholder="+91 Mobile number"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Suspect Details */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Suspect Information (If Known)
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono rounded font-bold uppercase">
                Unconfirmed — Alleged Target Tag
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Suspect Name / Alias</label>
                <input
                  type="text"
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                  placeholder="e.g. Unknown male or alias"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Physical Description &amp; Identifying Marks</label>
                <input
                  type="text"
                  value={suspectDesc}
                  onChange={(e) => setSuspectDesc(e.target.value)}
                  placeholder="e.g. Approx 5ft 10in, dark jacket, black motorcycle"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Real Local File Upload Picker */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-purple-400" />
              Evidence Attachment &amp; Digital Chain-of-Custody File Upload
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,application/pdf"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-slate-900 hover:bg-slate-850 border border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl text-center space-y-2 cursor-pointer transition group shadow-sm"
            >
              <Paperclip className="w-6 h-6 text-purple-400 mx-auto group-hover:scale-110 transition" />
              <div>
                <p className="text-xs font-bold text-slate-200">
                  {evidenceName ? `Attached: ${evidenceName}` : 'Click to Browse Local File Directory'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {evidenceSize ? `File Size: ${evidenceSize}` : 'Supports CCTV clips, ANPR images, or crime scene photos'}
                </p>
              </div>
              <span className="inline-block px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 text-xs font-bold rounded-lg transition">
                Browse Files...
              </span>
            </div>

            <p className="text-[10px] text-slate-500 font-mono text-center">
              Metadata captured automatically: Timestamp ({new Date().toISOString().slice(0, 16)}) • Geotag ({coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°)
            </p>
          </div>

          {/* Form Action Buttons */}
          {!isViewOnly && (
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleNewFirSubmit(true)}
                className="px-4 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleNewFirSubmit(false)}
                className="px-5 py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit for Supervisor (SHO) Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Update Existing Case Form */}
      {activeMode === 'update' && (
        <div className="dashboard-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scoped Case Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Assigned FIR Case <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedCaseId}
                disabled={isViewOnly}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-500"
              >
                {cases.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.id} — {c.crime || c.crimeType} ({c.station || c.policeStation})</option>
                ))}
              </select>
            </div>

            {/* Status Change Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Transition Investigation Status <span className="text-red-400">*</span>
              </label>
              <select
                value={caseStatus}
                disabled={isViewOnly}
                onChange={(e) => setCaseStatus(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="Open">Open</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Charge Sheeted">Charge Sheeted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Investigation Note Appender */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Append Investigation Progress Note (Preserves History Trail)
            </label>
            <textarea
              rows={3}
              value={investigationNote}
              disabled={isViewOnly}
              onChange={(e) => setInvestigationNote(e.target.value)}
              placeholder="e.g. Conducted CCTV review of ANPR Camera 4B. Interrogated suspect associate..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Case Link Suggestion Guardrail */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-purple-400" />
                Propose Cross-Case Link Guardrail
              </span>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono rounded font-bold uppercase">
                Officer-Suggested Link — Pending Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Target Related FIR Number</label>
                <input
                  type="text"
                  value={suggestedLinkFir}
                  disabled={isViewOnly}
                  onChange={(e) => setSuggestedLinkFir(e.target.value)}
                  placeholder="e.g. FIR-2026-8820"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Reason for Suggested Connection</label>
                <input
                  type="text"
                  value={linkReason}
                  disabled={isViewOnly}
                  onChange={(e) => setLinkReason(e.target.value)}
                  placeholder="e.g. Matching MO, vehicle registration, or phone tower overlap"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isViewOnly && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleUpdateCaseSubmit}
                className="px-5 py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Update Case &amp; Log Audit Entry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

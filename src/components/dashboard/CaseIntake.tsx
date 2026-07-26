import React, { useState } from 'react';
import {
  FilePlus,
  ShieldCheck,
  Lock,
  MapPin,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Eye,
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
  const { cases, myCases, pendingApprovalCases, addNewFir, approveCaseBySho, updateExistingCase } = useCases();
  const [activeMode, setActiveMode] = useState<'new' | 'update' | 'my_cases'>('new');

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

  // Mode 2 State (Update Case)
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'FIR-2026-8819');
  const [caseStatus, setCaseStatus] = useState<'Open' | 'Under Investigation' | 'Charge Sheeted' | 'Closed'>('Under Investigation');
  const [investigationNote, setInvestigationNote] = useState('');
  const [suggestedLinkFir, setSuggestedLinkFir] = useState('');
  const [linkReason, setLinkReason] = useState('');

  // Form submission feedback
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Enabled editing for all roles in demo mode so user can edit and test intake freely
  const isViewOnly = false;

  const handleNewFirSubmit = (isDraft: boolean) => {
    const created = addNewFir(
      {
        station: currentUser.jurisdiction,
        beat: 'Beat 4',
        reportingOfficer: `${currentUser.name} (${currentUser.badgeId})`,
        crimeType,
        incidentTime,
        reportTime,
        locationName,
        coordinates: coords,
        narrative: narrative || 'Overnight shutter breach at retail outlet. NLP indexing activated.',
        victimName: victimName || 'Store Manager',
        victimPhone: victimPhone || '+91-9876543210',
        suspectName: suspectName || 'Unconfirmed — Alleged Target',
        suspectDesc: suspectDesc || 'Height ~5ft 10in, dark jacket',
        evidenceName: evidenceName || 'Crime_Scene_Photo_01.jpg',
      },
      isDraft
    );

    setSubmitSuccess(
      isDraft
        ? `Draft FIR ${created.id} saved in Holding Pen. WORM Audit Log written.`
        : `FIR ${created.id} submitted! Status: "Pending SHO Review". Holding pen updated. WORM Block signed.`
    );

    setNarrative('');
    setVictimName('');
    setVictimPhone('');
    setSuspectName('');
    setSuspectDesc('');
    setEvidenceName('');

    setTimeout(() => setSubmitSuccess(null), 6000);
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
      `Case ${selectedCaseId} updated. Status: "Update Logged / Verified". Note appended & cross-case link proposed as "Pending Verification".`
    );
    setTimeout(() => setSubmitSuccess(null), 6000);
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
                disabled={isViewOnly}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter street name or landmark..."
                className="flex-1 p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            {/* Clickable Map Coordinates Simulator */}
            <div
              onClick={() => {
                if (isViewOnly) return;
                setCoords({
                  lat: 28.5355 + (Math.random() - 0.5) * 0.01,
                  lng: 77.3910 + (Math.random() - 0.5) * 0.01,
                });
              }}
              className="h-32 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center cursor-pointer group"
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
              />
              <div className="relative z-10 text-center space-y-1">
                <MapPin className="w-6 h-6 text-cyan-400 mx-auto group-hover:scale-110 transition" />
                <p className="text-xs font-bold text-slate-200">Interactive Map Pin Selector</p>
                <p className="text-[10px] text-slate-400">Click canvas to update PostGIS spatial coordinates</p>
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
              disabled={isViewOnly}
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
                  disabled={isViewOnly}
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
                  disabled={isViewOnly}
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
                  disabled={isViewOnly}
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
                  disabled={isViewOnly}
                  onChange={(e) => setSuspectDesc(e.target.value)}
                  placeholder="e.g. Approx 5ft 10in, dark jacket, black motorcycle"
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Geotagged Evidence Upload */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-purple-400" />
              Evidence Attachment &amp; Digital Chain-of-Custody Upload
            </label>
            <div className="p-3 bg-slate-900 border border-dashed border-slate-800 rounded-lg text-center space-y-1">
              <input
                type="text"
                value={evidenceName}
                disabled={isViewOnly}
                onChange={(e) => setEvidenceName(e.target.value)}
                placeholder="Upload CCTV clip, ANPR image, or crime-scene photo..."
                className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-center"
              />
              <p className="text-[10px] text-slate-500 font-mono">
                Metadata captured automatically: Timestamp ({new Date().toISOString().slice(0, 16)}) • Geotag ({coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°)
              </p>
            </div>
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
                {ASSIGNED_CASES.map((c) => (
                  <option key={c.id} value={c.id}>{c.id} — {c.crime} ({c.station})</option>
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
                onChange={(e) => setCaseStatus(e.target.value)}
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

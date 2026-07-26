import React, { useState } from 'react';
import { AuroraCanvas } from './AuroraCanvas';
import {
  Shield, Sparkles, Lock, Activity, MapPin, Eye, GitFork,
  ShieldCheck, CheckCircle2, User, BadgeCheck, Building2,
  AlertTriangle, ChevronRight, X, RotateCcw
} from 'lucide-react';
import { LoginModal } from '../auth/LoginModal';
import { useAuth } from '../../context/AuthContext';

/* ── Flip Card Component ─────────────────────────────────────────── */
interface FlipCardProps {
  accent: string;
  accentBg: string;
  accentBorder: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  whyItMatters: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  accent, accentBg, accentBorder, label, icon, title, shortDesc, whyItMatters,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1000px', height: '260px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 bg-slate-900/95 border ${accentBorder} rounded-2xl p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl overflow-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`h-1 w-full bg-gradient-to-r ${accent} absolute top-0 left-0 rounded-t-2xl`} />
          <div className="flex flex-col gap-3 pt-2">
            <div className={`p-3 rounded-xl ${accentBg} w-fit`}>{icon}</div>
            <h4 className="text-xl font-extrabold text-slate-100 leading-snug">{title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{shortDesc}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Click to learn why it matters</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 bg-slate-950 border ${accentBorder} rounded-2xl p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`h-1 w-full bg-gradient-to-r ${accent} absolute top-0 left-0 rounded-t-2xl`} />
          <div className="flex flex-col gap-3 pt-2">
            <span className={`text-[11px] font-mono font-extrabold tracking-widest ${label}`}>{title.toUpperCase()}</span>
            <h4 className="text-lg font-bold text-slate-100">Why It Matters</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{whyItMatters}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Request Access Form ─────────────────────────────────────────── */
interface RequestFormState {
  fullName: string;
  badgeId: string;
  rank: string;
  posting: string;
  requestedRole: string;
  supervisorName: string;
  supervisorEmail: string;
  justification: string;
}

const INITIAL_FORM: RequestFormState = {
  fullName: '', badgeId: '', rank: '', posting: '',
  requestedRole: '', supervisorName: '', supervisorEmail: '', justification: '',
};

const RequestAccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState<RequestFormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof RequestFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls =
    'w-full px-4 py-3 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition';
  const labelCls = 'block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <BadgeCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100">Request Platform Access</h3>
              <p className="text-xs text-slate-400 mt-0.5">Provisioning requires supervisor verification — not self-serve</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-slate-100">Request Received</h4>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your provisioning request has been submitted and is <span className="text-amber-400 font-semibold">pending verification</span>.
              No account has been created yet.
            </p>
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400 text-left space-y-1.5">
              <p>📧 <span className="text-slate-300">Super Admin / IT Provisioning Officer</span> has been notified</p>
              <p>📧 <span className="text-slate-300">{form.supervisorName || 'Your supervisor'}</span> has been sent a verification request</p>
              <p>⏳ Your badge ID will be verified against personnel records before an account is created</p>
            </div>
            <button onClick={onClose} className="mt-2 px-6 py-2.5 text-sm font-bold bg-slate-800 border border-slate-700 text-slate-200 rounded-xl hover:bg-slate-700 transition">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Warning banner */}
            <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Requests are reviewed manually. Badge IDs are cross-verified with personnel records. Misrepresentation is a punishable offence under the IT Act.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input required value={form.fullName} onChange={set('fullName')} placeholder="Vijay Kumar" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Badge / Service ID</label>
                <input required value={form.badgeId} onChange={set('badgeId')} placeholder="MH-2026-7741" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Rank</label>
                <input required value={form.rank} onChange={set('rank')} placeholder="Inspector / SHO / SP…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Current Posting (Station / District)</label>
                <input required value={form.posting} onChange={set('posting')} placeholder="Sector 18 PS, Metro Central" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Requested Access Role</label>
              <select required value={form.requestedRole} onChange={set('requestedRole')} className={inputCls}>
                <option value="">— Select role —</option>
                <option value="sho">Station House Officer (SHO)</option>
                <option value="analyst">Intelligence / Data Analyst</option>
                <option value="district_head">District Head (SP / DCP)</option>
                <option value="auditor">Ethics Board Auditor (Read-Only)</option>
                <option value="command_level">State Command (IG / DGP)</option>
              </select>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Sponsoring Supervisor</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Supervisor Name & Rank</label>
                  <input required value={form.supervisorName} onChange={set('supervisorName')} placeholder="DSP Ramesh Nair" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Supervisor Official Email</label>
                  <input required type="email" value={form.supervisorEmail} onChange={set('supervisorEmail')} placeholder="r.nair@police.gov.in" className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Justification</label>
              <textarea
                required
                rows={3}
                value={form.justification}
                onChange={set('justification')}
                placeholder="Briefly describe why you need access and the operational context…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition shadow-lg shadow-cyan-600/20 flex items-center gap-2">
                Submit Provisioning Request
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ── Main Public Landing ─────────────────────────────────────────── */
export const PublicLanding: React.FC<{ onOpenDashboard: () => void }> = ({ onOpenDashboard }) => {
  const { setLoginModalOpen, loginModalOpen, setRole } = useAuth();
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);

  const featureCards: FlipCardProps[] = [
    {
      accent: 'from-cyan-500 to-blue-500',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-slate-800 hover:border-cyan-500/40',
      label: 'text-cyan-400',
      icon: <MapPin className="w-7 h-7 text-cyan-400" />,
      title: 'Geospatial Hotspot Density',
      shortDesc: 'PostGIS vector tiles & time-series sliders for nocturnal patrol optimization.',
      whyItMatters: 'Visualizes continuous crime density and temporal drift over 24 hours so commanders can deploy patrols proactively before incidents occur — reducing reactive response lag.',
    },
    {
      accent: 'from-blue-500 to-purple-500',
      accentBg: 'bg-purple-500/10',
      accentBorder: 'border-slate-800 hover:border-purple-500/40',
      label: 'text-purple-400',
      icon: <GitFork className="w-7 h-7 text-purple-400" />,
      title: 'Link & Network Graph',
      shortDesc: 'Multi-entity relationship mapping across FIRs, stolen vehicles, and burner SIMs.',
      whyItMatters: 'Reveals hidden multi-hop connections across cases and suspect aliases, dismantling criminal syndicates rather than treating incidents in isolation.',
    },
    {
      accent: 'from-purple-500 to-emerald-500',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-slate-800 hover:border-emerald-500/40',
      label: 'text-emerald-400',
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
      title: 'Explainable SHAP AI',
      shortDesc: 'No black-box scores. Clear factor attribution for judicial & ethics compliance.',
      whyItMatters: 'Every risk score is traced back to the specific contributing factors — so it can be reviewed, challenged, and defended in court with a fully auditable evidence chain.',
    },
  ];

  const pipelineSteps = [
    { num: '01', label: 'INGESTION', color: 'text-cyan-400', bar: 'bg-cyan-500', title: 'Multi-Source Record Unified', desc: 'Integrates FIR databases, PostGIS spatial layers, and ANPR feeds into unified, encrypted storage.' },
    { num: '02', label: 'ANALYSIS', color: 'text-blue-400', bar: 'bg-blue-500', title: 'AI Link & Hotspot Models', desc: 'Graph neural networks and spatio-temporal models surface spatial density and syndicate connections.' },
    { num: '03', label: 'SAFEGUARD', color: 'text-amber-400', bar: 'bg-amber-500', title: 'Human Officer Review', desc: 'Every recommendation requires explicit officer review; automated operational action is strictly disabled.' },
    { num: '04', label: 'OVERSIGHT', color: 'text-emerald-400', bar: 'bg-emerald-500', title: 'Independent WORM Audit', desc: 'Cryptographically signed action logs are transmitted to an independent judicial oversight board.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-80">
        <AuroraCanvas />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl backdrop-blur-md">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-purple-300 bg-clip-text text-transparent font-['Space_Grotesk']">
              NETRA AI
            </span>
            <span className="block text-[10px] tracking-widest text-cyan-400 font-mono uppercase">
              State Crime Intelligence Network
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#pipeline" className="hover:text-cyan-400 transition">How It Works</a>
          <a href="#features" className="hover:text-cyan-400 transition">Capabilities</a>
          <a href="#ethics" className="hover:text-cyan-400 transition">Model Fairness & Audit</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setRole('public'); onOpenDashboard(); }}
            className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700 rounded-xl backdrop-blur-md hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Public Portal
          </button>
          <button
            onClick={() => setRequestAccessOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700 rounded-xl backdrop-blur-md hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            Request Access
          </button>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl transition shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Officer Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-16 space-y-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-sm font-bold backdrop-blur-xl shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Predictive Policing & Link Analysis Engine</span>
          </div>

          <h1 className="display-heading text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] text-slate-100 max-w-4xl mx-auto leading-tight font-extrabold">
            Next-Generation AI Intelligence for Law Enforcement & Public Safety
          </h1>


        </div>

        {/* Pipeline */}
        <div id="pipeline" className="w-full max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest font-bold">TRANSPARENT SYSTEM PIPELINE</span>
            <h3 className="text-3xl font-extrabold text-slate-100">How NETRA Operates: From Data to Action</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pipelineSteps.map((s) => (
              <div key={s.num} className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2.5 backdrop-blur-xl relative overflow-hidden shadow-xl hover:border-slate-700 transition">
                <div className={`w-1.5 h-full ${s.bar} absolute left-0 top-0`} />
                <div className="pl-3">
                  <span className={`text-[11px] font-mono ${s.color} font-extrabold tracking-wider`}>{s.num} / {s.label}</span>
                  <h4 className="text-base font-bold text-slate-100 mt-2">{s.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed mt-1.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flip Cards */}
        <div id="features" className="w-full max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase text-purple-400 tracking-widest font-bold">CORE CAPABILITIES</span>
            <h3 className="text-3xl font-extrabold text-slate-100">Intelligence Modules</h3>
            <p className="text-sm text-slate-400">Click any card to see why it matters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <FlipCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* Ethics Block */}
        <div id="ethics" className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 p-8 rounded-2xl text-left shadow-2xl backdrop-blur-xl space-y-4">
          <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Model Fairness & Independent Audit
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            NETRA's risk models are audited quarterly by an independent ethics board for disparate impact across demographic groups. Every score is SHAP-explainable, every access event is blockchain-timestamped, and the audit log is readable by the oversight board outside the police command structure.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-mono font-bold">
            {['SHAP Explainability', 'WORM Audit Trail', 'Quarterly Bias Review', 'ISO/IEC 27001', 'Zero Automated Action'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">{tag}</span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2026 State Police Cyber Cell & Intelligence Analytics Wing. ISO/IEC 27001 Certified.</p>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onSuccess={onOpenDashboard} />
      {requestAccessOpen && <RequestAccessModal onClose={() => setRequestAccessOpen(false)} />}
    </div>
  );
};

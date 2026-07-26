import React, { useState } from 'react';
import { AuroraCanvas } from './AuroraCanvas';
import { Shield, Sparkles, Lock, ArrowRight, Activity, MapPin, Eye, FileText, Database, GitFork, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LoginModal } from '../auth/LoginModal';
import { useAuth } from '../../context/AuthContext';

export const PublicLanding: React.FC<{ onOpenDashboard: () => void }> = ({ onOpenDashboard }) => {
  const { setLoginModalOpen, loginModalOpen, setRole } = useAuth();
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestAccessOpen(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Background Interactive Aurora WebGL Canvas */}
      <div className="absolute inset-0 z-0 opacity-80">
        <AuroraCanvas />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
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
          <a href="#ethics" className="hover:text-cyan-400 transition">Model Fairness &amp; Audit</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRole('public');
              onOpenDashboard();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700 rounded-lg backdrop-blur-md hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Public Portal
          </button>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg transition shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Officer Login
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-12 space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold backdrop-blur-xl shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Predictive Policing &amp; Link Analysis Engine</span>
          </div>

          <h1 className="display-heading text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] text-slate-100 max-w-4xl mx-auto leading-tight font-extrabold">
            Next-Generation AI Intelligence for Law Enforcement &amp; Public Safety
          </h1>

          {/* Narrative Flow: Problem -> How it Works -> Safeguard */}
          <p className="text-slate-200 text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-normal bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl text-left shadow-2xl">
            <span className="text-cyan-400 font-bold block mb-1 text-base">The Operational Challenge &amp; NETRA Architecture</span>
            Officers currently work across siloed FIR systems, paper records, and manual cross-referencing — making it slow to spot patterns across cases, districts, and repeat offenders. NETRA unifies this data into one platform: AI models surface hotspots and likely links between cases as investigative leads, every score comes with a plain-language explanation of the factors behind it, and every action is logged to an independent, tamper-evident audit trail reviewed outside the police chain of command.
          </p>
        </div>

        {/* Center Glassmorphic Console Card */}
        <div className="w-full max-w-3xl bg-slate-900/90 border border-cyan-500/40 p-6 md:p-8 rounded-2xl text-left relative overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1 font-bold">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>PILOT STATUS: METRO CENTRAL DISTRICT DEMO</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100">District Command Operating Console</h3>
              <p className="text-xs text-slate-300 mt-1">
                Supports Multi-level RBAC (IG/DGP, SP, SHO, Investigating Officer, &amp; Independent Auditor).
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex-1 md:flex-initial px-6 py-3.5 text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 rounded-xl transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                Enter Command Console
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRequestAccessOpen(true)}
                className="px-4 py-3.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>

        {/* "How It Works" 4-Step Pipeline Section */}
        <div id="pipeline" className="w-full max-w-4xl space-y-6 pt-4 text-left">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest font-bold">TRANSPARENT SYSTEM PIPELINE</span>
            <h3 className="text-2xl font-extrabold text-slate-100">How NETRA Operates: From Data to Action</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 backdrop-blur-xl relative overflow-hidden shadow-xl">
              <div className="w-1.5 h-full bg-cyan-500 absolute left-0 top-0" />
              <div className="pl-2">
                <span className="text-[11px] font-mono text-cyan-400 font-extrabold">01 / INGESTION</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Multi-Source Record Unified</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Integrates FIR databases, PostGIS spatial layers, and ANPR feeds into unified, encrypted storage.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 backdrop-blur-xl relative overflow-hidden shadow-xl">
              <div className="w-1.5 h-full bg-blue-500 absolute left-0 top-0" />
              <div className="pl-2">
                <span className="text-[11px] font-mono text-blue-400 font-extrabold">02 / ANALYSIS</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">AI Link &amp; Hotspot Models</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Graph neural networks and spatio-temporal models surface spatial density and syndicate connections.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 backdrop-blur-xl relative overflow-hidden shadow-xl">
              <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0" />
              <div className="pl-2">
                <span className="text-[11px] font-mono text-amber-400 font-extrabold">03 / SAFEGUARD</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Human Officer Review</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Every recommendation requires explicit officer review; automated operational action is strictly disabled.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 backdrop-blur-xl relative overflow-hidden shadow-xl">
              <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0" />
              <div className="pl-2">
                <span className="text-[11px] font-mono text-emerald-400 font-extrabold">04 / OVERSIGHT</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Independent WORM Audit</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Cryptographically signed action logs are transmitted to an independent judicial oversight board.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid — DARK MODE HIGH CONTRAST */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left pt-4">
          <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute top-0 left-0" />
            <MapPin className="w-7 h-7 text-cyan-400 mb-1" />
            <h4 className="text-base font-extrabold text-slate-100">Geospatial Hotspot Density</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              PostGIS vector tiles &amp; time-series sliders for nocturnal patrol optimization.
            </p>
            <p className="text-[11px] text-cyan-300 font-mono pt-3 border-t border-slate-800 font-medium">
              Why it matters: Visualizes continuous crime density and temporal drift over 24 hours so commanders deploy patrols proactively before incidents occur.
            </p>
          </div>

          <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 absolute top-0 left-0" />
            <GitFork className="w-7 h-7 text-purple-400 mb-1" />
            <h4 className="text-base font-extrabold text-slate-100">Link &amp; Network Graph</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Multi-entity relationship mapping across FIRs, stolen vehicles, and burner SIMs.
            </p>
            <p className="text-[11px] text-purple-300 font-mono pt-3 border-t border-slate-800 font-medium">
              Why it matters: Reveals hidden multi-hop connections across cases and suspect aliases to dismantle criminal syndicates rather than isolated incidents.
            </p>
          </div>

          <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-emerald-500 absolute top-0 left-0" />
            <ShieldCheck className="w-7 h-7 text-emerald-400 mb-1" />
            <h4 className="text-base font-extrabold text-slate-100">Explainable SHAP AI</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              No black-box scores. Clear factor attribution for judicial &amp; ethics compliance.
            </p>
            <p className="text-[11px] text-emerald-300 font-mono pt-3 border-t border-slate-800 font-medium">
              Why it matters: Every risk score can be traced back to the specific factors that produced it, so it can be reviewed, challenged, and defended in court.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>© 2026 State Police Cyber Cell &amp; Intelligence Analytics Wing. ISO/IEC 27001 Certified.</p>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onSuccess={onOpenDashboard} />

      {/* Request Access Modal */}
      {requestAccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-1">Request Department Access</h3>
            <p className="text-xs text-slate-400 mb-4">Official requests require District Officer verification.</p>
            {requestSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs text-center">
                ✓ Request submitted to State Admin desk. Verification token sent to official email.
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Full Name &amp; Rank</label>
                  <input required placeholder="Inspector Vijay Kumar" className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Official Gov Email</label>
                  <input required type="email" placeholder="v.kumar@police.gov.in" className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Jurisdiction / Police Station</label>
                  <input required placeholder="Sector 18 PS, Metro Central" className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setRequestAccessOpen(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

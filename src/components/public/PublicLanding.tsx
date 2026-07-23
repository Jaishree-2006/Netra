import React, { useState } from 'react';
import { AuroraCanvas } from './AuroraCanvas';
import { Shield, Sparkles, Lock, ArrowRight, Activity, MapPin, Eye, FileText } from 'lucide-react';
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Background Interactive Aurora WebGL Canvas */}
      <div className="absolute inset-0 z-0">
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
          <a href="#features" className="hover:text-cyan-400 transition">Capabilities</a>
          <a href="#transparency" className="hover:text-cyan-400 transition">Public Safety Map</a>
          <a href="#ethics" className="hover:text-cyan-400 transition">Model Fairness & Audit</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRole('public');
              onOpenDashboard();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 rounded-lg backdrop-blur-md hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Public Portal
          </button>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Officer Login
          </button>
        </div>
      </header>

      {/* Main Aurora Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-xl mb-6 shadow-xl">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Next-Gen Predictive Policing & Link Analysis Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-100 max-w-4xl font-['Space_Grotesk'] mb-6">
          Next-Generation AI Intelligence for Law Enforcement & Public Safety
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-normal">
          Real-time geospatial hotspot prediction, Graph Neural Link analysis across Repeat Offenders, and SHAP-based explainable risk scoring — built with strict ethical oversight.
        </p>

        {/* Center Glassmorphic Content Card */}
        <div className="w-full max-w-3xl glass-card-aurora p-6 md:p-8 rounded-2xl mb-12 text-left relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                SYSTEM STATUS: STATEWIDE LIVE
              </div>
              <h3 className="text-lg font-bold text-slate-100">District Command Operating Console</h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports Multi-level RBAC (IG/DGP, SP, SHO, Investigating Officer, & Independent Auditor).
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex-1 md:flex-initial px-6 py-3 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                Enter Command Console
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRequestAccessOpen(true)}
                className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 rounded-xl hover:bg-slate-700 transition"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <MapPin className="w-6 h-6 text-cyan-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-100 mb-1">Geospatial Hotspot Map</h4>
            <p className="text-xs text-slate-400">PostGIS vector tiles & time-series sliders for nocturnal patrol optimization.</p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <Activity className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-100 mb-1">Link & Network Graph</h4>
            <p className="text-xs text-slate-400">3-hop multi-entity relationship mapping for gang syndicates and stolen assets.</p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <FileText className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-100 mb-1">Explainable SHAP AI</h4>
            <p className="text-xs text-slate-400">No black-box scores. Clear factor transparency for judicial & ethics compliance.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 State Police Cyber Cell & Intelligence Analytics Wing. ISO/IEC 27001 Certified.</p>
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
                  <label className="block text-xs text-slate-300 mb-1">Full Name & Rank</label>
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

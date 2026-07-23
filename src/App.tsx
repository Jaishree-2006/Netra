import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicLanding } from './components/public/PublicLanding';
import { PublicPortal } from './components/public/PublicPortal';
import { SidebarNav } from './components/dashboard/SidebarNav';
import { MainOverview } from './components/dashboard/MainOverview';
import { GeospatialMap } from './components/dashboard/GeospatialMap';
import { LinkAnalysis } from './components/dashboard/LinkAnalysis';
import { RepeatOffenders } from './components/dashboard/RepeatOffenders';
import { PredictiveRisk } from './components/dashboard/PredictiveRisk';
import { WhatIfSimulator } from './components/dashboard/WhatIfSimulator';
import { AICopilot } from './components/dashboard/AICopilot';
import { AuditLog } from './components/dashboard/AuditLog';
import { Bell } from 'lucide-react';

const DashboardContent: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (currentUser.role === 'public') {
    return <PublicPortal onBackToLanding={onBackToLanding} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onBackToLanding}
      />

      {/* Main Command & Control Center */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Operational Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-100 font-['Space_Grotesk'] tracking-wide">
              STATE POLICE CRIME INTELLIGENCE COMMAND
            </h2>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs font-mono text-cyan-400">JURISDICTION: {currentUser.jurisdiction}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono">LIVE FEED ENCRYPTED</span>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700/60 rounded-lg transition relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Workspace */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && <MainOverview onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'geospatial' && <GeospatialMap />}
          {activeTab === 'network' && <LinkAnalysis />}
          {activeTab === 'repeat-offenders' && <RepeatOffenders />}
          {activeTab === 'predictive-risk' && <PredictiveRisk />}
          {activeTab === 'simulator' && <WhatIfSimulator />}
          {activeTab === 'copilot' && <AICopilot />}
          {activeTab === 'audit' && <AuditLog />}
          {activeTab === 'public-view' && <PublicPortal onBackToLanding={onBackToLanding} />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [viewState, setViewState] = useState<'landing' | 'dashboard'>('landing');

  return (
    <AuthProvider>
      {viewState === 'landing' ? (
        <PublicLanding onOpenDashboard={() => setViewState('dashboard')} />
      ) : (
        <DashboardContent onBackToLanding={() => setViewState('landing')} />
      )}
    </AuthProvider>
  );
};

export default App;

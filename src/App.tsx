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
import { CaseIntake } from './components/dashboard/CaseIntake';
import { CaseProvider } from './context/CaseContext';
import { Bell, ShieldCheck, X, AlertTriangle } from 'lucide-react';

const DashboardContent: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'ANPR Proximity Signal', desc: 'Suspect vehicle matched near Sector 18 PS boundary.', time: '4m ago', read: false, type: 'alert' },
    { id: 2, title: 'Hotspot Risk Spike', desc: 'Overnight burglary probability elevated to 78% in Tech Park.', time: '18m ago', read: false, type: 'warning' },
    { id: 3, title: 'Blockchain WORM Block #48,192', desc: 'Consensus verified hash on Consortium chain.', time: '1h ago', read: true, type: 'blockchain' },
    { id: 4, title: 'Duty Officer Recommendation', desc: 'Patrol shift adjustment logged by Analyst.', time: '2h ago', read: true, type: 'info' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (currentUser.role === 'public') {
    return <PublicPortal onBackToLanding={onBackToLanding} />;
  }

  return (
    <div className="flex h-screen bg-[#060913] text-slate-100 overflow-hidden font-sans select-none">
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onBackToLanding}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,_rgba(14,165,233,0.12),_transparent_45%),radial-gradient(circle_at_85%_85%,_rgba(139,92,246,0.10),_transparent_45%)]">
        <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 md:px-6 flex items-center justify-between shrink-0 backdrop-blur-xl relative z-30">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-100 tracking-tight">
                NETRA AI <span className="text-slate-500 font-normal">|</span> STATE POLICE CRIME INTELLIGENCE COMMAND
              </h2>
              <span className="text-[11px] font-mono font-bold text-cyan-400">JURISDICTION: {currentUser.jurisdiction}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Blockchain Security Badge */}
            <div className="hidden xl:flex items-center gap-2 bg-purple-950/40 border border-purple-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Consortium Blockchain WORM Ledger Verified</span>
            </div>

            {/* Live Feed Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-lg text-xs shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono font-bold">LIVE FEED ENCRYPTED</span>
            </div>

            {/* Interactive Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition relative shadow-sm"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 space-y-3 backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold text-slate-100">Operational System Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-bold font-mono">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-1 rounded hover:bg-slate-800"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                          item.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-bold flex items-center gap-1.5 ${
                            item.type === 'alert' ? 'text-red-400' :
                            item.type === 'warning' ? 'text-amber-400' :
                            item.type === 'blockchain' ? 'text-purple-400' : 'text-cyan-400'
                          }`}>
                            {item.type === 'alert' && <AlertTriangle className="w-3 h-3 shrink-0" />}
                            {item.type === 'blockchain' && <ShieldCheck className="w-3 h-3 shrink-0" />}
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => { setActiveTab('audit'); setShowNotifications(false); }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      View Full Blockchain Audit Log →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-transparent">
          {activeTab === 'overview' && <MainOverview onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'case-intake' && <CaseIntake />}
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
      <CaseProvider>
        {viewState === 'landing' ? (
          <PublicLanding onOpenDashboard={() => setViewState('dashboard')} />
        ) : (
          <DashboardContent onBackToLanding={() => setViewState('landing')} />
        )}
      </CaseProvider>
    </AuthProvider>
  );
};

export default App;

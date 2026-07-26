import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  MapPin,
  GitFork,
  UserCheck,
  BrainCircuit,
  Sliders,
  Sparkles,
  FileCheck,
  Eye,
  LogOut,
  ChevronDown,
  Info,
  FilePlus
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const { currentUser, setRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Main Command Overview', icon: LayoutDashboard, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst', 'auditor'] },
    { id: 'case-intake', label: 'FIR Intake & Case Logging', icon: FilePlus, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst', 'auditor', 'field_officer'] },
    { id: 'geospatial', label: 'Geospatial Hotspot Map', icon: MapPin, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'field_officer', 'analyst'] },
    { id: 'network', label: 'Link & Network Analysis', icon: GitFork, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst'] },
    { id: 'repeat-offenders', label: 'Repeat Offender Tracker', icon: UserCheck, roles: ['super_admin', 'district_head', 'sho', 'field_officer', 'analyst'] },
    { id: 'predictive-risk', label: 'Explainable Predictive Risk', icon: BrainCircuit, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst', 'auditor'] },
    { id: 'simulator', label: 'What-If Resource Simulator', icon: Sliders, roles: ['super_admin', 'command_level', 'district_head', 'analyst'] },
    { id: 'copilot', label: 'AI Co-pilot / NL Query', icon: Sparkles, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst'] },
    { id: 'audit', label: 'Ethics & WORM Audit Log', icon: FileCheck, roles: ['super_admin', 'command_level', 'auditor'] },
    { id: 'public-view', label: 'Public Anonymized Portal', icon: Eye, roles: ['super_admin', 'public', 'auditor', 'district_head'] },
  ];

  const allowedItems = menuItems.filter((item) =>
    currentUser.role === 'public' ? item.id === 'public-view' : item.roles.includes(currentUser.role)
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 select-none shadow-2xl">
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg shrink-0">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="truncate">
            <h1 className="display-heading text-sm font-extrabold tracking-tight text-slate-100 truncate">NETRA AI</h1>
            <span className="text-[9px] text-cyan-400 font-mono tracking-wider font-bold">SECURE LEVEL-4</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 border-b border-slate-800 bg-slate-950/60 relative">
        <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center justify-between font-bold">
          <span>Persona Role</span>
          <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-bold font-mono">
            DEMO
          </span>
        </div>
        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="w-full flex items-center justify-between p-2 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded-lg text-left transition shadow-sm"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700" />
            <div className="truncate">
              <p className="display-heading text-xs font-bold text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-[9px] text-cyan-400 font-medium truncate">{currentUser.roleTitle}</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {roleDropdownOpen && (
          <div className="absolute left-2 right-2 top-14 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1.5 backdrop-blur-xl">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-300">
                <Info className="w-3 h-3 text-amber-400 shrink-0" />
                Demo Persona Switcher
              </div>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => { setRole('district_head'); setRoleDropdownOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between font-semibold"
              >
                <span>District SP (SP/DCP)</span>
                {currentUser.role === 'district_head' && <span className="text-[9px] text-cyan-400 font-bold">Active</span>}
              </button>
              <button
                onClick={() => { setRole('sho'); setRoleDropdownOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between font-semibold"
              >
                <span>Station Officer (SHO)</span>
                {currentUser.role === 'sho' && <span className="text-[9px] text-cyan-400 font-bold">Active</span>}
              </button>
              <button
                onClick={() => { setRole('analyst'); setRoleDropdownOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between font-semibold"
              >
                <span>Intelligence Analyst</span>
                {currentUser.role === 'analyst' && <span className="text-[9px] text-cyan-400 font-bold">Active</span>}
              </button>
              <button
                onClick={() => { setRole('auditor'); setRoleDropdownOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between font-semibold"
              >
                <span>Oversight Auditor</span>
                {currentUser.role === 'auditor' && <span className="text-[9px] text-cyan-400 font-bold">Active</span>}
              </button>
              <button
                onClick={() => { setRole('command_level'); setRoleDropdownOpen(false); }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between font-semibold"
              >
                <span>State DGP Command</span>
                {currentUser.role === 'command_level' && <span className="text-[9px] text-cyan-400 font-bold">Active</span>}
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">Modules</div>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-2.5 border-t border-slate-800 space-y-2">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 shadow-sm">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-slate-400">Jurisdiction</span>
            <span className="font-mono text-cyan-400 font-bold text-[9px]">Active</span>
          </div>
          <p className="display-heading text-xs font-bold text-slate-100 truncate">{currentUser.jurisdiction}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/50 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
};

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
  ChevronDown
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { currentUser, setRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Role permissions filtering for navigation menu
  const menuItems = [
    { id: 'overview', label: 'Main Command Overview', icon: LayoutDashboard, roles: ['super_admin', 'command_level', 'district_head', 'sho', 'analyst', 'auditor'] },
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 select-none">
      {/* Platform Branding */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 font-['Space_Grotesk']">NETRA OPS</h1>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider">SECURE LEVEL-4</span>
          </div>
        </div>
      </div>

      {/* Persona Role Switcher Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/50 relative">
        <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center justify-between">
          <span>Active Persona Role</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="w-full flex items-center justify-between p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 rounded-lg text-left transition"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-cyan-400 truncate">{currentUser.roleTitle}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Dropdown menu to switch personas */}
        {roleDropdownOpen && (
          <div className="absolute left-3 right-3 top-16 z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] text-slate-400 font-mono uppercase">Switch Role (RBAC Demo)</div>
            <button
              onClick={() => { setRole('district_head'); setRoleDropdownOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>District SP (SP/DCP)</span>
              {currentUser.role === 'district_head' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
            </button>
            <button
              onClick={() => { setRole('sho'); setRoleDropdownOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>Station Officer (SHO)</span>
              {currentUser.role === 'sho' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
            </button>
            <button
              onClick={() => { setRole('analyst'); setRoleDropdownOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>Intelligence Analyst</span>
              {currentUser.role === 'analyst' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
            </button>
            <button
              onClick={() => { setRole('auditor'); setRoleDropdownOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>Oversight Auditor</span>
              {currentUser.role === 'auditor' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
            </button>
            <button
              onClick={() => { setRole('command_level'); setRoleDropdownOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>State DGP Command</span>
              {currentUser.role === 'command_level' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500">Modules</div>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
          <div className="flex justify-between items-center mb-1">
            <span>Jurisdiction</span>
            <span className="font-mono text-cyan-400">Active</span>
          </div>
          <p className="font-medium text-slate-200 truncate">{currentUser.jurisdiction}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, CheckCircle, Lock } from 'lucide-react';
import type { UserRole } from '../../types';

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setRole, verifyMFA } = useAuth();
  const [selectedRole, setSelectedRoleState] = useState<UserRole>('district_head');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'creds' | 'mfa'>('creds');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('mfa');
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyMFA(mfaCode)) {
      setRole(selectedRole);
      onClose();
    } else {
      setError('Invalid 6-digit MFA token. Try 123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Law Enforcement Portal</h3>
            <p className="text-xs text-slate-400">Admin-Provisioned OIDC Single Sign-On</p>
          </div>
        </div>

        {step === 'creds' ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Persona (Demo Switcher)</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRoleState(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="district_head">District Head (SP / DCP)</option>
                <option value="sho">Station Officer (SHO)</option>
                <option value="analyst">Intelligence / Data Analyst</option>
                <option value="auditor">Ethics Board Auditor (Read-Only)</option>
                <option value="command_level">State Command (IG / DGP)</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Badge ID / Official Email</label>
              <input
                type="text"
                readOnly
                value="officer.sen@police.gov.in"
                className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-start gap-2">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Restricted System. Unauthorized access is audited under Section 66 of the IT Act.</span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition shadow-lg shadow-cyan-600/20"
              >
                Continue to MFA
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-300">2FA Authenticator Token</label>
                <span className="text-xs text-cyan-400">Demo Code: 123456</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 tracking-widest font-mono"
                />
              </div>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Hardware YubiKey / OTP verification active.</span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep('creds')}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition shadow-lg shadow-cyan-600/20"
              >
                Authenticate & Launch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

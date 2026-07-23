import React, { createContext, useContext, useState } from 'react';
import type { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  allUsers: UserProfile[];
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  mfaVerified: boolean;
  verifyMFA: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Default District SP
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(true);

  const setRole = (role: UserRole) => {
    if (role === 'public') {
      setCurrentUser({
        id: 'u-public',
        name: 'Public Citizen',
        badgeId: 'PUBLIC-ACCESS',
        role: 'public',
        roleTitle: 'Civilian Transparency Viewer',
        jurisdiction: 'Public Realm',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        mfaEnabled: false,
      });
      return;
    }
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const verifyMFA = (code: string) => {
    if (code === '123456' || code.length === 6) {
      setMfaVerified(true);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setRole,
        allUsers: MOCK_USERS,
        loginModalOpen,
        setLoginModalOpen,
        mfaVerified,
        verifyMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

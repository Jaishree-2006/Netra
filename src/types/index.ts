export type UserRole =
  | 'super_admin'
  | 'command_level'
  | 'district_head'
  | 'sho'
  | 'field_officer'
  | 'analyst'
  | 'auditor'
  | 'public';

export interface UserProfile {
  id: string;
  name: string;
  badgeId: string;
  role: UserRole;
  roleTitle: string;
  jurisdiction: string;
  avatar: string;
  mfaEnabled: boolean;
}

export interface CrimeIncident {
  id: string;
  firNumber: string;
  crimeType: string;
  date: string;
  time: string;
  district: string;
  station: string;
  beat: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open Investigation' | 'Charge Sheeted' | 'Under Review' | 'Closed';
  repeatOffenderInvolved: boolean;
  assignedOfficer: string;
  summary: string;
  riskScore: number;
}

export interface OffenderProfile {
  id: string;
  name: string;
  alias: string;
  age: number;
  riskCategory: string;
  lastKnownLocation: string;
  associatedGang: string;
  totalPriorCases: number;
  activeBailStatus: boolean;
  linkedFirs?: string[];
  photoUrl: string;
  recentActivity: { date: string; event: string }[];
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'suspect' | 'fir' | 'vehicle' | 'location' | 'phone';
  riskScore?: number;
  details: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  relationship: string;
  confidence: number;
}

export interface SHAPFactor {
  factor: string;
  impact: number; // positive or negative
  description: string;
}

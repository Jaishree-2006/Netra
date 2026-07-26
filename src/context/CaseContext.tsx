import React, { createContext, useContext, useState } from 'react';
import { wormLedger } from '../services/blockchain';

export interface FIRCase {
  id: string;
  station: string;
  beat: string;
  reportingOfficer: string;
  crimeType: string;
  incidentTime: string;
  reportTime: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  narrative: string;
  victimName: string;
  victimPhone: string;
  suspectName: string;
  suspectDesc: string;
  evidenceName: string;
  status: 'Pending SHO Review' | 'Verified — Active' | 'Update Logged' | 'Closed';
  proposedLinkFir?: string;
  linkReason?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface CaseContextType {
  cases: FIRCase[];
  myCases: FIRCase[];
  pendingApprovalCases: FIRCase[];
  verifiedCases: FIRCase[];
  addNewFir: (newCase: Omit<FIRCase, 'id' | 'status' | 'submittedAt'>, isDraft: boolean) => FIRCase;
  approveCaseBySho: (caseId: string, shoName: string) => void;
  updateExistingCase: (caseId: string, status: FIRCase['status'], note: string, proposedLink?: string, linkReason?: string) => void;
}

const INITIAL_CASES: FIRCase[] = [
  {
    id: 'FIR-2026-8819',
    station: 'Sector 18 PS',
    beat: 'Beat 4',
    reportingOfficer: 'SI Ramesh Thorne (SHO-4029)',
    crimeType: 'Armed Robbery',
    incidentTime: '2026-07-22T23:45',
    reportTime: '2026-07-23T00:15',
    locationName: 'MG Road Jewelry Vault Zone',
    coordinates: { lat: 28.4595, lng: 77.0266 },
    narrative: 'Three armed assailants bypassed biometric lock using stolen RFID badge.',
    victimName: 'MG Vault Manager',
    victimPhone: '+91-9876543210',
    suspectName: 'Rashid "Shadow" Khan',
    suspectDesc: 'Dark jacket, wirecutter tool',
    evidenceName: 'CCTV_Vault_Cam4.mp4',
    status: 'Verified — Active',
    submittedAt: '2026-07-23T00:15',
    verifiedAt: '2026-07-23T01:00',
    verifiedBy: 'Inspector Rajesh Kumar (SHO)',
  },
  {
    id: 'FIR-2026-8820',
    station: 'Sector 18 PS',
    beat: 'Beat 2',
    reportingOfficer: 'SI Kavita Sharma',
    crimeType: 'Vehicle Theft (Auto Lifting)',
    incidentTime: '2026-07-23T02:15',
    reportTime: '2026-07-23T03:00',
    locationName: 'Tech Park Parking',
    coordinates: { lat: 28.4520, lng: 77.0310 },
    narrative: 'Luxury SUV stolen using signal relay box.',
    victimName: 'Tech Exec',
    victimPhone: '+91-9811223344',
    suspectName: 'Vikram "Speedy" Tyagi',
    suspectDesc: 'Black hoodie, relay device',
    evidenceName: 'ANPR_Plate_Cam4B.jpg',
    status: 'Verified — Active',
    submittedAt: '2026-07-23T03:00',
    verifiedAt: '2026-07-23T04:30',
    verifiedBy: 'Inspector Rajesh Kumar (SHO)',
  },
  {
    id: 'FIR-2026-9104',
    station: 'Sector 18 PS',
    beat: 'Beat 4',
    reportingOfficer: 'Inspector Rajesh Kumar (Badge #8820)',
    crimeType: 'Commercial Burglary',
    incidentTime: '2026-07-26T02:30',
    reportTime: '2026-07-26T08:15',
    locationName: 'Sector 18 Market, Main Alley',
    coordinates: { lat: 28.5355, lng: 77.3910 },
    narrative: 'Overnight shutter breach at electronic retail outlet.',
    victimName: 'Store Manager',
    victimPhone: '+91-9988776655',
    suspectName: 'Unconfirmed — Alleged Target',
    suspectDesc: 'Height ~5ft 10in, dark attire',
    evidenceName: 'Market_CCTV_Feed_02.mp4',
    status: 'Pending SHO Review',
    submittedAt: '2026-07-26T08:15',
  },
];

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<FIRCase[]>(INITIAL_CASES);

  const addNewFir = (newCaseData: Omit<FIRCase, 'id' | 'status' | 'submittedAt'>, isDraft: boolean): FIRCase => {
    const nextFirId = `FIR-2026-${9105 + cases.length}`;
    const newCase: FIRCase = {
      ...newCaseData,
      id: nextFirId,
      status: isDraft ? 'Pending SHO Review' : 'Pending SHO Review',
      submittedAt: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);

    // Write to Blockchain WORM ledger
    wormLedger.addAuditTransaction({
      timestamp: new Date().toISOString(),
      officerBadge: newCase.reportingOfficer,
      action: isDraft ? 'FIR_DRAFT_SAVED' : 'FIR_SUBMITTED_FOR_SHO_REVIEW',
      targetRef: newCase.id,
    });

    return newCase;
  };

  const approveCaseBySho = (caseId: string, shoName: string) => {
    const verifiedTimestamp = new Date().toISOString();
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Verified — Active',
              verifiedAt: verifiedTimestamp,
              verifiedBy: shoName,
            }
          : c
      )
    );

    // Write SHO Approval to Blockchain WORM ledger
    wormLedger.addAuditTransaction({
      timestamp: verifiedTimestamp,
      officerBadge: shoName,
      action: 'SHO_SUPERVISORY_VERIFICATION_APPROVED',
      targetRef: caseId,
    });
  };

  const updateExistingCase = (
    caseId: string,
    status: FIRCase['status'],
    note: string,
    proposedLink?: string,
    linkReason?: string
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status,
              proposedLinkFir: proposedLink || c.proposedLinkFir,
              linkReason: linkReason || c.linkReason,
            }
          : c
      )
    );

    wormLedger.addAuditTransaction({
      timestamp: new Date().toISOString(),
      officerBadge: 'OFFICER-SESSION',
      action: `CASE_UPDATE_${status.toUpperCase()}_NOTE:${note.slice(0, 20)}`,
      targetRef: caseId,
    });
  };

  const pendingApprovalCases = cases.filter((c) => c.status === 'Pending SHO Review');
  const verifiedCases = cases.filter((c) => c.status === 'Verified — Active');
  const myCases = cases;

  return (
    <CaseContext.Provider
      value={{
        cases,
        myCases,
        pendingApprovalCases,
        verifiedCases,
        addNewFir,
        approveCaseBySho,
        updateExistingCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
};

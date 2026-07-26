import React, { useState } from 'react';
import { GitFork, Search, ChevronDown, Info, ShieldAlert, FileText, Download, CheckCircle2, Lock } from 'lucide-react';
import { MOCK_NETWORK_DATA } from '../../data/mockData';
import type { NetworkNode } from '../../types';
import { useAuth } from '../../context/AuthContext';

// Helper to format confidence levels without false precision
function formatConfidence(confidence: number) {
  if (confidence >= 0.9) {
    return {
      band: 'High Confidence',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      description: 'Multiple independent vectors (co-occurrence + cell-tower overlap)',
    };
  }
  if (confidence >= 0.75) {
    return {
      band: 'Moderate Confidence',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      description: 'Single strong vector or partial temporal correlation',
    };
  }
  return {
    band: 'Low / Exploratory',
    badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
    description: 'Indirect association — flagged for manual analyst review',
  };
}

export const LinkAnalysis: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(MOCK_NETWORK_DATA.nodes[0]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [reportExported, setReportExported] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hopExpanded, setHopExpanded] = useState(false);
  const [hopAnchorNode, setHopAnchorNode] = useState<NetworkNode | null>(null);

  // Filter nodes based on search term
  const filteredNodeIds = searchTerm.trim()
    ? new Set(
        MOCK_NETWORK_DATA.nodes
          .filter((n) =>
            n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.id.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((n) => n.id)
      )
    : null;

  const handleExpandHops = () => {
    // Use selected node or first search match as anchor
    const anchor =
      filteredNodeIds && filteredNodeIds.size > 0
        ? MOCK_NETWORK_DATA.nodes.find((n) => filteredNodeIds.has(n.id)) || selectedNode
        : selectedNode;
    setHopAnchorNode(anchor);
    setHopExpanded(true);
  };

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="p-4 dashboard-card border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition"
        >
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
            <GitFork className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <h2 className="display-heading text-base font-extrabold text-slate-100">Multi-Hop Link &amp; Network Analysis Engine</h2>
            <p className="display-heading text-xs text-slate-400">Neo4j Graph Database • Entity Correlation Visualizer • Non-Evidentiary Lead Generator</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Legal / Methodological Disclaimer Banner */}
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-purple-200">Investigative Lead Guidance — Not Admissible Evidence</p>
              <p className="text-[11px] text-purple-300 leading-relaxed">
                Graph connections represent algorithmic correlation patterns derived from co-occurrence frequencies and cell-tower logs.
                They serve solely as investigative leads and require independent human officer verification before legal proceedings.
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 dashboard-card rounded-2xl flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="link-analysis-search"
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setHopExpanded(false); }}
                placeholder="Search suspect ref, FIR number, vehicle plate, or burner SIM..."
                className="w-full pl-9 pr-4 py-1.5 display-heading text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              id="expand-connections-btn"
              onClick={handleExpandHops}
              className="px-3 py-1.5 display-heading text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-lg shadow-purple-600/20"
            >
              Expand 3-Hop Connections
            </button>
          </div>

          {/* 3-Hop Expansion Result Panel */}
          {hopExpanded && hopAnchorNode && (
            <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-purple-800/50 pb-2">
                <span className="text-xs font-bold text-purple-200 flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-purple-400" />
                  3-Hop Subgraph Expansion: Anchor → <span className="font-mono text-purple-300">{hopAnchorNode.label}</span>
                </span>
                <button onClick={() => setHopExpanded(false)} className="text-[10px] text-slate-400 hover:text-red-400 font-mono">COLLAPSE ✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {[
                  { hop: 'Hop 1', label: 'SUSPECT-REF-2231', type: 'suspect', edge: 'Co-location proximity (Cell Tower M4)', confidence: 'High' },
                  { hop: 'Hop 2', label: 'VEH-MH12-X879', type: 'vehicle', edge: 'Registered alias match + ANPR hit', confidence: 'Moderate' },
                  { hop: 'Hop 3', label: 'BURNER-SIM-0041', type: 'phone', edge: 'Shared call bridge (Indirect 48hr window)', confidence: 'Low/Exploratory' },
                ].map((item) => (
                  <div key={item.hop} className="p-3 bg-slate-950 border border-purple-900/50 rounded-xl space-y-1">
                    <div className="text-[9px] font-mono text-purple-400 font-bold">{item.hop}</div>
                    <div className={`text-[11px] font-mono font-bold ${
                      item.type === 'suspect' ? 'text-red-300' :
                      item.type === 'vehicle' ? 'text-amber-300' : 'text-purple-300'
                    }`}>{item.label}</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">{item.edge}</div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block ${
                      item.confidence === 'High' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                      item.confidence === 'Moderate' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>{item.confidence} Confidence</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-purple-300/70 italic">All connections are non-evidentiary investigative leads. Requires human officer verification before proceeding.</p>
            </div>
          )}

          {/* Main Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Node Visualizer Canvas */}
            <div className="lg:col-span-2 dashboard-card border-slate-800 rounded-2xl h-[520px] relative overflow-hidden flex flex-col justify-between p-4 select-none">
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                  backgroundSize: '32px 32px'
                }}
              />

              <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="display-heading font-mono text-purple-400 font-bold">SYNDICATE CLUSTER: SHADOW GANG RECONSTRUCTION</span>
                </div>
                <span className="display-heading text-[10px] text-slate-400 font-medium">7 Entities • Banded Link Confidence</span>
              </div>

              {/* SVG Link Edge Connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {MOCK_NETWORK_DATA.links.map((link, idx) => {
                  const posMap: Record<string, { x: number; y: number }> = {
                    'off-1': { x: 220, y: 150 },
                    'off-2': { x: 420, y: 150 },
                    'fir-101': { x: 140, y: 320 },
                    'fir-102': { x: 480, y: 320 },
                    'veh-1': { x: 300, y: 400 },
                    'loc-1': { x: 120, y: 220 },
                    'phone-1': { x: 320, y: 240 },
                  };
                  const sourcePos = posMap[link.source];
                  const targetPos = posMap[link.target];
                  if (!sourcePos || !targetPos) return null;

                  return (
                    <g key={idx}>
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke={link.confidence > 0.9 ? '#8B5CF6' : '#64748B'}
                        strokeWidth={link.confidence > 0.9 ? 2.5 : 1.5}
                        strokeDasharray={link.confidence < 0.9 ? '4,4' : undefined}
                        opacity={0.75}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Interactive Graph Nodes */}
              <div className="relative z-20 flex-1">
                {MOCK_NETWORK_DATA.nodes.map((node) => {
                  const posMap: Record<string, { top: string; left: string }> = {
                    'off-1': { top: '25%', left: '32%' },
                    'off-2': { top: '25%', left: '62%' },
                    'fir-101': { top: '58%', left: '20%' },
                    'fir-102': { top: '58%', left: '70%' },
                    'veh-1': { top: '75%', left: '44%' },
                    'loc-1': { top: '40%', left: '16%' },
                    'phone-1': { top: '44%', left: '46%' },
                  };
                  const pos = posMap[node.id];
                  const isSelected = selectedNode?.id === node.id;
                  const isSearchMatch = filteredNodeIds ? filteredNodeIds.has(node.id) : true;
                  const isDimmed = filteredNodeIds ? !isSearchMatch : false;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ top: pos.top, left: pos.left, opacity: isDimmed ? 0.25 : 1 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-opacity duration-300"
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition display-heading shadow-md ${
                            node.type === 'suspect'
                              ? 'bg-red-500/20 border-red-500/50 text-red-300'
                              : node.type === 'fir'
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : node.type === 'vehicle'
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          } ${isSelected ? 'ring-2 ring-purple-400 scale-110 shadow-purple-500/30' : ''} ${isSearchMatch && filteredNodeIds ? 'ring-2 ring-emerald-400 scale-110' : ''} ${!isSelected && !isSearchMatch ? 'hover:scale-105' : ''}`}
                        >
                          <span className="font-mono">{node.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend Footer */}
              <div className="relative z-10 flex flex-wrap gap-4 text-[11px] bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg backdrop-blur-md">
                <span className="display-heading text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Suspect Ref</span>
                <span className="display-heading text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500" /> FIR Case</span>
                <span className="display-heading text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Vehicle</span>
                <span className="display-heading text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Phone/Loc</span>
              </div>
            </div>

            {/* Selected Node Intelligence Inspector */}
            <div className="dashboard-card rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="display-heading text-[10px] font-mono uppercase text-purple-400 tracking-wider font-bold">ENTITY GRAPH INSPECTOR</span>
                      <h3 className="display-heading text-base font-extrabold text-slate-100 font-mono">{selectedNode.label}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                      {selectedNode.type}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                      <div className="display-heading text-slate-400 font-bold text-[11px]">Entity Attributes</div>
                      <div className="display-heading font-bold text-slate-100">{selectedNode.details}</div>
                    </div>

                    {/* Split Metrics: 1. Graph Association Strength + 2. Actuarial Risk */}
                    {selectedNode.type === 'suspect' && (
                      <div className="space-y-2">
                        {/* Metric A: Graph Association Strength */}
                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-1.5">
                           <div className="flex justify-between items-center">
                             <span className="font-bold text-purple-300 flex items-center gap-1">
                               Link Association Strength
                               <div className="relative group/tip font-normal">
                                 <Info className="w-3 h-3 text-purple-400 cursor-pointer" />
                                 <div className="absolute z-20 left-0 top-5 w-52 p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded text-[10px] hidden group-hover/tip:block shadow-xl">
                                   Measures co-occurrence frequency across cell-tower logs and shared vehicle records.
                                 </div>
                               </div>
                             </span>
                             <span className="font-mono font-bold text-purple-300">88 / 100</span>
                           </div>
                           <div className="w-full bg-purple-900/50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-purple-500 h-full rounded-full" style={{ width: '88%' }} />
                           </div>
                           <p className="text-[10px] text-purple-400">Based on 3 overlapping cell-tower pings during incident window</p>
                         </div>

                         {/* Metric B: Historical Pattern / Actuarial Score */}
                         <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-1.5">
                           <div className="flex justify-between items-center">
                             <span className="font-bold text-amber-300 flex items-center gap-1">
                               Historical Pattern Index
                               <div className="relative group/tip font-normal">
                                 <Info className="w-3 h-3 text-amber-400 cursor-pointer" />
                                 <div className="absolute z-20 right-0 top-5 w-56 p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded text-[10px] hidden group-hover/tip:block shadow-xl">
                                   Actuarial score derived from prior record (14 cases) and bail status. Does not constitute a prediction of future action or guilt.
                                 </div>
                               </div>
                             </span>
                             <span className="font-mono font-bold text-amber-300">92 / 100</span>
                           </div>
                           <div className="w-full bg-amber-900/50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
                           </div>
                           <p className="text-[10px] text-amber-400">Actuarial factors: 14 priors • Active conditional bail status</p>
                         </div>
                      </div>
                    )}

                    {/* Direct Connections with Banded Confidence */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <div className="display-heading text-slate-300 font-bold flex justify-between items-center">
                        <span>Direct Graph Connections</span>
                        <span className="text-[10px] text-slate-500 font-normal">Banded Confidence</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        {MOCK_NETWORK_DATA.links
                          .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                          .map((link, idx) => {
                            const otherId = link.source === selectedNode.id ? link.target : link.source;
                            const otherNode = MOCK_NETWORK_DATA.nodes.find(n => n.id === otherId);
                            const conf = formatConfidence(link.confidence);
                            return (
                              <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-slate-100">{otherNode?.label || otherId}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${conf.badgeBg}`}>
                                    {conf.band}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                  <span>Relationship: {link.relationship}</span>
                                  <span className="font-mono text-purple-300 font-bold">{conf.description}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="display-heading text-slate-400 text-xs text-center py-12 font-bold">Click any graph node to inspect details</div>
              )}

              {/* Action: Export Investigative Lead Report (PDF) */}
              <div className="pt-3 space-y-2">
                <button
                  id="export-lead-report-btn"
                  onClick={handleExportReport}
                  className="w-full py-2.5 display-heading text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export Investigative Lead Report (PDF)
                </button>
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  Investigative lead document — requires human officer verification and chain-of-custody logging prior to judicial filing.
                </p>

                {reportExported && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Investigative Lead Report generated &amp; logged to Audit Trail.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

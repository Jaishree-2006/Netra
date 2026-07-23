import React, { useState } from 'react';
import { GitFork, Search } from 'lucide-react';
import { MOCK_NETWORK_DATA } from '../../data/mockData';
import type { NetworkNode } from '../../types';

export const LinkAnalysis: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(MOCK_NETWORK_DATA.nodes[0]);

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/30">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Multi-Hop Link & Network Analysis Engine</h2>
            <p className="text-xs text-slate-400">Neo4j Graph Database • 3-Hop Entity Relationship Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search suspect, FIR, phone, plate..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 w-64"
            />
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-lg shadow-purple-600/20">
            Expand 3-Hop Connections
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Graph Node Visualizer Canvas */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl h-[520px] relative overflow-hidden flex flex-col justify-between p-4 select-none">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#8B5CF6 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs backdrop-blur-md">
            <span className="font-mono text-purple-400 font-bold">SYNDICATE CLUSTER: SHADOW GANG RECONSTRUCTION</span>
            <span className="text-[10px] text-slate-400">7 Nodes • 8 Relationship Links</span>
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
                    opacity={0.7}
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

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                        node.type === 'suspect'
                          ? 'bg-red-950/80 border-red-500 text-red-300 shadow-lg shadow-red-500/20'
                          : node.type === 'fir'
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                          : node.type === 'vehicle'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-purple-950/80 border-purple-500 text-purple-300'
                      } ${isSelected ? 'ring-2 ring-purple-400 scale-110' : 'hover:scale-105'}`}
                    >
                      <span className="font-mono">{node.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex gap-4 text-[11px] bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg backdrop-blur-md">
            <span className="text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Suspect</span>
            <span className="text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500" /> FIR Case</span>
            <span className="text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Vehicle</span>
            <span className="text-slate-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Phone/Loc</span>
          </div>
        </div>

        {/* Selected Node Intelligence Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">ENTITY GRAPH INSPECTOR</span>
                  <h3 className="text-base font-extrabold text-slate-100 font-mono">{selectedNode.label}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-slate-400">Entity Details</div>
                  <div className="font-semibold text-slate-200">{selectedNode.details}</div>
                </div>

                {selectedNode.riskScore && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Recidivism & Link Risk</span>
                      <span className="font-mono font-bold text-red-400">{selectedNode.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: `${selectedNode.riskScore}%` }} />
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-slate-400 font-medium">Direct Graph Connections</div>
                  <div className="space-y-1 text-[11px]">
                    <div className="p-1.5 bg-slate-900 rounded flex justify-between">
                      <span className="text-slate-300">FIR-2026-8819</span>
                      <span className="text-purple-400 font-mono">Primary Suspect (94%)</span>
                    </div>
                    <div className="p-1.5 bg-slate-900 rounded flex justify-between">
                      <span className="text-slate-300">Vikram Tyagi</span>
                      <span className="text-purple-400 font-mono">Accomplice (98%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-12">Click any node to inspect graph metrics</div>
          )}

          <div className="pt-2">
            <button className="w-full py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-lg shadow-purple-600/20">
              Export Graph Evidence Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

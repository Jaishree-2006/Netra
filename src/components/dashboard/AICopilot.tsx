import React, { useState } from 'react';
import { Sparkles, Send, Bot, Filter } from 'lucide-react';

export const AICopilot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string; filters?: any }[]>([
    {
      role: 'assistant',
      text: 'Greetings Officer. I am Netra Co-pilot. Ask me any query in natural language (e.g. "Show repeat offenders in Sector 18 for vehicle theft, last 6 months").',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);

    // Simulated RAG + Structured Query Parsing Response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Extracted SQL/PostGIS Intent: Filtered 2 repeat offenders matched to Sector 18 PS vehicle theft FIRs (FIR-2026-8820). Rashid Khan & Vikram Tyagi detected nearby.`,
          filters: {
            jurisdiction: 'Sector 18 PS',
            offense: 'Vehicle Theft',
            timeframe: 'Last 6 Months',
            repeatOffenders: ['Rashid Khan', 'Vikram Tyagi'],
          },
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">AI Co-pilot & Natural Language Case Query Engine</h2>
            <p className="text-xs text-slate-400">RAG over FIR Database • Natural Language to Structured PostGIS Query</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono">
          LLM Engine: Llama-3-70B-Instruct-Police
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-[500px] flex flex-col justify-between">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-xl space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {msg.filters && (
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] space-y-1.5 font-mono">
                    <div className="text-cyan-400 font-bold flex items-center gap-1">
                      <Filter className="w-3 h-3" />
                      GENERATED STRUCTURED FILTER MATRIX
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>Jurisdiction: {msg.filters.jurisdiction}</div>
                      <div>Offense: {msg.filters.offense}</div>
                      <div>Time Window: {msg.filters.timeframe}</div>
                      <div>Matched Targets: {msg.filters.repeatOffenders.join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="relative pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query e.g. 'show repeat offenders in Sector 18 for vehicle theft, last 6 months'..."
            className="flex-1 px-4 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 pr-12"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition shadow-lg shadow-cyan-600/20"
          >
            <span>Run Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

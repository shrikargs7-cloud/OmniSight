"use client";

import { useState } from "react";
import { Search, TrendingUp, DollarSign, Newspaper, PlayCircle, ShieldAlert, Activity, Bot, LayoutDashboard, Network, MonitorPlay, LogOut, ChevronRight, Briefcase, Download, Settings, Code, ArrowRight, Rocket, Mail, ExternalLink, X, CheckCircle2, AlertCircle, Lightbulb, Target, Users, MapPin, Zap } from "lucide-react";
import { ReactFlow, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [selectedSeoNode, setSelectedSeoNode] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [agentMessage, setAgentMessage] = useState<string | null>(null);
  const [blueprintTab, setBlueprintTab] = useState("executive");
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const [aiBlueprint, setAiBlueprint] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!query) return;
    setLoading(true);
    setResults(null);
    setAgentMessage(null);
    setAiBlueprint(null);
    setSelectedSeoNode(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data);
      setActiveTab("dashboard");

      // Parallel kick-off for the LLM Agent
      fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, serpData: data }),
      })
      .then(res => res.json())
      .then(agentData => {
        setAgentMessage(agentData.response || agentData.chatSummary);
      })
      .catch(err => console.error("Agent Engine Offline"));

      // Full Blueprint Generator
      setBlueprintLoading(true);
      fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, serpData: data }),
      })
      .then(res => res.json())
      .then(bpData => {
         if (!bpData.error) setAiBlueprint(bpData);
      })
      .catch(err => console.error("Blueprint Error"))
      .finally(() => setBlueprintLoading(false));

    } catch (error) {
      setResults({ error: "API connection severed." });
    } finally {
      setLoading(false);
    }
  };

  const getPriceData = () => {
    if (!results?.marketPricing) return [];
    return results.marketPricing
      .map((item: any) => ({
        name: item.source.length > 10 ? item.source.substring(0, 10) + ".." : item.source,
        price: parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0"),
        originalItem: item
      }))
      .filter((item: any) => item.price > 0).slice(0, 8);
  };

  const getTrendsData = () => {
    if (!results?.historicalTrends || results.historicalTrends.length === 0) return [];
    let processedData = results.historicalTrends.filter((_: any, i: number) => i % 6 === 0).map((item: any) => {
      let lastDate = new Date(item.date?.split(" ")[0]);
      if (isNaN(lastDate.getTime())) lastDate = new Date();
      return {
        date: lastDate.toISOString().substring(0, 7),
        Past_Present: item.values?.[0]?.extracted_value || 0,
        Future: null
      }
    });

    if (processedData.length > 5) {
      const recent = processedData.slice(-5);
      const avgChange = (recent[recent.length - 1].Past_Present - recent[0].Past_Present) / 5;
      const lastVal = recent[recent.length - 1].Past_Present;
      let lastDate = new Date(recent[recent.length - 1].date);
      if (isNaN(lastDate.getTime())) lastDate = new Date();
      
      for(let i=1; i<=3; i++) {
        lastDate.setMonth(lastDate.getMonth() + 6);
        processedData.push({
          date: lastDate.toISOString().substring(0, 7) + " (Est)",
          Past_Present: null,
          Future: Math.max(0, lastVal + (avgChange * i * 2))
        });
      }
      const lastRealIndex = processedData.length - 4;
      processedData[lastRealIndex].Future = processedData[lastRealIndex].Past_Present;
    }
    return processedData;
  };

  const getSeoGraph = () => {
    if (!results?.seoData) return { nodes: [], edges: [] };
    const nodes = [
      { id: "root", position: { x: 400, y: 300 }, data: { label: query.toUpperCase(), type: 'root' }, style: { background: "#0ea5e9", color: "#fff", fontWeight: "900", border: "none", borderRadius: "8px", padding: "10px 20px" } }
    ];
    const edges: any[] = [];
    
    const questions = results.seoData.questions?.slice(0, 4) || [];
    questions.forEach((q: any, i: number) => {
      const id = `q-${i}`;
      nodes.push({ id, position: { x: 100, y: 100 + (i * 100) }, data: { label: q.question, type: 'question' }, style: { background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", borderRadius: "4px", fontSize: "11px", width: 200 } });
      edges.push({ id: `e-${id}`, source: "root", target: id, animated: true, style: { stroke: '#0ea5e9', strokeDasharray: "5 5" } });
    });

    const searches = results.seoData.searches?.slice(0, 4) || [];
    searches.forEach((s: any, i: number) => {
      const id = `s-${i}`;
      nodes.push({ id, position: { x: 700, y: 100 + (i * 100) }, data: { label: s.query, type: 'keyword' }, style: { background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", borderRadius: "4px", fontSize: "11px", width: 200 } });
      edges.push({ id: `e-${id}`, source: "root", target: id, animated: true, style: { stroke: '#8b5cf6' } });
    });

    return { nodes, edges };
  };

  const onNodeClick = (_: any, node: any) => {
    const volume = (node.data.label.length * 1200) + 4500;
    const cpc = (node.data.label.length * 0.15).toFixed(2);
    const difficulty = Math.min(99, node.data.label.length * 4);
    setSelectedSeoNode({ ...node.data, volume, cpc, difficulty });
  };

  const priceData = getPriceData();
  const trendsData = getTrendsData();
  const seoGraph = getSeoGraph();

  // Financials & Chart Data
  const avgRetailPrice = priceData.length > 0 ? (priceData.reduce((acc, curr) => acc + curr.price, 0) / priceData.length) : 0;
  const estWholesalePrice = avgRetailPrice * 0.35;
  const minPrice = priceData.length > 0 ? Math.min(...priceData.map(p => p.price)) : 0;
  const maxPrice = priceData.length > 0 ? Math.max(...priceData.map(p => p.price)) : 0;
  
  const marketPieData = [
    { name: 'D2C E-Commerce', value: 42, fill: '#3b82f6' },
    { name: 'Wholesale B2B', value: 28, fill: '#8b5cf6' },
    { name: 'Retail Partners', value: 18, fill: '#10b981' },
    { name: 'Other', value: 12, fill: '#94a3b8' }
  ];

  const radarData = [
    { subject: 'Margins', A: 85 },
    { subject: 'Demand', A: Math.min(100, (results?.seoData?.questions?.length || 0) * 15 + 40) },
    { subject: 'News Hype', A: Math.min(100, (results?.sentimentNews?.length || 0) * 10 + 30) },
    { subject: 'Video Reach', A: Math.min(100, (results?.influencerSentiment?.length || 0) * 20 + 40) },
    { subject: 'Competition', A: 90 },
  ];

  // Dynamic Chatbot Messages
  const chatMessages = [];
  if (results) {
     chatMessages.push({ type: "system", text: `Scanning 5 SerpApi Engines for "${query.toUpperCase()}"...` });
     if (results.sentimentNews?.length > 0) {
        chatMessages.push({ type: "news", text: `"${results.sentimentNews[0].title}"\nSource: ${results.sentimentNews[0].source?.name || results.sentimentNews[0].source}` });
     }
     if (priceData.length > 0) {
        chatMessages.push({ type: "alert", text: `Arbitrage validated. Retail ceiling is $${maxPrice.toFixed(2)}. Target $${estWholesalePrice.toFixed(2)} bulk.` });
     }
     if (agentMessage) {
        chatMessages.push({ type: "llm", text: agentMessage });
     } else {
        chatMessages.push({ type: "system", text: "Connecting to Gemini Core for synthesis..." });
     }
  }

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300 font-sans overflow-hidden selection:bg-indigo-900">
      
      {/* UI Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
            
            {activeModal === 'export' && (
              <div className="text-center space-y-4">
                <Download className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">Generating PDF Report</h3>
                <p className="text-sm text-slate-400">Compiling SerpApi data, market arbitrage, and SEO threat models into an executive summary...</p>
                <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

            {activeModal === 'api' && (
              <div className="space-y-4">
                <Code className="h-8 w-8 text-sky-500 mb-2" />
                <h3 className="text-xl font-bold text-white">OMNISIGHT API Access</h3>
                <p className="text-sm text-slate-400 mb-4">Integrate our market intelligence directly into your CRM or backend.</p>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Your API Key</p>
                  <p className="font-mono text-emerald-400 text-sm">sk_omni_7x9fA2...<span className="blur-sm">h82kL9sP</span></p>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 mt-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Endpoint Example</p>
                  <code className="text-xs text-sky-300">POST https://api.omnisight.com/v1/analyze</code>
                </div>
              </div>
            )}

            {activeModal === 'settings' && (
              <div className="space-y-6">
                <Settings className="h-8 w-8 text-slate-400 mb-2" />
                <h3 className="text-xl font-bold text-white">Platform Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Region (GL Code)</span>
                    <select className="bg-black border border-white/10 rounded px-2 py-1 text-sm text-white"><option>US (United States)</option><option>IN (India)</option></select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Language (HL Code)</span>
                    <select className="bg-black border border-white/10 rounded px-2 py-1 text-sm text-white"><option>EN (English)</option><option>HI (Hindi)</option></select>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-sm font-bold text-indigo-400">Current Plan</span>
                    <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Enterprise Tier</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'analysis' && (
              <div className="space-y-4">
                 <Lightbulb className="h-8 w-8 text-yellow-400 mb-2" />
                 <h3 className="text-xl font-bold text-white">AI Analysis Report</h3>
                 <p className="text-sm text-slate-400 mb-4">{aiBlueprint?.detailedAnalysis || "Run an analysis to view deep metrics."}</p>
                 <button onClick={() => setActiveModal(null)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors">Acknowledge</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-indigo-500" />
            OMNI<span className="text-indigo-500">SIGHT</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enterprise Intelligence</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Core Engines</p>
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <LayoutDashboard className="h-4 w-4" /> Market Dashboard
            </button>
            <button onClick={() => setActiveTab("seo")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "seo" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <Network className="h-4 w-4" /> SEO Threat Web
            </button>
            <button onClick={() => setActiveTab("media")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "media" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <MonitorPlay className="h-4 w-4" /> Media Monitor
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Commerce & Launch</p>
            <button onClick={() => setActiveTab("wholesale")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "wholesale" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <Briefcase className="h-4 w-4" /> B2B Wholesale Hub
            </button>
            <button onClick={() => setActiveTab("blueprint")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "blueprint" ? "bg-white text-blue-600 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <Rocket className="h-4 w-4" /> Startup Blueprint
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Platform</p>
            <button onClick={() => setActiveModal('export')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
              <span className="flex items-center gap-3"><Download className="h-4 w-4" /> Export Report</span>
              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-slate-400">PDF</span>
            </button>
            <button onClick={() => setActiveModal('api')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
              <Code className="h-4 w-4" /> API Access
            </button>
            <button onClick={() => setActiveModal('settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
              <Settings className="h-4 w-4" /> Settings
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
        
        <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center px-8 z-10 justify-between">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
            <input 
              type="text" 
              placeholder="Deploy agents to research a market, keyword, or competitor..." 
              className="w-full bg-[#121212] border border-white/5 text-white pl-12 pr-32 py-3 rounded-full focus:outline-none focus:border-indigo-500/50 transition-all text-sm shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !query}
              className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 rounded-full disabled:opacity-50 transition-all"
            >
              {loading ? "SCANNING..." : "EXECUTE"}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 relative z-0">
          
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <ShieldAlert className="h-24 w-24 mb-6 text-indigo-500" />
              <h2 className="text-3xl font-black text-white tracking-tighter">WAITING FOR DIRECTIVE</h2>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500 animate-pulse" />
              </div>
              <h3 className="mt-8 text-xl font-bold tracking-widest text-indigo-400">ORCHESTRATING 5 AI AGENTS</h3>
            </div>
          )}

          {results && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                 <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full overflow-y-auto pb-8">
                  
                 {/* Left Column (Charts) */}
                 <div className="xl:col-span-3 flex flex-col gap-6">
                   <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-2xl flex-1 min-h-[300px] flex flex-col">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                       <h2 className="font-bold text-white flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400" /> Macro Demand & Prediction</h2>
                     </div>
                     <div className="flex-1 w-full min-h-[200px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={trendsData}>
                           <defs>
                             <linearGradient id="colorPast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                             <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                           <XAxis dataKey="date" tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                           <YAxis tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                           <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1e1e1e', borderRadius: '8px' }} />
                           <Area type="monotone" dataKey="Past_Present" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPast)" />
                           <Area type="monotone" dataKey="Future" strokeDasharray="5 5" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorFuture)" />
                         </AreaChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[250px]">
                     <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col">
                       <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                         <h2 className="font-bold text-white flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-indigo-400" /> Competitor Pricing Arbitrage</h2>
                       </div>
                       <div className="flex-1 w-full min-h-[180px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={priceData} margin={{ left: -20 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                             <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 10}} interval={0} axisLine={false} tickLine={false} />
                             <YAxis tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                             <Tooltip cursor={{fill: '#ffffff02'}} contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1e1e1e', borderRadius: '8px' }} />
                             <Bar dataKey="price" fill="#6366f1" radius={[4, 4, 0, 0]}>
                               {priceData.map((e: any, i: number) => <Cell key={i} fill={i === 0 ? '#10b981' : '#4f46e5'} />)}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                     <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col">
                       <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                         <h2 className="font-bold text-white flex items-center gap-2 text-sm"><Target className="h-4 w-4 text-rose-400" /> Market Threat Matrix</h2>
                       </div>
                       <div className="flex-1 w-full min-h-[180px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                              <PolarGrid stroke="#ffffff20" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Market" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                              <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1e1e1e', borderRadius: '8px' }} />
                           </RadarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Right Column (Dynamic AI Chatbot) */}
                 <div className="xl:col-span-1 bg-[#121212] border border-indigo-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
                   <div className="p-4 border-b border-white/5 bg-indigo-500/5 flex items-center gap-3">
                     <div className="p-2 bg-indigo-500/20 rounded-lg"><Bot className="h-5 w-5 text-indigo-400" /></div>
                     <div>
                       <h3 className="font-bold text-white text-sm">OMNISIGHT AI</h3>
                       <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Agent</p>
                     </div>
                   </div>
                   
                   <div className="flex-1 p-4 overflow-auto space-y-4 flex flex-col-reverse">
                     {/* Reversed so it feels like a feed, we render bottom-to-top visually or just standard */}
                     <div className="space-y-4">
                       {chatMessages.map((msg, i) => (
                         <div key={i} className={`p-3 rounded-xl rounded-tl-sm text-xs font-mono border ${
                           msg.type === 'system' ? 'bg-[#1a1a1a] border-white/5 text-slate-300' :
                           msg.type === 'llm' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' :
                           msg.type === 'news' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                           'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                         }`}>
                           <strong className="block mb-1 text-[10px] uppercase opacity-70">
                             {msg.type === 'news' ? '📰 Live Data Feed' : msg.type === 'alert' ? '💡 Pricing Alert' : msg.type === 'llm' ? '🤖 Agent Synthesis' : '⚙️ System'}
                           </strong>
                           {msg.text}
                         </div>
                       ))}
                     </div>
                   </div>
                   
                   <div className="p-3 border-t border-white/5 bg-[#0a0a0a]">
                     <div className="bg-[#1a1a1a] border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-500 flex justify-between items-center">
                        Agent is monitoring... <Activity className="h-3 w-3 animate-pulse text-indigo-500"/>
                     </div>
                   </div>
                 </div>
               </div>
              )}

              {/* TAB 2: SEO THREAT WEB */}
              {activeTab === "seo" && (
                 <div className="h-full flex gap-6">
                 <div className="flex-1 flex flex-col bg-[#121212] border border-white/5 rounded-2xl shadow-2xl p-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                     <div>
                       <h2 className="font-bold text-white flex items-center gap-2 text-xl"><Network className="h-5 w-5 text-sky-400" /> Interactive SEO Threat Web</h2>
                     </div>
                   </div>
                   <div className="flex-1 w-full bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
                     <ReactFlow nodes={seoGraph.nodes} edges={seoGraph.edges} onNodeClick={onNodeClick} fitView>
                       <Background color="#1e293b" gap={24} size={1} />
                       <Controls className="bg-[#121212] border border-white/10 fill-white" />
                     </ReactFlow>
                   </div>
                 </div>
                 
                 <div className={`w-80 bg-[#121212] border border-sky-500/30 rounded-2xl p-6 shadow-2xl transition-all duration-300 ${selectedSeoNode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'}`}>
                   <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                     <Activity className="h-5 w-5 text-sky-400" />
                     <h2 className="font-bold text-white">Node Intelligence</h2>
                   </div>
                   {selectedSeoNode && (
                     <div className="space-y-6">
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Target Keyword / Query</p>
                         <p className="text-lg font-bold text-white leading-tight">"{selectedSeoNode.label}"</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-slate-500 mb-1">Est. Volume</p>
                           <p className="text-xl font-mono text-emerald-400">{selectedSeoNode.volume.toLocaleString()}</p>
                         </div>
                         <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-slate-500 mb-1">Est. CPC</p>
                           <p className="text-xl font-mono text-violet-400">${selectedSeoNode.cpc}</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
              )}

              {/* TAB 3: MEDIA MONITOR */}
              {activeTab === "media" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                  <div className="bg-[#121212] border border-white/5 rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden">
                    <h2 className="font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4 mb-4"><PlayCircle className="h-5 w-5 text-red-500" /> YouTube Intelligence</h2>
                    <div className="flex-1 overflow-auto space-y-6 pr-4">
                      {results.influencerSentiment?.length > 0 ? results.influencerSentiment.map((vid: any, i: number) => {
                        const videoId = vid.link?.split("v=")[1]?.split("&")[0] || vid.video_id;
                        return (
                          <div key={i} className="flex flex-col gap-3">
                            <iframe className="w-full h-56 rounded-xl border border-white/5" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen></iframe>
                            <div>
                              <p className="text-sm font-bold text-white line-clamp-1">{vid.title}</p>
                            </div>
                          </div>
                        )
                      }) : <p className="text-slate-500 text-sm">No videos found.</p>}
                    </div>
                  </div>
                  
                  <div className="bg-[#121212] border border-white/5 rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden">
                    <h2 className="font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4 mb-4"><Newspaper className="h-5 w-5 text-blue-400" /> Global Press & Sentiment</h2>
                    <div className="flex-1 overflow-auto space-y-4 pr-4">
                      {results.sentimentNews?.length > 0 ? results.sentimentNews.map((news: any, i: number) => (
                        <div key={i} className="p-4 bg-[#0a0a0a] rounded-xl border-l-2 border-blue-500 hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                          <a href={news.link} target="_blank" rel="noreferrer" className="block text-sm text-slate-200 group-hover:text-blue-400 font-bold mb-2 transition-colors">
                            {news.title}
                          </a>
                          <p className="text-xs text-slate-500 flex justify-between">
                            <span>{news.source?.name || news.source}</span>
                            <span>{news.date}</span>
                          </p>
                        </div>
                      )) : <p className="text-slate-500 text-sm">No recent news found for this query.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: B2B WHOLESALE HUB */}
              {activeTab === "wholesale" && (
                 <div className="h-full flex flex-col bg-[#121212] border border-emerald-500/20 rounded-2xl shadow-2xl p-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                   <div>
                     <h2 className="font-bold text-white flex items-center gap-2 text-xl"><Briefcase className="h-5 w-5 text-emerald-400" /> Global B2B Wholesale Matrix</h2>
                   </div>
                 </div>
                 <div className="flex-1 overflow-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500">
                         <th className="pb-4 font-bold">Supplier / Source</th>
                         <th className="pb-4 font-bold">Contact Email</th>
                         <th className="pb-4 font-bold">Est. Retail</th>
                         <th className="pb-4 font-bold text-emerald-400">Bulk Target</th>
                         <th className="pb-4 font-bold text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="text-sm">
                       {priceData.map((item: any, i: number) => {
                         const bulkPrice = (item.price * 0.35).toFixed(2); 
                         const domain = item.name.replace(/\s+/g, '').toLowerCase() || "supplier";
                         const mockEmail = `sales@${domain}.com`;
                         
                         let portalLink = item.originalItem?.link || "#";
                         const lowerName = item.name.toLowerCase();
                         if (lowerName.includes("walmart")) portalLink = "https://retaillink.wal-mart.com/";
                         else if (lowerName.includes("target")) portalLink = "https://partners.target.com/";
                         else if (lowerName.includes("best buy")) portalLink = "https://partners.bestbuy.com/";
                         else if (lowerName.includes("amazon")) portalLink = "https://vendorcentral.amazon.com/";
                         else if (lowerName.includes("costco")) portalLink = "https://www.costco.com/vendor-inquiries.html";

                         return (
                           <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                             <td className="py-4 font-semibold text-white flex items-center gap-3">
                               {item.originalItem?.source_icon && <img src={item.originalItem.source_icon} className="w-6 h-6 rounded bg-white p-0.5" alt="icon" />}
                               {item.name}
                             </td>
                             <td className="py-4 text-slate-400 text-xs font-mono flex items-center gap-2"><Mail className="h-3 w-3" /> {mockEmail}</td>
                             <td className="py-4 text-slate-400">${item.price.toFixed(2)}</td>
                             <td className="py-4 font-mono text-emerald-400 font-bold">${bulkPrice}</td>
                             <td className="py-4 text-right">
                               <a href={portalLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                 Supplier Portal <ExternalLink className="h-3 w-3" />
                               </a>
                             </td>
                           </tr>
                         )
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
              )}

              {/* TAB 5: STARTUP BLUEPRINT (INFOGRAPHIC REDESIGN) */}
              {activeTab === "blueprint" && (
                <div className="h-full overflow-y-auto bg-[#0a0a0a] text-slate-200 rounded-3xl shadow-2xl relative scroll-smooth">
                  <div className="p-10 lg:p-16 max-w-7xl mx-auto">
                    
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        <Rocket className="h-4 w-4" /> Startup Guide
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                        {query.toUpperCase()} <br/><span className="text-blue-400">Intelligence.</span>
                      </h1>
                      <p className="text-xl text-slate-400 max-w-2xl mx-auto">Smarter market entry. Healthier margins. We synthesize live search trends, wholesale pricing, and SEO gaps so you can build without delays.</p>
                      
                      
                    </div>

                    
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 mt-12 border-b border-white/10 pb-px">
                      <button 
                        onClick={() => setBlueprintTab('executive')}
                        className={`px-2 py-4 font-bold text-sm transition-all border-b-2 ${blueprintTab === 'executive' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        Executive Summary
                      </button>
                      <button 
                        onClick={() => setBlueprintTab('market')}
                        className={`px-2 py-4 font-bold text-sm transition-all border-b-2 ${blueprintTab === 'market' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        Market Gap Analysis
                      </button>
                      <button 
                        onClick={() => setBlueprintTab('roadmap')}
                        className={`px-2 py-4 font-bold text-sm transition-all border-b-2 ${blueprintTab === 'roadmap' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        Visual Roadmap
                      </button>
                    </div>

                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "executive" ? "block" : "hidden"}`}>
                      {!aiBlueprint ? (
                        <div className="text-center py-24 text-slate-500 font-mono animate-pulse flex flex-col items-center">
                          <Bot className="h-10 w-10 mb-4 opacity-50" />
                          OMNISIGHT AI is analyzing live SerpApi Data...
                        </div>
                      ) : (
                        <>
                    {/* Section 1: The Opportunity */}
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-blue-500/30">1</span> 
                        {aiBlueprint.opportunityTitle}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Target className="h-6 w-6"/></div>
                          <h4 className="font-bold text-lg mb-3 text-white">Market Opportunity</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{aiBlueprint.opportunityText}</p>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6"><ShieldAlert className="h-6 w-6"/></div>
                          <h4 className="font-bold text-lg mb-3 text-white">The Core Problem</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{aiBlueprint.problemText}</p>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6"><TrendingUp className="h-6 w-6"/></div>
                          <h4 className="font-bold text-lg mb-3 text-white">Data Solution</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{aiBlueprint.solutionText}</p>
                        </div>
                      </div>
                    </div>

                    

                    {/* Section 2: Problem -> Solution */}
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-purple-500/30">2</span> 
                        The Problem <ArrowRight className="h-5 w-5 text-slate-300 mx-2" /> Solution
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#121212] p-8 rounded-3xl border border-white/10 shadow-sm">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-rose-500 font-bold border-b border-slate-100 pb-4">
                            <AlertCircle className="h-5 w-5" /> <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-sm">The Problem</span>
                          </div>
                          <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2"></div> {aiBlueprint.problemText}</li>
                            
                            
                          </ul>
                        </div>
                        <div className="bg-blue-500/20/50 p-6 rounded-2xl border border-blue-100 space-y-6">
                          <div className="flex items-center gap-3 text-blue-400 font-bold border-b border-blue-100 pb-4">
                            <Lightbulb className="h-5 w-5" /> The Solution
                          </div>
                          <ul className="space-y-4 text-sm text-slate-300 font-medium">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" /> {aiBlueprint.solutionText}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                        </>
                      )}
                    </div>

                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "roadmap" ? "block" : "hidden"}`}>
                      {!aiBlueprint ? (
                        <div className="text-center py-24 text-slate-500 font-mono animate-pulse flex flex-col items-center">
                          <Bot className="h-10 w-10 mb-4 opacity-50" />
                          OMNISIGHT AI is analyzing live SerpApi Data...
                        </div>
                      ) : (
                        <>
                    {/* Section 3: How It Works */}
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-emerald-500/30">3</span> 
                        How It Works
                      </h2>
                      <p className="text-slate-400 mb-8 text-sm">A simple 4-step journey from market gap to product launch.</p>
                      
                      <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm w-full">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                          <h4 className="font-bold text-sm mb-2">Extract Pricing</h4>
                          <p className="text-xs text-slate-400">Scrape {priceData.length} global retailers for <strong>{query}</strong> baseline pricing.</p>
                        </div>
                        <ArrowRight className="text-slate-300 hidden lg:block shrink-0" />
                        <div className="flex-1 bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm w-full">
                          <div className="w-10 h-10 bg-blue-100 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                          <h4 className="font-bold text-sm mb-2">Analyze SEO</h4>
                          <p className="text-xs text-slate-400">Map Google "People Also Ask" to find unanswered questions.</p>
                        </div>
                        <ArrowRight className="text-slate-300 hidden lg:block shrink-0" />
                        <div className="flex-1 bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm w-full">
                          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                          <h4 className="font-bold text-sm mb-2">Vendor Lock</h4>
                          <p className="text-xs text-slate-400">Contact suppliers via our B2B Hub for a 65% bulk discount.</p>
                        </div>
                        <ArrowRight className="text-slate-300 hidden lg:block shrink-0" />
                        <div className="flex-1 bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm border-b-4 border-b-emerald-400 w-full">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold"><CheckCircle2 className="h-5 w-5"/></div>
                          <h4 className="font-bold text-sm mb-2">Launch Fast</h4>
                          <p className="text-xs text-slate-400">Deploy landing pages targeting the exact SEO gaps found.</p>
                        </div>
                      </div>
                    </div>
                        </>
                      )}
                    </div>

                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "market" ? "block" : "hidden"}`}>
                      {!aiBlueprint ? (
                        <div className="text-center py-24 text-slate-500 font-mono animate-pulse flex flex-col items-center">
                          <Bot className="h-10 w-10 mb-4 opacity-50" />
                          OMNISIGHT AI is analyzing live SerpApi Data...
                        </div>
                      ) : (
                        <>
                    {/* Section 4: Market & Insights */}
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-sky-500/30">4</span> 
                        Market & Customer Insights
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col justify-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Retail Floor Price</p>
                          <h3 className="text-4xl font-black text-white">${minPrice.toFixed(2)}</h3>
                          <p className="text-xs text-slate-400 mt-2">Lowest detected market entry.</p>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col justify-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Wholesale Target</p>
                          <h3 className="text-4xl font-black text-emerald-500">${(minPrice*0.35).toFixed(2)}</h3>
                          <p className="text-xs text-slate-400 mt-2">Required acquisition cost.</p>
                        </div>
                        
                        <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-sm col-span-1 lg:col-span-2 flex items-center">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-4">Customer Segments</h4>
                            <ul className="space-y-3 text-xs text-slate-400">
                              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500/200"></div> D2C E-Commerce</span> <strong>42%</strong></li>
                              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Wholesale B2B</span> <strong>28%</strong></li>
                              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Retail Partners</span> <strong>18%</strong></li>
                            </ul>
                          </div>
                          <div className="h-32 w-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={marketPieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} stroke="none">
                                  {marketPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </div>
                    </div>

                    

                    {/* Section 5: AI Insights */}
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30">5</span> 
                        AI-Generated Insights
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                           <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-4"><div className="bg-emerald-500/20 p-1 rounded"><ArrowRight className="h-4 w-4 text-emerald-600"/></div> What's going well</h4>
                           <ul className="space-y-3 text-sm text-emerald-300/80">
                             {aiBlueprint.goingWell.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                           </ul>
                        </div>
                        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
                           <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-4"><div className="bg-amber-500/20 p-1 rounded"><AlertCircle className="h-4 w-4 text-amber-600"/></div> What needs attention</h4>
                           <ul className="space-y-3 text-sm text-amber-300/80">
                             {aiBlueprint.needsAttention.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                           </ul>
                        </div>
                        <div className="bg-purple-500/10 p-6 rounded-3xl border border-purple-500/20">
                           <h4 className="font-bold text-purple-400 flex items-center gap-2 mb-4"><div className="bg-purple-500/20 p-1 rounded"><Zap className="h-4 w-4 text-purple-600"/></div> The "Why?"</h4>
                           <ul className="space-y-3 text-sm text-purple-300/80">
                             {aiBlueprint.theWhy.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                           </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                         <div>
                            <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-yellow-300"/> AI Recommendation</h4>
                            <p className="text-blue-100 text-sm">{aiBlueprint.recommendation}</p>
                         </div>
                         <button onClick={() => setActiveModal('analysis')} className="bg-[#121212] text-blue-400 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500/20 transition-colors whitespace-nowrap">View detailed analysis →</button>
                      </div>
                    </div>
                        </>
                      )}
                    </div>

                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "roadmap" ? "block" : "hidden"}`}>
                      {!aiBlueprint ? (
                        <div className="text-center py-10 text-slate-500 font-mono animate-pulse flex flex-col items-center">
                          <Bot className="h-10 w-10 mb-4 opacity-50" />
                          Generating Growth Roadmap...
                        </div>
                      ) : (
                        <>
                    {/* Section 6: Roadmap */}
                    <div className="pb-16">
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                        <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-slate-500/30">6</span> 
                        Growth Roadmap
                      </h2>
                      <div className="flex flex-col lg:flex-row gap-6 relative">
                        <div className="hidden lg:block absolute top-[28px] left-8 right-8 h-1 bg-slate-200 z-0"></div>
                        
                        <div className="flex-1 relative z-10">
                          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold mb-4 shadow-lg mx-auto"><CheckCircle2 className="h-6 w-6"/></div>
                          <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm">
                            <h4 className="font-bold text-sm mb-1 text-white">Now <span className="text-xs text-slate-400 font-normal block mt-1">(0-3 months)</span></h4>
                            <ul className="text-xs text-slate-400 text-left mt-4 space-y-2">
                              {aiBlueprint.phase1.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                            </ul>
                          </div>
                        </div>

                        <div className="flex-1 relative z-10">
                          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold mb-4 shadow-lg mx-auto"><MapPin className="h-6 w-6"/></div>
                          <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm">
                            <h4 className="font-bold text-sm mb-1 text-white">Next <span className="text-xs text-slate-400 font-normal block mt-1">(3-6 months)</span></h4>
                            <ul className="text-xs text-slate-400 text-left mt-4 space-y-2">
                              {aiBlueprint.phase2.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                            </ul>
                          </div>
                        </div>

                        <div className="flex-1 relative z-10">
                          <div className="w-14 h-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center font-bold mb-4 shadow-lg mx-auto"><TrendingUp className="h-6 w-6"/></div>
                          <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl text-center shadow-sm">
                            <h4 className="font-bold text-sm mb-1 text-white">Later <span className="text-xs text-slate-400 font-normal block mt-1">(6-12 months)</span></h4>
                            <ul className="text-xs text-slate-400 text-left mt-4 space-y-2">
                              {aiBlueprint.phase3.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}
                            </ul>
                          </div>
                        </div>

                      </div>
                    </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

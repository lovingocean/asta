import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Users,
  Search,
  DollarSign,
  Briefcase,
  Globe,
  ShieldCheck,
  Send,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  Terminal,
  Activity,
  ArrowRight,
  Flame,
  Radio,
  FileText,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import {
  ClientProspect,
  GlobalHub,
  DealStatus,
  INITIAL_PROSPECTS,
  generateNewProspect,
  generatePitchDossier,
  advanceProspectStage,
  executeAgentUserCommand
} from '../utils/autonomousSalesAgent';

interface AutonomousRainmakerAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
  onAddTreasuryRevenue?: (amountUsd: number, description: string) => void;
}

export const AutonomousRainmakerAgentModal: React.FC<AutonomousRainmakerAgentModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  onAddTreasuryRevenue
}) => {
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  // Prospects state initialized with institutional profiles
  const [prospects, setProspects] = useState<ClientProspect[]>(INITIAL_PROSPECTS);
  const [selectedProspectId, setSelectedProspectId] = useState<string>(INITIAL_PROSPECTS[0].id);
  const [filterHub, setFilterHub] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Autonomous Bot Auto-Loop state
  const [isAutonomousHunting, setIsAutonomousHunting] = useState<boolean>(true);
  const [agentLogs, setAgentLogs] = useState<Array<{ text: string; time: string; type: 'LEAD' | 'PITCH' | 'CLOSE' | 'FULFILL' }>>([
    {
      text: '🤖 Astra Sovereign Autonomous Agent initialized. Monitoring Tier-1 Capital Hubs (NY, LDN, DXB, SG, ZRH).',
      time: '10:00:00',
      type: 'LEAD'
    },
    {
      text: '⚡ Al-Maktoum Dynasty Sovereign ($4.2B) signed $250k/yr agreement. Autonomous trading vault actively yielding.',
      time: '10:02:15',
      type: 'FULFILL'
    }
  ]);

  // Command prompt input
  const [userCommand, setUserCommand] = useState<string>('');
  const [agentReply, setAgentReply] = useState<{ en: string; ur: string } | null>(null);

  // Active dossier preview modal/tab
  const [viewingDossier, setViewingDossier] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Selected prospect memo
  const selectedProspect = prospects.find(p => p.id === selectedProspectId) || prospects[0];

  // Pipeline aggregate calculations
  const totalPipelineValue = prospects.reduce((acc, p) => acc + p.dealValueUsd, 0);
  const closedProspects = prospects.filter(p => p.status === 'CLOSED_WON' || p.status === 'FULFILLED');
  const totalClosedRevenue = closedProspects.reduce((acc, p) => acc + p.dealValueUsd, 0);
  const totalLossDetected = prospects.reduce((acc, p) => acc + p.detectedAnnualLoss, 0);

  // Autonomous background hunting interval
  useEffect(() => {
    if (!isAutonomousHunting || !isOpen) return;

    const interval = setInterval(() => {
      // Pick a random prospect that is not yet fulfilled and advance them, or discover a new one
      const dice = Math.random();

      if (dice > 0.65 && prospects.length < 15) {
        // Discover a new prospect
        const newLead = generateNewProspect();
        setProspects(prev => [newLead, ...prev]);
        setAgentLogs(prev => [
          {
            text: `🎯 Autonomous Radar spotted ${newLead.name} (${newLead.aum} AUM) in ${newLead.hub}. Detected annual slippage loss: $${newLead.detectedAnnualLoss.toLocaleString()}.`,
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            type: 'LEAD'
          },
          ...prev.slice(0, 30)
        ]);
        soundManager.playTierUp();
      } else {
        // Advance an existing prospect
        setProspects(prev => {
          const eligible = prev.filter(p => p.status !== 'FULFILLED');
          if (eligible.length === 0) return prev;
          const target = eligible[Math.floor(Math.random() * eligible.length)];
          const step = advanceProspectStage(target);

          if (step.revenueCollected > 0 && onAddTreasuryRevenue) {
            onAddTreasuryRevenue(step.revenueCollected, `Autonomous Closed Deal: ${target.name} ($${step.revenueCollected.toLocaleString()}/yr)`);
          }

          let logType: 'LEAD' | 'PITCH' | 'CLOSE' | 'FULFILL' = 'PITCH';
          if (step.updatedProspect.status === 'CLOSED_WON') logType = 'CLOSE';
          else if (step.updatedProspect.status === 'FULFILLED') logType = 'FULFILL';

          setAgentLogs(l => [
            {
              text: step.actionLog,
              time: new Date().toLocaleTimeString('en-US', { hour12: false }),
              type: logType
            },
            ...l.slice(0, 30)
          ]);

          if (logType === 'CLOSE') {
            soundManager.playApexMilestone();
          } else {
            soundManager.playOrderFilled();
          }

          return prev.map(p => p.id === target.id ? step.updatedProspect : p);
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutonomousHunting, isOpen, prospects.length, onAddTreasuryRevenue]);

  // Handle user direct command
  const handleSendCommand = (cmdText?: string) => {
    const text = (cmdText || userCommand).trim();
    if (!text) return;

    soundManager.playClick();
    const result = executeAgentUserCommand(text, prospects, language);

    setProspects(result.updatedProspects);
    setAgentReply({ en: result.replyMessage, ur: result.replyMessageUrdu });
    setUserCommand('');

    if (result.newRevenue > 0 && onAddTreasuryRevenue) {
      onAddTreasuryRevenue(result.newRevenue, `Agent Command Execution Closed Revenue ($${result.newRevenue.toLocaleString()})`);
      soundManager.playApexMilestone();
    } else {
      soundManager.playTierUp();
    }

    setAgentLogs(prev => [
      {
        text: `⚡ Commander Directive: "${text}" -> ${result.replyMessage}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'CLOSE'
      },
      ...prev.slice(0, 30)
    ]);
  };

  // Advance single prospect manually
  const handleAdvanceSingleProspect = (prospect: ClientProspect) => {
    soundManager.playClick();
    const step = advanceProspectStage(prospect);
    setProspects(prev => prev.map(p => p.id === prospect.id ? step.updatedProspect : p));

    if (step.revenueCollected > 0 && onAddTreasuryRevenue) {
      onAddTreasuryRevenue(step.revenueCollected, `Manual Closed Deal: ${prospect.name}`);
      soundManager.playApexMilestone();
    } else {
      soundManager.playOrderFilled();
    }

    setAgentLogs(prev => [
      {
        text: step.actionLog,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: step.updatedProspect.status === 'CLOSED_WON' ? 'CLOSE' : 'PITCH'
      },
      ...prev.slice(0, 30)
    ]);
  };

  // Instant 1-click close & fulfill
  const handleInstantCloseAndFulfill = (prospect: ClientProspect) => {
    soundManager.playApexMilestone();
    let currentP = { ...prospect };
    let collectedRev = 0;

    while (currentP.status !== 'CLOSED_WON') {
      const step = advanceProspectStage(currentP);
      currentP = step.updatedProspect;
      collectedRev += step.revenueCollected;
    }
    // Fulfill
    const fulfillStep = advanceProspectStage(currentP);
    currentP = fulfillStep.updatedProspect;

    if (collectedRev > 0 && onAddTreasuryRevenue) {
      onAddTreasuryRevenue(collectedRev, `Instant Closed: ${prospect.name}`);
    }

    setProspects(prev => prev.map(p => p.id === prospect.id ? currentP : p));
    setAgentLogs(prev => [
      {
        text: `⚡ INSTANT APEX CLOSE: ${prospect.name} closed on $${prospect.dealValueUsd.toLocaleString()}/yr Sovereign license & trading infrastructure autonomously provisioned!`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'CLOSE'
      },
      ...prev.slice(0, 30)
    ]);
  };

  if (!isOpen) return null;

  // Filtered prospects
  const filteredProspects = prospects.filter(p => {
    if (filterHub !== 'ALL' && p.hub !== filterHub) return false;
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
        isLight
          ? isCashmere
            ? 'bg-[#faf8f5] border-amber-200/90 text-stone-900 shadow-amber-950/15'
            : 'bg-white border-slate-200 text-slate-800 shadow-blue-950/15'
          : 'bg-[#0b101e] border-cyan-500/30 text-slate-100 shadow-cyan-950/40'
      }`}>
        {/* Header Bar */}
        <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isLight
            ? isCashmere
              ? 'bg-[#f4efe5] border-amber-200/70'
              : 'bg-slate-50 border-slate-200'
            : 'bg-[#080d1a] border-cyan-900/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg border relative ${
              isLight
                ? isCashmere
                  ? 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-white border-amber-300'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-400'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white border-cyan-400'
            }`}>
              <Bot className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0b101e] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold tracking-tight font-mono flex items-center gap-2">
                  <span>ASTRA RAINMAKER AI</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {language === 'en' ? 'Autonomous Client Acquisition & Sales Agent' : 'خودکار کسٹمر فائنڈر اور سیلز ایجنٹ'}
                  </span>
                </h2>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {language === 'en' 
                  ? 'Finds institutional clients, pitches mathematical ROI, closes enterprise agreements, and autonomously fulfills all trading infrastructure.'
                  : 'ادارہ جاتی کلائنٹس تلاش کرتا ہے، پچ کرتا ہے، معاہدے بند کرتا ہے، اور سارا ٹریڈنگ سیٹ اپ خود بخود چالو کرتا ہے۔'}
              </p>
            </div>
          </div>

          {/* Top Controls: Autonomous Switch & Close */}
          <div className="flex items-center gap-2.5">
            {/* Auto Mode Switch */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsAutonomousHunting(!isAutonomousHunting);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all ${
                isAutonomousHunting
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                  : isLight ? 'bg-slate-100 text-slate-500 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAutonomousHunting ? <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isAutonomousHunting ? (language === 'en' ? 'Agent: AUTONOMOUS' : 'ایجنٹ: خودکار فعال') : (language === 'en' ? 'Agent: PAUSED' : 'ایجنٹ: موقوف')}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'hover:bg-slate-200 border-slate-300 text-slate-700' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Performance & Pipeline Ticker Bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b text-xs font-mono py-2.5 px-4 ${
          isLight
            ? isCashmere ? 'bg-amber-50/50 border-amber-200/60 divide-amber-200/60' : 'bg-slate-100/70 border-slate-200 divide-slate-200'
            : 'bg-[#080d19] border-cyan-950/60 divide-slate-800'
        }`}>
          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Active Pipeline ARR' : 'پائپ لائن ویلیو'}</span>
            <span className={`text-base font-bold ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
              ${totalPipelineValue.toLocaleString()}
            </span>
          </div>
          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Closed & Collected ARR' : 'وصول شدہ آمدن'}</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              +${totalClosedRevenue.toLocaleString()}
            </span>
          </div>
          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Client Slippage Identified' : 'کلائنٹس کا شناختی نقصان'}</span>
            <span className="text-base font-bold text-rose-500">
              ${(totalLossDetected / 1000000).toFixed(1)}M/yr
            </span>
          </div>
          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Autonomous Execution' : 'خودکار سروس'}</span>
            <span className="text-base font-bold text-amber-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              100% Zero-Touch
            </span>
          </div>
        </div>

        {/* Agent Commander Bar (Direct Natural Language Instruction to Agent) */}
        <div className={`p-3 border-b flex flex-col gap-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0c1322] border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span className="text-xs font-bold uppercase font-mono tracking-wider">
              {language === 'en' ? 'Direct Commander Directive to AI Sales Agent:' : 'سیلز ایجنٹ کو براہ راست حکم دیں:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userCommand}
              onChange={(e) => setUserCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendCommand();
              }}
              placeholder={language === 'en' 
                ? 'e.g. "Hunt Dubai family offices", "Close all pending deals now", "Pitch Citadel alpha desk"...' 
                : 'مثال: "دبئی کے فنڈز تلاش کرو"، "سب ڈیلز فوری کلوز کرو"، "نیویارک کے ہیج فنڈز کو پچ کرو"...'}
              className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono transition-colors focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-cyan-500/30'
              }`}
            />
            <button
              onClick={() => handleSendCommand()}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                isLight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Execute' : 'حکم دیں'}</span>
            </button>
          </div>

          {/* Quick Command Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400">{language === 'en' ? 'Quick Instructions:' : 'فوری احکامات:'}</span>
            <button
              onClick={() => handleSendCommand('hunt Dubai family offices')}
              className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
            >
              📍 {language === 'en' ? 'Hunt Dubai Funds' : 'دبئی فنڈز تلاش'}
            </button>
            <button
              onClick={() => handleSendCommand('close all pending deals now')}
              className="px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
            >
              ⚡ {language === 'en' ? 'Close All Deals (Auto-Sell)' : 'تمام معاہدے بند کرو'}
            </button>
            <button
              onClick={() => handleSendCommand('hunt London HFT market makers')}
              className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
            >
              🇬🇧 {language === 'en' ? 'London HFT Desks' : 'لندن مارکیٹ میکرز'}
            </button>
            <button
              onClick={() => handleSendCommand('give me an institutional status report')}
              className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
            >
              📊 {language === 'en' ? 'Status Report' : 'رپورٹ حاصل کرو'}
            </button>
          </div>

          {/* Agent Reply Notification */}
          {agentReply && (
            <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-start gap-2 animate-in fade-in ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200'
            }`}>
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{language === 'en' ? agentReply.en : agentReply.ur}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Body: 2 Columns (Left: Prospects Pipeline & Hubs, Right: Client Dossier & Live AI Dialogue) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-b overflow-hidden">
          {/* Left Column: Client Leads List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 h-[480px] lg:h-[530px] overflow-hidden">
            {/* Filter Bar */}
            <div className={`p-2.5 border-b flex flex-wrap items-center justify-between gap-1.5 text-xs ${
              isLight ? 'bg-slate-100/60' : 'bg-slate-900/60'
            }`}>
              {/* Hub Filters */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['ALL', 'Dubai', 'New York', 'London', 'Singapore', 'Zurich'].map((hub) => (
                  <button
                    key={hub}
                    onClick={() => {
                      soundManager.playClick();
                      setFilterHub(hub);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                      filterHub === hub
                        ? isLight ? 'bg-blue-600 text-white font-bold' : 'bg-cyan-500 text-slate-950 font-bold'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {hub}
                  </button>
                ))}
              </div>

              {/* Hunt Lead Action */}
              <button
                onClick={() => {
                  soundManager.playTierUp();
                  const newLead = generateNewProspect(filterHub !== 'ALL' ? (filterHub as GlobalHub) : undefined);
                  setProspects(prev => [newLead, ...prev]);
                  setSelectedProspectId(newLead.id);
                  setAgentLogs(l => [
                    {
                      text: `🎯 Manually triggered radar hunt: Discovered ${newLead.name} (${newLead.aum} AUM).`,
                      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                      type: 'LEAD'
                    },
                    ...l
                  ]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-blue-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300'
                }`}
                title="Hunt new client lead"
              >
                <Search className="w-3 h-3" />
                <span>+ Hunt</span>
              </button>
            </div>

            {/* Prospects Scrollable List */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y p-2 pb-16 space-y-2 overscroll-contain">
              {filteredProspects.map((p) => {
                const isSelected = p.id === selectedProspectId;
                const isClosed = p.status === 'CLOSED_WON' || p.status === 'FULFILLED';
                const statusBadgeColor =
                  p.status === 'FULFILLED'
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30'
                    : p.status === 'CLOSED_WON'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 font-bold'
                    : p.status === 'NEGOTIATING'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30'
                    : p.status === 'PITCHING'
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30'
                    : 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30';

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedProspectId(p.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                          : 'bg-cyan-950/30 border-cyan-500/60 shadow-md'
                        : isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-200'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs font-mono">{p.name}</h4>
                          <span className="text-[10px] text-slate-400">({p.hub})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {p.decisionMaker} · <strong className="text-emerald-600 dark:text-emerald-400">{p.aum} AUM</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-mono font-bold ${statusBadgeColor}`}>
                          {p.status}
                        </span>
                        <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                          ${p.dealValueUsd.toLocaleString()}/yr
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      ⚠️ {language === 'en' ? p.painPoint : p.painPointUrdu}
                    </div>

                    {/* Quick Action row */}
                    <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        Score: <strong className="text-cyan-500">{p.leadScore}/100</strong> | ROI: <strong className="text-emerald-500">{p.projectedClientRoiX}x</strong>
                      </span>

                      {!isClosed ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceSingleProspect(p);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                              isLight ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300' : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40'
                            }`}
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstantCloseAndFulfill(p);
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-black border bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-emerald-400"
                          >
                            ⚡ Auto-Close
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.status === 'FULFILLED' ? 'Work Auto-Fulfilled' : 'Signed & Paid'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Client Deep-Dive, AI Sales Dialogue & Autonomous Fulfillment (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 h-[480px] lg:h-[530px] overflow-y-auto p-4 pb-12 space-y-3.5">
            {/* Client Intelligence Card */}
            <div className={`p-4 pt-5 rounded-xl border relative overflow-visible ${
              isLight
                ? isCashmere ? 'bg-white border-amber-200' : 'bg-white border-slate-200'
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-mono leading-normal pt-0.5">{selectedProspect.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded border font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30">
                      {selectedProspect.hub}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Decision Maker: <strong className="text-slate-800 dark:text-slate-200">{selectedProspect.decisionMaker}</strong> ({selectedProspect.decisionMakerTitle})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">{language === 'en' ? 'Annual SaaS License' : 'سالانہ لائسنس فیس'}</div>
                  <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    ${selectedProspect.dealValueUsd.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> + {selectedProspect.performanceFeeBps} bps carry</span>
                  </div>
                </div>
              </div>

              {/* Detected Vulnerability & Projected ROI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                <div className={`p-2.5 rounded-lg border ${
                  isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                }`}>
                  <span className="font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    {language === 'en' ? 'Detected Execution Drag & Loss:' : 'شناخت شدہ سالانہ نقصان:'}
                  </span>
                  <p className="mt-1 text-[11px]">{language === 'en' ? selectedProspect.painPoint : selectedProspect.painPointUrdu}</p>
                  <p className="font-mono font-bold mt-1 text-rose-600 dark:text-rose-400">
                    -${selectedProspect.detectedAnnualLoss.toLocaleString()} / year
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                }`}>
                  <span className="font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    {language === 'en' ? 'Astra Sovereign Solution & ROI:' : 'آسٹرا ساورن کا حل اور منافع:'}
                  </span>
                  <p className="mt-1 text-[11px]">{selectedProspect.pitchHeadline}</p>
                  <p className="font-mono font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                    {selectedProspect.projectedClientRoiX}x Projected ROI (Save ~${(selectedProspect.detectedAnnualLoss * 0.92).toLocaleString()}/yr)
                  </p>
                </div>
              </div>

              {/* Action Buttons for this Prospect */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
                {selectedProspect.status !== 'FULFILLED' && selectedProspect.status !== 'CLOSED_WON' ? (
                  <>
                    <button
                      onClick={() => handleAdvanceSingleProspect(selectedProspect)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Dispatch AI Pitch & Negotiate' : 'پچ بھیجو اور بات چیت کرو'}</span>
                    </button>
                    <button
                      onClick={() => handleInstantCloseAndFulfill(selectedProspect)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Instant Close & Auto-Fulfill ($)' : 'فوری معاہدہ اور خودکار تکمیل'}</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'en' ? 'Agreement Executed & Non-Custodial Vault Provisioned' : 'معاہدہ مکمل ہو چکا ہے اور ٹریڈنگ خودکار چل رہی ہے'}</span>
                  </div>
                )}

                <button
                  onClick={() => setViewingDossier(!viewingDossier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ml-auto ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  <span>{viewingDossier ? 'Hide Dossier' : 'View Alpha Dossier'}</span>
                </button>
              </div>
            </div>

            {/* Confidential Dossier View (if toggled) */}
            {viewingDossier && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 animate-in fade-in ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-950 border-cyan-800/50 text-slate-200'
              }`}>
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{generatePitchDossier(selectedProspect).headline}</span>
                </h4>
                <p className="text-slate-400">{generatePitchDossier(selectedProspect).executiveSummary}</p>
                <div className="p-2.5 rounded-lg bg-black/20 border border-slate-700/50">
                  <span className="text-slate-400 block mb-1">Confidential Outreach Draft Dispatched:</span>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300">
                    {generatePitchDossier(selectedProspect).pitchEmailDraft}
                  </pre>
                </div>
              </div>
            )}

            {/* Autonomous Fulfillment Card: "Sub kaam khud kary" */}
            {(selectedProspect.status === 'CLOSED_WON' || selectedProspect.status === 'FULFILLED') && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-700/40 text-emerald-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h4 className="font-bold text-xs uppercase font-mono tracking-wider">
                      {language === 'en' ? 'Autonomous Client Work Fulfillment Engine' : 'کلائنٹ کے لیے خودکار سروس اور ٹریڈنگ تکمیل'}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black uppercase font-mono">
                    Zero Human Intervention
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {language === 'en'
                    ? 'The AI Agent automatically provisioned the client’s dedicated sub-account, configured low-latency Equinix fiber routing, and deployed 24 autonomous HFT bots executing trades on their behalf.'
                    : 'ایجنٹ نے کلائنٹ کے لیے تمام ٹیکنیکل کام مکمل کر دیا: نجی اے پی آئی کیز بنا کر، فائبر نوڈ سے جوڑ کر، 24 خودکار ٹریڈنگ بوٹس چالو کر دیے ہیں۔'}
                </p>

                {selectedProspect.fulfillmentData && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-black/10 dark:bg-black/30 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Generated API Key:</span>
                        <code className="text-xs font-bold text-cyan-400">{selectedProspect.fulfillmentData.apiKey}</code>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedProspect.fulfillmentData!.apiKey);
                          setCopiedKey(selectedProspect.fulfillmentData!.apiKey);
                          setTimeout(() => setCopiedKey(null), 2000);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Copy Key"
                      >
                        {copiedKey === selectedProspect.fulfillmentData.apiKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2 rounded bg-black/10 dark:bg-black/30 border border-emerald-500/30">
                      <span className="text-[10px] text-slate-400 block">Co-Located Fiber Node:</span>
                      <strong className="text-emerald-400">{selectedProspect.fulfillmentData.dedicatedFiberNode}</strong>
                    </div>

                    <div className="p-2 rounded bg-black/10 dark:bg-black/30 border border-emerald-500/30">
                      <span className="text-[10px] text-slate-400 block">Allocated Autonomous Bots:</span>
                      <strong className="text-amber-400">{selectedProspect.fulfillmentData.allocatedBots} Active HFT Arbitrageurs</strong>
                    </div>

                    <div className="p-2 rounded bg-black/10 dark:bg-black/30 border border-emerald-500/30">
                      <span className="text-[10px] text-slate-400 block">Daily P&L Generated for Client:</span>
                      <strong className="text-emerald-400">+${selectedProspect.fulfillmentData.dailyPnlGenerated.toLocaleString()} USD</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live AI Sales Dialogue / Negotiation Transcript */}
            <div className={`p-4 rounded-xl border flex-1 space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Bot className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <h4 className="font-bold text-xs uppercase font-mono">
                    {language === 'en' ? 'Live AI Sales Negotiation Transcript' : 'ایجنٹ اور کلائنٹ کے درمیان براہ راست بات چیت'}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedProspect.negotiationHistory.length} messages
                </span>
              </div>

              {selectedProspect.negotiationHistory.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 font-mono">
                  {language === 'en' 
                    ? 'No negotiation started yet. Click "Dispatch AI Pitch & Negotiate" to initiate autonomous sales outreach.'
                    : 'ابھی بات چیت شروع نہیں ہوئی۔ پچ بھیجنے کے لیے اوپر والے بٹن پر کلک کریں۔'}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 pb-3">
                  {selectedProspect.negotiationHistory.map((msg, idx) => {
                    const isAgent = msg.speaker === 'AI_AGENT';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] p-2.5 rounded-xl text-xs font-mono ${
                          isAgent
                            ? isLight
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-cyan-600 text-slate-950 font-medium rounded-br-none'
                            : isLight
                            ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                        }`}>
                          <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-1 font-bold">
                            <span>{isAgent ? '🤖 ASTRA RAINMAKER AI' : `👤 ${selectedProspect.decisionMaker}`}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p>{language === 'en' ? msg.message : (msg.messageUrdu || msg.message)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Live Real-Time Agent Stream Logs */}
        <div className={`relative z-10 p-2.5 border-t flex items-center justify-between gap-3 text-xs font-mono overflow-x-auto shadow-xs ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#060a14] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 shrink-0">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-bold text-[11px] text-slate-400 uppercase">Live Agent Stream:</span>
          </div>

          <div className="flex-1 truncate text-[11px]">
            {agentLogs[0]?.text || 'Autonomous radar online.'}
          </div>

          <div className="shrink-0 text-slate-400 text-[10px]">
            Active Capital Desks: <strong className="text-cyan-400">{prospects.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

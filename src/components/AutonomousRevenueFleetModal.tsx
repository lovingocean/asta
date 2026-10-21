import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Send,
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Globe,
  Coins,
  Cpu,
  Radio,
  FileCode,
  Building2,
  Check
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import {
  RevenueFleetState,
  FleetAgentInfo,
  createInitialFleetState,
  executeFleetAutonomousCycle,
  triggerMillionDollarBlitz,
  processFleetCommand
} from '../utils/autonomousRevenueFleet';

interface AutonomousRevenueFleetModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
  onAddTreasuryRevenue?: (amountUsd: number, description: string) => void;
}

export const AutonomousRevenueFleetModal: React.FC<AutonomousRevenueFleetModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  onAddTreasuryRevenue
}) => {
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  // Fleet state
  const [fleetState, setFleetState] = useState<RevenueFleetState>(createInitialFleetState);
  const [activeTab, setActiveTab] = useState<'AGENTS' | 'VAULT' | 'STRATEGIES' | 'BROKERS'>('AGENTS');
  const [isAutoFleetRunning, setIsAutoFleetRunning] = useState<boolean>(true);
  const [userFleetCommand, setUserFleetCommand] = useState<string>('');
  const [fleetReply, setFleetReply] = useState<{ en: string; ur: string } | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-rainmaker');
  const [copiedStratId, setCopiedStratId] = useState<string | null>(null);

  // Background autonomous cycle loop (every 5 seconds)
  useEffect(() => {
    if (!isAutoFleetRunning || !isOpen) return;

    const timer = setInterval(() => {
      setFleetState(prev => {
        const cycle = executeFleetAutonomousCycle(prev);
        if (cycle.newRevenueUsd > 0 && onAddTreasuryRevenue) {
          onAddTreasuryRevenue(cycle.newRevenueUsd, cycle.featuredLogText);
          soundManager.playOrderFilled();
        }
        return cycle.nextState;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [isAutoFleetRunning, isOpen, onAddTreasuryRevenue]);

  // 1-Click Million Dollar Sales Blitz
  const handleRunMillionDollarBlitz = () => {
    soundManager.playApexMilestone();
    const blitz = triggerMillionDollarBlitz(fleetState);
    setFleetState(blitz.nextState);
    setFleetReply({ en: blitz.summaryEn, ur: blitz.summaryUr });

    if (onAddTreasuryRevenue) {
      onAddTreasuryRevenue(blitz.blitzRevenueGenerated, `MILLION-DOLLAR SALES BLITZ: ${blitz.dealsCount} Institutional Deals Closed`);
    }
  };

  // Direct Commander Execution
  const handleExecuteFleetCommand = (customCmd?: string) => {
    const cmd = (customCmd || userFleetCommand).trim();
    if (!cmd) return;

    soundManager.playClick();
    const result = processFleetCommand(cmd, fleetState);
    setFleetState(result.nextState);
    setFleetReply({ en: result.replyMessage, ur: result.replyMessageUrdu });
    setUserFleetCommand('');

    if (result.revenueGained > 0) {
      soundManager.playApexMilestone();
      if (onAddTreasuryRevenue) {
        onAddTreasuryRevenue(result.revenueGained, `Fleet Directive Closed Revenue: ${cmd}`);
      }
    } else {
      soundManager.playTierUp();
    }
  };

  // Harvest Vault Carry
  const handleHarvestVaultCarry = () => {
    soundManager.playApexMilestone();
    const result = processFleetCommand('harvest all vault fees now', fleetState);
    setFleetState(result.nextState);
    setFleetReply({ en: result.replyMessage, ur: result.replyMessageUrdu });

    if (result.revenueGained > 0 && onAddTreasuryRevenue) {
      onAddTreasuryRevenue(result.revenueGained, 'Harvested 20% Vault LP Performance Carry');
    }
  };

  if (!isOpen) return null;

  const targetArr = fleetState.targetAnnualRunRate;
  const currentTotal = fleetState.totalRevenueCollected;
  const progressTo10M = Math.min(100, Math.round((currentTotal / targetArr) * 100));
  const selectedAgent = fleetState.agents.find(a => a.id === selectedAgentId) || fleetState.agents[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-6xl h-[90vh] max-h-[820px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
        isLight
          ? isCashmere
            ? 'bg-[#faf8f5] border-amber-200/90 text-stone-900 shadow-amber-950/20'
            : 'bg-white border-slate-200 text-slate-800 shadow-blue-950/20'
          : 'bg-[#090e1a] border-cyan-500/30 text-slate-100 shadow-cyan-950/40'
      }`}>
        {/* Top Header Bar */}
        <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-2.5 ${
          isLight
            ? isCashmere
              ? 'bg-[#f4efe5] border-amber-200/70'
              : 'bg-slate-50 border-slate-200'
            : 'bg-[#060a14] border-cyan-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg border relative ${
              isLight
                ? isCashmere
                  ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 border-amber-300'
                  : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white border-blue-400'
                : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 border-cyan-400 font-black'
            }`}>
              <Coins className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#090e1a] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold tracking-tight font-mono flex items-center gap-2">
                  <span>ASTRA REVENUE FLEET</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black'
                  }`}>
                    {language === 'en' ? 'Autonomous Multi-Million $ Sales Machine' : 'خودکار کروڑوں ڈالر سیلز مشین'}
                  </span>
                </h2>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {language === 'en'
                  ? '5 autonomous AI agents working in synergy: Closing SaaS, accumulating 20% LP carry, licensing alpha strategies, & syndicating prime brokers.'
                  : 'پانچ خودکار ایجنٹس کی مشترکہ فلیٹ جو خود بخود معاہدے کرتی ہے، 20 فیصد کیری کماتی ہے، اور کروڑوں ڈالر کا ریونیو لاتی ہے۔'}
              </p>
            </div>
          </div>

          {/* Top Actions: Blitz, Auto Toggle & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunMillionDollarBlitz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md hover:brightness-110 transition-all border border-amber-300"
              title="Force-trigger simultaneous sales across all 5 agents"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{language === 'en' ? '⚡ $1M Sales Blitz' : '⚡ 10 لاکھ ڈالر مہم'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsAutoFleetRunning(!isAutoFleetRunning);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono uppercase border transition-all ${
                isAutoFleetRunning
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAutoFleetRunning ? <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isAutoFleetRunning ? 'SWARM: ACTIVE' : 'PAUSED'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'hover:bg-slate-200 border-slate-300 text-slate-700' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-Million Dollar KPI Metrics Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b text-xs font-mono py-1.5 px-4 ${
          isLight
            ? isCashmere ? 'bg-amber-50/60 border-amber-200/60 divide-amber-200/60' : 'bg-slate-100/70 border-slate-200 divide-slate-200'
            : 'bg-[#070b16] border-slate-800 divide-slate-800'
        }`}>
          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Total Automated Revenue' : 'کل خودکار ریونیو'}</span>
            <span className={`text-base md:text-lg font-black ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
              ${currentTotal.toLocaleString()}
            </span>
          </div>

          <div className="px-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? '$10M ARR Run Rate' : '$10M ہدف کی رفتار'}</span>
              <span className="text-[10px] font-bold text-amber-500">{progressTo10M}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progressTo10M}%` }} 
              />
            </div>
          </div>

          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Sovereign Vault LP AUM' : 'والٹ میں ادارہ جاتی سرمایہ'}</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              ${(fleetState.sovereignVault.totalAumUsd / 1000000).toFixed(1)}M
              <span className="text-[10px] text-slate-500 font-normal"> (2/20 Fee)</span>
            </span>
          </div>

          <div className="px-2">
            <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Fleet Automation Status' : 'ایجنٹس کی خودکار رفتار'}</span>
            <span className="text-base font-bold text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              100% Autonomous Swarm
            </span>
          </div>
        </div>

        {/* Commander Prompt Bar */}
        <div className={`p-2.5 border-b flex flex-col gap-1.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b101e] border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <Bot className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span className="text-xs font-bold uppercase font-mono tracking-wider">
              {language === 'en' ? 'Direct Commander Directive to Multi-Agent Swarm:' : 'تمام ایجنٹس کو براہ راست حکم دیں:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userFleetCommand}
              onChange={(e) => setUserFleetCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteFleetCommand();
              }}
              placeholder={language === 'en' 
                ? 'e.g. "Generate 1 million dollars now", "Harvest all vault fees", "Sell alpha strategies to London desks"...' 
                : 'مثال: "دس لاکھ ڈالر کماؤ"، "والٹ سے تمام کیری فیس نکالو"، "لندن کے فنڈز کو سٹریٹیجی بیچو"...'}
              className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono transition-colors focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-cyan-500/30'
              }`}
            />
            <button
              onClick={() => handleExecuteFleetCommand()}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                isLight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-cyan-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Deploy' : 'حکم دیں'}</span>
            </button>
          </div>

          {/* Quick Directive Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400">{language === 'en' ? 'Quick Commands:' : 'فوری احکامات:'}</span>
            <button
              onClick={() => handleExecuteFleetCommand('generate 1 million dollars in sales')}
              className="px-2 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
            >
              💰 {language === 'en' ? 'Generate $1M in Sales' : '10 لاکھ ڈالر کماؤ'}
            </button>
            <button
              onClick={handleHarvestVaultCarry}
              className="px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold"
            >
              💎 {language === 'en' ? 'Harvest Vault Carry ($184k)' : 'والٹ کیری فیس وصول'}
            </button>
            <button
              onClick={() => handleExecuteFleetCommand('sell exclusive alpha strategy')}
              className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
            >
              ⚡ {language === 'en' ? 'Sell Exclusive Alpha Strategy' : 'سٹریٹیجی لائسنس بیچو'}
            </button>
            <button
              onClick={() => handleExecuteFleetCommand('recruit 5 new prime brokers')}
              className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
            >
              🌐 {language === 'en' ? 'Onboard Prime Brokers' : 'نئے پرائم بروکرز جوڑو'}
            </button>
          </div>

          {/* Swarm Reply Banner */}
          {fleetReply && (
            <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-start gap-2 animate-in fade-in ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200'
            }`}>
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{language === 'en' ? fleetReply.en : fleetReply.ur}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation: Agents Swarm | Sovereign Vault | Alpha Strategies | Prime Brokers */}
        <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold shrink-0 ${
          isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/70 border-slate-800'
        }`}>
          <button
            onClick={() => setActiveTab('AGENTS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'AGENTS'
                ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '5-Agent Revenue Swarm' : '5 خودکار ایجنٹس'}</span>
            <span className={`text-[10px] px-1 rounded ${activeTab === 'AGENTS' ? 'bg-black/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'}`}>5</span>
          </button>

          <button
            onClick={() => setActiveTab('VAULT')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'VAULT'
                ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '$48.5M Sovereign Vault (2/20)' : '$48.5M ساورن والٹ'}</span>
          </button>

          <button
            onClick={() => setActiveTab('STRATEGIES')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'STRATEGIES'
                ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Alpha Strategy NFT Licenses' : 'سٹریٹیجی لائسنسنگ'}</span>
            <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
              ${(fleetState.synthesizedStrategies.reduce((acc, s) => acc + s.exclusiveLicenseFeeUsd, 0) / 1000).toFixed(0)}k
            </span>
          </button>

          <button
            onClick={() => setActiveTab('BROKERS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'BROKERS'
                ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Prime Broker Syndicates' : 'پرائم بروکر نیٹ ورک'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-20 space-y-4">
          {/* TAB 1: 5-AGENT REVENUE SWARM */}
          {activeTab === 'AGENTS' && (
            <div className="space-y-4 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {fleetState.agents.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  const isWide = agent.role === 'TREASURY_SETTLER';
                  return (
                    <div
                      key={agent.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedAgentId(agent.id);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${isWide ? 'lg:col-span-2' : ''} ${
                        isSelected
                          ? isLight
                            ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                            : 'bg-cyan-950/30 border-cyan-500/60 shadow-md'
                          : isLight
                          ? 'bg-white hover:bg-slate-50 border-slate-200'
                          : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                            agent.role === 'RAINMAKER_ENTERPRISE'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-400'
                              : agent.role === 'VAULT_LIQUIDITY_LP'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-400'
                              : agent.role === 'BROKER_SYNDICATE'
                              ? 'bg-purple-500/10 text-purple-600 border-purple-400'
                              : agent.role === 'QUANT_STRATEGY_SYNTHESIZER'
                              ? 'bg-amber-500/10 text-amber-600 border-amber-400'
                              : 'bg-cyan-500/10 text-cyan-600 border-cyan-400'
                          }`}>
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs font-mono">{agent.name}</h4>
                            <p className="text-[10px] text-slate-400">{agent.title}</p>
                          </div>
                        </div>

                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {agent.status}
                        </span>
                      </div>

                      {/* Revenue Generated */}
                      <div className="mt-2 pt-1.5 border-t flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 text-[10px]">Revenue Generated:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                          +${agent.revenueGeneratedTotal.toLocaleString()}
                        </strong>
                      </div>

                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug break-words">
                        🎯 {agent.currentObjective}
                      </div>

                      <div className="mt-1.5 text-[10px] p-1.5 rounded bg-black/5 dark:bg-black/25 text-slate-600 dark:text-slate-300 leading-tight">
                        ⚡ {language === 'en' ? agent.lastActionSummary : agent.lastActionSummaryUrdu}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Agent Deep Dive & Manual Action Dispatcher */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Bot className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                    <div>
                      <h4 className="font-bold text-sm font-mono">{selectedAgent.name}</h4>
                      <p className="text-xs text-slate-500">{selectedAgent.specialty}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Generated</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      +${selectedAgent.revenueGeneratedTotal.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Active Target:</span>
                    <p className="font-mono mt-0.5">{selectedAgent.currentObjective}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Latest Autonomous Fulfillment:</span>
                    <p className="font-mono mt-0.5 text-emerald-600 dark:text-emerald-400">
                      {language === 'en' ? selectedAgent.lastActionSummary : selectedAgent.lastActionSummaryUrdu}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-mono">
                    Contracts Managed: <strong className="text-cyan-400">{selectedAgent.activeContractsCount} active institutional accounts</strong>
                  </span>

                  <button
                    onClick={() => {
                      soundManager.playOrderFilled();
                      const cycle = executeFleetAutonomousCycle(fleetState);
                      setFleetState(cycle.nextState);
                      if (cycle.newRevenueUsd > 0 && onAddTreasuryRevenue) {
                        onAddTreasuryRevenue(cycle.newRevenueUsd, `Triggered ${selectedAgent.name} action`);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                      isLight
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-cyan-500/20'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Trigger Agent Action Now' : 'ایجنٹ کو فوراً چلائیں'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOVEREIGN LIQUIDITY VAULT (2% Mgmt + 20% Performance Carry) */}
          {activeTab === 'VAULT' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-bold text-base font-mono">{fleetState.sovereignVault.vaultName}</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Non-custodial algorithmic capital pool compounding LP funds through Kelly-optimal Dark Pool Arbitrage.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Total LP Capital Pool</span>
                    <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ${fleetState.sovereignVault.totalAumUsd.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">Management Fee (Annual):</span>
                    <strong className="text-base text-blue-600 dark:text-cyan-400">2.0% (200 bps)</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">Performance Carry Fee:</span>
                    <strong className="text-base text-amber-500">20.0% (2000 bps)</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">Total Profit Generated for LPs:</span>
                    <strong className="text-base text-emerald-500">+${fleetState.sovereignVault.highWaterMarkProfit.toLocaleString()}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">Pending Unclaimed Carry:</span>
                    <strong className="text-base text-cyan-400">+${fleetState.sovereignVault.pendingUnclaimedCarryUsd.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    Backing Investors: <strong>{fleetState.sovereignVault.activeLpInvestorsCount} Institutional LPs</strong> (Dubai, Zurich, London, Singapore)
                  </span>

                  <button
                    onClick={handleHarvestVaultCarry}
                    className="px-4 py-2 rounded-xl text-xs font-black font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-md flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Harvest +${fleetState.sovereignVault.pendingUnclaimedCarryUsd.toLocaleString()} Carry to Treasury</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPRIETARY QUANT STRATEGY NFT LICENSES */}
          {activeTab === 'STRATEGIES' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>The Alpha Synthesizer autonomously designs, backtests, and packages algorithmic code into $50k-$100k exclusive licenses:</span>
                <span className="font-mono text-cyan-400 font-bold">4 Synthesized Modules</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fleetState.synthesizedStrategies.map((strat) => (
                  <div
                    key={strat.id}
                    className={`p-3.5 rounded-xl border space-y-2 font-mono text-xs ${
                      strat.status === 'LICENSED_SOLD'
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs">{strat.title}</h4>
                        <span className="text-[10px] text-slate-400 uppercase">{strat.type}</span>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${
                        strat.status === 'LICENSED_SOLD'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                      }`}>
                        {strat.status === 'LICENSED_SOLD' ? 'SOLD & LICENSED' : 'READY TO LICENSE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200 dark:border-slate-800 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block">Sharpe Ratio:</span>
                        <strong className="text-emerald-500">{strat.backtestedSharpe}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Max Drawdown:</span>
                        <strong className="text-cyan-400">{strat.maxDrawdownPct}%</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">License Fee:</span>
                        <strong className="text-amber-500 font-bold">${strat.exclusiveLicenseFeeUsd.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        {strat.buyerName ? `Licensed to: ${strat.buyerName}` : 'Available for Exclusive Licensing'}
                      </span>

                      {strat.status !== 'LICENSED_SOLD' ? (
                        <button
                          onClick={() => {
                            soundManager.playApexMilestone();
                            const cycle = executeFleetAutonomousCycle(fleetState);
                            setFleetState(cycle.nextState);
                            if (cycle.newRevenueUsd > 0 && onAddTreasuryRevenue) {
                              onAddTreasuryRevenue(cycle.newRevenueUsd, `Sold Strategy: ${strat.title}`);
                            }
                          }}
                          className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs"
                        >
                          Sell License ➔
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Settled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRIME BROKER SYNDICATE */}
          {activeTab === 'BROKERS' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Institutional brokers in Wall Street, London, and Dubai drive deal flow on a 15% recurring revenue split:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {fleetState.brokerSyndicate.map((broker) => (
                  <div
                    key={broker.id}
                    className={`p-3.5 rounded-xl border space-y-2 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                        {broker.location}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold">15% Split</span>
                    </div>

                    <h4 className="font-bold text-xs">{broker.firmName}</h4>
                    <p className="text-[10px] text-slate-400 uppercase">{broker.brokerType}</p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Referred Capital:</span>
                        <strong className="text-emerald-500">${(broker.referredCapitalUsd / 1000000).toFixed(1)}M</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Closed Funds:</span>
                        <strong className="text-cyan-400">{broker.closedDealsCount} Funds</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Swarm Streaming Footer */}
        <div className={`relative z-10 p-2.5 border-t flex items-center justify-between gap-3 text-xs font-mono overflow-x-auto shadow-xs ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#060a14] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 shrink-0">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-bold text-[11px] text-slate-400 uppercase">Live Revenue Swarm:</span>
          </div>

          <div className="flex-1 truncate text-[11px]">
            {fleetState.recentFleetLogs[0]?.actionText || 'Autonomous revenue swarm active.'}
          </div>

          <div className="shrink-0 text-slate-400 text-[10px]">
            Settled Run Rate: <strong className="text-emerald-400">${(fleetState.totalRevenueCollected / 1000000).toFixed(2)}M</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Languages, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Award,
  Sun,
  Moon,
  Feather,
  Palette,
  HelpCircle,
  Building2,
  Layers,
  Terminal,
  ShieldAlert,
  AlertOctagon,
  Lock,
  Bot,
  Coins
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  balance: number;
  initialBalance: number;
  targetBalance: number;
  targetMode: '10K' | '10M';
  onToggleTargetMode: (mode: '10K' | '10M') => void;
  isAutoPilotRunning: boolean;
  onToggleAutoPilot: () => void;
  onResetBalance: () => void;
  onOpenProofModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: 'en' | 'ur';
  onToggleLanguage: () => void;
  theme: 'light' | 'cashmere' | 'dark';
  onToggleTheme: (newTheme?: 'light' | 'cashmere' | 'dark') => void;
  saasTier?: 'COMMUNITY' | 'PRO_QUANT' | 'SOVEREIGN_MM';
  clientName?: string;
  gatewayMode?: 'SIMULATED' | 'LIVE_EXCHANGE';
  onOpenEnterpriseModal?: () => void;
  onOpenQuantSuite?: () => void;
  onOpenGatewayModal?: () => void;
  onOpenKillSwitch?: () => void;
  onOpenSalesAgent?: () => void;
  onOpenRevenueFleet?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  initialBalance,
  targetBalance,
  targetMode,
  onToggleTargetMode,
  isAutoPilotRunning,
  onToggleAutoPilot,
  onResetBalance,
  onOpenProofModal,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  saasTier = 'PRO_QUANT',
  clientName = 'Hudson River Trading Desk IV',
  gatewayMode = 'SIMULATED',
  onOpenEnterpriseModal,
  onOpenQuantSuite,
  onOpenGatewayModal,
  onOpenKillSwitch,
  onOpenSalesAgent,
  onOpenRevenueFleet,
}) => {
  const currentMultiplier = (balance / initialBalance).toFixed(1);
  const isTargetAchieved = balance >= targetBalance;
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  const tierBadgeColor = 
    saasTier === 'SOVEREIGN_MM'
      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 font-black'
      : saasTier === 'PRO_QUANT'
      ? isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      : isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <header className={`border-b sticky top-0 z-40 transition-colors backdrop-blur-md ${
      isLight 
        ? isCashmere 
          ? 'bg-[#faf8f5]/95 border-amber-200/80 shadow-xs'
          : 'bg-white/95 border-slate-200/90 shadow-xs' 
        : 'bg-[#0b101d]/95 border-cyan-900/30 shadow-xl'
    }`}>
      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & System Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl shadow-md border ${
              isLight 
                ? isCashmere
                  ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-amber-300 shadow-amber-500/10'
                  : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 border-blue-400/30 shadow-blue-500/15' 
                : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 border-cyan-400/30 shadow-cyan-500/20'
            }`}>
              <Cpu className="w-5 h-5 text-white animate-pulse-subtle" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 ${
                isLight ? 'border-white' : 'border-[#0b101d]'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-bold text-lg tracking-wider flex items-center gap-1.5 font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  ASTRA<span className={isLight ? (isCashmere ? 'text-amber-700' : 'text-blue-600') : 'text-cyan-400'}>QUANT</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-sans uppercase font-bold ${
                    isLight 
                      ? isCashmere
                        ? 'bg-amber-100/70 text-amber-900 border-amber-300'
                        : 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                  }`}>
                    {theme === 'light' ? '💎 Pearl Frost' : theme === 'cashmere' ? '🌅 Cashmere Titanium' : '🌌 Cyber Dark'}
                  </span>
                </h1>
              </div>
              <p className={`text-xs font-mono flex items-center gap-1.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {language === 'en' 
                  ? (targetMode === '10M' ? '1,000,000x Sovereign Engine ($10 → $10M)' : 'Algorithmic 1,000x Target ($10 → $10,000)')
                  : (targetMode === '10M' ? 'دس لاکھ گنا میگا سسٹم ($10 ← $10M)' : '1,000 گنا ہدف سسٹم ($10 ← $10,000)')}
              </p>
            </div>
          </div>

          {/* Quick Actions on Mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleTheme();
              }}
              className={`p-2 rounded-lg border ${
                isLight 
                  ? 'bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
              }`}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-blue-600" /> : theme === 'cashmere' ? <Feather className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className={`p-2 rounded-lg border ${
                isLight 
                  ? 'bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleLanguage();
              }}
              className={`px-2 py-1 text-xs rounded-lg border font-bold font-mono ${
                isLight 
                  ? 'bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
              }`}
            >
              {language === 'en' ? 'URDU' : 'EN'}
            </button>
          </div>
        </div>

        {/* Live Capital & Multiplier Readout */}
        <div className={`flex items-center gap-3 rounded-xl px-4 py-2 w-full md:w-auto justify-around md:justify-start border shadow-xs ${
          isLight 
            ? isCashmere
              ? 'bg-[#f5f2eb] border-amber-200/90'
              : 'bg-slate-50 border-slate-200/90' 
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="text-left">
            <div className={`text-[11px] uppercase font-mono tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <span>{language === 'en' ? 'Astra Portfolio Balance' : 'موجودہ بیلنس'}</span>
            </div>
            <div className={`text-xl md:text-2xl font-extrabold font-mono tracking-tight flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span className={isTargetAchieved ? 'text-amber-500 font-black' : isLight ? 'text-emerald-700' : 'text-emerald-400'}>
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {currentMultiplier}x
              </span>
            </div>
          </div>

          <div className={`h-8 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          <div className="text-left">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[11px] uppercase font-mono tracking-wider ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {language === 'en' ? 'Target Apex' : 'حتمی ہدف'}
              </span>
              <div className={`flex items-center rounded-md p-0.5 border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onToggleTargetMode('10K');
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    targetMode === '10K'
                      ? (isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs')
                      : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')
                  }`}
                  title="1,000x Target ($10,000)"
                >
                  1,000x
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onToggleTargetMode('10M');
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    targetMode === '10M'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-xs'
                      : (isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300')
                  }`}
                  title="1,000,000x Sovereign Target ($10,000,000)"
                >
                  1,000,000x
                </button>
              </div>
            </div>
            <div className={`text-lg md:text-xl font-bold font-mono flex items-center gap-1.5 ${
              targetMode === '10M' 
                ? 'text-amber-600 font-extrabold' 
                : (isLight ? 'text-blue-700' : 'text-cyan-300')
            }`}>
              <span>${targetBalance.toLocaleString()}</span>
              {isTargetAchieved && (
                <Award className="w-4 h-4 text-amber-500 animate-bounce" />
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Mathematical Logic & Brain Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProofModal();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all shadow-xs ${
              isLight 
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' 
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-700/50 text-indigo-200'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline font-mono">
              {language === 'en' ? 'Astra Brain & Proof' : 'ریاضیاتی حکمت عملی (دماغ)'}
            </span>
          </button>

          {/* Auto-Pilot Trigger Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleAutoPilot();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isAutoPilotRunning
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-rose-900/30 animate-pulse'
                : isLight
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-blue-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-cyan-500/20'
            }`}
          >
            <Zap className={`w-4 h-4 ${isAutoPilotRunning ? 'fill-white' : ''}`} />
            <span>
              {isAutoPilotRunning
                ? language === 'en' ? 'Pause Auto-Pilot' : 'روکیں'
                : language === 'en' ? 'Astra Auto-Pilot' : 'آٹو پائلٹ چلائیں'}
            </span>
          </button>

          {/* Reset Balance Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onResetBalance();
            }}
            className={`p-2 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' 
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
            title={language === 'en' ? 'Reset to $10.00' : '$10 پر ری سیٹ کریں'}
            aria-label="Reset Balance to $10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme Selector (Unique Light Pearl / Cashmere / Dark) */}
          <div className="hidden md:flex items-center rounded-lg p-0.5 border bg-slate-100/90 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleTheme('light');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Astra Pearl Frost (Unique Clean Light Theme)"
            >
              <Sun className="w-3.5 h-3.5 text-blue-600" />
              <span>Pearl</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleTheme('cashmere');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                theme === 'cashmere'
                  ? 'bg-white text-amber-800 shadow-xs border border-amber-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Warm Cashmere Titanium (Soft Warm Light Theme)"
            >
              <Feather className="w-3.5 h-3.5 text-amber-600" />
              <span>Warm</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleTheme('dark');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs border border-slate-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cyber Obsidian (Midnight High-Tech Dark Theme)"
            >
              <Moon className="w-3.5 h-3.5 text-slate-400" />
              <span>Dark</span>
            </button>
          </div>

          {/* Sound & Lang */}
          <div className="hidden md:flex items-center gap-1.5 pl-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className={`p-2 rounded-lg border transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-blue-600' 
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-slate-400 hover:text-cyan-400'
              }`}
              aria-label="Toggle Sound"
              title={soundEnabled ? "Mute audio" : "Enable sound"}
            >
              {soundEnabled 
                ? <Volume2 className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} /> 
                : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleLanguage();
              }}
              className={`px-2.5 py-1.5 text-xs rounded-lg border font-mono font-bold transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-blue-600' 
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-slate-300 hover:text-cyan-400'
              }`}
              title="Toggle English / Urdu"
            >
              {language === 'en' ? 'URDU' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Institutional Enterprise Command Bar (Uncopyable Moat Features) */}
      <div className={`border-t py-1.5 px-4 text-xs font-mono transition-colors ${
        isLight
          ? isCashmere
            ? 'bg-[#f4efe5] border-amber-200/70 text-stone-700'
            : 'bg-slate-50 border-slate-200 text-slate-700'
          : 'bg-[#080d19] border-cyan-950/60 text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {/* Institutional Navigation Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Autonomous AI Rainmaker Agent (Finds & Sells to Clients) */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSalesAgent?.();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all shadow-xs ${
                isLight
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400 shadow-blue-500/15'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold border-cyan-400 shadow-cyan-500/25'
              }`}
              title="Autonomous AI Agent: Finds clients, pitches ROI, closes contracts, and fulfills work"
            >
              <Bot className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'en' ? 'AI Sales Agent' : 'سیلز ایجنٹ'}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-black uppercase flex items-center gap-0.5 ${
                isLight ? 'bg-white/20 text-white' : 'bg-slate-950 text-cyan-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AUTO
              </span>
            </button>

            {/* Multi-Million Dollar Autonomous Revenue Fleet Swarm */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenRevenueFleet?.();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-black transition-all shadow-xs ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-105 text-slate-950 border-amber-300 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-slate-950 border-amber-300 shadow-amber-500/30'
              }`}
              title="Autonomous Multi-Million Dollar Revenue Fleet (5 Agents, 2/20 Vaults, Broker Syndicate)"
            >
              <Coins className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'en' ? '$10M Revenue Fleet' : 'ریونیو فلیٹ'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/80 text-amber-300 font-mono font-black">
                $3.2M+
              </span>
            </button>

            {/* Enterprise SaaS & Licensing Modal Opener */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenEnterpriseModal?.();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all shadow-2xs ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
              <span>Enterprise SaaS</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono uppercase ${tierBadgeColor}`}>
                {saasTier === 'SOVEREIGN_MM' ? '👑 SOVEREIGN' : saasTier === 'PRO_QUANT' ? 'PRO $499' : 'COMMUNITY'}
              </span>
            </button>

            {/* Institutional Quant Suite (SOR & Anti-MEV) */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenQuantSuite?.();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all shadow-2xs ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span>SOR & Dark Pool Matrix</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Anti-MEV 100%
              </span>
            </button>

            {/* Live Gateway / SDK */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenGatewayModal?.();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all shadow-2xs ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
              }`}
            >
              <Terminal className={`w-3.5 h-3.5 ${isLight ? 'text-teal-600' : 'text-teal-400'}`} />
              <span>Live Gateway & SDK</span>
              <span className={`text-[10px] px-1 py-0.2 rounded border uppercase font-bold ${
                gatewayMode === 'LIVE_EXCHANGE'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
              }`}>
                {gatewayMode}
              </span>
            </button>
          </div>

          {/* Right: Risk Kill Switch & Direct Fiber Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden lg:inline text-[11px] text-slate-500">
              Equinix LD4: <strong className="text-emerald-600 dark:text-emerald-400">0.28ms</strong> | VaR 99.9%: <strong className="text-blue-600 dark:text-cyan-400">1.4%</strong>
            </span>

            {/* Emergency Risk Kill Switch */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenKillSwitch?.();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-wider transition-all"
              title="Immediate circuit breaker to hedge and liquidate all positions to USDC"
            >
              <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
              <span>Kill Switch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

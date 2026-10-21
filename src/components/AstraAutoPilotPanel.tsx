import React from 'react';
import { 
  Play, 
  Pause, 
  FastForward, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Bot, 
  Zap, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { getCurrentTier } from '../utils/quantEngine';

interface AstraAutoPilotPanelProps {
  balance: number;
  initialBalance: number;
  targetBalance: number;
  isAutoPilotRunning: boolean;
  onToggleAutoPilot: () => void;
  onExecuteNextStep: () => void;
  onRunInstant10K: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  selectedStrategy: string;
  onSelectStrategy: (strat: string) => void;
  autoLog: Array<{
    id: string;
    text: string;
    timestamp: string;
    type: 'WIN' | 'LOSS' | 'INFO' | 'TIER_UP';
  }>;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const AstraAutoPilotPanel: React.FC<AstraAutoPilotPanelProps> = ({
  balance,
  initialBalance,
  targetBalance,
  isAutoPilotRunning,
  onToggleAutoPilot,
  onExecuteNextStep,
  onRunInstant10K,
  speed,
  onChangeSpeed,
  selectedStrategy,
  onSelectStrategy,
  autoLog,
  language,
  theme = 'light',
}) => {
  const isMega = targetBalance >= 1000000;
  const currentTier = getCurrentTier(balance, targetBalance);
  const remainingUsd = Math.max(0, targetBalance - balance);
  const isFinished = balance >= targetBalance;
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  return (
    <div className={`rounded-2xl p-4 shadow-sm border transition-colors flex flex-col h-full font-mono ${
      isLight 
        ? isCashmere
          ? 'bg-[#fcfaf7] border-amber-200/80 shadow-stone-200/60'
          : 'bg-white/95 border-slate-200/90 shadow-slate-100'
        : 'bg-[#0b101d] border-cyan-900/40 shadow-xl'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-3 mb-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${
            isLight
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>{language === 'en' ? 'ASTRA QUANT BOT' : 'آسٹرا کوانٹ روبوٹ'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                isAutoPilotRunning 
                  ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
                  : (isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700')
              }`}>
                {isAutoPilotRunning ? 'AUTOPILOT ENGAGED' : 'READY'}
              </span>
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isMega
                ? (language === 'en' ? 'Sovereign 1,000,000x Hyper-Compounding' : '10 ڈالر سے 10,000,000 ڈالر میگا سٹریٹجی')
                : (language === 'en' ? 'Algorithmic 1000x Compounding Protocol' : '10 ڈالر سے 10,000 ڈالر خودکار سٹریٹجی')}
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          {[1, 5, 20].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                speed === s 
                  ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500 text-slate-950')
                  : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Target Milestone Status Card */}
      <div className={`rounded-xl p-3 mb-3 border ${
        isLight 
          ? 'bg-slate-50 border-slate-200/90' 
          : 'bg-slate-900/70 border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono mb-1">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
            {language === 'en' 
              ? (isMega ? 'Gap to $10,000,000 Apex:' : 'Gap to $10,000 Target:')
              : (isMega ? '$10,000,000 ہدف تک فاصلہ:' : '$10,000 ہدف تک فاصلہ:')}
          </span>
          <span className={`font-bold ${isMega ? 'text-amber-500' : (isLight ? 'text-blue-700' : 'text-cyan-400')}`}>
            ${remainingUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`flex items-center justify-between text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>{language === 'en' ? 'Active Matrix Focus:' : 'موجودہ فوکس:'}</span>
          <span className={isLight ? 'text-amber-700 font-bold' : 'text-amber-400 font-semibold'}>{currentTier.name.split(':')[0]}</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={onToggleAutoPilot}
          disabled={isFinished}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-md ${
            isFinished
              ? (isLight ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
              : isAutoPilotRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
              : isMega
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/30'
              : (isLight 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-blue-500/20' 
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/20')
          }`}
        >
          {isAutoPilotRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>{language === 'en' ? 'Pause Bot' : 'روکیں'}</span>
            </>
          ) : (
            <>
              <Play className={`w-4 h-4 ${isLight && !isMega ? 'fill-white' : 'fill-slate-950'}`} />
              <span>{language === 'en' ? 'Start Auto-Pilot' : 'آٹو پائلٹ چلائیں'}</span>
            </>
          )}
        </button>

        <button
          onClick={onExecuteNextStep}
          disabled={isAutoPilotRunning || isFinished}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed border ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 shadow-sm'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
          }`}
          title="Manually trigger the next algorithmic trade execution"
        >
          <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
          <span>{language === 'en' ? 'Step Trade (1x)' : 'اگلی ٹریڈ (سٹیپ)'}</span>
        </button>
      </div>

      {/* Fast Forward Full Backtested Run */}
      <div className="mb-3">
        <button
          onClick={onRunInstant10K}
          disabled={isFinished}
          className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold border flex items-center justify-center gap-2 transition-all shadow-sm ${
            isMega 
              ? (isLight 
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800' 
                : 'bg-amber-950/60 hover:bg-amber-900/60 border-amber-600/60 text-amber-300 shadow-md shadow-amber-950/40')
              : (isLight 
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' 
                : 'bg-indigo-950/60 hover:bg-indigo-900/60 border-indigo-700/60 text-indigo-300')
          }`}
        >
          <FastForward className={`w-4 h-4 ${isMega ? (isLight ? 'text-amber-600' : 'text-amber-400') : (isLight ? 'text-indigo-600' : 'text-indigo-400')}`} />
          <span>
            {isMega
              ? (language === 'en' ? 'Simulate 1,000,000x Mega Run ($10 → $10M)' : '10 لاکھ گنا سمولیشن فوراً چلائیں ($10 ← $10M)')
              : (language === 'en' ? 'Simulate 1000x Complete Run (Instant)' : 'مکمل 1000 گنا سمولیشن فوراً چلائیں')}
          </span>
        </button>
      </div>

      {/* Live AI Reasoning Console Log */}
      <div className="flex-1 flex flex-col min-h-[160px] max-h-[220px]">
        <div className={`flex items-center justify-between text-[11px] font-mono mb-1.5 ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span className="flex items-center gap-1 font-semibold">
            <Cpu className={`w-3 h-3 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span>{language === 'en' ? 'Astra Neural Live Decisions' : 'آسٹرا نیورل لائیو فیصلے'}</span>
          </span>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Real-time Quant Feed</span>
        </div>

        <div className={`flex-1 rounded-xl p-2.5 overflow-y-auto space-y-1.5 font-mono text-xs border ${
          isLight 
            ? 'bg-slate-50/90 border-slate-200/90 text-slate-800' 
            : 'bg-[#070b14] border-slate-800/90 text-slate-300'
        }`}>
          {autoLog.length === 0 ? (
            <div className={`h-full flex items-center justify-center text-center text-xs ${
              isLight ? 'text-slate-500' : 'text-slate-500'
            }`}>
              {language === 'en' ? 'Awaiting activation. Click "Start Auto-Pilot" or "Step Trade".' : 'شروع کرنے کے لیے "آٹو پائلٹ چلائیں" پر کلک کریں۔'}
            </div>
          ) : (
            autoLog.slice(-15).reverse().map((log) => (
              <div 
                key={log.id} 
                className={`p-1.5 rounded text-[11px] leading-tight border transition-colors ${
                  isLight
                    ? log.type === 'WIN'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : log.type === 'LOSS'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : log.type === 'TIER_UP'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                    : log.type === 'WIN' 
                    ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' 
                    : log.type === 'LOSS'
                    ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                    : log.type === 'TIER_UP'
                    ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 font-bold'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-between text-[9px] mb-0.5 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>{log.timestamp}</span>
                  <span className={`uppercase font-bold ${
                    isLight 
                      ? (log.type === 'WIN' ? 'text-emerald-700' : log.type === 'LOSS' ? 'text-rose-700' : log.type === 'TIER_UP' ? 'text-amber-700' : 'text-slate-600')
                      : ''
                  }`}>{log.type}</span>
                </div>
                <p>{log.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

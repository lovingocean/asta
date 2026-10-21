import React from 'react';
import { 
  getTiersForTarget, 
  getCurrentTier, 
  calculateProgressToTarget,
  calculateKellyFraction 
} from '../utils/quantEngine';
import { Target, ShieldAlert, Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface MilestoneProgressProps {
  balance: number;
  targetBalance?: number;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ 
  balance, 
  targetBalance = 10000, 
  language,
  theme = 'light'
}) => {
  const currentTier = getCurrentTier(balance, targetBalance);
  const totalProgress = calculateProgressToTarget(balance, targetBalance, 10);
  const kelly = calculateKellyFraction(0.68, 2.5);
  const tiers = getTiersForTarget(targetBalance);
  const isMega = targetBalance >= 1000000;
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  return (
    <div className={`rounded-2xl p-4 md:p-5 shadow-sm border transition-colors relative overflow-hidden ${
      isLight 
        ? isCashmere
          ? 'bg-[#fcfaf7] border-amber-200/90 shadow-stone-200/60'
          : 'bg-white border-slate-200/90 shadow-slate-100' 
        : 'bg-[#0e1424] border-cyan-950/70 shadow-xl'
    }`}>
      {/* Background ambient glow */}
      <div className={`absolute top-0 right-0 w-96 h-32 rounded-full blur-3xl pointer-events-none ${
        isLight
          ? (isMega ? 'bg-amber-500/5' : 'bg-blue-500/5')
          : (isMega ? 'bg-amber-500/10' : 'bg-cyan-500/5')
      }`} />

      {/* Top Banner: Overall Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isMega ? 'bg-amber-400' : (isLight ? 'bg-blue-400' : 'bg-cyan-400')
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isMega ? 'bg-amber-500' : (isLight ? 'bg-blue-600' : 'bg-cyan-500')
              }`}></span>
            </span>
            <h2 className={`text-sm font-bold uppercase tracking-wider font-mono ${
              isMega 
                ? 'text-amber-500' 
                : (isLight ? 'text-blue-700' : 'text-cyan-400')
            }`}>
              {isMega
                ? (language === 'en' ? 'Astra 6-Stage 1,000,000x Sovereign Matrix ($10 → $10,000,000)' : 'آسٹرا 6 مرحلہ وار 1,000,000 گنا ہدف ($10 ← $10,000,000)')
                : (language === 'en' ? 'Astra 4-Tier Compounding Matrix ($10 → $10,000)' : 'آسٹرا 4 مرحلہ وار کمپاؤنڈنگ میٹرکس ($10 ← $10,000)')}
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en'
              ? `Currently in Tier ${currentTier.tierNumber} • Kelly Factor: ${(kelly * 100).toFixed(1)}% Optimal Risk • ${isMega ? 'Macro Supercycle Mode' : 'Standard Alpha Mode'}`
              : `فی الحال مرحلہ نمبر ${currentTier.tierNumber} • کیلی آپٹیمائزڈ رسک سائز`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className={`text-[11px] block font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {language === 'en' ? 'Compound Velocity' : 'حتمی پیش رفت'}
            </span>
            <span className={`text-base font-extrabold font-mono ${
              isMega ? 'text-amber-500' : (isLight ? 'text-blue-600' : 'text-cyan-300')
            }`}>
              {totalProgress}%
            </span>
          </div>
          <div className={`w-28 sm:w-36 rounded-full h-3.5 p-0.5 border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700/80'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                isMega 
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-300 shadow-amber-500/30' 
                  : (isLight 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 shadow-cyan-500/50')
              }`}
              style={{ width: `${Math.max(4, totalProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tiers Visual Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMega ? 'lg:grid-cols-3 xl:grid-cols-6' : 'lg:grid-cols-4'} gap-3`}>
        {tiers.map((tier) => {
          const isPassed = balance >= tier.endRange;
          const isCurrent = balance >= tier.startRange && balance < tier.endRange;
          const isLocked = balance < tier.startRange;

          const tierProgress = isPassed 
            ? 100 
            : isCurrent 
              ? Math.min(100, Math.max(0, ((balance - tier.startRange) / (tier.endRange - tier.startRange)) * 100))
              : 0;

          return (
            <div
              key={tier.tierNumber}
              className={`relative rounded-xl p-3.5 transition-all duration-300 border ${
                isCurrent
                  ? (isLight 
                    ? 'bg-gradient-to-b from-blue-50/70 to-white border-blue-500/70 shadow-md shadow-blue-500/10 ring-1 ring-blue-400/40' 
                    : 'bg-gradient-to-b from-cyan-950/40 to-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/30')
                  : isPassed
                  ? (isLight 
                    ? 'bg-slate-50 border-emerald-300/80 text-slate-700' 
                    : 'bg-slate-900/60 border-emerald-900/40 text-slate-300')
                  : (isLight 
                    ? 'bg-slate-50/50 border-slate-200 opacity-60 text-slate-400' 
                    : 'bg-slate-900/30 border-slate-800/50 opacity-60')
              }`}
            >
              {/* Active Badge */}
              {isCurrent && (
                <div className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-mono shadow-sm ${
                  isLight ? 'bg-blue-600 text-white' : 'bg-cyan-500 text-slate-950'
                }`}>
                  {language === 'en' ? 'Active Tier' : 'جاری مرحلہ'}
                </div>
              )}
              {isPassed && (
                <div className="absolute top-2.5 right-2.5 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Title & Range */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                  isCurrent 
                    ? (isLight ? 'bg-blue-600 text-white' : 'bg-cyan-500 text-slate-950') 
                    : isPassed 
                    ? (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400') 
                    : (isLight ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-slate-500')
                }`}>
                  {tier.tierNumber}
                </span>
                <span className={`text-xs font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ${tier.startRange} → ${tier.endRange.toLocaleString()}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ml-auto ${
                  isLight ? 'bg-slate-200/80 text-slate-600' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tier.multiplier}x
                </span>
              </div>

              {/* Strategy Focus */}
              <p className={`text-[11px] line-clamp-2 leading-relaxed h-8 ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {language === 'en' ? tier.strategyFocus : tier.strategyFocusUrdu}
              </p>

              {/* Constraints Matrix */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
              }`}>
                <div>
                  <span>{language === 'en' ? 'Max Lev: ' : 'زیادہ سے زیادہ لیوریج: '}</span>
                  <span className={`font-bold ${isLight ? 'text-blue-600' : 'text-cyan-300'}`}>{tier.maxLeverage}x</span>
                </div>
                <div>
                  <span>{language === 'en' ? 'Risk: ' : 'رسک: '}</span>
                  <span className={`font-bold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{tier.riskTolerancePercent}%</span>
                </div>
              </div>

              {/* Micro Progress Bar */}
              <div className={`mt-2 w-full rounded-full h-1.5 overflow-hidden ${
                isLight ? 'bg-slate-200' : 'bg-slate-800/60'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPassed 
                      ? 'bg-emerald-500' 
                      : isCurrent 
                      ? (isLight ? 'bg-blue-600' : 'bg-cyan-400') 
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

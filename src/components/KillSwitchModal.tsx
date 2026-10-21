import React, { useState } from 'react';
import { 
  AlertOctagon, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  openPositionsCount: number;
  balance: number;
  onExecuteKillSwitch: () => void;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({
  isOpen,
  onClose,
  openPositionsCount,
  balance,
  onExecuteKillSwitch,
  language,
  theme,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  if (!isOpen) return null;

  const handleTrigger = () => {
    soundManager.playClick();
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsExecuted(true);
      soundManager.playMilestone10K();
      onExecuteKillSwitch();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-rose-300 text-slate-900 shadow-rose-900/10'
          : 'bg-[#12080c] border-rose-600/40 text-slate-100 shadow-rose-950/60'
      }`}>
        {/* Top Danger Header */}
        <div className="p-5 border-b border-rose-500/20 bg-gradient-to-r from-rose-600/20 via-rose-500/10 to-transparent flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                {language === 'en' ? 'Institutional Risk Control' : 'ادارہ جاتی خطرے کا کنٹرول'}
              </span>
              <h3 className="text-lg font-black font-mono">
                {language === 'en' ? 'EMERGENCY RISK KILL SWITCH' : 'ایمرجنسی سرکٹ بریکر (کل سوئچ)'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {!isExecuted ? (
            <>
              <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {language === 'en'
                  ? 'Activating this protocol will immediately trigger the Astra Circuit Breaker, cancel all active algorithmic limits, liquidate all open leveraged positions at current index mark price, pause the Auto-Pilot bot, and preserve 100% of capital in USDC.'
                  : 'یہ سرکٹ بریکر تمام اوپن ٹریڈز فوری بند کر دے گا، آٹو پائلٹ روک دے گا، اور سارا سرمایہ فوری محفوظ کیش (USDC) میں بدل دے گا۔'}
              </p>

              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Open Leveraged Positions:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{openPositionsCount} Positions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Portfolio Capital to Secure:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Execution Venue:</span>
                  <span className="font-bold">Dark Pool Crossing (Zero Contagion)</span>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                  {language === 'en'
                    ? 'I acknowledge that activating the Kill Switch immediately hedges all open risk and halts the active compounding schedule.'
                    : 'میں تصدیق کرتا ہوں کہ کل سوئچ تمام رسک فوری بند کرے گا اور تمام فنڈز محفوظ کر دے گا۔'}
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition-colors ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  disabled={!confirmed || isExecuting}
                  onClick={handleTrigger}
                  className={`flex-1 py-2.5 rounded-xl font-black uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    confirmed && !isExecuting
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40 cursor-pointer animate-pulse'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isExecuting ? 'LIQUIDATING...' : language === 'en' ? 'EXECUTE KILL SWITCH' : 'کل سوئچ چلائیں'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {language === 'en' ? 'ALL POSITIONS HEDGED & LIQUIDATED' : 'تمام پوزیشنز کامیابی سے محفوظ ہو گئیں'}
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {language === 'en'
                    ? `100% of capital ($${balance.toFixed(2)} USD) is now safely parked in collateral reserves. Auto-Pilot paused.`
                    : `$${balance.toFixed(2)} کی رقم محفوظ کر لی گئی ہے اور آٹو پائلٹ روک دیا گیا ہے۔`}
                </p>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold"
              >
                {language === 'en' ? 'Return to Safe Terminal' : 'ٹرمینل پر واپس جائیں'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

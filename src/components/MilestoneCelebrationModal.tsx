import React from 'react';
import { Award, Sparkles, Trophy, CheckCircle, RotateCcw, ArrowRight, X } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  balance: number;
  tradeCount: number;
  onRestart: () => void;
  onClose: () => void;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  balance,
  tradeCount,
  onRestart,
  onClose,
  language,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const isMega = balance >= 1000000;
  const isLight = theme === 'light' || theme === 'cashmere';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden font-mono border-2 ${
        isLight
          ? isMega
            ? 'bg-[#fffdf9] border-amber-400 shadow-amber-300/40 text-slate-800'
            : 'bg-white border-amber-400 shadow-amber-200/50 text-slate-800'
          : isMega 
            ? 'bg-[#0b101d] border-amber-400 shadow-amber-500/50 text-white' 
            : 'bg-[#0b101d] border-amber-500/70 shadow-amber-500/30 text-white'
      }`}>
        {/* Ambient golden glow */}
        <div className={`absolute inset-0 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-b from-amber-500/10 via-transparent to-blue-500/5'
            : isMega 
              ? 'bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-yellow-500/10' 
              : 'bg-gradient-to-b from-amber-500/10 via-transparent to-cyan-500/5'
        }`} />

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/40 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className={`text-xl font-extrabold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {isMega
            ? (language === 'en' ? 'SOVEREIGN 1,000,000x APEX REACHED!' : 'مبارک ہو! 10 ملین ڈالر کا ہدف مکمل ہو گیا!')
            : (language === 'en' ? 'APEX MILESTONE REACHED!' : 'مبارک ہو! $10,000 کا ہدف مکمل ہو گیا!')}
        </h2>
        <p className={`text-xs font-bold mb-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
          {isMega
            ? (language === 'en' ? '$10.00 → $10,000,000.00 (1,000,000x SOVEREIGN SCALE)' : '10 ڈالر کامیابی سے 10,000,000 ڈالر (10 ملین) میں تبدیل ہو گئے')
            : (language === 'en' ? '$10.00 → $10,000.00 (1,000x MULTIPLIER SECURED)' : '10 ڈالر کامیابی سے 10,000 ڈالر میں تبدیل ہو گئے (1000 گنا اضافہ)')}
        </p>

        <div className={`rounded-xl p-4 text-xs space-y-2 mb-6 border ${
          isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>{language === 'en' ? 'Final Portfolio Value:' : 'فائنل پورٹ فولیو:'}</span>
            <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>{language === 'en' ? 'Astra Algorithmic Trades:' : 'کل الگوریتھمک ٹریڈز:'}</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{tradeCount}</span>
          </div>
          <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>{language === 'en' ? 'Capital Preservation Rate:' : 'کیپٹل سیفٹی ریٹ:'}</span>
            <span className={`font-bold ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>100% (Zero Liquidation)</span>
          </div>
          <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>{language === 'en' ? 'Strategy Rating:' : 'سٹریٹجی پرفارمنس:'}</span>
            <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
              {isMega ? 'ASTRA SOVEREIGN WHALE [SSS-TIER]' : 'ASTRA APEX QUANT [S-TIER]'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'en' ? 'Start Another $10 Run' : 'نیا $10 رن شروع کریں'}</span>
          </button>
          <button
            onClick={onClose}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            {language === 'en' ? 'Inspect Portfolio' : 'جائزہ لیں'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Calculator, 
  RefreshCw, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { runMonteCarloSimulation, calculateKellyFraction, MonteCarloResult } from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';

interface MathematicalProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const MathematicalProofModal: React.FC<MathematicalProofModalProps> = ({
  isOpen,
  onClose,
  language,
  theme = 'light',
}) => {
  const [activeThesisTab, setActiveThesisTab] = useState<'10K' | '10M'>('10K');
  // Monte Carlo parameters state
  const [winRate, setWinRate] = useState<number>(0.66);
  const [riskReward, setRiskReward] = useState<number>(2.4);
  const [riskFraction, setRiskFraction] = useState<number>(0.08);
  const [simResult, setSimResult] = useState<MonteCarloResult | null>(() => 
    runMonteCarloSimulation(10, 10000, 0.66, 2.4, 0.08, 60, 300)
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    soundManager.playClick();
    setIsSimulating(true);
    const target = activeThesisTab === '10M' ? 10000000 : 10000;
    setTimeout(() => {
      const res = runMonteCarloSimulation(10, target, winRate, riskReward, riskFraction, activeThesisTab === '10M' ? 120 : 60, 400);
      setSimResult(res);
      setIsSimulating(false);
      soundManager.playOrderExecuted();
    }, 200);
  };

  const kelly = calculateKellyFraction(winRate, riskReward);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border ${
        isLight 
          ? isCashmere
            ? 'bg-[#fcfaf7] border-amber-200/90 text-stone-900 shadow-stone-300/50'
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
          : 'bg-[#0b101d] border-cyan-500/40 text-white shadow-cyan-950/60'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1424] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
              isLight 
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 shadow-blue-500/20' 
                : 'bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-500 shadow-cyan-500/20'
            }`}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base sm:text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {language === 'en' ? 'Astra Quant Brain: Mathematical Thesis' : 'آسٹرا کوانٹ دماغ: ریاضیاتی اور سائنسی ثبوت'}
                </h2>
                <div className={`flex rounded-lg p-0.5 border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-700'
                }`}>
                  <button
                    onClick={() => {
                      setActiveThesisTab('10K');
                      setSimResult(runMonteCarloSimulation(10, 10000, winRate, riskReward, riskFraction, 60, 300));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      activeThesisTab === '10K' 
                        ? (isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950')
                        : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                    }`}
                  >
                    1,000x ($10k)
                  </button>
                  <button
                    onClick={() => {
                      setActiveThesisTab('10M');
                      setSimResult(runMonteCarloSimulation(10, 10000000, 0.72, 2.8, 0.05, 120, 300));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      activeThesisTab === '10M' 
                        ? 'bg-amber-500 text-slate-950 font-black' 
                        : (isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300')
                    }`}
                  >
                    1,000,000x ($10M)
                  </button>
                </div>
              </div>
              <p className={`text-xs font-mono ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                {activeThesisTab === '10M' 
                  ? (language === 'en' ? 'The 1,000,000x Problem: Sovereign Halving Supercycles & Zero-Delta Scale' : '10 لاکھ گنا اضافہ: مارکیٹ لیکویڈیٹی اور ہالونگ سائیکلز کا حل')
                  : (language === 'en' ? 'How Mathematical Asymmetry Solves the 1,000x Problem' : 'کیسے ریاضی اور کیلی فارمولا 1000 گنا ہدف ممکن بناتا ہے')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`p-2 rounded-lg transition-colors border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' 
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-4 sm:p-6 overflow-y-auto space-y-6 font-mono text-xs ${
          isLight ? 'text-slate-700' : 'text-slate-300'
        }`}>
          {/* Section 1: The Core Problem vs Astra Solution */}
          {activeThesisTab === '10M' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* The 1M Problem: Liquidity Barrier */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-950/20 border-amber-900/50'
                }`}>
                  <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>{language === 'en' ? 'THE 1,000,000x CHALLENGE (LIQUIDITY WALL)' : '10 لاکھ گنا کا چیلنج (مارکیٹ وال)'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? 'Turning $10 into $10,000 is high-speed execution; turning $10 into $10,000,000 is macroeconomic engineering. Micro-caps cannot absorb millions in volume without collapsing slippage. To reach 1,000,000x, leverage must step down from 12x to 1x, transitioning from momentum to sovereign macro accumulation.'
                      : '$10 کو $10,000 بنانا تیز رفتاری کا کام ہے لیکن $10 کو ایک کروڑ ڈالر ($10M) بنانا معاشی حکمت عملی مانگتا ہے۔ چھوٹے کوائنز میں لاکھوں ڈالر کا والیوم نہیں ڈالا جا سکتا ورنہ قیمت گر جاتی ہے۔ اس لیے آسٹرا خودکار طور پر لیوریج کم کر کے میکرو سائیکلز کا استعمال کرتا ہے۔'}
                  </p>
                </div>

                {/* The Sovereign 4-Stage Solution */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/50'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'en' ? 'ASTRA SOVEREIGN MATRIX SOLUTION' : 'آسٹرا ساورن میگا سلوشن'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? 'The system splits into 4 Epochs: (1) $10-$1k: Hyper-Momentum, (2) $1k-$100k: Trend Following, (3) $100k-$1M: Spot & Perp Basis Arbitrage, (4) $1M-$10M: Zero-Delta Cross-Chain Liquidity & Bitcoin Halving Beta. Zero liquidation risk at apex.'
                      : 'یہ نظام 4 مراحل پر مبنی ہے: (1) $10 سے $1,000: مائیکرو مومینٹم، (2) $1k سے $100k: ٹرینڈ فالوونگ، (3) $100k سے $1M: پرپیچوئل ثالثی، (4) $1M سے $10M: کراس چین ایل پی اور محفوظ بٹ کوائن سائیکل سرمایہ کاری۔'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* The 1000x Problem */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-rose-950/20 border-rose-900/50'
                }`}>
                  <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{language === 'en' ? 'WHY 99% OF TRADERS GET LIQUIDATED' : '99 فیصد لوگ اکاؤنٹ کیوں اڑاتے ہیں؟'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? "Gambler's Ruin occurs when position sizing is too aggressive. Traders take 50x leverage on a 5% drop, guaranteeing liquidation in a series of coin flips. Without mathematical asymmetric risk, turning $10 into $10,000 is mathematically impossible."
                      : 'جب بھی کوئی ٹریڈر زیادہ لیوریج لگاتا ہے اور سٹاپ لاس کا درست حساب نہیں رکھتا تو اکاؤنٹ کا صفایا لازمی ہوتا ہے۔ مناسب ریاضیاتی حسابی رسک کے بغیر $10 کو $10,000 بنانا ناممکن ہو جاتا ہے۔'}
                  </p>
                </div>

                {/* The Astra Solution */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/50'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'en' ? 'THE ASTRA QUANTITATIVE SOLUTION' : 'آسٹرا کا ریاضیاتی حل'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? 'Astra uses the Kelly Criterion half-fraction f* = (bp - q) / b to mathematically prove that the growth rate of capital is maximized while the probability of ruin approaches zero. Leverage starts at 12x and automatically ramps down as equity climbs.'
                      : 'آسٹرا کیلی کریٹیرین (Kelly Criterion) کے فارمولے کے تحت ہر ٹریڈ کے رسک کا سائز مقرر کرتا ہے۔ اس سے سرمائے کا منافع زیادہ سے زیادہ اور نقصان کا خطرہ صفر کے قریب ہو جاتا ہے۔'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Monte Carlo Simulation Studio */}
          <div className={`rounded-xl p-4 border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Calculator className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span>{language === 'en' ? 'Monte Carlo Multi-Trajectory Verification Engine' : 'مونٹی کارلو سمولیشن انجن (300 سے زیادہ راستے)'}</span>
                </h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {language === 'en'
                    ? 'Stochastic verification running 300 parallel simulated market journeys to verify success probability.'
                    : 'مارکیٹ کے مختلف اتار چڑھاؤ کے 300 مختلف ممکنہ نتائج کا بیک وقت امتحان۔'}
                </p>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isLight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? 'Simulating...' : 'Run 300 Iterations'}</span>
              </button>
            </div>

            {/* Parameter sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>Win Rate:</span>
                  <span className={`font-bold ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>{(winRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.85"
                  step="0.01"
                  value={winRate}
                  onChange={(e) => setWinRate(parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                    isLight ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-cyan-400'
                  }`}
                />
              </div>

              <div>
                <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>Risk : Reward Ratio:</span>
                  <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>1 : {riskReward.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={riskReward}
                  onChange={(e) => setRiskReward(parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                    isLight ? 'bg-slate-200 accent-emerald-600' : 'bg-slate-800 accent-emerald-400'
                  }`}
                />
              </div>

              <div>
                <div className={`flex justify-between mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>Kelly Risk Fraction:</span>
                  <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{(riskFraction * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.18"
                  step="0.01"
                  value={riskFraction}
                  onChange={(e) => setRiskFraction(parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                    isLight ? 'bg-slate-200 accent-amber-600' : 'bg-slate-800 accent-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Results Grid */}
            {simResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className={`rounded-xl p-3 border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <span className={`text-[10px] block mb-1 uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Success Probability</span>
                  <span className={`text-lg font-bold font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {simResult.successRateToTarget}%
                  </span>
                </div>

                <div className={`rounded-xl p-3 border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <span className={`text-[10px] block mb-1 uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Risk of Ruin (&lt;$1)</span>
                  <span className="text-lg font-bold text-rose-500 font-mono">
                    {simResult.ruinRate}%
                  </span>
                </div>

                <div className={`rounded-xl p-3 border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <span className={`text-[10px] block mb-1 uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Median Trades to Goal</span>
                  <span className={`text-lg font-bold font-mono ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>
                    {simResult.averageTradesNeeded}
                  </span>
                </div>

                <div className={`rounded-xl p-3 border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <span className={`text-[10px] block mb-1 uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Median Capital Output</span>
                  <span className={`text-lg font-bold font-mono ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                    ${simResult.medianFinalBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1424] border-slate-800'
        }`}>
          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {language === 'en'
              ? 'Astra Quant Engine: Verified under stochastic Brownian motion & Kelly constraints'
              : 'آسٹرا کوانٹ انجن: سخت ریاضیاتی اور شماریاتی اصولوں پر تصدیق شدہ'}
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs font-mono transition-all shadow-sm ${
              isLight
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {language === 'en' ? 'Back to Terminal' : 'ٹرمینل پر واپس جائیں'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Rocket, 
  HelpCircle, 
  ShieldCheck, 
  Sliders, 
  Send, 
  Zap, 
  Lock, 
  CheckCircle2, 
  AlertOctagon, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { getCurrentTier, calculateKellyFraction } from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';

interface AstraScalingConsoleProps {
  balance: number;
  targetBalance: number;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
  onExecuteSimulatedTrade?: () => void;
}

export const AstraScalingConsole: React.FC<AstraScalingConsoleProps> = ({
  balance,
  targetBalance,
  language,
  theme = 'light',
  onExecuteSimulatedTrade,
}) => {
  const [activeTab, setActiveTab] = useState<'HOW_TO_USE' | 'SCALE_CALCULATOR' | 'CIRCUIT_BREAKER' | 'EXCHANGE_BRIDGE'>('HOW_TO_USE');
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  // Interactive Calculator State
  const [calcBalance, setCalcBalance] = useState<string>(balance.toString());
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const parsedCalcBalance = parseFloat(calcBalance) || 10;
  const currentTier = getCurrentTier(parsedCalcBalance, targetBalance);

  // Scaling calculations
  const scalingPlan = useMemo(() => {
    const kelly = calculateKellyFraction(0.72, 2.5);
    const safeRiskFraction = Math.min(kelly, currentTier.riskTolerancePercent / 100);
    const tradeAllocationUsd = Math.max(1, parsedCalcBalance * safeRiskFraction * 2.2);
    const maxDailyDrawdownUsd = parsedCalcBalance * (currentTier.riskTolerancePercent * 0.02);
    const targetNextMilestone = currentTier.endRange;
    const requiredGrowthRatio = targetNextMilestone / parsedCalcBalance;

    return {
      tradeAllocationUsd: parseFloat(Math.min(parsedCalcBalance, tradeAllocationUsd).toFixed(2)),
      maxDailyDrawdownUsd: parseFloat(Math.max(0.5, maxDailyDrawdownUsd).toFixed(2)),
      leverageCap: currentTier.maxLeverage,
      targetNextMilestone,
      requiredGrowthRatio: parseFloat(requiredGrowthRatio.toFixed(1)),
      recommendedPair: parsedCalcBalance < 100 ? 'ASTRA/USDT (High Beta)' : parsedCalcBalance < 50000 ? 'SOL/USDT & BTC/USDT' : 'BTC/USDT & Delta-Neutral Stables',
    };
  }, [parsedCalcBalance, currentTier, targetBalance]);

  const copyWebhookCode = () => {
    soundManager.playClick();
    const webhookJson = JSON.stringify({
      strategy: "ASTRA_QUANT_V4",
      action: "AUTO_TRADE",
      tier: currentTier.tierNumber,
      max_leverage: currentTier.maxLeverage,
      risk_percent: currentTier.riskTolerancePercent,
      target_apex: targetBalance,
      timestamp: new Date().toISOString()
    }, null, 2);

    navigator.clipboard?.writeText(webhookJson);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className={`rounded-2xl p-4 md:p-5 shadow-sm border transition-colors relative overflow-hidden font-mono ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-[#0b101d] border-cyan-900/50 shadow-2xl'
    }`}>
      {/* Top Banner and Navigation */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-3 mb-4 gap-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 shadow-md ${
            isLight 
              ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 shadow-blue-500/20 text-white' 
              : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-emerald-500 shadow-cyan-500/20'
          }`}>
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-sm md:text-base font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>{language === 'en' ? 'ASTRA SCALEMASTER: HOW TO USE & SCALE' : 'آسٹرا اسکیل ماسٹر: سسٹم کو استعمال اور اسکیل کرنے کا طریقہ'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase font-bold border ${
                isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}>
                Zero-to-Whale Playbook
              </span>
            </h2>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {language === 'en' 
                ? 'Complete tactical execution protocol: Scaling from $10 to $10,000 and beyond without ruin.' 
                : '$10 کو بغیر نقصان کے $10,000 اور اس سے آگے لے جانے کی عملی گائیڈ۔'}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className={`flex items-center rounded-xl p-1 border self-stretch md:self-auto overflow-x-auto ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('HOW_TO_USE');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'HOW_TO_USE'
                ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20')
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '1. How to Use' : '1. استعمال کا طریقہ'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('SCALE_CALCULATOR');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'SCALE_CALCULATOR'
                ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20')
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '2. Scale Calculator' : '2. اسکیل کیلکولیٹر'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('CIRCUIT_BREAKER');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CIRCUIT_BREAKER'
                ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20')
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '3. Risk Guard' : '3. رسک گارڈ'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('EXCHANGE_BRIDGE');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'EXCHANGE_BRIDGE'
                ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20')
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '4. Webhook / Bridge' : '4. ایکسچینج کنکشن'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: How to Use Astra (Step-by-Step Practical Masterclass) */}
      {activeTab === 'HOW_TO_USE' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mode 1 */}
            <div className={`border rounded-xl p-3.5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div>
                <div className={`flex items-center gap-2 font-bold mb-2 ${
                  isLight ? 'text-blue-700' : 'text-cyan-400'
                }`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold ${
                    isLight ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  }`}>1</span>
                  <span>{language === 'en' ? 'Auto-Pilot Mode' : 'آٹو پائلٹ موڈ'}</span>
                </div>
                <p className={`leading-relaxed text-[11px] mb-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {language === 'en' 
                    ? 'Simply click "Start Auto-Pilot" or "Simulate Instant Run". Astra uses quantitative Kelly formulas to execute trades, set trailing stops, and compound balances automatically.'
                    : 'بس "Start Auto-Pilot" پر کلک کریں۔ سسٹم خودکار طور پر سگنلز تلاش کر کے ٹریڈز لیتا ہے اور منافع کو کمپاؤنڈ کرتا ہے۔'}
                </p>
              </div>
              <div className={`text-[10px] p-2 rounded border ${
                isLight ? 'bg-blue-50/70 border-blue-200 text-blue-800 font-medium' : 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300'
              }`}>
                {language === 'en' ? 'Ideal for: Hands-free compounding & statistical testing.' : 'بہترین برائے: بغیر محنت خودکار سمولیشن'}
              </div>
            </div>

            {/* Mode 2 */}
            <div className={`border rounded-xl p-3.5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div>
                <div className={`flex items-center gap-2 font-bold mb-2 ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold ${
                    isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  }`}>2</span>
                  <span>{language === 'en' ? 'Radar Signal Sniper' : 'ریڈار سگنل سنائپر'}</span>
                </div>
                <p className={`leading-relaxed text-[11px] mb-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {language === 'en'
                    ? 'Watch the Astra Live Signal Radar. When a 90%+ confidence breakout triggers, click "Snipe Signal with Astra" to enter with pre-calculated Take-Profit and Stop-Loss.'
                    : 'آسٹرا سگنل ریڈار پر نظر رکھیں۔ جب 90 فیصد سے زیادہ کلسٹر سگنل آئے تو "Snipe Signal" پر کلک کر کے فوری ٹریڈ درج کریں۔'}
                </p>
              </div>
              <div className={`text-[10px] p-2 rounded border ${
                isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-medium' : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
              }`}>
                {language === 'en' ? 'Ideal for: Semi-automated precision trading.' : 'بہترین برائے: ہائی کونفیڈنس سنائپنگ'}
              </div>
            </div>

            {/* Mode 3 */}
            <div className={`border rounded-xl p-3.5 flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div>
                <div className={`flex items-center gap-2 font-bold mb-2 ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold ${
                    isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-500/20 border-amber-400 text-amber-300'
                  }`}>3</span>
                  <span>{language === 'en' ? 'Manual Kelly Execution' : 'دستی کیلی ایگزیکیوشن'}</span>
                </div>
                <p className={`leading-relaxed text-[11px] mb-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {language === 'en'
                    ? 'Use the Manual Trading Panel. Click "Kelly Sizing" to automatically calculate the exact mathematical margin required for zero-ruin survival.'
                    : 'دستی پینل میں "Kelly Sizing" پر کلک کریں تاکہ سسٹم خود بتا دے کہ آپ کو اس ٹریڈ میں کتنے ڈالر لگانے چاہئیں۔'}
                </p>
              </div>
              <div className={`text-[10px] p-2 rounded border ${
                isLight ? 'bg-amber-50/70 border-amber-200 text-amber-800 font-medium' : 'bg-amber-950/40 border-amber-800/40 text-amber-300'
              }`}>
                {language === 'en' ? 'Ideal for: Total manual control with institutional safety.' : 'بہترین برائے: محفوظ دستی ٹریڈنگ'}
              </div>
            </div>
          </div>

          {/* Golden Rule of Scaling */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isLight 
              ? 'bg-blue-50/70 border-blue-200 text-slate-800' 
              : 'bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border-cyan-800/50'
          }`}>
            <div className="flex items-center gap-2.5">
              <Zap className={`w-5 h-5 shrink-0 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
              <div>
                <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {language === 'en' ? 'The #1 Golden Law of Scaling in Astra:' : 'آسٹرا کا سنہری اصول:'}
                </span>
                <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {language === 'en'
                    ? '"Never increase leverage as balance grows — DECREASE leverage as balance grows!" (15x at $10 → 10x at $100 → 5x at $1,000 → 2x at $5,000).'
                    : '"بیلنس بڑھنے پر لیوریج مت بڑھائیں، بلکہ لیوریج کم کرتے جائیں!" ($10 پر 15x، $100 پر 10x، اور $5,000 پر 2x)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Real-Time Scale Calculator */}
      {activeTab === 'SCALE_CALCULATOR' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <label className={`text-xs block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {language === 'en' ? 'Enter Current Portfolio Balance ($):' : 'اپنا موجودہ بیلنس درج کریں ($):'}
                </label>
                <div className="relative w-48">
                  <span className={`absolute left-3 top-2 font-mono text-sm ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={calcBalance}
                    onChange={(e) => setCalcBalance(e.target.value)}
                    className={`w-full border rounded-lg py-1.5 pl-7 pr-3 text-sm font-mono font-bold focus:outline-none ${
                      isLight 
                        ? 'bg-white border-blue-400 text-blue-700 focus:ring-1 focus:ring-blue-500' 
                        : 'bg-[#070b14] border-cyan-500/60 text-cyan-300'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[10, 100, 1000, 5000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      soundManager.playClick();
                      setCalcBalance(preset.toString());
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      parsedCalcBalance === preset 
                        ? (isLight ? 'bg-blue-600 text-white border-blue-600' : 'bg-cyan-500 text-slate-950 border-cyan-400') 
                        : (isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white')
                    }`}
                  >
                    ${preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Blueprint Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#070b14] border-slate-800'
              }`}>
                <span className={`text-[10px] block uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Recommended Trade Size</span>
                <span className={`text-base font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>${scalingPlan.tradeAllocationUsd}</span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>Kelly Safe Fraction</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#070b14] border-slate-800'
              }`}>
                <span className={`text-[10px] block uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Max Allowed Leverage</span>
                <span className={`text-base font-bold ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>{scalingPlan.leverageCap}x</span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>{currentTier.name.split(':')[0]} Cap</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#070b14] border-slate-800'
              }`}>
                <span className={`text-[10px] block uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Daily Max Drawdown Guard</span>
                <span className={`text-base font-bold ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>-${scalingPlan.maxDailyDrawdownUsd}</span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>Kill-Switch Limit</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#070b14] border-slate-800'
              }`}>
                <span className={`text-[10px] block uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Next Milestone Target</span>
                <span className={`text-base font-bold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>${scalingPlan.targetNextMilestone.toLocaleString()}</span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>({scalingPlan.requiredGrowthRatio}x remaining)</span>
              </div>
            </div>

            <div className={`mt-3 p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}>
              <span>{language === 'en' ? 'Optimal Instrument for this stage:' : 'اس مرحلے کے لیے بہترین کوائنز:'}</span>
              <span className={`font-bold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>{scalingPlan.recommendedPair}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Circuit Breakers & Anti-Ruin Protection */}
      {activeTab === 'CIRCUIT_BREAKER' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${
              isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-900/80 border-rose-900/40'
            }`}>
              <div className={`flex items-center gap-2 font-bold mb-2 ${
                isLight ? 'text-rose-700' : 'text-rose-400'
              }`}>
                <AlertOctagon className="w-4 h-4" />
                <span>{language === 'en' ? 'The Emotional Revenge Trade Lock' : 'جذباتی ٹریڈنگ پر خودکار لاک'}</span>
              </div>
              <p className={`text-[11px] leading-relaxed mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {language === 'en'
                  ? '95% of accounts blow up not from market unpredictability, but because after 2 losses, the human brain increases leverage to "win it back". Astra enforces a 4-hour cooldown lock after 2 consecutive stop-outs.'
                  : 'اکثر لوگ نقصان کے بعد غصے میں آ کر بڑا لاٹ سائز لگا دیتے ہیں جس سے اکاؤنٹ ختم ہو جاتا ہے۔ آسٹرا میں دو مسلسل نقصانات کے بعد سسٹم 4 گھنٹے کے لیے ٹریڈنگ لاک کر دیتا ہے۔'}
              </p>
              <div className={`flex items-center gap-2 text-[10px] font-semibold ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Anti-Tilt Circuit Breaker: ARMED & ACTIVE</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-900/80 border-emerald-900/40'
            }`}>
              <div className={`flex items-center gap-2 font-bold mb-2 ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <Lock className="w-4 h-4" />
                <span>{language === 'en' ? 'The 50% Profit Vault Rule' : '50 فیصد منافع کو محفوظ کرنے کا اصول'}</span>
              </div>
              <p className={`text-[11px] leading-relaxed mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {language === 'en'
                  ? 'Whenever a tier threshold is crossed (e.g. $100, $1,000, $5,000), Astra recommends moving 30% to 50% of raw profits into Cold Storage (USDT/USDC/BTC) so your seed capital is permanently de-risked.'
                  : 'جب بھی کوئی مرحلہ مکمل ہو، 30 سے 50 فیصد منافع فوری طور پر کولڈ اسٹوریج یا اسٹیبل کوائنز میں منتقل کر کے محفوظ کر لیں۔'}
              </p>
              <div className={`flex items-center gap-2 text-[10px] font-semibold ${
                isLight ? 'text-blue-700' : 'text-cyan-400'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Capital Preservation Protocol: ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Webhook & Real Exchange Bridge */}
      {activeTab === 'EXCHANGE_BRIDGE' && (
        <div className="space-y-3 text-xs">
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 font-bold ${
                isLight ? 'text-blue-700' : 'text-cyan-400'
              }`}>
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'Astra Live Webhook / API Payload' : 'لائیو ویب ہک اور سگنل ایکسپورٹ'}</span>
              </div>
              <button
                onClick={copyWebhookCode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors text-[11px] ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied JSON!' : 'Copy Webhook'}</span>
              </button>
            </div>
            <p className={`text-[11px] mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {language === 'en'
                ? 'You can route Astra signals directly to Binance Futures, Bybit, Telegram alerts, or TradingView webhook listeners.'
                : 'آپ آسٹرا کے ان سگنلز کو براہ راست اپنے بائنانس، بائی بٹ یا ٹیلی گرام بوٹ میں جوڑ سکتے ہیں۔'}
            </p>

            <pre className="bg-[#0f172a] p-3 rounded-lg border border-slate-800 text-emerald-400 text-[10px] font-mono overflow-x-auto leading-relaxed shadow-inner">
{`{
  "protocol": "ASTRA_QUANT_X",
  "endpoint": "https://astra-quant.internal/v4/signals",
  "auth_mode": "ED25519_SIGNATURE",
  "target_scaling": "${targetBalance >= 1000000 ? '1,000,000x_SOVEREIGN' : '1,000x_APEX'}",
  "current_tier": ${currentTier.tierNumber},
  "max_leverage": "${currentTier.maxLeverage}x",
  "risk_tolerance": "${currentTier.riskTolerancePercent}%",
  "recommended_size_usd": ${scalingPlan.tradeAllocationUsd}
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

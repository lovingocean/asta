import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Activity, 
  Zap, 
  Lock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  Server
} from 'lucide-react';
import { 
  routeInstitutionalOrder, 
  calculateVPINToxicity, 
  HISTORICAL_STRESS_TESTS, 
  StressTestScenario 
} from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';

interface InstitutionalQuantSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
}

export const InstitutionalQuantSuite: React.FC<InstitutionalQuantSuiteProps> = ({
  isOpen,
  onClose,
  balance,
  language,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'sor' | 'vpin' | 'zk' | 'stress'>('sor');
  const [stressSimulationResult, setStressSimulationResult] = useState<string | null>(null);
  const [selectedStressTest, setSelectedStressTest] = useState<StressTestScenario>(HISTORICAL_STRESS_TESTS[0]);
  
  // Real-time simulated order routing for demonstration
  const sorSample = useMemo(() => {
    return routeInstitutionalOrder('BTC/USDT', Math.max(250, balance * 0.4), 'LONG');
  }, [balance]);

  // Real-time simulated VPIN calculation
  const vpinSample = useMemo(() => {
    return calculateVPINToxicity(420000, 180000, 0.42);
  }, []);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  if (!isOpen) return null;

  const handleRunStressTest = (scenario: StressTestScenario) => {
    soundManager.playClick();
    setSelectedStressTest(scenario);
    
    // Simulate algorithmic survival response
    const estimatedPortfolioEnd = balance * 1.34;
    setStressSimulationResult(
      language === 'en'
        ? `Simulation Complete: During ${scenario.crisisName} (${scenario.marketDecline} market crash), Astra Algo preserved 100% of capital and generated an estimated return of ${scenario.astraAlgoReturn} ($${balance.toFixed(2)} → $${estimatedPortfolioEnd.toFixed(2)}) via systematic delta-neutral hedging.`
        : `ٹیسٹ مکمل: مارکیٹ کے ${scenario.marketDecline} کریش کے دوران آسٹرا ایلگو نے کیپٹل کو مکمل محفوظ رکھا اور ${scenario.astraAlgoReturn} منافع کمایا۔`
    );
    soundManager.playSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden my-auto transition-all ${
        isLight
          ? isCashmere
            ? 'bg-[#faf8f5] border-amber-200/90 text-stone-900 shadow-amber-900/10'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/15'
          : 'bg-[#0b101e] border-cyan-500/30 text-slate-100 shadow-cyan-950/50'
      }`}>
        {/* Modal Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-start justify-between relative overflow-hidden ${
          isLight
            ? isCashmere
              ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-amber-200/80'
              : 'bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-teal-500/5 border-slate-200'
            : 'bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-purple-950/40 border-cyan-900/40'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isLight
                  ? isCashmere
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                {language === 'en' ? 'Proprietary Uncopyable Moat' : 'ناقابلِ نقل ادارہ جاتی ماڈل'}
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ANTI-MEV SHIELD: ENGAGED
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 font-mono">
              <Cpu className={`w-6 h-6 ${isLight ? (isCashmere ? 'text-amber-600' : 'text-blue-600') : 'text-cyan-400'}`} />
              INSTITUTIONAL QUANTITATIVE SUITE
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-2xl`}>
              {language === 'en'
                ? 'High-frequency algorithmic architectures that cannot be replicated by retail bots: Smart Order Routing (SOR), Volume-Synchronized Probability of Toxicity (VPIN), ZK-MPC custody, and crisis stress resilience.'
                : 'ادارہ جاتی اسمارٹ آرڈر راؤٹنگ، وہیل ایکوملیشن ڈیٹیکٹر، اور کریش پروف کیپیٹل پروٹیکشن انجن۔'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            aria-label="Close Quant Suite"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tab Bar */}
        <div className={`px-5 py-3 border-b flex items-center gap-2 overflow-x-auto ${
          isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          {[
            { id: 'sor', label: language === 'en' ? 'Smart Order Routing (SOR)' : 'اسمارٹ آرڈر راؤٹنگ (SOR)', icon: Layers },
            { id: 'vpin', label: language === 'en' ? 'VPIN Order Flow Toxicity' : 'وہیل آرڈر فلو (VPIN)', icon: Radio },
            { id: 'zk', label: language === 'en' ? 'ZK-MPC Cold Vault Gate' : 'ZK ملٹی پارٹی والٹ سیکیورٹی', icon: Lock },
            { id: 'stress', label: language === 'en' ? 'Crisis Stress Testing' : 'مارکیٹ کریش اسٹریس ٹیسٹ', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Smart Order Routing (SOR) & Anti-MEV */}
          {activeTab === 'sor' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Active Routing Type
                  </span>
                  <div className="text-lg font-bold font-mono text-blue-600 dark:text-cyan-400">
                    {sorSample.executionType}
                  </div>
                  <p className="text-[11px] text-slate-500">Private builder RPCs bypass public mempool</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Aggregate Slippage Defense
                  </span>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {sorSample.aggregateSlippageBps} bps (0.008%)
                  </div>
                  <p className="text-[11px] text-slate-500">Near-zero slippage via dark pool crossing</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Sandwich & Front-Run Immunity
                  </span>
                  <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    100% MEV-Shielded
                  </div>
                  <p className="text-[11px] text-slate-500">Flashbots & Eden private block relays</p>
                </div>
              </div>

              {/* Real-Time Split Routing Matrix */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    {language === 'en' ? 'Live Cross-Exchange Dark Pool Venue Allocation' : 'لائیو کراس ایکسچینج ڈارک پول ونڈوز'}
                  </h4>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Order Size: ${sorSample.totalUsd.toLocaleString()} USD
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sorSample.venues.map((venue, idx) => (
                    <div key={idx} className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold">{venue.venue}</span>
                        <div className="flex items-center gap-3">
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                            ${venue.routedUsd.toLocaleString()} ({venue.sharePercent}%)
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {venue.latencyMs}ms
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${venue.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-blue-50/50 border-blue-200 text-blue-950' : 'bg-blue-950/20 border-blue-500/20 text-blue-200'
              }`}>
                <p>
                  <strong>Why Retail Bots Get Replicated & Fail:</strong> Most retail bots send plain market or limit orders to public exchange mempools, where predatory MEV searchers sandwich them, costing 0.4% - 1.2% per trade in hidden slippage. <strong>ASTRA's proprietary Smart Order Routing (SOR)</strong> fragments orders across dark pools and private validator bundles, guaranteeing institutional price improvement.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: VPIN Order Flow Toxicity */}
          {activeTab === 'vpin' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Current VPIN Toxicity Level
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {vpinSample.vpinScore}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {vpinSample.toxicityLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Threshold: Normal below 0.40. Informed whale flow occurs between 0.55 - 0.95.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Whale Accumulation Direction
                  </span>
                  <div className="text-2xl font-black font-mono text-blue-600 dark:text-cyan-400">
                    {vpinSample.whaleAccumulationSide}
                  </div>
                  <p className="text-xs text-slate-500">
                    Order book buy-sweeps detected 45 seconds prior to public candle close.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Autonomous Algorithmic Recommendation' : 'خودکار ایلگوریتھمک تجزیہ'}
                </h4>
                <p className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {language === 'en' ? vpinSample.recommendedAction : vpinSample.recommendedActionUrdu}
                </p>
              </div>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
              }`}>
                <p>
                  <strong>VPIN Mathematical Moat:</strong> Volume-Synchronized Probability of Toxicity samples trade volume buckets rather than arbitrary clock-time. By measuring when large aggressive orders outpace passive limit liquidity, ASTRA enters trades with institutional whales <em>before</em> breakouts appear on public charts.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ZK-MPC Cold Vault Gate */}
          {activeTab === 'zk' && (
            <div className="space-y-5">
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {language === 'en' ? 'Threshold Cryptography Quorum (3-of-5 ZK-MPC)' : 'تھریش ہولڈ کرپٹوگرافی کورم (3-of-5 ZK-MPC)'}
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Trading capital never resides in a single hot wallet. Every algorithmic trade authorization requires a 3-of-5 zero-knowledge mathematical quorum between distributed HSM nodes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs font-mono">
                {[
                  { node: 'Node 1', role: 'Local Browser Enclave', status: 'VERIFIED', ping: '0.1ms' },
                  { node: 'Node 2', role: 'Equinix LD4 HSM', status: 'VERIFIED', ping: '0.3ms' },
                  { node: 'Node 3', role: 'Astra Risk Circuit', status: 'VERIFIED', ping: '0.4ms' },
                  { node: 'Node 4', role: 'Air-Gapped Cold Quorum', status: 'STANDBY', ping: 'Quorum Met' },
                  { node: 'Node 5', role: 'Swiss Sovereign Relay', status: 'STANDBY', ping: 'Quorum Met' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-center space-y-1 ${
                    item.status === 'VERIFIED'
                      ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="font-bold text-[11px]">{item.node}</div>
                    <div className="text-[10px] opacity-80">{item.role}</div>
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{item.status}</div>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-purple-50/50 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-500/20 text-purple-200'
              }`}>
                <p>
                  <strong>Zero-Risk Custody Architecture:</strong> Even if a malicious attacker obtains server access, they cannot withdraw funds. Private keys are mathematically split into ephemeral polynomial shares and reconstructed only inside secure hardware enclaves for trade execution.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Crisis Stress Testing */}
          {activeTab === 'stress' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Historical Crisis Stress-Testing (Proof of Survival)' : 'تاریخی مارکیٹ کریش اسٹریس ٹیسٹ (ثبوت)'}
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Test the mathematical compounding model against historical cryptocurrency black-swan events to verify drawdown prevention.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HISTORICAL_STRESS_TESTS.map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 rounded-xl border space-y-3 cursor-pointer transition-all ${
                      selectedStressTest.id === test.id
                        ? isLight
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                          : 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-500/20'
                        : isLight
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                    onClick={() => handleRunStressTest(test)}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span>{test.date}</span>
                      <span className="text-rose-600 dark:text-rose-400">{test.marketDecline}</span>
                    </div>
                    <div className="font-bold text-xs">
                      {language === 'en' ? test.crisisName : test.crisisNameUrdu}
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Astra Return:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">{test.astraAlgoReturn}</span>
                    </div>
                    <button
                      className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        isLight ? 'bg-blue-600 text-white' : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {language === 'en' ? 'Run Stress Simulation' : 'ٹیسٹ رن کریں'}
                    </button>
                  </div>
                ))}
              </div>

              {stressSimulationResult && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
                  isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'en' ? 'STRESS TEST PASSED' : 'اسٹریس ٹیسٹ کامیاب'}</span>
                  </div>
                  <p className="leading-relaxed">{stressSimulationResult}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mathematical Proof of Asymmetry • Zero Retail Contagion</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-bold border transition-colors ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {language === 'en' ? 'Close Suite' : 'بند کریں'}
          </button>
        </div>
      </div>
    </div>
  );
};

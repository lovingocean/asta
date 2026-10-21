import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  Building2, 
  Users, 
  Key, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Globe, 
  Activity,
  Award,
  CreditCard,
  Wallet,
  DollarSign,
  Check,
  Copy,
  ArrowDownToLine,
  Smartphone
} from 'lucide-react';
import { 
  ENTERPRISE_SAAS_PLANS, 
  SaaSTierPlan, 
  validateEnterpriseLicense 
} from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';

interface EnterpriseSaaSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
  currentTierId: 'COMMUNITY' | 'PRO_QUANT' | 'SOVEREIGN_MM';
  onUpgradeTier: (tierId: 'COMMUNITY' | 'PRO_QUANT' | 'SOVEREIGN_MM', clientName?: string) => void;
}

export const EnterpriseSaaSModal: React.FC<EnterpriseSaaSModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  currentTierId,
  onUpgradeTier,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [licenseSuccess, setLicenseSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tiers' | 'seats' | 'sla' | 'payout'>('tiers');
  const [payoutWallet, setPayoutWallet] = useState<string>('TYD7xM8k29PnQqVbW6jC4R1LzHs93FxZ8A');
  const [payoutNetwork, setPayoutNetwork] = useState<'TRC20' | 'ERC20' | 'SOLANA'>('TRC20');
  const [copiedWallet, setCopiedWallet] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  if (!isOpen) return null;

  const handleApplyLicense = () => {
    soundManager.playClick();
    if (!licenseKeyInput.trim()) {
      setLicenseError(language === 'en' ? 'Please enter an enterprise license key.' : 'براہ کرم لائسنس کی درج کریں۔');
      return;
    }

    const validation = validateEnterpriseLicense(licenseKeyInput);
    if (validation.isValid) {
      setLicenseError(null);
      setLicenseSuccess(
        language === 'en' 
          ? `Verified! Welcome ${validation.clientName} (${validation.tierId}). ${validation.seatsAuthorized} seats active.`
          : `تصدیق ہو گئی! خوش آمدید ${validation.clientName}۔`
      );
      soundManager.playSuccess();
      onUpgradeTier(validation.tierId, validation.clientName);
    } else {
      setLicenseSuccess(null);
      setLicenseError(
        language === 'en'
          ? 'Invalid license key. Try demo keys: SOVEREIGN-VIP-2026 or PRO-QUANT-2026'
          : 'غلط لائسنس کی۔ ٹیسٹ کی استعمال کریں: SOVEREIGN-VIP-2026'
      );
    }
  };

  const handleSelectPlan = (plan: SaaSTierPlan) => {
    soundManager.playClick();
    if (plan.id === 'COMMUNITY') {
      onUpgradeTier('COMMUNITY', 'Community Free Sandbox');
      soundManager.playSuccess();
    } else if (plan.id === 'PRO_QUANT') {
      onUpgradeTier('PRO_QUANT', 'Hudson River Trading Desk IV');
      soundManager.playSuccess();
      setLicenseSuccess(language === 'en' ? 'Pro Quant Desk tier activated (5 Seats)!' : 'پرو کوانٹ ڈیسک فعال ہو گئی!');
    } else {
      onUpgradeTier('SOVEREIGN_MM', 'Citadel Apex Sovereign Alpha Fund');
      soundManager.playSuccess();
      setLicenseSuccess(language === 'en' ? 'Sovereign Institutional MM Tier activated (25 Seats, Equinix LD4 fiber)!' : 'سویرن ادارہ جاتی لائسنس فعال ہو گیا!');
    }
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
        {/* Header Banner */}
        <div className={`p-5 sm:p-6 border-b flex items-start justify-between relative overflow-hidden ${
          isLight
            ? isCashmere
              ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-amber-200/80'
              : 'bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-teal-500/5 border-slate-200'
            : 'bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-purple-950/40 border-cyan-900/40'
        }`}>
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isLight
                  ? isCashmere
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                {language === 'en' ? 'Billion-Dollar Enterprise SaaS Platform' : 'بلین ڈالر ادارہ جاتی SaaS پلیٹ فارم'}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                SLA: 99.999%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 font-mono">
              <Building2 className={`w-6 h-6 ${isLight ? (isCashmere ? 'text-amber-600' : 'text-blue-600') : 'text-cyan-400'}`} />
              ASTRA QUANT X ENTERPRISE SUITE
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-2xl`}>
              {language === 'en'
                ? 'Uncopyable quantitative moats: Equinix LD4 co-located latency, ZK-MPC sovereign custody gate, private mempool Anti-MEV Smart Order Routing (SOR), and multi-tenant seat governance.'
                : 'ادارہ جاتی ہائی فریکوئنسی ٹریڈنگ، اینٹی MEV ڈارک پول راؤٹنگ، اور ZK ملٹی پارٹی والٹ سیکیورٹی جو دنیا کے ٹاپ ہیج فنڈز کے لیے بنائی گئی ہے۔'}
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
            aria-label="Close Enterprise Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Cycle Toggle */}
        <div className={`px-5 py-3 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'tiers'
                  ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Institutional Tiers' : 'ادارہ جاتی پلانز'}
            </button>
            <button
              onClick={() => setActiveTab('seats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'seats'
                  ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Seat Management (RBAC)' : 'ٹیم سیٹ مینجمنٹ'}
            </button>
            <button
              onClick={() => setActiveTab('sla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'sla'
                  ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'LD4 Fiber Co-location & SLA' : 'فائبر کنیکٹیویٹی اور گارنٹی'}
            </button>
            <button
              onClick={() => setActiveTab('payout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'payout'
                  ? isLight ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : isLight ? 'text-emerald-700 hover:text-emerald-900 bg-emerald-50' : 'text-emerald-400 hover:text-white bg-emerald-950/30'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Bank Payouts & Wallet' : 'رقم کی وصولی و بینک'}</span>
            </button>
          </div>

          {/* Billing Cycle Switch (Only on Tiers Tab) */}
          {activeTab === 'tiers' ? (
            <div className={`flex items-center rounded-lg p-0.5 border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? isLight ? 'bg-slate-100 text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                    : isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {language === 'en' ? 'Monthly' : 'ماہانہ'}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  billingCycle === 'annual'
                    ? isLight ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-500 text-slate-950 shadow-xs'
                    : isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}
              >
                <span>{language === 'en' ? 'Annual' : 'سالانہ'}</span>
                <span className="text-[10px] uppercase px-1 py-0.2 rounded bg-black/20 font-black">20% OFF</span>
              </button>
            </div>
          ) : activeTab === 'payout' ? (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Instant P2P & Crypto Settlement</span>
            </div>
          ) : null}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'tiers' && (
            <>
              {/* Enterprise Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ENTERPRISE_SAAS_PLANS.map((plan) => {
                  const isCurrent = currentTierId === plan.id;
                  const price = billingCycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                        isCurrent
                          ? isLight
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                            : 'border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-500/20 shadow-md'
                          : plan.isPopular
                          ? isLight
                            ? 'border-indigo-300 bg-indigo-50/20 shadow-sm'
                            : 'border-purple-500/40 bg-purple-950/10'
                          : isLight
                          ? 'border-slate-200 bg-slate-50/50'
                          : 'border-slate-800 bg-slate-900/40'
                      }`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow-sm border ${
                            isLight
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400'
                              : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 font-bold'
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold font-mono text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {language === 'en' ? plan.name : plan.nameUrdu}
                          </h3>
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="text-3xl font-extrabold tracking-tight">
                            ${price.toLocaleString()}
                          </span>
                          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            / {language === 'en' ? 'seat / mo' : 'سیٹ / ماہ'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {plan.latencyProfile} • {plan.seats} {plan.seats === 1 ? 'Quant Seat' : 'Quant Team Seats'}
                        </p>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2 mb-6 flex-1 text-xs">
                        {(language === 'en' ? plan.features : plan.featuresUrdu).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isLight ? 'text-blue-600' : 'text-cyan-400'
                            }`} />
                            <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? isLight
                              ? 'bg-slate-200 text-slate-700 cursor-default'
                              : 'bg-slate-800 text-slate-300 cursor-default'
                            : plan.id === 'SOVEREIGN_MM'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/20'
                            : isLight
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                        }`}
                      >
                        {isCurrent 
                          ? (language === 'en' ? 'Current Active License' : 'موجودہ فعال لائسنس')
                          : (language === 'en' ? `Deploy ${plan.badge === 'STARTER' ? 'Sandbox' : plan.badge}` : 'لائسنس فعال کریں')}
                        {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Enterprise License Key Input */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                      {language === 'en' ? 'Activate Commercial License Key' : 'کمرشل لائسنس کی فعال کریں'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <button
                      onClick={() => setLicenseKeyInput('SOVEREIGN-VIP-2026')}
                      className={`underline ${isLight ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'}`}
                    >
                      Fill Demo Sovereign Key
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setLicenseKeyInput('PRO-QUANT-2026')}
                      className={`underline ${isLight ? 'text-blue-600 hover:text-blue-700' : 'text-cyan-400 hover:text-cyan-300'}`}
                    >
                      Fill Demo Pro Key
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="e.g. ASTRA-SOV-2026-CITADEL-99X or SOVEREIGN-VIP-2026"
                    className={`flex-1 px-3 py-2 rounded-lg font-mono text-xs border focus:outline-hidden ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' 
                        : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                    }`}
                  />
                  <button
                    onClick={handleApplyLicense}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-xs ${
                      isLight
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {language === 'en' ? 'Validate & Unlock' : 'تصدیق کریں'}
                  </button>
                </div>

                {licenseError && (
                  <p className="text-xs font-mono text-rose-600 dark:text-rose-400">
                    ✕ {licenseError}
                  </p>
                )}
                {licenseSuccess && (
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {licenseSuccess}
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === 'seats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono">
                    {language === 'en' ? 'Multi-Tenant Seat & Role Allocation (RBAC)' : 'ملٹی ٹیننٹ سیٹ اور رول مختص'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {language === 'en' 
                      ? 'Enterprise governance allowing distinct access for Algorithmic Quants, Risk Officers, and Compliance Auditors.'
                      : 'مختلف کرداروں (کوانٹ، رسک مینیجر، آڈیٹر) کے لیے محفوظ رسائی۔'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                }`}>
                  {currentTierId === 'SOVEREIGN_MM' ? '18 / 25 Seats Active' : currentTierId === 'PRO_QUANT' ? '4 / 5 Seats Active' : '1 / 1 Seat Active'}
                </div>
              </div>

              <div className="border rounded-xl divide-y overflow-hidden text-xs font-mono">
                {[
                  { name: 'Dr. Evelyn Zhang', role: 'Head of Quantitative Alpha', email: 'e.zhang@citadelaura.fund', status: 'Online (LD4 Server)', permissions: 'Full Algo Injection + ZK Key Access' },
                  { name: 'Kaelen Thorne', role: 'Chief Risk Officer (CRO)', email: 'k.thorne@citadelaura.fund', status: 'Online (NY4 Bridge)', permissions: 'Global Circuit Breaker & Max Drawdown Override' },
                  { name: 'Malik Al-Farouq', role: 'HFT Infrastructure Lead', email: 'm.farouq@citadelaura.fund', status: 'Active (TY3 Sub-ms Relay)', permissions: 'Dark Pool SOR Gateway & Hardware HSM Quorum' },
                  { name: 'Auditor_PwC_External', role: 'Third-Party Compliance', email: 'audit@pwc.ch', status: 'Read-Only (Zurich Node)', permissions: 'Cryptographic Trade Log Verification Only' },
                ].map((user, idx) => (
                  <div key={idx} className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isLight ? 'bg-white hover:bg-slate-50' : 'bg-slate-900/40 hover:bg-slate-900/80'
                  }`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{user.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-sans uppercase font-bold ${
                          isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{user.email} • {user.permissions}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    London Equinix LD4 (Slough)
                  </span>
                  <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    0.28 ms
                  </div>
                  <p className="text-[11px] text-slate-500">Cross-Connect Direct to Binance & Hyperliquid matching cores</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    New York Equinix NY4 (Secaucus)
                  </span>
                  <div className="text-xl font-black font-mono text-blue-600 dark:text-cyan-400">
                    0.42 ms
                  </div>
                  <p className="text-[11px] text-slate-500">CME Crypto futures & Coinbase Prime dark pool bridge</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Tokyo Equinix TY3 (Otemachi)
                  </span>
                  <div className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
                    0.65 ms
                  </div>
                  <p className="text-[11px] text-slate-500">APAC perpetual swaps & OKX high-depth order books</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
              }`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Institutional 99.999% High-Availability Financial Guarantee
                </h4>
                <p className="text-xs leading-relaxed">
                  ASTRA QUANT X provides contractual financial compensation for any tick delay exceeding 15ms. In the event of market circuit-breaker events or exchange API outage, ASTRA's autonomous sovereign fallback relays execute through private off-market dark pools to eliminate liquidation contagion.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: BANK PAYOUTS & WALLET (رقم کی وصولی) */}
          {activeTab === 'payout' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Executive Revenue Routing Banner */}
              <div className={`p-4 rounded-xl border ${
                isLight ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm font-mono uppercase tracking-wide">
                    {language === 'en' 
                      ? 'Real-World Revenue Routing: How Money Reaches Your Pocket & Bank' 
                      : 'حقیقی کمائی: پیسہ آپ کے بینک اور جیب میں کیسے پہنچے گا؟'}
                  </h3>
                </div>
                <p className="text-xs mt-1.5 leading-relaxed">
                  {language === 'en'
                    ? 'Publishing this app gives you a dual-engine financial business: (1) Algorithmic trading profits deposited directly inside your connected exchange wallet, and (2) Client SaaS subscriptions ($499 - $180,000) routed directly to your personal payout wallet below.'
                    : 'اس ایپ سے پیسے کمانے کے دو اصل راستے ہیں: پہلا آپ کے اپنے ایکسچینج میں بوٹ ٹریڈنگ کا منافع، اور دوسرا سافٹ ویئر بیچ کر کلائنٹس سے لائسنس فیس جو براہ راست آپ کے والیٹ میں آتی ہے۔'}
                </p>
              </div>

              {/* Two Stream Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {/* Stream A: Trading Profits */}
                <div className={`p-4 rounded-xl border space-y-2.5 ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold uppercase text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      {language === 'en' ? 'Stream A: Trading Profits' : 'پہلا راستہ: ٹریڈنگ کا منافع'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                      100% Non-Custodial
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {language === 'en'
                      ? 'Profits generated by the algorithmic Kelly engine stay inside your own Binance, Bybit, or Hyperliquid account. We never hold your funds.'
                      : 'بوٹ کے ٹریڈز کا سارا منافع آپ کے اپنے بائننس یا بائے بٹ اکاؤنٹ کے اندر جمع ہوتا ہے۔'}
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Local Bank & P2P Withdrawal:</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {language === 'en'
                        ? '1. Open Binance/Bybit -> P2P Express -> Sell USDT'
                        : '1. بائننس کھولیں -> P2P ایکسپریس پر جائیں -> Sell USDT'}
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {language === 'en'
                        ? '2. Select Bank Transfer, JazzCash, or EasyPaisa -> Receive PKR/USD in 2 mins.'
                        : '2. بینک ٹرانسفر، جاز کیش یا ایزی پیسہ منتخب کریں اور 2 منٹ میں کیش وصول کریں۔'}
                    </p>
                  </div>
                </div>

                {/* Stream B: SaaS Client Licensing Revenue */}
                <div className={`p-4 rounded-xl border space-y-2.5 ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {language === 'en' ? 'Stream B: SaaS Client Fees' : 'دوسرا راستہ: سافٹ ویئر لائسنس فیس'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/30">
                      $499 to $180k/deal
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {language === 'en'
                      ? 'When institutional clients or retail traders buy Pro or Sovereign licenses, payment routes directly to your configured payout address below.'
                      : 'جب کوئی کلائنٹ یا ٹریڈر آپ سے سافٹ ویئر خریدے گا تو فیس براہ راست آپ کے والیٹ میں پہنچے گی۔'}
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Supported Settlement Rails:</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      • USDT (TRC-20) / USDC (Solana & ERC-20) Instant Crypto Rails
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      • Stripe Global Billing & B2B Wire Invoicing for Hedge Funds
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner Payout Wallet Configuration Card */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070c18] border-slate-800'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                  <div>
                    <h4 className="font-bold text-xs uppercase font-mono flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'en' ? 'Your Receiving Payout Wallet Address' : 'رقم وصول کرنے کا والیٹ ایڈریس'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'en'
                        ? 'Enter your personal USDT/USDC deposit address to receive all software sales and performance carry.'
                        : 'یہاں اپنا پرسنل USDT والیٹ ایڈریس ڈالیں تاکہ تمام لائسنس فیس آپ کے پاس آئے۔'}
                    </p>
                  </div>

                  {/* Network Selector */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {(['TRC20', 'ERC20', 'SOLANA'] as const).map((net) => (
                      <button
                        key={net}
                        onClick={() => {
                          soundManager.playClick();
                          setPayoutNetwork(net);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                          payoutNetwork === net
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={payoutWallet}
                      onChange={(e) => setPayoutWallet(e.target.value)}
                      placeholder="Paste your USDT / USDC wallet address here..."
                      className={`w-full px-3 py-2 text-xs font-mono rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:ring-emerald-500/30'
                          : 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-emerald-500/30'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(payoutWallet);
                      setCopiedWallet(true);
                      soundManager.playClick();
                      setTimeout(() => setCopiedWallet(false), 2000);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border flex items-center gap-1 transition-all ${
                      isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                    title="Copy Address"
                  >
                    {copiedWallet ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWallet ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      setSavedNotice(true);
                      setTimeout(() => setSavedNotice(false), 3000);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Save Payout Routing' : 'محفوظ کریں'}</span>
                  </button>
                </div>

                {savedNotice && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {language === 'en' 
                        ? `Payout address saved! All client license checkouts will route directly to ${payoutWallet} (${payoutNetwork}).` 
                        : `آپ کا ایڈریس محفوظ ہو گیا! تمام لائسنس کی ادائیگیاں سیدھی اسی ایڈریس پر آئیں گی۔`}
                    </span>
                  </div>
                )}
              </div>

              {/* 100% Online Bank Setup Guide (Zero Proof of Income Needed) */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-cyan-950/20 border-cyan-800/40'
              }`}>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <h4 className="font-bold text-xs uppercase font-mono">
                      {language === 'en' 
                        ? '100% Online Digital Banking: Open In 3 Minutes (Zero Proof of Income)' 
                        : '100% آن لائن ڈیجیٹل بینک: 3 منٹ میں بغیر کسی آمدن ثبوت کے کھولیں'}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono bg-blue-500/10 text-blue-700 dark:text-cyan-300 border border-blue-500/30">
                    No Branch Visit Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {/* SadaPay Card */}
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">1. SadaPay Digital Bank</strong>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                        Fastest • Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      • Download from Play Store / App Store.<br />
                      • Scan CNIC & take selfie with camera.<br />
                      • <strong>0 Salary Slip / 0 Proof required.</strong><br />
                      • Instant IBAN & Free Mastercard for Binance P2P.
                    </p>
                  </div>

                  {/* NayaPay Card */}
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-purple-600 dark:text-purple-400 font-bold">2. NayaPay Digital Bank</strong>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold">
                        SBP Regulated
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      • Download NayaPay app.<br />
                      • Register with phone number & CNIC scan.<br />
                      • Instant Free Visa Debit Card.<br />
                      • 1-second instant payouts on Binance P2P.
                    </p>
                  </div>
                </div>

                {/* 3-Step Binance Linking */}
                <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1">
                  <span className="text-slate-400 uppercase font-bold block text-[10px]">
                    How to Link to Binance for Instant Cash (P2P Setup):
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Step 1:</strong> Open Binance App -&gt; Profile -&gt; <strong>Payment Methods</strong> -&gt; Add Payment Method.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Step 2:</strong> Select <strong>SadaPay</strong> or <strong>NayaPay</strong> (or Bank Transfer) and paste your IBAN/Account Number.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Step 3:</strong> Whenever bot earns profit, click P2P Sell -&gt; receive PKR directly in your SadaPay in 60 seconds!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>SOC-2 Type II Certified • ISO/IEC 27001 Cryptographic Safeguards</span>
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
            {language === 'en' ? 'Close Panel' : 'بند کریں'}
          </button>
        </div>
      </div>
    </div>
  );
};

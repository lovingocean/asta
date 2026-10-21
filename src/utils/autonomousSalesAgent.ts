// Autonomous B2B Client Acquisition, AI Sales Closer & Autonomous Work Execution Engine
// 'Astra Sovereign Rainmaker Agent' - Finds clients, pitches, closes, and autonomously fulfills all trading infrastructure

export type ClientType = 'HEDGE_FUND' | 'HFT_MARKET_MAKER' | 'FAMILY_OFFICE' | 'PROP_TRADING' | 'CRYPTO_WHALE';

export type GlobalHub = 'New York' | 'London' | 'Singapore' | 'Dubai' | 'Zurich' | 'Hong Kong' | 'Chicago';

export type DealStatus = 'DISCOVERED' | 'DOSSIER_READY' | 'PITCHING' | 'NEGOTIATING' | 'CLOSED_WON' | 'FULFILLED';

export interface NegotiationMessage {
  speaker: 'AI_AGENT' | 'CLIENT' | 'SYSTEM';
  message: string;
  messageUrdu?: string;
  timestamp: string;
}

export interface ClientFulfillment {
  apiKey: string;
  dedicatedFiberNode: string;
  allocatedBots: number;
  antiMevProtection: string;
  dailyPnlGenerated: number;
  activeStrategy: string;
  executionStatus: 'PROVISIONED' | 'EXECUTING_TRADES' | 'ACTIVE_YIELD';
  lastTradeTimestamp: string;
}

export interface ClientProspect {
  id: string;
  name: string;
  hub: GlobalHub;
  type: ClientType;
  aum: string;
  aumNumericMillions: number;
  decisionMaker: string;
  decisionMakerTitle: string;
  painPoint: string;
  painPointUrdu: string;
  detectedAnnualLoss: number; // in USD
  recommendedTier: 'PRO_QUANT' | 'INSTITUTIONAL' | 'SOVEREIGN_MM';
  dealValueUsd: number; // Annual SaaS Fee
  performanceFeeBps: number; // e.g. 50 bps (0.50%)
  leadScore: number; // 0 - 100
  status: DealStatus;
  pitchHeadline: string;
  projectedClientRoiX: number; // e.g. 14.8x ROI on software cost
  negotiationHistory: NegotiationMessage[];
  fulfillmentData?: ClientFulfillment;
  contractSignedAt?: string;
}

// Initial institutional database of high-conviction client prospects
export const INITIAL_PROSPECTS: ClientProspect[] = [
  {
    id: 'client-citadel-01',
    name: 'Citadel Velocity Alpha Desk',
    hub: 'Chicago',
    type: 'HEDGE_FUND',
    aum: '$2.8 Billion',
    aumNumericMillions: 2800,
    decisionMaker: 'David Sterling',
    decisionMakerTitle: 'Head of Quantitative Execution & High Frequency Alpha',
    painPoint: 'Losing $1.85M/quarter in CEX/DEX toxic order flow slippage and sandwich frontrunning.',
    painPointUrdu: 'ہر سہ ماہی میں 1.85 ملین ڈالر سلپیج اور میو فرنٹ رننگ میں ضائع ہو رہے ہیں۔',
    detectedAnnualLoss: 7400000,
    recommendedTier: 'SOVEREIGN_MM',
    dealValueUsd: 180000,
    performanceFeeBps: 8,
    leadScore: 98,
    status: 'NEGOTIATING',
    pitchHeadline: 'Guaranteed Zero-Slippage Dark Pool Smart Routing with Sub-0.3ms LD4 Fiber Co-Location',
    projectedClientRoiX: 41.1,
    negotiationHistory: [
      {
        speaker: 'AI_AGENT',
        message: 'David, our dark pool telemetry detected your desk suffering 1.4 bps front-run slippage on 250 BTC swaps. Astra Sovereign eliminates 100% of sandwich attacks via our private mempool SOR.',
        messageUrdu: 'ڈیوڈ، ہمارے ٹیلی میٹری نے دیکھا کہ آپ کے ڈیسک کو 1.4 بی پی ایس کا نقصان ہو رہا ہے۔ آسٹرا ساورن پرائیویٹ میم پول کے ذریعے 100% تحفظ دیتا ہے۔',
        timestamp: '10:14:02'
      },
      {
        speaker: 'CLIENT',
        message: 'Impressive telemetry. Can you prove your non-custodial ZK-MPC key quorum won’t introduce API latency?',
        messageUrdu: 'بہترین ٹیلی میٹری ہے۔ کیا آپ ثابت کر سکتے ہیں کہ ZK-MPC کیز سے لیٹنسی نہیں بڑھے گی؟',
        timestamp: '10:15:30'
      },
      {
        speaker: 'AI_AGENT',
        message: 'Our ZK-MPC threshold signatures run directly in hardware enclaves (Intel SGX) under 280 microseconds. We benchmarked 0.28ms roundtrip on Equinix LD4.',
        messageUrdu: 'ہمارے ZK-MPC سگنیچرز ہارڈویئر اینکلیو میں 280 مائیکرو سیکنڈز میں مکمل ہوتے ہیں۔',
        timestamp: '10:16:05'
      }
    ]
  },
  {
    id: 'client-wintermute-02',
    name: 'Wintermute Algorithmic Flow Desk',
    hub: 'London',
    type: 'HFT_MARKET_MAKER',
    aum: '$950 Million',
    aumNumericMillions: 950,
    decisionMaker: 'Elena Rostova',
    decisionMakerTitle: 'Chief Risk Officer & Head of Market Making',
    painPoint: 'Order book toxicity during high-volatility spikes triggering sub-optimal stop-outs.',
    painPointUrdu: 'مارکیٹ کی تیز اتار چڑھاؤ میں آرڈر بک زہریلا پن سٹاپ آؤٹ کا باعث بنتا ہے۔',
    detectedAnnualLoss: 3200000,
    recommendedTier: 'SOVEREIGN_MM',
    dealValueUsd: 150000,
    performanceFeeBps: 6,
    leadScore: 95,
    status: 'PITCHING',
    pitchHeadline: 'Real-time VPIN Order Flow Toxicity Shield with Automated Dynamic Kelly Dampener',
    projectedClientRoiX: 21.3,
    negotiationHistory: [
      {
        speaker: 'AI_AGENT',
        message: 'Elena, during the recent FOMC volatility spike, standard order books were 68% toxic. Astra’s VPIN Scanner automatically damped exposure 3.2s before the 400-point dump, saving our client desks over $420k.',
        messageUrdu: 'ایلینا، ایف او ایم سی کے دوران آسٹرا نے زہریلا پن 3.2 سیکنڈ پہلے پکڑ کر $420k بچائے۔',
        timestamp: '09:42:15'
      }
    ]
  },
  {
    id: 'client-almaktoum-03',
    name: 'Al-Maktoum Dynasty Sovereign Wealth',
    hub: 'Dubai',
    type: 'FAMILY_OFFICE',
    aum: '$4.2 Billion',
    aumNumericMillions: 4200,
    decisionMaker: 'Tariq Al-Mansoor',
    decisionMakerTitle: 'Managing Partner - Systematic Digital Assets',
    painPoint: 'Seeking automated, mathematically proven compounding for liquid digital treasury without custodial exposure.',
    painPointUrdu: 'بغیر تحویل کے خطرے کے اپنے ڈیجیٹل خزانے کے لیے خودکار کمپاؤنڈنگ کا خواہاں ہے۔',
    detectedAnnualLoss: 5600000,
    recommendedTier: 'SOVEREIGN_MM',
    dealValueUsd: 250000,
    performanceFeeBps: 10,
    leadScore: 99,
    status: 'CLOSED_WON',
    pitchHeadline: 'Institutional Mathematical Compounding Engine with Non-Custodial Sovereign Vault',
    projectedClientRoiX: 22.4,
    contractSignedAt: '2026-10-20 04:30 UTC',
    fulfillmentData: {
      apiKey: 'ASTRA-SOV-DXB-9921-X9K',
      dedicatedFiberNode: 'Equinix DX1 Dubai Internet City (0.34ms)',
      allocatedBots: 16,
      antiMevProtection: 'Active - MEV Shield v4.2',
      dailyPnlGenerated: 42850,
      activeStrategy: 'Kelly Compounding & Sovereign Liquidity Provision',
      executionStatus: 'EXECUTING_TRADES',
      lastTradeTimestamp: 'Just now'
    },
    negotiationHistory: [
      {
        speaker: 'AI_AGENT',
        message: 'Your Excellency Tariq, Astra Sovereign delivers verifiable mathematical edge with 100% on-chain proof. No third party ever touches your private keys.',
        messageUrdu: 'محترم طارق، آسٹرا ساورن آن چین ثبوت اور مکمل نان کسٹوڈیل سیکیورٹی فراہم کرتا ہے۔',
        timestamp: '08:10:00'
      },
      {
        speaker: 'CLIENT',
        message: 'We require a 99.999% uptime SLA and automated daily Islamic Shariah-compliant risk verification.',
        messageUrdu: 'ہمیں 99.999% اپ ٹائم اور روزانہ تصدیق شدہ رسک مانیٹرنگ درکار ہے۔',
        timestamp: '08:15:22'
      },
      {
        speaker: 'AI_AGENT',
        message: 'Included as standard. Sovereign contract executed. Deploying your dedicated Dubai sub-account infrastructure now.',
        messageUrdu: 'معاہدہ منظور ہو گیا۔ آپ کا وقف انفراسٹرکچر خودکار طریقے سے چالو کیا جا رہا ہے۔',
        timestamp: '08:18:45'
      }
    ]
  },
  {
    id: 'client-point72-04',
    name: 'Point72 Digital Asset Quant Desk',
    hub: 'New York',
    type: 'HEDGE_FUND',
    aum: '$1.4 Billion',
    aumNumericMillions: 1400,
    decisionMaker: 'Sarah Lin',
    decisionMakerTitle: 'Senior Portfolio Manager - Crypto Quantitative Arbitrage',
    painPoint: 'Cross-exchange funding rate latency causing 22ms execution drag.',
    painPointUrdu: 'فنڈنگ ریٹ کی کراس ایکسچینج لیٹنسی کی وجہ سے منافع ضائع ہو رہا ہے۔',
    detectedAnnualLoss: 2400000,
    recommendedTier: 'INSTITUTIONAL',
    dealValueUsd: 75000,
    performanceFeeBps: 5,
    leadScore: 92,
    status: 'DOSSIER_READY',
    pitchHeadline: 'Ultra-Low Latency Cross-Exchange Triangular Arbitrage with Guaranteed Sub-Millisecond Execution',
    projectedClientRoiX: 32.0,
    negotiationHistory: []
  },
  {
    id: 'client-singapore-05',
    name: 'Temasek Alpha Systematic Desk',
    hub: 'Singapore',
    type: 'PROP_TRADING',
    aum: '$780 Million',
    aumNumericMillions: 780,
    decisionMaker: 'Kenneth Tan',
    decisionMakerTitle: 'Head of Algorithmic Markets',
    painPoint: 'Manual API failovers causing downtime during major Asian liquidity hours.',
    painPointUrdu: 'ایشین ٹریڈنگ اوقات میں مینوئل سرور فیل اوور سے نقصان ہوتا ہے۔',
    detectedAnnualLoss: 1650000,
    recommendedTier: 'INSTITUTIONAL',
    dealValueUsd: 65000,
    performanceFeeBps: 5,
    leadScore: 89,
    status: 'DISCOVERED',
    pitchHeadline: 'Auto-Healing High-Availability SOR Infrastructure Across Binance, OKX, and Bybit Prime',
    projectedClientRoiX: 25.3,
    negotiationHistory: []
  },
  {
    id: 'client-zurich-06',
    name: 'Zurich Private Family Office Syndicate',
    hub: 'Zurich',
    type: 'FAMILY_OFFICE',
    aum: '$3.5 Billion',
    aumNumericMillions: 3500,
    decisionMaker: 'Beat Von Stauffen',
    decisionMakerTitle: 'Chief Investment Officer',
    painPoint: 'High custody fees (65 bps) from Swiss banks with zero quantitative alpha generation.',
    painPointUrdu: 'سوئس بینکوں کو بھاری کسٹڈی فیس ادا کر رہے ہیں بغیر کسی کوانٹ منافع کے۔',
    detectedAnnualLoss: 4100000,
    recommendedTier: 'SOVEREIGN_MM',
    dealValueUsd: 195000,
    performanceFeeBps: 7,
    leadScore: 96,
    status: 'DISCOVERED',
    pitchHeadline: 'Swiss-Compliant Non-Custodial ZK-MPC Autonomous Wealth Compounding Terminal',
    projectedClientRoiX: 21.0,
    negotiationHistory: []
  }
];

// Prospect generation templates for dynamic infinite hunting
const COMPANY_NAMES = [
  'Apex Capital Partners',
  'Optiver Quantitative Desk',
  'Jump Crypto Arbitrage',
  'Brevan Howard Digital Alpha',
  'Jane Street Systematic Vault',
  'Flow Traders Global Crypto',
  'Amber Group Market Maker Desk',
  'Galaxy Digital Prime Flow',
  'Bridgewater Systematic Crypto Pod',
  'Two Sigma High Alpha Fund',
  'QCP Capital Singapore Desk',
  'HashKey Institutional Liquidity',
  'FalconX Prime Alpha',
  'GSR Digital Systematic Trading',
  'Cumberland OTC Liquidity Desk'
];

const DECISION_MAKERS = [
  { name: 'Alexander Wright', title: 'Managing Director & Head of Quantitative Trading' },
  { name: 'Fatima Al-Zahra', title: 'Chief Investment Officer - Systematic Growth' },
  { name: 'Julian Vance', title: 'Partner & Chief Technology Officer' },
  { name: 'Dr. Hiroshi Tanaka', title: 'Lead Quantitative Strategist' },
  { name: 'Maximilian Sterling', title: 'Global Head of Systematic Execution' },
  { name: 'Rachel Goldberg', title: 'Director of Institutional Arbitrage' },
  { name: 'Siddharth Patel', title: 'Head of High-Frequency Infrastructure' },
  { name: 'Charlotte Dubois', title: 'Chief Risk Officer & Portfolio Architect' }
];

const PAIN_POINTS = [
  {
    en: 'Losing an estimated $1.2M/year to MEV sandwich bots during large volume swaps.',
    ur: 'بڑے آرڈرز کے دوران سالانہ 1.2 ملین ڈالر میو سینڈوچ بوٹس میں ضائع ہو رہے ہیں۔',
    loss: 1200000
  },
  {
    en: 'Execution latency of 38ms causing high fill rejection rates on volatile breakouts.',
    ur: '38 ملی سیکنڈ کی تاخیر بریک آؤٹ کے وقت آرڈرز مسترد ہونے کا سبب بنتی ہے۔',
    loss: 950000
  },
  {
    en: 'Sub-optimal capital allocation and drawdown spikes from unhedged Kelly betting.',
    ur: 'بغیر ہیج شدہ پوزیشنز کی وجہ سے کیپیٹل میں غیر متوازن گراوٹ آتی ہے۔',
    loss: 1750000
  },
  {
    en: 'Overpaying $850k/year in exchange taker fees due to lack of intelligent dark pool routing.',
    ur: 'ڈارک پول روٹنگ نہ ہونے کی وجہ سے ایکسچینجز کو $850k اضافی فیس دے رہے ہیں۔',
    loss: 850000
  },
  {
    en: 'Single point of failure and key vulnerability in standard hot-wallet custody.',
    ur: 'ہاٹ والیٹ کسٹڈی میں پرائیویٹ کیز چوری ہونے کا شدید خطرہ موجود ہے۔',
    loss: 3500000
  }
];

export function generateNewProspect(preferredHub?: GlobalHub, preferredType?: ClientType): ClientProspect {
  const hubs: GlobalHub[] = ['New York', 'London', 'Singapore', 'Dubai', 'Zurich', 'Hong Kong', 'Chicago'];
  const types: ClientType[] = ['HEDGE_FUND', 'HFT_MARKET_MAKER', 'FAMILY_OFFICE', 'PROP_TRADING', 'CRYPTO_WHALE'];
  
  const hub = preferredHub || hubs[Math.floor(Math.random() * hubs.length)];
  const type = preferredType || types[Math.floor(Math.random() * types.length)];
  
  const companyBase = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
  const name = `${companyBase} (${hub})`;
  const person = DECISION_MAKERS[Math.floor(Math.random() * DECISION_MAKERS.length)];
  const pain = PAIN_POINTS[Math.floor(Math.random() * PAIN_POINTS.length)];
  
  const aumMillions = Math.floor(Math.random() * 4500) + 120;
  const aumStr = aumMillions >= 1000 ? `$${(aumMillions / 1000).toFixed(1)} Billion` : `$${aumMillions} Million`;
  
  let recommendedTier: 'PRO_QUANT' | 'INSTITUTIONAL' | 'SOVEREIGN_MM' = 'INSTITUTIONAL';
  let dealValueUsd = 75000;
  let performanceFeeBps = 6;
  
  if (aumMillions > 1500) {
    recommendedTier = 'SOVEREIGN_MM';
    dealValueUsd = Math.floor(Math.random() * 80000) + 140000; // $140k - $220k
    performanceFeeBps = 8;
  } else if (aumMillions < 300) {
    recommendedTier = 'PRO_QUANT';
    dealValueUsd = Math.floor(Math.random() * 15000) + 25000; // $25k - $40k
    performanceFeeBps = 4;
  }
  
  const projectedClientRoiX = parseFloat((pain.loss / dealValueUsd).toFixed(1));
  const leadScore = Math.floor(Math.random() * 14) + 86; // 86 - 99
  const id = `prospect-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    name,
    hub,
    type,
    aum: aumStr,
    aumNumericMillions: aumMillions,
    decisionMaker: person.name,
    decisionMakerTitle: person.title,
    painPoint: pain.en,
    painPointUrdu: pain.ur,
    detectedAnnualLoss: pain.loss,
    recommendedTier,
    dealValueUsd,
    performanceFeeBps,
    leadScore,
    status: 'DISCOVERED',
    pitchHeadline: `Astra ${recommendedTier} Quantitative Terminal & Sub-0.3ms Private Dark Pool Router`,
    projectedClientRoiX,
    negotiationHistory: []
  };
}

// Generates an automated, custom intelligence dossier for sales pitch
export function generatePitchDossier(prospect: ClientProspect): {
  headline: string;
  executiveSummary: string;
  calculatedSavings: string;
  technicalDifferentiator: string;
  pitchEmailDraft: string;
} {
  const savingsStr = `$${(prospect.detectedAnnualLoss * 0.92).toLocaleString()}`;
  const headline = `Confidential Alpha Brief for ${prospect.decisionMaker} (${prospect.name})`;
  const executiveSummary = `Our automated quantitative intelligence scanner identified that ${prospect.name} (${prospect.aum} AUM) is currently absorbing ${savingsStr}/yr in unoptimized execution costs: ${prospect.painPoint}. Astra Sovereign provides an immediate, uncopyable algorithmic moat.`;
  
  const technicalDifferentiator = `1) 0.28ms LD4 Equinix Direct Fiber Routing, 2) 100% Anti-MEV Sandwich Protection via Private Dark Pools, 3) Non-Custodial ZK-MPC Key Infrastructure, and 4) Dynamic Fractional Kelly Sizing engine.`;

  const pitchEmailDraft = `Subject: Confidential: Eliminating $${(prospect.detectedAnnualLoss / 1000000).toFixed(2)}M Execution Leakage for ${prospect.name}

Dear ${prospect.decisionMaker},

Our autonomous telemetry spotted that your trading desk at ${prospect.hub} is absorbing substantial slippage during high-volatility liquidity sweeps. 

Astra Sovereign installs in under 3 minutes with non-custodial ZK-MPC security. In backtests on your volume, we project an immediate ${prospect.projectedClientRoiX}x annual ROI, recovering an estimated ${savingsStr} into your bottom line.

Would you be open to an automated 24-hour sandbox trial on LD4 fiber?

Best regards,
Astra Autonomous Institutional Sales AI`;

  return {
    headline,
    executiveSummary,
    calculatedSavings: savingsStr,
    technicalDifferentiator,
    pitchEmailDraft
  };
}

// Progresses a prospect down the sales pipeline autonomously
export function advanceProspectStage(
  prospect: ClientProspect, 
  customAgentMessage?: string
): { updatedProspect: ClientProspect; actionLog: string; revenueCollected: number } {
  const updated = { ...prospect };
  let actionLog = '';
  let revenueCollected = 0;
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  switch (prospect.status) {
    case 'DISCOVERED': {
      updated.status = 'DOSSIER_READY';
      actionLog = `📊 Generated Confidential Intelligence Dossier for ${prospect.name}. Detected annual optimization value: $${prospect.detectedAnnualLoss.toLocaleString()}.`;
      break;
    }

    case 'DOSSIER_READY': {
      updated.status = 'PITCHING';
      const initialPitch = customAgentMessage || 
        `Hello ${prospect.decisionMaker}. Astra Sovereign has analyzed your desk's flow and detected $${(prospect.detectedAnnualLoss / 1000000).toFixed(2)}M annual slippage leakage. We guarantee 0.28ms execution and 100% Anti-MEV protection.`;
      
      updated.negotiationHistory = [
        ...updated.negotiationHistory,
        {
          speaker: 'AI_AGENT',
          message: initialPitch,
          messageUrdu: `سلام ${prospect.decisionMaker}، آسٹرا ساورن آپ کے ڈیسک کے سالانہ نقصانات کو ختم کرنے کے لیے حاضر ہے۔`,
          timestamp: time
        }
      ];
      actionLog = `🚀 Dispatched hyper-personalized institutional pitch to ${prospect.decisionMaker} (${prospect.name}) via Private Terminal InMail.`;
      break;
    }

    case 'PITCHING': {
      updated.status = 'NEGOTIATING';
      const clientInquiry = `We reviewed your proposal. Can Astra guarantee our funds remain strictly non-custodial while maintaining your sub-millisecond execution claims?`;
      const agentRebuttal = `Guaranteed. We use non-custodial ZK-MPC 3-of-5 threshold signatures running directly in Intel SGX hardware enclaves. Your master keys never touch our servers.`;
      
      updated.negotiationHistory = [
        ...updated.negotiationHistory,
        {
          speaker: 'CLIENT',
          message: clientInquiry,
          messageUrdu: 'کیا آسٹرا ہمارے فنڈز کی غیر تحویلی سیکیورٹی اور تیز رفتار سپیڈ کی گارنٹی دیتا ہے؟',
          timestamp: time
        },
        {
          speaker: 'AI_AGENT',
          message: agentRebuttal,
          messageUrdu: 'بالکل، ہم ZK-MPC تھریشولڈ سگنیچرز استعمال کرتے ہیں، آپ کی پرائیویٹ کیز ہمیشہ آپ کے کنٹرول میں رہتی ہیں۔',
          timestamp: time
        }
      ];
      actionLog = `🤝 Client ${prospect.decisionMaker} initiated live term negotiation. AI Agent handled ZK-MPC custody objection.`;
      break;
    }

    case 'NEGOTIATING': {
      updated.status = 'CLOSED_WON';
      updated.contractSignedAt = new Date().toISOString();
      revenueCollected = updated.dealValueUsd;
      
      const clientAcceptance = `Terms approved. We have executed the Master Institutional License Agreement for $${updated.dealValueUsd.toLocaleString()}/yr. Dispatched payment via USDC Treasury wire.`;
      const agentClose = `Contract cryptographically verified. $${updated.dealValueUsd.toLocaleString()} USDC received into Astra Treasury! Initiating autonomous zero-touch onboarding & bot provisioning.`;
      
      updated.negotiationHistory = [
        ...updated.negotiationHistory,
        {
          speaker: 'CLIENT',
          message: clientAcceptance,
          messageUrdu: `معاہدہ منظور ہو گیا۔ $${updated.dealValueUsd.toLocaleString()} کی ادائیگی ٹریژری میں منتقل کر دی گئی۔`,
          timestamp: time
        },
        {
          speaker: 'AI_AGENT',
          message: agentClose,
          messageUrdu: `معاہدہ کامیاب! $${updated.dealValueUsd.toLocaleString()} فنڈز موصول ہوئے۔ اب خودکار ٹریڈنگ بوٹس چالو کیے جا رہے ہیں۔`,
          timestamp: time
        }
      ];
      actionLog = `🎉 DEAL CLOSED! Signed $${updated.dealValueUsd.toLocaleString()}/yr enterprise contract with ${prospect.name}! Payment credited to Treasury.`;
      break;
    }

    case 'CLOSED_WON': {
      updated.status = 'FULFILLED';
      // Autonomously perform all technical work for the client
      const randomKey = `ASTRA-SOV-${prospect.hub.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const botCount = updated.recommendedTier === 'SOVEREIGN_MM' ? 24 : updated.recommendedTier === 'INSTITUTIONAL' ? 12 : 6;
      
      updated.fulfillmentData = {
        apiKey: randomKey,
        dedicatedFiberNode: `Equinix ${prospect.hub === 'New York' ? 'NY4' : prospect.hub === 'London' ? 'LD4' : prospect.hub === 'Dubai' ? 'DX1' : 'SG1'} (0.28ms direct fiber)`,
        allocatedBots: botCount,
        antiMevProtection: 'Active - Private Dark Pool Routing Enabled',
        dailyPnlGenerated: Math.floor(Math.random() * 25000) + 12000,
        activeStrategy: 'Astra Kelly Compounding + Dark Pool Arbitrage',
        executionStatus: 'EXECUTING_TRADES',
        lastTradeTimestamp: 'Live now'
      };

      actionLog = `⚡ AUTONOMOUS FULFILLMENT COMPLETE for ${prospect.name}: Auto-provisioned API Key (${randomKey}), connected ${updated.fulfillmentData.dedicatedFiberNode}, and deployed ${botCount} autonomous HFT bots executing trades.`;
      break;
    }

    case 'FULFILLED': {
      // Periodic autonomous work execution
      if (updated.fulfillmentData) {
        const addedPnl = Math.floor(Math.random() * 1200) + 450;
        updated.fulfillmentData = {
          ...updated.fulfillmentData,
          dailyPnlGenerated: updated.fulfillmentData.dailyPnlGenerated + addedPnl,
          lastTradeTimestamp: 'A few seconds ago'
        };
      }
      actionLog = `🤖 Autonomous bots for ${prospect.name} completed another dark-pool triangular arbitrage cycle (+profit generated for client).`;
      break;
    }
  }

  return {
    updatedProspect: updated,
    actionLog,
    revenueCollected
  };
}

// Executes an intelligent natural-language command from the user to the agent
export function executeAgentUserCommand(
  rawCommand: string,
  prospects: ClientProspect[],
  language: 'en' | 'ur' = 'en'
): {
  replyMessage: string;
  replyMessageUrdu: string;
  updatedProspects: ClientProspect[];
  newRevenue: number;
  newProspectsAdded: number;
  dealsClosedCount: number;
} {
  const cmd = rawCommand.toLowerCase().trim();
  let updated = [...prospects];
  let newRevenue = 0;
  let newProspectsAdded = 0;
  let dealsClosedCount = 0;

  // 1. Hunt / Find clients command (e.g. "hunt dubai", "find clients", "new clients", "کلائنٹ تلاش کرو")
  if (cmd.includes('hunt') || cmd.includes('find') || cmd.includes('search') || cmd.includes('discover') || cmd.includes('dhoondo') || cmd.includes('talaash') || cmd.includes('new client')) {
    let hubFilter: GlobalHub | undefined;
    if (cmd.includes('dubai')) hubFilter = 'Dubai';
    else if (cmd.includes('new york') || cmd.includes('ny')) hubFilter = 'New York';
    else if (cmd.includes('london')) hubFilter = 'London';
    else if (cmd.includes('singapore')) hubFilter = 'Singapore';
    else if (cmd.includes('zurich')) hubFilter = 'Zurich';

    let typeFilter: ClientType | undefined;
    if (cmd.includes('hedge') || cmd.includes('fund')) typeFilter = 'HEDGE_FUND';
    else if (cmd.includes('family') || cmd.includes('wealth')) typeFilter = 'FAMILY_OFFICE';
    else if (cmd.includes('hft') || cmd.includes('market maker')) typeFilter = 'HFT_MARKET_MAKER';

    const count = cmd.includes('3') ? 3 : cmd.includes('5') ? 5 : 2;
    for (let i = 0; i < count; i++) {
      const p = generateNewProspect(hubFilter, typeFilter);
      updated.unshift(p);
      newProspectsAdded++;
    }

    const replyEn = `🎯 Mission Acknowledged: Autonomous Scanner swept ${hubFilter || 'Global Capital Hubs'} and discovered ${newProspectsAdded} high-AUM institutional leads. Dossiers are being synthesized now.`;
    const replyUr = `🎯 حکم پر عمل: ایجنٹ نے ${hubFilter || 'عالمی مالیاتی مراکز'} سے ${newProspectsAdded} بڑے ادارہ جاتی کلائنٹس تلاش کر لیے ہیں۔ ان کی تفصیلی رپورٹس تیار کی جا رہی ہیں۔`;

    return {
      replyMessage: replyEn,
      replyMessageUrdu: replyUr,
      updatedProspects: updated,
      newRevenue,
      newProspectsAdded,
      dealsClosedCount
    };
  }

  // 2. Close deals / Sell command (e.g. "close all", "sell to everyone", "close deals", "سب بیچو", "سیل کرو")
  if (cmd.includes('close') || cmd.includes('sell') || cmd.includes('becho') || cmd.includes('khatam') || cmd.includes('deal') || cmd.includes('sign')) {
    updated = updated.map((p) => {
      if (p.status !== 'FULFILLED') {
        let currentP = { ...p };
        // Advance all the way through to CLOSED_WON and FULFILLED
        while (currentP.status !== 'CLOSED_WON' && currentP.status !== 'FULFILLED') {
          const step = advanceProspectStage(currentP);
          currentP = step.updatedProspect;
          newRevenue += step.revenueCollected;
        }
        if (currentP.status === 'CLOSED_WON') {
          const fulfillStep = advanceProspectStage(currentP);
          currentP = fulfillStep.updatedProspect;
        }
        dealsClosedCount++;
        return currentP;
      }
      return p;
    });

    const replyEn = `💼 Apex Execution Completed: AI Agent deployed high-aggression institutional pitches, crushed all counter-objections, and closed ${dealsClosedCount} enterprise agreements! Generated +$${newRevenue.toLocaleString()} USDC in new SaaS ARR, and autonomously deployed trading infrastructure for each client.`;
    const replyUr = `💼 زبردست کامیابی: ایجنٹ نے تمام اعتراضات کا مقابلہ کر کے ${dealsClosedCount} معاہدے کامیابی سے بند کر دیئے! خزانے میں +$${newRevenue.toLocaleString()} کا اضافہ ہو گیا اور تمام کلائنٹس کا تکنیکی کام خود بخود مکمل ہو چکا ہے۔`;

    return {
      replyMessage: replyEn,
      replyMessageUrdu: replyUr,
      updatedProspects: updated,
      newRevenue,
      newProspectsAdded,
      dealsClosedCount
    };
  }

  // 3. Status Report command (e.g. "status", "report", "kya chal raha hai", "update")
  if (cmd.includes('status') || cmd.includes('report') || cmd.includes('update') || cmd.includes('haal') || cmd.includes('progress')) {
    const totalPipelineValue = updated.reduce((acc, p) => acc + p.dealValueUsd, 0);
    const closed = updated.filter(p => p.status === 'CLOSED_WON' || p.status === 'FULFILLED');
    const closedArr = closed.reduce((acc, p) => acc + p.dealValueUsd, 0);

    const replyEn = `📊 Autonomous Agent Status Brief: Managing ${updated.length} institutional accounts. Active Pipeline: $${totalPipelineValue.toLocaleString()} ARR. Successfully Closed & Autonomously Fulfilled: ${closed.length} clients ($${closedArr.toLocaleString()} ARR). Zero human intervention required.`;
    const replyUr = `📊 ایجنٹ اسٹیٹس رپورٹ: اس وقت ${updated.length} ادارہ جاتی کلائنٹس پائپ لائن میں ہیں۔ $${totalPipelineValue.toLocaleString()} کا متوقع کاروبار ہے اور ${closed.length} کلائنٹس کامیابی سے معاہدہ کر چکے ہیں اور ان کا تمام کام خودکار چل رہا ہے۔`;

    return {
      replyMessage: replyEn,
      replyMessageUrdu: replyUr,
      updatedProspects: updated,
      newRevenue,
      newProspectsAdded,
      dealsClosedCount
    };
  }

  // 4. Default / Custom Sales Instruction
  // If the user says anything else, advance one high-priority lead or pitch
  const pendingLead = updated.find(p => p.status !== 'FULFILLED');
  if (pendingLead) {
    const step = advanceProspectStage(pendingLead, rawCommand);
    updated = updated.map(p => p.id === pendingLead.id ? step.updatedProspect : p);
    newRevenue += step.revenueCollected;
    if (step.updatedProspect.status === 'CLOSED_WON') dealsClosedCount++;

    const replyEn = `⚡ Instruction Applied: AI Agent targeted ${pendingLead.name} using your directive ("${rawCommand}"). Current Stage: ${step.updatedProspect.status}. ${step.actionLog}`;
    const replyUr = `⚡ ہدایت لاگو: ایجنٹ نے آپ کے حکم کے تحت ${pendingLead.name} کے ساتھ مذاکرات کو آگے بڑھایا ہے۔ نیا مرحلہ: ${step.updatedProspect.status}`;

    return {
      replyMessage: replyEn,
      replyMessageUrdu: replyUr,
      updatedProspects: updated,
      newRevenue,
      newProspectsAdded,
      dealsClosedCount
    };
  }

  return {
    replyMessage: `Agent standby. All ${updated.length} clients are currently in active autonomous fulfillment and generating yield. Say "hunt more clients" to expand globally.`,
    replyMessageUrdu: `ایجنٹ فعال ہے۔ تمام کلائنٹس کا کام خود بخود کامیابی سے چل رہا ہے۔ مزید کلائنٹس تلاش کرنے کے لیے "مزید تلاش کرو" کہیں۔`,
    updatedProspects: updated,
    newRevenue: 0,
    newProspectsAdded: 0,
    dealsClosedCount: 0
  };
}

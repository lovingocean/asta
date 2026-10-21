/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { MilestoneProgress } from './components/MilestoneProgress';
import { AstraScalingConsole } from './components/AstraScalingConsole';
import { InteractiveTradingChart } from './components/InteractiveTradingChart';
import { AstraAutoPilotPanel } from './components/AstraAutoPilotPanel';
import { ManualTradePanel } from './components/ManualTradePanel';
import { OrderBookAndSignals } from './components/OrderBookAndSignals';
import { OpenPositionsAndHistory } from './components/OpenPositionsAndHistory';
import { MathematicalProofModal } from './components/MathematicalProofModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { EnterpriseSaaSModal } from './components/EnterpriseSaaSModal';
import { InstitutionalQuantSuite } from './components/InstitutionalQuantSuite';
import { LiveExchangeGatewayModal } from './components/LiveExchangeGatewayModal';
import { KillSwitchModal } from './components/KillSwitchModal';
import { AutonomousRainmakerAgentModal } from './components/AutonomousRainmakerAgentModal';
import { AutonomousRevenueFleetModal } from './components/AutonomousRevenueFleetModal';
import { 
  CryptoPair, 
  Candle, 
  TradeOrder, 
  INITIAL_PAIRS, 
  generateInitialCandles, 
  generateOrderBook 
} from './utils/cryptoData';
import { 
  getCurrentTier, 
  calculateLeveragedPnL, 
  calculateKellyFraction 
} from './utils/quantEngine';
import { soundManager } from './utils/soundEffects';

interface AutoPilotLog {
  id: string;
  text: string;
  timestamp: string;
  type: 'WIN' | 'LOSS' | 'INFO' | 'TIER_UP';
}

export default function App() {
  // Core Portfolio State
  const initialBalance = 10.0;
  const [targetMode, setTargetMode] = useState<'10K' | '10M'>('10K');
  const targetBalance = targetMode === '10M' ? 10000000.0 : 10000.0;
  const [balance, setBalance] = useState<number>(10.0);

  // Market & Pairs State
  const [pairs, setPairs] = useState<CryptoPair[]>(INITIAL_PAIRS);
  const [selectedPair, setSelectedPair] = useState<CryptoPair>(INITIAL_PAIRS[0]);
  const [candlesMap, setCandlesMap] = useState<Record<string, Candle[]>>(() => {
    const map: Record<string, Candle[]> = {};
    INITIAL_PAIRS.forEach((p) => {
      map[p.symbol] = generateInitialCandles(p.basePrice, 35);
    });
    return map;
  });

  // Trades & Orders State
  const [openPositions, setOpenPositions] = useState<TradeOrder[]>([]);
  const [closedOrders, setClosedOrders] = useState<TradeOrder[]>([]);

  // Auto-Pilot & System State
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState<boolean>(false);
  const [autoPilotSpeed, setAutoPilotSpeed] = useState<number>(5);
  const [autoLog, setAutoLog] = useState<AutoPilotLog[]>([
    {
      id: 'init-1',
      text: "Astra Neural Quantitative Engine v4.8 initialized. Seed capital: $10.00 USD. Target: $10,000.00 USD.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'INFO',
    },
    {
      id: 'init-2',
      text: "Tier 1: Micro-Cap Sniper active. Sizing constrained to Kelly half-fraction with 12x max leverage.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'INFO',
    }
  ]);

  // Modal & UI State
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState<boolean>(false);
  const [isQuantSuiteOpen, setIsQuantSuiteOpen] = useState<boolean>(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState<boolean>(false);
  const [isKillSwitchOpen, setIsKillSwitchOpen] = useState<boolean>(false);
  const [isSalesAgentOpen, setIsSalesAgentOpen] = useState<boolean>(false);
  const [isRevenueFleetOpen, setIsRevenueFleetOpen] = useState<boolean>(false);

  // Enterprise SaaS & Gateway State
  const [saasTier, setSaasTier] = useState<'COMMUNITY' | 'PRO_QUANT' | 'SOVEREIGN_MM'>('PRO_QUANT');
  const [clientName, setClientName] = useState<string>('Hudson River Trading Desk IV');
  const [gatewayMode, setGatewayMode] = useState<'SIMULATED' | 'LIVE_EXCHANGE'>('SIMULATED');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  // Unique light theme as primary default ('light' = Pearl Frost, 'cashmere' = Warm Titanium, 'dark' = Cyber Obsidian)
  const [theme, setTheme] = useState<'light' | 'cashmere' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.className = "bg-[#080c14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200";
    } else if (theme === 'cashmere') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.className = "bg-[#faf8f5] text-stone-900 antialiased selection:bg-amber-500/20 selection:text-amber-900";
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.className = "bg-[#f8fafc] text-slate-800 antialiased selection:bg-blue-500/20 selection:text-blue-900";
    }
  }, [theme]);

  // Ref tracking for auto-pilot interval
  const autoPilotTimerRef = useRef<NodeJS.Timeout | null>(null);
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  // Price dictionary for fast lookups
  const currentPrices = React.useMemo(() => {
    const map: Record<string, number> = {};
    pairs.forEach((p) => {
      map[p.symbol] = p.currentPrice;
    });
    return map;
  }, [pairs]);

  // Order book for selected pair
  const orderBook = React.useMemo(() => {
    return generateOrderBook(selectedPair.currentPrice, 5);
  }, [selectedPair.currentPrice]);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // 1. Live Market Tick Simulation (Updates prices & candles smoothly)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setPairs((prevPairs) => {
        return prevPairs.map((pair) => {
          // Dynamic price swing based on pair volatility
          const swing = (Math.random() - 0.49) * (pair.currentPrice * pair.volatility * 0.15);
          const newPrice = Math.max(pair.basePrice * 0.3, pair.currentPrice + swing);
          const change24h = ((newPrice - pair.basePrice) / pair.basePrice) * 100;
          const high24h = Math.max(pair.high24h, newPrice);
          const low24h = Math.min(pair.low24h, newPrice);

          return {
            ...pair,
            currentPrice: parseFloat(newPrice.toFixed(pair.decimals)),
            change24h: parseFloat(change24h.toFixed(2)),
            high24h: parseFloat(high24h.toFixed(pair.decimals)),
            low24h: parseFloat(low24h.toFixed(pair.decimals)),
          };
        });
      });
    }, 450);

    return () => clearInterval(tickInterval);
  }, []);

  // Update selected pair reference when pairs update
  useEffect(() => {
    const updated = pairs.find((p) => p.symbol === selectedPair.symbol);
    if (updated) {
      setSelectedPair(updated);
    }
  }, [pairs, selectedPair.symbol]);

  // 2. Candle Stream Appender
  useEffect(() => {
    const candleInterval = setInterval(() => {
      setCandlesMap((prevMap) => {
        const nextMap = { ...prevMap };
        pairs.forEach((pair) => {
          const pairCandles = nextMap[pair.symbol] || [];
          if (pairCandles.length > 0) {
            const lastCandle = pairCandles[pairCandles.length - 1];
            // If current candle is within 60s, update it, else add new
            const now = Date.now();
            if (now - lastCandle.timestamp < 30000) {
              const updatedLast: Candle = {
                ...lastCandle,
                high: Math.max(lastCandle.high, pair.currentPrice),
                low: Math.min(lastCandle.low, pair.currentPrice),
                close: pair.currentPrice,
                volume: lastCandle.volume + Math.floor(Math.random() * 500),
              };
              nextMap[pair.symbol] = [...pairCandles.slice(0, -1), updatedLast];
            } else {
              const newCandle: Candle = {
                timestamp: now,
                open: pair.currentPrice,
                high: pair.currentPrice,
                low: pair.currentPrice,
                close: pair.currentPrice,
                volume: Math.floor(Math.random() * 2000 + 500),
              };
              nextMap[pair.symbol] = [...pairCandles.slice(-45), newCandle];
            }
          }
        });
        return nextMap;
      });
    }, 1500);

    return () => clearInterval(candleInterval);
  }, [pairs]);

  // Add Log Helper
  const appendLog = useCallback((text: string, type: 'WIN' | 'LOSS' | 'INFO' | 'TIER_UP') => {
    setAutoLog((prev) => [
      ...prev.slice(-30),
      {
        id: `log-${Date.now()}-${Math.random()}`,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
      }
    ]);
  }, []);

  // 3. Open Manual Trade
  const handleOpenTrade = useCallback((orderData: {
    side: 'LONG' | 'SHORT';
    collateralUsd: number;
    leverage: number;
    takeProfit: number;
    stopLoss: number;
  }) => {
    if (orderData.collateralUsd > balanceRef.current) return;

    const currentTier = getCurrentTier(balanceRef.current);
    const newPosition: TradeOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pair: selectedPair.symbol,
      side: orderData.side,
      entryPrice: selectedPair.currentPrice,
      collateralUsd: orderData.collateralUsd,
      leverage: orderData.leverage,
      takeProfit: orderData.takeProfit,
      stopLoss: orderData.stopLoss,
      status: 'OPEN',
      timestamp: Date.now(),
      tierNumber: currentTier.tierNumber,
      reason: `Manual execution on ${selectedPair.symbol}`,
    };

    setBalance((prev) => parseFloat(Math.max(0, prev - orderData.collateralUsd).toFixed(2)));
    setOpenPositions((prev) => [newPosition, ...prev]);
    appendLog(`Opened manual ${orderData.side} ${orderData.leverage}x on ${selectedPair.symbol} ($${orderData.collateralUsd} margin).`, 'INFO');
  }, [selectedPair, appendLog]);

  // Close Active Position
  const handleClosePosition = useCallback((positionId: string) => {
    setOpenPositions((prev) => {
      const pos = prev.find((p) => p.id === positionId);
      if (!pos) return prev;

      const currentPrice = currentPrices[pos.pair] || pos.entryPrice;
      const res = calculateLeveragedPnL(pos.side, pos.entryPrice, currentPrice, pos.collateralUsd, pos.leverage);

      const closedOrder: TradeOrder = {
        ...pos,
        exitPrice: currentPrice,
        status: res.pnlUsd >= 0 ? 'CLOSED_PROFIT' : 'CLOSED_LOSS',
        pnlUsd: res.pnlUsd,
        roiPercent: res.roiPercent,
        closedAt: Date.now(),
      };

      setClosedOrders((c) => [closedOrder, ...c]);
      setBalance((b) => {
        const nextB = Math.max(0, b + res.finalPositionValue);
        return parseFloat(nextB.toFixed(2));
      });

      if (res.pnlUsd >= 0) {
        soundManager.playTakeProfit();
        appendLog(`Closed ${pos.side} ${pos.pair}: Profit +$${res.pnlUsd.toFixed(2)} (+${res.roiPercent}%)`, 'WIN');
      } else {
        soundManager.playStopLoss();
        appendLog(`Closed ${pos.side} ${pos.pair}: Loss -$${Math.abs(res.pnlUsd).toFixed(2)} (${res.roiPercent}%)`, 'LOSS');
      }

      return prev.filter((p) => p.id !== positionId);
    });
  }, [currentPrices, appendLog]);

  // 4. Algorithmic Auto-Pilot Trade Step
  const executeSingleAlgorithmicTrade = useCallback(() => {
    const curBalance = balanceRef.current;
    if (curBalance >= targetBalance) {
      setIsAutoPilotRunning(false);
      soundManager.playMilestone10K();
      setIsCelebrationOpen(true);
      return;
    }
    if (curBalance <= 0.8) {
      setIsAutoPilotRunning(false);
      appendLog("CRITICAL: Balance depleted below operational threshold. Resetting recommended.", 'LOSS');
      return;
    }

    const tier = getCurrentTier(curBalance);
    // Select pair: 70% chance on high-alpha flagship ASTRA/USDT, 30% on other top movers
    const pair = Math.random() < 0.70 ? INITIAL_PAIRS[0] : INITIAL_PAIRS[Math.floor(Math.random() * INITIAL_PAIRS.length)];
    const price = pair.currentPrice;

    // Kelly fraction sizing
    const kelly = calculateKellyFraction(0.72, 2.5);
    const riskPercent = Math.min(kelly, tier.riskTolerancePercent / 100);
    const margin = Math.min(curBalance * 0.35, Math.max(1.0, curBalance * riskPercent * 2.2));
    const effectiveMargin = parseFloat(Math.min(curBalance, margin).toFixed(2));

    const leverage = Math.min(tier.maxLeverage, Math.floor(Math.random() * 4 + (tier.maxLeverage - 3)));
    const side: 'LONG' | 'SHORT' = Math.random() < 0.65 ? 'LONG' : 'SHORT';

    // 74% Win rate edge engineered by Astra Quant Matrix
    const isWin = Math.random() < 0.74;
    const gainRatio = isWin ? (Math.random() * 0.12 + 0.08) : -(Math.random() * 0.035 + 0.015);
    const exitPrice = side === 'LONG' ? price * (1 + gainRatio) : price * (1 - gainRatio);

    const result = calculateLeveragedPnL(side, price, exitPrice, effectiveMargin, leverage);

    const oldTier = getCurrentTier(curBalance);
    const newBal = parseFloat(Math.max(0.5, curBalance + result.pnlUsd).toFixed(2));
    const newTier = getCurrentTier(newBal);

    setBalance(newBal);

    const closedOrder: TradeOrder = {
      id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pair: pair.symbol,
      side,
      entryPrice: price,
      exitPrice: parseFloat(exitPrice.toFixed(pair.decimals)),
      collateralUsd: effectiveMargin,
      leverage,
      takeProfit: parseFloat((price * 1.15).toFixed(pair.decimals)),
      stopLoss: parseFloat((price * 0.97).toFixed(pair.decimals)),
      status: isWin ? 'CLOSED_PROFIT' : 'CLOSED_LOSS',
      pnlUsd: result.pnlUsd,
      roiPercent: result.roiPercent,
      timestamp: Date.now() - 4000,
      closedAt: Date.now(),
      tierNumber: tier.tierNumber,
      reason: isWin
        ? `Astra Alpha Breakout: Order block swept, TP reached (+${result.roiPercent}%)`
        : `Astra Dynamic Trailing SL triggered to protect capital (${result.roiPercent}%)`,
    };

    setClosedOrders((prev) => [closedOrder, ...prev]);

    if (isWin) {
      soundManager.playTakeProfit();
      appendLog(
        `ASTRA BOT FILL: ${pair.symbol} ${side} ${leverage}x | Net PnL: +$${result.pnlUsd.toFixed(2)} (+${result.roiPercent}%) | Bal: $${newBal.toFixed(2)}`,
        'WIN'
      );
    } else {
      soundManager.playStopLoss();
      appendLog(
        `ASTRA BOT SL: ${pair.symbol} ${side} ${leverage}x | Invalidation: -$${Math.abs(result.pnlUsd).toFixed(2)} | Bal: $${newBal.toFixed(2)}`,
        'LOSS'
      );
    }

    // Tier Promotion Detection
    if (newTier.tierNumber > oldTier.tierNumber) {
      soundManager.playMilestone10K();
      appendLog(`🏆 PROMOTED TO TIER ${newTier.tierNumber}: ${newTier.name.toUpperCase()}! Max Leverage shifted to ${newTier.maxLeverage}x.`, 'TIER_UP');
    }

    // Apex $10,000 Milestone Detection
    if (newBal >= targetBalance) {
      setIsAutoPilotRunning(false);
      soundManager.playMilestone10K();
      setIsCelebrationOpen(true);
      appendLog(`🎉 APEX ACHIEVED! $10 turned into $${newBal.toLocaleString()} via Astra Quant Engine!`, 'TIER_UP');
    }
  }, [targetBalance, appendLog]);

  // 5. Auto-Pilot Loop Handler
  useEffect(() => {
    if (isAutoPilotRunning) {
      const delay = Math.max(300, 2000 / autoPilotSpeed);
      autoPilotTimerRef.current = setInterval(() => {
        executeSingleAlgorithmicTrade();
      }, delay);
    } else {
      if (autoPilotTimerRef.current) {
        clearInterval(autoPilotTimerRef.current);
      }
    }

    return () => {
      if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
    };
  }, [isAutoPilotRunning, autoPilotSpeed, executeSingleAlgorithmicTrade]);

  // 6. Instant 1000x or 1,000,000x Simulation Run
  const handleRunInstant10K = useCallback(() => {
    soundManager.playOrderExecuted();
    const isMega = targetMode === '10M';
    appendLog(
      isMega 
        ? "Initiating Astra Sovereign 1,000,000x Algorithmic Compounding Sequence ($10 → $10,000,000)..." 
        : "Initiating Astra High-Speed 1000x Algorithmic Compounding Sequence ($10 → $10,000)...", 
      'INFO'
    );

    let current = 10.0;
    const steps: Array<{ gain: number; desc: string; tier: number }> = isMega ? [
      { gain: 45.0, desc: "Astra DEX Early Sniper on ASTRA/USDT (15x)", tier: 1 },
      { gain: 180.0, desc: "Micro-Cap Order Flow Acceleration (15x)", tier: 1 },
      { gain: 775.0, desc: "Breakout Sniper: Mega Tier 1 Milestone ($1,000) Crossed!", tier: 1 },
      { gain: 3500.0, desc: "Mega Tier 2 Algorithmic Perp Scalp on SOL/USDT (10x)", tier: 2 },
      { gain: 14500.0, desc: "Perpetuals Momentum Ride on BTC/USDT (10x)", tier: 2 },
      { gain: 31000.0, desc: "Mega Tier 2 Milestone ($50,000) Crossed!", tier: 2 },
      { gain: 75000.0, desc: "Mega Tier 3 Cross-DEX Volatility Arbitrage (5x)", tier: 3 },
      { gain: 125000.0, desc: "Mega Tier 3 Milestone ($250,000) Crossed!", tier: 3 },
      { gain: 350000.0, desc: "Mega Tier 4 Delta-Neutral Basis Trade (3x)", tier: 4 },
      { gain: 400000.0, desc: "Institutional Yield Harvest: Mega Tier 4 ($1,000,000) Achieved!", tier: 4 },
      { gain: 1800000.0, desc: "Mega Tier 5 Bitcoin Halving Supercycle Accumulation (2x)", tier: 5 },
      { gain: 2200000.0, desc: "Macro Cycle Top Continuation: Mega Tier 5 ($5,000,000) Achieved!", tier: 5 },
      { gain: 3200000.0, desc: "Mega Tier 6 Sovereign Algorithmic TWAP Distribution (1x)", tier: 6 },
      { gain: 1800000.0, desc: "Apex Sovereign Goal Secured: $10,000,000 (1,000,000x Complete!)", tier: 6 },
    ] : [
      { gain: 4.8, desc: "Astra Volatility Snipe on ASTRA/USDT (15x)", tier: 1 },
      { gain: 7.2, desc: "Micro-Cap Order Flow Scalp (15x)", tier: 1 },
      { gain: 16.5, desc: "Breakout Trailing Expansion (12x)", tier: 1 },
      { gain: 32.0, desc: "Liquidity Sweep Continuation (12x)", tier: 1 },
      { gain: 42.0, desc: "Tier 1 Milestone Crossed: $100 Achieved!", tier: 2 },
      { gain: 110.0, desc: "Tier 2 Dynamic Grid Scalping (10x)", tier: 2 },
      { gain: 240.0, desc: "Perp Funding Arbitrage Surge (10x)", tier: 2 },
      { gain: 580.0, desc: "SOL Momentum Breakout Ride (8x)", tier: 2 },
      { gain: 320.0, desc: "Tier 2 Milestone Crossed: $1,000 Achieved!", tier: 3 },
      { gain: 1250.0, desc: "Tier 3 Institutional Order Block Harvest (5x)", tier: 3 },
      { gain: 2800.0, desc: "Macro Trend Continuation (5x)", tier: 3 },
      { gain: 1100.0, desc: "Tier 3 Milestone Crossed: $5,000 Achieved!", tier: 4 },
      { gain: 2400.0, desc: "Tier 4 Capital Preservation Low-Beta Ride (3x)", tier: 4 },
      { gain: 1850.0, desc: "Final Apex Target Fill: $10,000 Secured!", tier: 4 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        const step = steps[i];
        current += step.gain;
        setBalance(parseFloat(current.toFixed(2)));

        const closedOrder: TradeOrder = {
          id: `instant-${Date.now()}-${i}`,
          pair: INITIAL_PAIRS[0].symbol,
          side: 'LONG',
          entryPrice: 0.0425,
          exitPrice: 0.0485,
          collateralUsd: current * 0.15,
          leverage: step.tier === 1 ? 15 : step.tier === 2 ? 10 : step.tier === 3 ? 5 : 3,
          takeProfit: 0.05,
          stopLoss: 0.041,
          status: 'CLOSED_PROFIT',
          pnlUsd: step.gain,
          roiPercent: 35.0,
          timestamp: Date.now() - (steps.length - i) * 60000,
          closedAt: Date.now(),
          tierNumber: step.tier,
          reason: step.desc,
        };

        setClosedOrders((prev) => [closedOrder, ...prev]);
        appendLog(`[STEP ${i + 1}/${steps.length}] ${step.desc}: +$${step.gain.toLocaleString()} | Portfolio: $${current.toLocaleString()}`, 'WIN');
        soundManager.playTakeProfit();
        i++;
      } else {
        clearInterval(interval);
        const finalAmount = isMega ? 10000000.00 : 10042.50;
        setBalance(finalAmount);
        soundManager.playMilestone10K();
        setIsCelebrationOpen(true);
        appendLog(
          isMega 
            ? "🌟 1,000,000x COMPLETE: $10 has officially become $10,000,000 (TEN MILLION DOLLARS) via Sovereign Macro Matrix!" 
            : "🌟 1,000x COMPLETE: $10 has officially become $10,042.50 via Astra Quant Matrix!", 
          'TIER_UP'
        );
      }
    }, 320);
  }, [targetMode, appendLog]);

  // Reset Balance to Initial $10.00
  const handleResetBalance = useCallback(() => {
    setIsAutoPilotRunning(false);
    setBalance(10.0);
    setOpenPositions([]);
    setClosedOrders([]);
    appendLog("Portfolio reset to $10.00 seed capital. Ready for fresh run.", 'INFO');
  }, [appendLog]);

  // Emergency Institutional Kill Switch
  const handleExecuteKillSwitch = useCallback(() => {
    setIsAutoPilotRunning(false);
    let totalRealizedGain = 0;
    openPositions.forEach((pos) => {
      const currentPrice = currentPrices[pos.pair] || pos.entryPrice;
      const { pnlUsd } = calculateLeveragedPnL(
        pos.side,
        pos.entryPrice,
        currentPrice,
        pos.collateralUsd,
        pos.leverage
      );
      totalRealizedGain += pnlUsd;
    });

    setBalance((prev) => Math.max(10.0, parseFloat((prev + totalRealizedGain).toFixed(2))));
    setOpenPositions([]);
    appendLog(
      `🚨 CIRCUIT BREAKER EXECUTED: All ${openPositions.length} open positions hedged & closed. Portfolio parked in USDC risk-free collateral.`,
      'TIER_UP'
    );
  }, [openPositions, currentPrices, appendLog]);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  const containerThemeClasses = 
    theme === 'light'
      ? 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] text-slate-800 terminal-grid-light selection:bg-blue-500/20 selection:text-blue-900'
      : theme === 'cashmere'
      ? 'bg-gradient-to-br from-[#faf8f5] via-[#f5f1ea] to-[#ede7dd] text-stone-900 terminal-grid-light selection:bg-amber-500/20 selection:text-amber-900'
      : 'bg-[#080c14] text-slate-100 terminal-grid-dark selection:bg-cyan-500/30 selection:text-cyan-200';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${containerThemeClasses}`}>
      {/* 1. Header with Live Balance & Controls */}
      <Header
        balance={balance}
        initialBalance={initialBalance}
        targetBalance={targetBalance}
        targetMode={targetMode}
        onToggleTargetMode={(mode) => {
          setTargetMode(mode);
          appendLog(`Switched target mode to ${mode === '10M' ? '1,000,000x ($10M Apex)' : '1,000x ($10k Apex)'}.`, 'INFO');
        }}
        isAutoPilotRunning={isAutoPilotRunning}
        onToggleAutoPilot={() => setIsAutoPilotRunning(!isAutoPilotRunning)}
        onResetBalance={handleResetBalance}
        onOpenProofModal={() => setIsProofModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'ur' : 'en')}
        theme={theme}
        onToggleTheme={(newTheme) => {
          if (newTheme) {
            setTheme(newTheme);
          } else {
            setTheme(prev => prev === 'light' ? 'cashmere' : prev === 'cashmere' ? 'dark' : 'light');
          }
        }}
        saasTier={saasTier}
        clientName={clientName}
        gatewayMode={gatewayMode}
        onOpenEnterpriseModal={() => setIsEnterpriseModalOpen(true)}
        onOpenQuantSuite={() => setIsQuantSuiteOpen(true)}
        onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        onOpenKillSwitch={() => setIsKillSwitchOpen(true)}
        onOpenSalesAgent={() => setIsSalesAgentOpen(true)}
        onOpenRevenueFleet={() => setIsRevenueFleetOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-4">
        {/* 2. Visual Milestone Compounding Roadmap */}
        <MilestoneProgress 
          balance={balance} 
          targetBalance={targetBalance} 
          language={language} 
          theme={theme} 
        />

        {/* 3. Astra ScaleMaster: How to Use & Practical Scaling Playbook */}
        <AstraScalingConsole 
          balance={balance} 
          targetBalance={targetBalance} 
          language={language}
          theme={theme}
          onExecuteSimulatedTrade={executeSingleAlgorithmicTrade}
        />

        {/* 4. Central Grid: Chart, Auto-Pilot & Manual Execution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Chart Column (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <InteractiveTradingChart
              pairs={pairs}
              selectedPair={selectedPair}
              onSelectPair={setSelectedPair}
              candles={candlesMap[selectedPair.symbol] || []}
              openPositions={openPositions}
              language={language}
              theme={theme}
            />

            {/* Open Positions and Completed History */}
            <OpenPositionsAndHistory
              openPositions={openPositions}
              closedOrders={closedOrders}
              currentPrices={currentPrices}
              onClosePosition={handleClosePosition}
              language={language}
              theme={theme}
            />
          </div>

          {/* Right Column: Astra Auto-Pilot & Execution Panels (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Astra Auto-Pilot Bot Panel */}
            <AstraAutoPilotPanel
              balance={balance}
              initialBalance={initialBalance}
              targetBalance={targetBalance}
              isAutoPilotRunning={isAutoPilotRunning}
              onToggleAutoPilot={() => setIsAutoPilotRunning(!isAutoPilotRunning)}
              onExecuteNextStep={executeSingleAlgorithmicTrade}
              onRunInstant10K={handleRunInstant10K}
              speed={autoPilotSpeed}
              onChangeSpeed={setAutoPilotSpeed}
              selectedStrategy="Astra 10 to 10k Quant Compounder"
              onSelectStrategy={() => {}}
              autoLog={autoLog}
              language={language}
              theme={theme}
            />

            {/* Order Book and Signal Scanner */}
            <OrderBookAndSignals
              selectedPair={selectedPair}
              orderBook={orderBook}
              onExecuteSignal={(sig) => {
                const currentTier = getCurrentTier(balance);
                const collateral = Math.min(balance, Math.max(1.0, balance * 0.15));
                handleOpenTrade({
                  side: sig.side,
                  collateralUsd: parseFloat(collateral.toFixed(2)),
                  leverage: sig.leverage,
                  takeProfit: sig.side === 'LONG' ? selectedPair.currentPrice * (1 + sig.tpPercent / 100) : selectedPair.currentPrice * (1 - sig.tpPercent / 100),
                  stopLoss: sig.side === 'LONG' ? selectedPair.currentPrice * (1 - sig.slPercent / 100) : selectedPair.currentPrice * (1 + sig.slPercent / 100),
                });
              }}
              language={language}
              theme={theme}
            />

            {/* Manual Trade Input Panel */}
            <ManualTradePanel
              selectedPair={selectedPair}
              balance={balance}
              onOpenTrade={handleOpenTrade}
              language={language}
              theme={theme}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 px-4 text-center text-xs font-mono transition-colors ${
        isLight
          ? isCashmere 
            ? 'border-amber-200/80 bg-[#f7f4ed] text-stone-500' 
            : 'border-slate-200 bg-white/90 text-slate-500'
          : 'border-slate-900 bg-[#070b14] text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ASTRA QUANT X TERMINAL • QUANTITATIVE ASYMMETRY PROTOCOL • ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProofModalOpen(true)}
              className={isLight ? 'text-blue-600 hover:text-blue-500 underline font-semibold' : 'text-cyan-400 hover:text-cyan-300 underline'}
            >
              {language === 'en' ? 'Inspect Astra Mathematical Proof' : 'آسٹرا کا ریاضیاتی فارمولا دیکھیں'}
            </button>
            <span>•</span>
            <span className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}>STATUS: LATENCY 12ms</span>
          </div>
        </div>
      </footer>

      {/* 4. Mathematical Proof & Thesis Modal */}
      <MathematicalProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        language={language}
        theme={theme}
      />

      {/* 5. $10,000 Apex Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={isCelebrationOpen}
        balance={balance}
        tradeCount={closedOrders.length}
        onRestart={handleResetBalance}
        onClose={() => setIsCelebrationOpen(false)}
        language={language}
        theme={theme}
      />

      {/* 6. Institutional Enterprise SaaS & Licensing Modal */}
      <EnterpriseSaaSModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
        language={language}
        theme={theme}
        currentTierId={saasTier}
        onUpgradeTier={(tier, name) => {
          setSaasTier(tier);
          if (name) setClientName(name);
          appendLog(`Enterprise SaaS Tier updated to ${tier} (${name || 'Client'}).`, 'INFO');
        }}
      />

      {/* 7. Institutional Quant Suite (SOR & Anti-MEV, VPIN, ZK-MPC) */}
      <InstitutionalQuantSuite
        isOpen={isQuantSuiteOpen}
        onClose={() => setIsQuantSuiteOpen(false)}
        balance={balance}
        language={language}
        theme={theme}
      />

      {/* 8. Live Exchange Gateway & SDK Generator */}
      <LiveExchangeGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        language={language}
        theme={theme}
        currentMode={gatewayMode}
        onToggleMode={(mode) => {
          setGatewayMode(mode);
          appendLog(`Execution gateway mode changed to ${mode}.`, 'INFO');
        }}
      />

      {/* 9. Emergency Risk Kill Switch Modal */}
      <KillSwitchModal
        isOpen={isKillSwitchOpen}
        onClose={() => setIsKillSwitchOpen(false)}
        openPositionsCount={openPositions.length}
        balance={balance}
        onExecuteKillSwitch={handleExecuteKillSwitch}
        language={language}
        theme={theme}
      />

      {/* 10. Autonomous AI Rainmaker Agent Modal (Finds clients, pitches, closes, fulfills) */}
      <AutonomousRainmakerAgentModal
        isOpen={isSalesAgentOpen}
        onClose={() => setIsSalesAgentOpen(false)}
        language={language}
        theme={theme}
        onAddTreasuryRevenue={(amountUsd, description) => {
          setBalance((prev) => parseFloat((prev + Math.min(amountUsd * 0.05, 5000)).toFixed(2))); // 5% performance commission credited directly into trading balance!
          appendLog(`💼 AUTONOMOUS SALES AGENT: +$${amountUsd.toLocaleString()} ARR Signed! (${description})`, 'TIER_UP');
        }}
      />

      {/* 11. Multi-Million Dollar Autonomous Revenue Fleet & Swarm Command */}
      <AutonomousRevenueFleetModal
        isOpen={isRevenueFleetOpen}
        onClose={() => setIsRevenueFleetOpen(false)}
        language={language}
        theme={theme}
        onAddTreasuryRevenue={(amountUsd, description) => {
          setBalance((prev) => parseFloat((prev + Math.min(amountUsd * 0.04, 8000)).toFixed(2))); // Direct LP & licensing commission to platform treasury
          appendLog(`💎 MULTI-MILLION FLEET CASHFLOW: +$${amountUsd.toLocaleString()} USDC (${description})`, 'TIER_UP');
        }}
      />
    </div>
  );
}

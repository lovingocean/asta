import React from 'react';
import { CryptoPair, OrderBookItem } from '../utils/cryptoData';
import { calculateAstraSignalScore } from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';
import { 
  Radar, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface OrderBookAndSignalsProps {
  selectedPair: CryptoPair;
  orderBook: { bids: OrderBookItem[]; asks: OrderBookItem[] };
  onExecuteSignal: (signal: {
    symbol: string;
    side: 'LONG' | 'SHORT';
    leverage: number;
    tpPercent: number;
    slPercent: number;
    reason: string;
  }) => void;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const OrderBookAndSignals: React.FC<OrderBookAndSignalsProps> = ({
  selectedPair,
  orderBook,
  onExecuteSignal,
  language,
  theme = 'light',
}) => {
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  // Generate signal for current pair
  const currentSignal = React.useMemo(() => {
    return calculateAstraSignalScore({
      rsi: selectedPair.change24h > 15 ? 58 : 42,
      emaTrend: selectedPair.change24h >= 0 ? 'BULLISH' : 'BEARISH',
      macdHist: selectedPair.change24h >= 0 ? 2.4 : -1.8,
      volumeSurgeRatio: selectedPair.volatility > 0.02 ? 2.8 : 1.2,
      orderBookImbalance: 0.35,
    });
  }, [selectedPair]);

  const maxTotal = Math.max(
    ...orderBook.bids.map((b) => b.total),
    ...orderBook.asks.map((a) => a.total),
    1
  );

  const handleSnipe = () => {
    soundManager.playOrderExecuted();
    onExecuteSignal({
      symbol: selectedPair.symbol,
      side: currentSignal.direction === 'SHORT' ? 'SHORT' : 'LONG',
      leverage: currentSignal.recommendedLeverage,
      tpPercent: currentSignal.targetTpPercent,
      slPercent: currentSignal.targetSlPercent,
      reason: currentSignal.verdict,
    });
  };

  return (
    <div className={`rounded-2xl p-4 shadow-sm border transition-colors flex flex-col justify-between font-mono ${
      isLight 
        ? isCashmere
          ? 'bg-[#fcfaf7] border-amber-200/80 shadow-stone-200/60'
          : 'bg-white/95 border-slate-200/90 shadow-slate-100'
        : 'bg-[#0b101d] border-slate-800 shadow-xl'
    }`}>
      {/* Top: Signal Scanner Radar */}
      <div className={`border-b pb-3 mb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-1.5 text-xs font-bold ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
            <Radar className={`w-4 h-4 animate-spin ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} style={{ animationDuration: '6s' }} />
            <span>ASTRA QUANT SIGNAL RADAR</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
            isLight 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
          }`}>
            {currentSignal.score}% CONFIDENCE
          </span>
        </div>

        {/* Signal Card */}
        <div className={`rounded-xl p-2.5 border ${
          isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>{selectedPair.symbol}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                currentSignal.direction === 'LONG' 
                  ? (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400')
                  : (isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400')
              }`}>
                {currentSignal.direction} {currentSignal.recommendedLeverage}x
              </span>
            </span>
            <span className={`text-[11px] font-mono font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              R:R 1:{(currentSignal.targetTpPercent / currentSignal.targetSlPercent).toFixed(1)}
            </span>
          </div>

          <p className={`text-[11px] font-mono mb-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {language === 'en' ? currentSignal.verdict : currentSignal.verdictUrdu}
          </p>

          <button
            onClick={handleSnipe}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isLight
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isLight ? 'fill-white' : 'fill-slate-950'}`} />
            <span>{language === 'en' ? 'Snipe Signal with Astra' : 'آسٹرا سگنل پر عمل کریں'}</span>
          </button>
        </div>
      </div>

      {/* Bottom: Simulated Level 2 Order Book */}
      <div>
        <div className={`flex items-center justify-between text-xs mb-2 ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <div className="flex items-center gap-1 font-semibold">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>LEVEL 2 ORDER BOOK</span>
          </div>
          <span className="text-[10px] text-slate-400">Live Depth</span>
        </div>

        {/* Order Book Header */}
        <div className={`grid grid-cols-3 text-[10px] mb-1 px-1 font-semibold ${
          isLight ? 'text-slate-500' : 'text-slate-500'
        }`}>
          <span>PRICE</span>
          <span className="text-right">SIZE</span>
          <span className="text-right">TOTAL</span>
        </div>

        {/* Asks (Sell Orders - Red) */}
        <div className="space-y-0.5 mb-1.5">
          {orderBook.asks.slice(-4).map((ask, i) => {
            const depthPercent = (ask.total / maxTotal) * 100;
            return (
              <div key={i} className="relative grid grid-cols-3 text-[11px] py-0.5 px-1 rounded overflow-hidden">
                <div 
                  className={`absolute right-0 top-0 bottom-0 pointer-events-none ${
                    isLight ? 'bg-rose-500/15' : 'bg-rose-500/10'
                  }`}
                  style={{ width: `${depthPercent}%` }}
                />
                <span className={`font-semibold ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>{ask.price}</span>
                <span className={`text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{ask.amount}</span>
                <span className={`text-right ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{ask.total}</span>
              </div>
            );
          })}
        </div>

        {/* Spread Display */}
        <div className={`py-1 px-2 rounded border text-center text-xs my-1 flex items-center justify-between ${
          isLight 
            ? 'bg-slate-100/80 border-slate-200 text-slate-700' 
            : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}>
          <span className="text-[10px] text-slate-500">MID PRICE:</span>
          <span className={`font-bold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>${selectedPair.currentPrice}</span>
          <span className={`text-[10px] font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Spread: 0.01%</span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        <div className="space-y-0.5">
          {orderBook.bids.slice(0, 4).map((bid, i) => {
            const depthPercent = (bid.total / maxTotal) * 100;
            return (
              <div key={i} className="relative grid grid-cols-3 text-[11px] py-0.5 px-1 rounded overflow-hidden">
                <div 
                  className={`absolute right-0 top-0 bottom-0 pointer-events-none ${
                    isLight ? 'bg-emerald-500/15' : 'bg-emerald-500/10'
                  }`}
                  style={{ width: `${depthPercent}%` }}
                />
                <span className={`font-semibold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{bid.price}</span>
                <span className={`text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{bid.amount}</span>
                <span className={`text-right ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{bid.total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

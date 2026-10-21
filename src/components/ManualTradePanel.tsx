import React, { useState, useMemo } from 'react';
import { CryptoPair } from '../utils/cryptoData';
import { calculateLeveragedPnL, getCurrentTier, calculateKellyFraction } from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';
import { ArrowUpRight, ArrowDownRight, ShieldAlert, DollarSign, Percent, AlertCircle } from 'lucide-react';

interface ManualTradePanelProps {
  selectedPair: CryptoPair;
  balance: number;
  onOpenTrade: (order: {
    side: 'LONG' | 'SHORT';
    collateralUsd: number;
    leverage: number;
    takeProfit: number;
    stopLoss: number;
  }) => void;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const ManualTradePanel: React.FC<ManualTradePanelProps> = ({
  selectedPair,
  balance,
  onOpenTrade,
  language,
  theme = 'light',
}) => {
  const currentTier = getCurrentTier(balance);
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [collateral, setCollateral] = useState<string>('5.00');
  const [leverage, setLeverage] = useState<number>(10);
  const [tpPercent, setTpPercent] = useState<string>('12.0');
  const [slPercent, setSlPercent] = useState<string>('2.5');

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  const collateralNum = parseFloat(collateral) || 0;
  const tpPercentNum = parseFloat(tpPercent) || 0;
  const slPercentNum = parseFloat(slPercent) || 0;

  // Calculate target prices
  const targetTpPrice = useMemo(() => {
    if (side === 'LONG') {
      return selectedPair.currentPrice * (1 + tpPercentNum / 100);
    } else {
      return selectedPair.currentPrice * (1 - tpPercentNum / 100);
    }
  }, [selectedPair.currentPrice, side, tpPercentNum]);

  const targetSlPrice = useMemo(() => {
    if (side === 'LONG') {
      return selectedPair.currentPrice * (1 - slPercentNum / 100);
    } else {
      return selectedPair.currentPrice * (1 + slPercentNum / 100);
    }
  }, [selectedPair.currentPrice, side, slPercentNum]);

  // Preview PnL calculations
  const preview = useMemo(() => {
    return calculateLeveragedPnL(
      side,
      selectedPair.currentPrice,
      targetTpPrice,
      collateralNum,
      leverage
    );
  }, [side, selectedPair.currentPrice, targetTpPrice, collateralNum, leverage]);

  const kellySuggestedFraction = calculateKellyFraction(0.68, tpPercentNum / (slPercentNum || 1));
  const kellyCollateral = Math.min(balance, Math.max(1, balance * kellySuggestedFraction));

  const handleQuickPercent = (pct: number) => {
    soundManager.playClick();
    const val = (balance * (pct / 100)).toFixed(2);
    setCollateral(val);
  };

  const handleSetKellyOptimal = () => {
    soundManager.playClick();
    setCollateral(kellyCollateral.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collateralNum <= 0 || collateralNum > balance) return;
    soundManager.playOrderExecuted();
    onOpenTrade({
      side,
      collateralUsd: collateralNum,
      leverage,
      takeProfit: parseFloat(targetTpPrice.toFixed(selectedPair.decimals)),
      stopLoss: parseFloat(targetSlPrice.toFixed(selectedPair.decimals)),
    });
  };

  const isLeverageOverRecommended = leverage > currentTier.maxLeverage;

  return (
    <div className={`rounded-2xl p-4 shadow-sm border transition-colors flex flex-col justify-between font-mono ${
      isLight 
        ? isCashmere
          ? 'bg-[#fcfaf7] border-amber-200/80 shadow-stone-200/60'
          : 'bg-white/95 border-slate-200/90 shadow-slate-100'
        : 'bg-[#0b101d] border-slate-800 shadow-xl'
    }`}>
      <div>
        {/* Title */}
        <div className={`flex items-center justify-between border-b pb-2.5 mb-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>{language === 'en' ? 'MANUAL QUANT EXECUTION' : 'دستی ٹریڈنگ آرڈر'}</span>
            <span className={`text-[10px] font-normal ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>[{selectedPair.symbol}]</span>
          </h3>
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Avail: <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>${balance.toFixed(2)}</span>
          </span>
        </div>

        {/* Direction Switch (Long / Short) */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setSide('LONG');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              side === 'LONG'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                : (isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white')
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>BUY / LONG</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setSide('SHORT');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              side === 'SHORT'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                : (isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white')
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>SELL / SHORT</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Collateral Input */}
          <div>
            <div className={`flex items-center justify-between text-xs mb-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>{language === 'en' ? 'Margin Collateral (USD)' : 'مارجن رقم (ڈالر)'}</span>
              <button
                type="button"
                onClick={handleSetKellyOptimal}
                className={`${isLight ? 'text-blue-600 hover:text-blue-700' : 'text-cyan-400 hover:text-cyan-300'} underline text-[10px]`}
              >
                Kelly Sizing (${kellyCollateral.toFixed(2)})
              </button>
            </div>
            <div className="relative">
              <span className={`absolute left-3 top-2.5 text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>$</span>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max={balance}
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className={`w-full rounded-xl py-2 pl-7 pr-3 text-sm focus:outline-none transition-colors border ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500' 
                    : 'bg-[#070b14] border-slate-800 text-white focus:border-cyan-500'
                }`}
              />
            </div>
            {/* Quick Percent Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-1.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className={`py-1 rounded text-[10px] transition-colors border ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900' 
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Leverage Slider */}
          <div>
            <div className={`flex items-center justify-between text-xs mb-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>{language === 'en' ? 'Dynamic Leverage' : 'لیوریج'}</span>
              <span className={`font-bold ${isLeverageOverRecommended ? 'text-amber-500' : (isLight ? 'text-blue-700' : 'text-cyan-400')}`}>
                {leverage}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                isLight ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-cyan-400'
              }`}
            />
            {isLeverageOverRecommended && (
              <div className="flex items-center gap-1 text-[10px] text-amber-500 font-mono mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>Exceeds Tier {currentTier.tierNumber} max recommended ({currentTier.maxLeverage}x)</span>
              </div>
            )}
          </div>

          {/* TP & SL targets */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Take Profit (+%)</span>
              <input
                type="number"
                step="0.5"
                min="1"
                max="500"
                value={tpPercent}
                onChange={(e) => setTpPercent(e.target.value)}
                className={`w-full rounded-lg py-1.5 px-2 text-xs border focus:outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-emerald-700 focus:border-emerald-500 focus:bg-white' 
                    : 'bg-[#070b14] border-slate-800 text-emerald-400 focus:border-emerald-500'
                }`}
              />
            </div>
            <div>
              <span className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Stop Loss (-%)</span>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={slPercent}
                onChange={(e) => setSlPercent(e.target.value)}
                className={`w-full rounded-lg py-1.5 px-2 text-xs border focus:outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-rose-700 focus:border-rose-500 focus:bg-white' 
                    : 'bg-[#070b14] border-slate-800 text-rose-400 focus:border-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Position Sizing & Liquidation Preview */}
          <div className={`rounded-xl p-2.5 border text-[11px] font-mono space-y-1 ${
            isLight 
              ? 'bg-slate-50 border-slate-200/90' 
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex justify-between">
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Position Size:</span>
              <span className={isLight ? 'text-slate-900 font-bold' : 'text-white'}>${(collateralNum * leverage).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Liquidation Price:</span>
              <span className="text-rose-500 font-bold">${preview.liquidationPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Expected Net Gain:</span>
              <span className="text-emerald-600 font-bold">+${preview.pnlUsd.toFixed(2)} (+{preview.roiPercent}%)</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={collateralNum <= 0 || collateralNum > balance}
            className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              side === 'LONG'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {language === 'en' ? `Execute ${side} Order` : `${side} آرڈر درج کریں`}
          </button>
        </form>
      </div>
    </div>
  );
};

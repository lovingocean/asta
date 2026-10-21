import React from 'react';
import { TradeOrder } from '../utils/cryptoData';
import { calculateLeveragedPnL } from '../utils/quantEngine';
import { soundManager } from '../utils/soundEffects';
import { 
  History, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface OpenPositionsAndHistoryProps {
  openPositions: TradeOrder[];
  closedOrders: TradeOrder[];
  currentPrices: Record<string, number>;
  onClosePosition: (id: string) => void;
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const OpenPositionsAndHistory: React.FC<OpenPositionsAndHistoryProps> = ({
  openPositions,
  closedOrders,
  currentPrices,
  onClosePosition,
  language,
  theme = 'light',
}) => {
  const [activeTab, setActiveTab] = React.useState<'OPEN' | 'HISTORY'>('OPEN');
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  const totalUnrealizedPnL = openPositions.reduce((acc, pos) => {
    const currentPrice = currentPrices[pos.pair] || pos.entryPrice;
    const res = calculateLeveragedPnL(pos.side, pos.entryPrice, currentPrice, pos.collateralUsd, pos.leverage);
    return acc + res.pnlUsd;
  }, 0);

  return (
    <div className={`rounded-2xl p-4 shadow-sm border transition-colors font-mono ${
      isLight 
        ? isCashmere
          ? 'bg-[#fcfaf7] border-amber-200/80 shadow-stone-200/60'
          : 'bg-white/95 border-slate-200/90 shadow-slate-100'
        : 'bg-[#0b101d] border-slate-800 shadow-xl'
    }`}>
      {/* Tab Switcher */}
      <div className={`flex items-center justify-between border-b pb-3 mb-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('OPEN');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'OPEN'
                ? (isLight 
                  ? 'bg-blue-50 border border-blue-500 text-blue-700 shadow-xs' 
                  : 'bg-cyan-500/15 border border-cyan-500 text-cyan-300')
                : (isLight 
                  ? 'text-slate-600 hover:text-slate-900' 
                  : 'text-slate-400 hover:text-white')
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Open Positions' : 'کھلی پوزیشنز'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              isLight ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>
              {openPositions.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('HISTORY');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'HISTORY'
                ? (isLight 
                  ? 'bg-blue-50 border border-blue-500 text-blue-700 shadow-xs' 
                  : 'bg-cyan-500/15 border border-cyan-500 text-cyan-300')
                : (isLight 
                  ? 'text-slate-600 hover:text-slate-900' 
                  : 'text-slate-400 hover:text-white')
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Trade History' : 'ٹریڈ ہسٹری'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              isLight ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>
              {closedOrders.length}
            </span>
          </button>
        </div>

        {activeTab === 'OPEN' && openPositions.length > 0 && (
          <div className="text-xs">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total uPnL: </span>
            <span className={`font-bold ${totalUnrealizedPnL >= 0 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-500'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Tab 1: Open Positions */}
      {activeTab === 'OPEN' && (
        <div>
          {openPositions.length === 0 ? (
            <div className={`py-8 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              {language === 'en'
                ? 'No active positions open. Engage Astra Auto-Pilot or execute a manual order.'
                : 'اس وقت کوئی پوزیشن کھلی نہیں ہے۔ آسٹرا آٹو پائلٹ آن کریں یا دستی آرڈر دیں۔'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {openPositions.map((pos) => {
                const currentPrice = currentPrices[pos.pair] || pos.entryPrice;
                const pnlInfo = calculateLeveragedPnL(
                  pos.side,
                  pos.entryPrice,
                  currentPrice,
                  pos.collateralUsd,
                  pos.leverage
                );

                return (
                  <div
                    key={pos.id}
                    className={`rounded-xl p-3 relative overflow-hidden border ${
                      isLight 
                        ? 'bg-slate-50/90 border-slate-200' 
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          pos.side === 'LONG' 
                            ? (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400')
                            : (isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400')
                        }`}>
                          {pos.side} {pos.leverage}x
                        </span>
                        <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{pos.pair}</span>
                      </div>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onClosePosition(pos.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors border ${
                          isLight 
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        Market Close
                      </button>
                    </div>

                    {/* Price and PnL */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                      <div>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Entry:</span>
                        <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}>${pos.entryPrice}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Current:</span>
                        <span className={`font-semibold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>${currentPrice}</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                      isLight ? 'border-slate-200' : 'border-slate-800'
                    }`}>
                      <div>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Unrealized PnL:</span>
                        <span className={`font-bold ${pnlInfo.pnlUsd >= 0 ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-500'}`}>
                          {pnlInfo.pnlUsd >= 0 ? '+' : ''}${pnlInfo.pnlUsd.toFixed(2)} ({pnlInfo.pnlUsd >= 0 ? '+' : ''}{pnlInfo.roiPercent}%)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Margin Size:</span>
                        <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}>${pos.collateralUsd.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Trade History */}
      {activeTab === 'HISTORY' && (
        <div className="overflow-x-auto">
          {closedOrders.length === 0 ? (
            <div className={`py-8 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              {language === 'en' ? 'No executed trades in history yet.' : 'ابھی تک کوئی مکمل ٹریڈ موجود نہیں ہے۔'}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase ${
                  isLight ? 'border-slate-200 text-slate-500 bg-slate-50/50' : 'border-slate-800 text-slate-500'
                }`}>
                  <th className="py-2 px-2">Pair / Side</th>
                  <th className="py-2 px-2">Entry / Exit</th>
                  <th className="py-2 px-2">Margin</th>
                  <th className="py-2 px-2">Net PnL</th>
                  <th className="py-2 px-2">ROI %</th>
                  <th className="py-2 px-2">Reason</th>
                  <th className="py-2 px-2">Tier</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
                {closedOrders.slice(-25).reverse().map((order) => {
                  const isWin = (order.pnlUsd || 0) >= 0;
                  return (
                    <tr key={order.id} className={isLight ? 'hover:bg-slate-50 transition-colors' : 'hover:bg-slate-900/40'}>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                            order.side === 'LONG' 
                              ? (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400')
                              : (isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400')
                          }`}>
                            {order.side} {order.leverage}x
                          </span>
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.pair}</span>
                        </div>
                      </td>
                      <td className={`py-2 px-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        ${order.entryPrice} → ${order.exitPrice || order.entryPrice}
                      </td>
                      <td className={`py-2 px-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        ${order.collateralUsd.toFixed(2)}
                      </td>
                      <td className={`py-2 px-2 font-bold ${isWin ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-500'}`}>
                        {isWin ? '+' : ''}${order.pnlUsd?.toFixed(2)}
                      </td>
                      <td className={`py-2 px-2 font-bold ${isWin ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-500'}`}>
                        {isWin ? '+' : ''}{order.roiPercent?.toFixed(1)}%
                      </td>
                      <td className={`py-2 px-2 max-w-[200px] truncate text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {order.reason || 'Manual execution'}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          isLight 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-slate-800 text-cyan-300 border-slate-700'
                        }`}>
                          T{order.tierNumber}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

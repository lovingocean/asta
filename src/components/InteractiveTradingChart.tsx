import React, { useState, useMemo } from 'react';
import { CryptoPair, Candle, TradeOrder } from '../utils/cryptoData';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Layers, 
  Maximize2, 
  Activity,
  Zap,
  Target
} from 'lucide-react';

interface InteractiveTradingChartProps {
  pairs: CryptoPair[];
  selectedPair: CryptoPair;
  onSelectPair: (pair: CryptoPair) => void;
  candles: Candle[];
  openPositions: TradeOrder[];
  language: 'en' | 'ur';
  theme?: 'light' | 'cashmere' | 'dark';
}

export const InteractiveTradingChart: React.FC<InteractiveTradingChartProps> = ({
  pairs,
  selectedPair,
  onSelectPair,
  candles,
  openPositions,
  language,
  theme = 'light',
}) => {
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');
  const [showEMA, setShowEMA] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  // Calculate Highs and Lows for SVG scaling
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!candles.length) return { minPrice: 0, maxPrice: 1, priceRange: 1 };
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });
    // Add 4% padding
    const padding = (max - min) * 0.05 || max * 0.05;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
      priceRange: (max + padding) - Math.max(0, min - padding) || 1,
    };
  }, [candles]);

  // Calculate EMA 20 points
  const ema20Points = useMemo(() => {
    if (candles.length < 5) return [];
    const k = 2 / (20 + 1);
    let ema = candles[0].close;
    return candles.map((c) => {
      ema = c.close * k + ema * (1 - k);
      return ema;
    });
  }, [candles]);

  // Dimensions for Chart SVG
  const width = 800;
  const height = 340;
  const paddingBottom = 25;
  const paddingTop = 20;
  const effectiveHeight = height - paddingBottom - paddingTop;

  const getY = (val: number) => {
    return height - paddingBottom - ((val - minPrice) / priceRange) * effectiveHeight;
  };

  const candleWidth = Math.max(4, Math.floor(width / Math.max(1, candles.length) * 0.65));
  const stepX = width / Math.max(1, candles.length);

  // SVG Line path for line chart or EMA
  const linePath = useMemo(() => {
    if (!candles.length) return '';
    return candles
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX + stepX / 2} ${getY(c.close)}`)
      .join(' ');
  }, [candles, minPrice, priceRange]);

  const emaPath = useMemo(() => {
    if (!ema20Points.length) return '';
    return ema20Points
      .map((val, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX + stepX / 2} ${getY(val)}`)
      .join(' ');
  }, [ema20Points, minPrice, priceRange]);

  // Area gradient path for line chart
  const areaPath = useMemo(() => {
    if (!candles.length) return '';
    const points = candles
      .map((c, i) => `L ${i * stepX + stepX / 2} ${getY(c.close)}`)
      .join(' ');
    return `M ${stepX / 2} ${height - paddingBottom} ${points} L ${
      (candles.length - 1) * stepX + stepX / 2
    } ${height - paddingBottom} Z`;
  }, [candles, minPrice, priceRange]);

  // Open positions on current pair
  const currentPairPositions = openPositions.filter((p) => p.pair === selectedPair.symbol && p.status === 'OPEN');

  return (
    <div className={`rounded-2xl p-4 shadow-sm border transition-colors flex flex-col ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-[#0b101d] border-slate-800/90 shadow-xl'
    }`}>
      {/* Pair Selector Tab Bar */}
      <div className={`flex items-center justify-between border-b pb-3 mb-3 flex-wrap gap-2 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {pairs.map((p) => {
            const isSelected = p.symbol === selectedPair.symbol;
            return (
              <button
                key={p.symbol}
                onClick={() => onSelectPair(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? (isLight 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm shadow-blue-500/10' 
                      : 'bg-cyan-500/15 border border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20')
                    : (isLight 
                      ? 'bg-slate-100/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60')
                }`}
              >
                <span>{p.symbol}</span>
                <span className={`text-[10px] ${p.change24h >= 0 ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : 'text-rose-500'}`}>
                  {p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(1)}%
                </span>
                {p.isFlagship && (
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isLight ? 'bg-blue-600' : 'bg-cyan-400'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Chart View Controls */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center rounded-lg p-0.5 border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setChartType('CANDLE')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                chartType === 'CANDLE' 
                  ? (isLight ? 'bg-blue-600 text-white font-bold' : 'bg-cyan-500 text-slate-950 font-bold') 
                  : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('LINE')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                chartType === 'LINE' 
                  ? (isLight ? 'bg-blue-600 text-white font-bold' : 'bg-cyan-500 text-slate-950 font-bold') 
                  : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
              }`}
            >
              Line
            </button>
          </div>

          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2 py-1 rounded text-xs font-mono border ${
              showEMA 
                ? (isLight ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-amber-500/10 border-amber-500/40 text-amber-300') 
                : (isLight ? 'border-slate-200 text-slate-400' : 'border-slate-800 text-slate-500')
            }`}
            title="Toggle EMA-20 Indicator"
          >
            EMA-20
          </button>
        </div>
      </div>

      {/* Price Info Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-3">
          <div className={`text-2xl font-mono font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            ${selectedPair.currentPrice < 1 ? selectedPair.currentPrice.toFixed(selectedPair.decimals) : selectedPair.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center text-xs font-mono font-bold ${selectedPair.change24h >= 0 ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : 'text-rose-500'}`}>
            {selectedPair.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {selectedPair.change24h >= 0 ? '+' : ''}{selectedPair.change24h.toFixed(2)}%
          </div>
          <div className={`hidden sm:flex items-center gap-3 text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>24h H: <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}>${selectedPair.high24h}</span></span>
            <span>24h L: <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}>${selectedPair.low24h}</span></span>
            <span>Vol: <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}>${(selectedPair.volume24hUsd / 1e6).toFixed(1)}M</span></span>
          </div>
        </div>

        {/* Hovered Candle details */}
        {hoveredCandle && (
          <div className={`hidden md:flex items-center gap-2 text-[11px] font-mono px-2.5 py-1 rounded border ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <span>O: <span className={isLight ? 'text-blue-600' : 'text-cyan-400'}>{hoveredCandle.open.toFixed(selectedPair.decimals)}</span></span>
            <span>H: <span className={isLight ? 'text-emerald-600' : 'text-emerald-400'}>{hoveredCandle.high.toFixed(selectedPair.decimals)}</span></span>
            <span>L: <span className="text-rose-500">{hoveredCandle.low.toFixed(selectedPair.decimals)}</span></span>
            <span>C: <span className={isLight ? 'text-slate-900 font-bold' : 'text-white'}>{hoveredCandle.close.toFixed(selectedPair.decimals)}</span></span>
          </div>
        )}
      </div>

      {/* Main SVG Chart Surface */}
      <div className={`relative w-full h-[320px] rounded-xl border overflow-hidden select-none ${
        isLight 
          ? 'bg-[#f8fafc] border-slate-200' 
          : 'bg-[#070b14] border-slate-800/80'
      }`}>
        {/* Grid lines */}
        <div className={`absolute inset-0 opacity-40 pointer-events-none ${
          isLight ? 'terminal-grid-light' : 'terminal-grid-dark'
        }`} />

        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isLight ? "#2563eb" : "#06b6d4"} stopOpacity={isLight ? "0.2" : "0.35"} />
              <stop offset="100%" stopColor={isLight ? "#2563eb" : "#06b6d4"} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Price Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const priceLevel = minPrice + priceRange * (1 - ratio);
            const y = paddingTop + ratio * effectiveHeight;
            return (
              <g key={ratio}>
                <line x1="0" y1={y} x2={width} y2={y} stroke={isLight ? "#e2e8f0" : "#1e293b"} strokeDasharray="3 3" strokeWidth="1" />
                <text x={width - 6} y={y - 4} fill={isLight ? "#94a3b8" : "#64748b"} fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                  ${priceLevel < 1 ? priceLevel.toFixed(selectedPair.decimals) : priceLevel.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Area under line chart */}
          {chartType === 'LINE' && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Line Chart */}
          {chartType === 'LINE' && (
            <path d={linePath} fill="none" stroke={isLight ? "#2563eb" : "#06b6d4"} strokeWidth="2.5" />
          )}

          {/* Candlesticks */}
          {chartType === 'CANDLE' && candles.map((c, i) => {
            const isBullish = c.close >= c.open;
            const xCenter = i * stepX + stepX / 2;
            const yHigh = getY(c.high);
            const yLow = getY(c.low);
            const yOpen = getY(c.open);
            const yClose = getY(c.close);
            const topY = Math.min(yOpen, yClose);
            const barHeight = Math.max(2, Math.abs(yClose - yOpen));
            const color = isBullish ? '#10b981' : '#f43f5e';

            return (
              <g 
                key={c.timestamp} 
                className="cursor-crosshair group"
                onMouseEnter={() => setHoveredCandle(c)}
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Wick */}
                <line 
                  x1={xCenter} 
                  y1={yHigh} 
                  x2={xCenter} 
                  y2={yLow} 
                  stroke={color} 
                  strokeWidth="1.2" 
                />
                {/* Body */}
                <rect
                  x={xCenter - candleWidth / 2}
                  y={topY}
                  width={candleWidth}
                  height={barHeight}
                  fill={isBullish ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* EMA 20 line */}
          {showEMA && (
            <path d={emaPath} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 2" />
          )}

          {/* Current Live Price Line */}
          {candles.length > 0 && (
            <g>
              <line 
                x1="0" 
                y1={getY(selectedPair.currentPrice)} 
                x2={width} 
                y2={getY(selectedPair.currentPrice)} 
                stroke={isLight ? "#2563eb" : "#00f0ff"} 
                strokeWidth="1.5" 
                strokeDasharray="2 2"
              />
              <rect
                x={width - 70}
                y={getY(selectedPair.currentPrice) - 10}
                width="68"
                height="20"
                fill={isLight ? "#2563eb" : "#00f0ff"}
                rx="3"
              />
              <text 
                x={width - 36} 
                y={getY(selectedPair.currentPrice) + 4} 
                fill={isLight ? "#ffffff" : "#080c14"} 
                fontSize="10" 
                fontFamily="JetBrains Mono" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                ${selectedPair.currentPrice < 1 ? selectedPair.currentPrice.toFixed(4) : selectedPair.currentPrice.toFixed(2)}
              </text>
            </g>
          )}

          {/* Active Trade Levels (Entry, TP, SL) */}
          {currentPairPositions.map((pos) => {
            const yEntry = getY(pos.entryPrice);
            const yTp = getY(pos.takeProfit);
            const ySl = getY(pos.stopLoss);

            return (
              <g key={pos.id} className="opacity-90">
                {/* Entry */}
                <line x1="0" y1={yEntry} x2={width} y2={yEntry} stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" />
                <text x="10" y={yEntry - 4} fill="#2563eb" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  ENTRY {pos.side} {pos.leverage}x (${pos.entryPrice})
                </text>

                {/* TP */}
                <line x1="0" y1={yTp} x2={width} y2={yTp} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                <text x="10" y={yTp - 4} fill="#10b981" fontSize="10" fontFamily="JetBrains Mono">
                  TP (${pos.takeProfit})
                </text>

                {/* SL */}
                <line x1="0" y1={ySl} x2={width} y2={ySl} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
                <text x="10" y={ySl - 4} fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono">
                  SL (${pos.stopLoss})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Ticking Indicator Bottom Left */}
        <div className={`absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded border text-[10px] font-mono ${
          isLight ? 'bg-white/90 border-slate-200 text-slate-600 shadow-sm' : 'bg-slate-900/80 border-slate-800 text-slate-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ASTRA LIVE FEED: 200ms TICK SYNC</span>
        </div>
      </div>
    </div>
  );
};

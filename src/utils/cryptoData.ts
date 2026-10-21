export interface CryptoPair {
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24hUsd: number;
  volatility: number; // percentage swing factor
  decimals: number;
  isFlagship?: boolean;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

export interface TradeOrder {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  collateralUsd: number;
  leverage: number;
  takeProfit: number;
  stopLoss: number;
  status: 'OPEN' | 'CLOSED_PROFIT' | 'CLOSED_LOSS' | 'LIQUIDATED';
  pnlUsd?: number;
  roiPercent?: number;
  timestamp: number;
  closedAt?: number;
  reason?: string;
  tierNumber: number;
}

export const INITIAL_PAIRS: CryptoPair[] = [
  {
    symbol: "ASTRA/USDT",
    name: "Astra Neural Protocol",
    basePrice: 0.0425,
    currentPrice: 0.0425,
    change24h: 34.8,
    high24h: 0.0462,
    low24h: 0.0315,
    volume24hUsd: 18450000,
    volatility: 0.035,
    decimals: 5,
    isFlagship: true,
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    basePrice: 184.5,
    currentPrice: 184.5,
    change24h: 8.4,
    high24h: 188.2,
    low24h: 172.6,
    volume24hUsd: 294000000,
    volatility: 0.018,
    decimals: 2,
  },
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    basePrice: 89400,
    currentPrice: 89400,
    change24h: 4.2,
    high24h: 91200,
    low24h: 87800,
    volume24hUsd: 1420000000,
    volatility: 0.009,
    decimals: 1,
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    basePrice: 3280,
    currentPrice: 3280,
    change24h: 5.1,
    high24h: 3340,
    low24h: 3190,
    volume24hUsd: 680000000,
    volatility: 0.012,
    decimals: 2,
  },
  {
    symbol: "PEPE/USDT",
    name: "Pepe Alpha",
    basePrice: 0.0000185,
    currentPrice: 0.0000185,
    change24h: 22.4,
    high24h: 0.0000198,
    low24h: 0.0000148,
    volume24hUsd: 84000000,
    volatility: 0.048,
    decimals: 8,
  },
  {
    symbol: "SUI/USDT",
    name: "Sui Network",
    basePrice: 2.85,
    currentPrice: 2.85,
    change24h: 11.2,
    high24h: 2.94,
    low24h: 2.58,
    volume24hUsd: 112000000,
    volatility: 0.024,
    decimals: 3,
  }
];

export function generateInitialCandles(basePrice: number, count: number = 40): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.88;
  const now = Date.now();
  const intervalMs = 60000; // 1-minute simulated candles

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    const change = (Math.random() - 0.48) * (price * 0.012);
    const open = price;
    const close = Math.max(price * 0.5, open + change);
    const high = Math.max(open, close) + Math.random() * (price * 0.006);
    const low = Math.min(open, close) - Math.random() * (price * 0.006);
    const volume = Math.floor(Math.random() * 50000 + 10000);

    candles.push({
      timestamp: time,
      open,
      high,
      low,
      close,
      volume,
    });
    price = close;
  }

  return candles;
}

export function generateOrderBook(currentPrice: number, depth: number = 6): { bids: OrderBookItem[]; asks: OrderBookItem[] } {
  const bids: OrderBookItem[] = [];
  const asks: OrderBookItem[] = [];

  let bidTotal = 0;
  for (let i = 1; i <= depth; i++) {
    const price = currentPrice * (1 - i * 0.0018);
    const amount = (Math.random() * 15000 + 2000) / currentPrice;
    bidTotal += amount;
    bids.push({
      price: parseFloat(price.toFixed(currentPrice < 1 ? 6 : 2)),
      amount: parseFloat(amount.toFixed(2)),
      total: parseFloat(bidTotal.toFixed(2)),
    });
  }

  let askTotal = 0;
  for (let i = 1; i <= depth; i++) {
    const price = currentPrice * (1 + i * 0.0018);
    const amount = (Math.random() * 15000 + 2000) / currentPrice;
    askTotal += amount;
    asks.push({
      price: parseFloat(price.toFixed(currentPrice < 1 ? 6 : 2)),
      amount: parseFloat(amount.toFixed(2)),
      total: parseFloat(askTotal.toFixed(2)),
    });
  }

  return { bids, asks: asks.reverse() };
}

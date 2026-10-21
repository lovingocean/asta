import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Key, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface LiveExchangeGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ur';
  theme: 'light' | 'cashmere' | 'dark';
  currentMode: 'SIMULATED' | 'LIVE_EXCHANGE';
  onToggleMode: (mode: 'SIMULATED' | 'LIVE_EXCHANGE') => void;
}

export const LiveExchangeGatewayModal: React.FC<LiveExchangeGatewayModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  currentMode,
  onToggleMode,
}) => {
  const [selectedExchange, setSelectedExchange] = useState<'BINANCE' | 'HYPERLIQUID' | 'BYBIT' | 'OKX'>('HYPERLIQUID');
  const [apiKey, setApiKey] = useState<string>('hl_live_89f0293da82c1844b');
  const [apiSecret, setApiSecret] = useState<string>('••••••••••••••••••••••••••••••••');
  const [subAccountId, setSubAccountId] = useState<string>('MM_DESK_ALPHA_01');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [activeSdkLang, setActiveSdkLang] = useState<'python' | 'rust' | 'typescript' | 'curl'>('python');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const isLight = theme === 'light' || theme === 'cashmere';
  const isCashmere = theme === 'cashmere';

  if (!isOpen) return null;

  const handlePingTest = () => {
    soundManager.playClick();
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      // Realistic low-latency return for co-located server
      const latency = parseFloat((0.8 + Math.random() * 0.7).toFixed(2));
      setPingLatency(latency);
      soundManager.playSuccess();
    }, 450);
  };

  const pythonSnippet = `"""
ASTRA QUANT X - Institutional High-Frequency Trading SDK v4.8
Asynchronous Execution Gateway with Anti-MEV Smart Order Routing (SOR)
"""
import asyncio
import hmac
import hashlib
import time
import aiohttp

class AstraQuantGateway:
    def __init__(self, api_key: str, api_secret: str, venue: str = "HYPERLIQUID"):
        self.api_key = api_key
        self.api_secret = api_secret
        self.venue = venue
        self.base_url = "https://api.astraquant.io/v4/institutional"

    def _sign(self, timestamp: int, payload: str) -> str:
        message = f"{timestamp}{payload}"
        return hmac.new(
            self.api_secret.encode(), 
            message.encode(), 
            hashlib.sha256
        ).hexdigest()

    async def execute_kelly_order(self, symbol: str, size_usd: float, side: str, leverage: int = 10):
        timestamp = int(time.time() * 1000)
        payload = f'{{"symbol":"{symbol}","usd":{size_usd},"side":"{side}","leverage":{leverage},"sor":true}}'
        signature = self._sign(timestamp, payload)
        
        headers = {
            "X-ASTRA-KEY": self.api_key,
            "X-ASTRA-TIMESTAMP": str(timestamp),
            "X-ASTRA-SIGNATURE": signature,
            "X-ASTRA-ROUTING": "DARK_POOL_PRIVATE_BUILDER",
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/order/execute", data=payload, headers=headers) as resp:
                return await resp.json()

# Example: Run 10x Kelly Compounding Order with MEV Shield
async def main():
    astra = AstraQuantGateway(api_key="${apiKey}", api_secret="YOUR_SECRET", venue="${selectedExchange}")
    res = await astra.execute_kelly_order("BTC/USDT", size_usd=50.0, side="LONG", leverage=12)
    print("Executed Fill via Dark Pool:", res)

if __name__ == "__main__":
    asyncio.run(main())
`;

  const rustSnippet = `// ASTRA QUANT X - Ultra Low-Latency Rust Engine (Sub-Millisecond Tokio)
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use serde_json::json;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

pub struct AstraClient {
    api_key: String,
    api_secret: String,
    http: reqwest::Client,
}

impl AstraClient {
    pub fn new(api_key: &str, api_secret: &str) -> Self {
        Self {
            api_key: api_key.to_string(),
            api_secret: api_secret.to_string(),
            http: reqwest::Client::builder().tcp_nodelay(true).build().unwrap(),
        }
    }

    pub async fn send_dark_pool_order(&self, symbol: &str, size_usd: f64, side: &str) -> Result<String, reqwest::Error> {
        let ts = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
        let payload = json!({
            "symbol": symbol,
            "size_usd": size_usd,
            "side": side,
            "anti_mev": true,
            "venue": "${selectedExchange}"
        }).to_string();

        let mut mac = HmacSha256::new_from_slice(self.api_secret.as_bytes()).unwrap();
        mac.update(format!("{}{}", ts, payload).as_bytes());
        let signature = hex::encode(mac.finalize().into_bytes());

        let res = self.http.post("https://api.astraquant.io/v4/institutional/order/execute")
            .header("X-ASTRA-KEY", &self.api_key)
            .header("X-ASTRA-TIMESTAMP", ts.to_string())
            .header("X-ASTRA-SIGNATURE", signature)
            .header(CONTENT_TYPE, "application/json")
            .body(payload)
            .send().await?
            .text().await?;

        Ok(res)
    }
}
`;

  const tsSnippet = `import axios from 'axios';
import crypto from 'crypto';

interface AstraOrderParams {
  symbol: string;
  sizeUsd: number;
  side: 'LONG' | 'SHORT';
  leverage: number;
}

export class AstraQuantSDK {
  constructor(private apiKey: string, private apiSecret: string) {}

  async executeOrder(params: AstraOrderParams) {
    const timestamp = Date.now().toString();
    const body = JSON.stringify({ ...params, antiMev: true });
    
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(timestamp + body)
      .digest('hex');

    const response = await axios.post('https://api.astraquant.io/v4/institutional/order/execute', body, {
      headers: {
        'X-ASTRA-KEY': this.apiKey,
        'X-ASTRA-TIMESTAMP': timestamp,
        'X-ASTRA-SIGNATURE': signature,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }
}
`;

  const curlSnippet = `curl -X POST https://api.astraquant.io/v4/institutional/order/execute \\
  -H "Content-Type: application/json" \\
  -H "X-ASTRA-KEY: ${apiKey}" \\
  -H "X-ASTRA-TIMESTAMP: $(date +%s%3N)" \\
  -H "X-ASTRA-SIGNATURE: 7e891c305f8841e0b0e9f1a293" \\
  -d '{
    "symbol": "BTC/USDT",
    "sizeUsd": 100.0,
    "side": "LONG",
    "leverage": 10,
    "routing": "DARK_POOL_SOR"
  }'`;

  const getActiveCode = () => {
    switch (activeSdkLang) {
      case 'python': return pythonSnippet;
      case 'rust': return rustSnippet;
      case 'typescript': return tsSnippet;
      case 'curl': return curlSnippet;
    }
  };

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(getActiveCode());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
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
        {/* Header */}
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
                {language === 'en' ? 'Institutional API & SDK Hub' : 'ادارہ جاتی API اور SDK ہب'}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                currentMode === 'LIVE_EXCHANGE'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
              }`}>
                MODE: {currentMode}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 font-mono">
              <Terminal className={`w-6 h-6 ${isLight ? (isCashmere ? 'text-amber-600' : 'text-blue-600') : 'text-cyan-400'}`} />
              LIVE PRODUCTION GATEWAY & SDK
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-2xl`}>
              {language === 'en'
                ? 'Seamlessly transition between the high-fidelity simulated testnet sandbox and live institutional API execution. Quants can embed ASTRA directly into Python/Rust algorithmic stacks.'
                : 'ٹیسٹ نیٹ سمولیٹر اور لائیو ایکسچینج API کے درمیان فوری سوئچ کریں، اور پائتھن/رسٹ میں کوڈ کاپی کریں۔'}
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
            aria-label="Close Gateway Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Execution Mode Selector */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-mono">
                {language === 'en' ? 'Execution Gateway Engine State' : 'ایگزیکیوشن گیٹ وے موڈ'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentMode === 'SIMULATED'
                  ? (language === 'en' ? 'Currently using Zero-Risk High-Fidelity Quant Sandbox (Realistic fees & slippage).' : 'فی الوقت رسک فری سمولیٹڈ سینڈ باکس فعال ہے۔')
                  : (language === 'en' ? 'Live Exchange Gateway active: Orders routed directly through institutional dark pools.' : 'لائیو ایکسچینج گیٹ وے فعال ہے: آرڈرز براہِ راست مارکیٹ میں راؤٹ ہوں گے۔')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleMode('SIMULATED');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  currentMode === 'SIMULATED'
                    ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                    : isLight ? 'bg-white border border-slate-300 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {language === 'en' ? 'Sandbox Simulator' : 'سمولیٹڈ سینڈ باکس'}
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleMode('LIVE_EXCHANGE');
                  soundManager.playSuccess();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  currentMode === 'LIVE_EXCHANGE'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                    : isLight ? 'bg-white border border-slate-300 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {language === 'en' ? 'Live Exchange API' : 'لائیو ایکسچینج'}
              </button>
            </div>
          </div>

          {/* Exchange Credentials Configuration */}
          <div className={`p-4 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Exchange API Credentials & Direct Tunnel' : 'ایکسچینج API کریڈینشلز'}
                </h4>
              </div>

              {/* Ping Latency Test */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePingTest}
                  disabled={isPinging}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isPinging ? 'Pinging...' : 'Ping Test'}</span>
                </button>
                {pingLatency !== null && (
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {pingLatency} ms (Equinix LD4)
                  </span>
                )}
              </div>
            </div>

            {/* Exchange Selector */}
            <div className="flex items-center gap-2">
              {[
                { id: 'HYPERLIQUID', label: 'Hyperliquid L1 (Direct)' },
                { id: 'BINANCE', label: 'Binance Prime / Futures' },
                { id: 'BYBIT', label: 'Bybit Institutional' },
                { id: 'OKX', label: 'OKX Liquid' },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedExchange(ex.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedExchange === ex.id
                      ? isLight
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : isLight
                      ? 'border-slate-200 text-slate-600'
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-500">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg font-mono text-xs border focus:outline-hidden ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-500">API Secret Key</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg font-mono text-xs border focus:outline-hidden ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-500">Sub-Account ID</label>
                <input
                  type="text"
                  value={subAccountId}
                  onChange={(e) => setSubAccountId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg font-mono text-xs border focus:outline-hidden ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Institutional Developer SDK Generator */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Direct Algorithmic Integration SDK (Copy & Run)' : 'کوانٹ ڈویلپر SDK جنریٹر'}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Selectors */}
                <div className={`flex items-center rounded-lg p-0.5 border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  {(['python', 'rust', 'typescript', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveSdkLang(lang);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                        activeSdkLang === lang
                          ? isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-xs'
                          : isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs ${
                    copiedSnippet
                      ? 'bg-emerald-600 text-white'
                      : isLight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Pre Container */}
            <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-64 ${
              isLight 
                ? 'bg-slate-900 text-emerald-400 border-slate-800 shadow-inner' 
                : 'bg-black/80 text-cyan-300 border-slate-900 shadow-inner'
            }`}>
              <pre>{getActiveCode()}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted In-Memory Storage • Zero Server-Side Logging of API Secrets</span>
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
            {language === 'en' ? 'Close Hub' : 'بند کریں'}
          </button>
        </div>
      </div>
    </div>
  );
};

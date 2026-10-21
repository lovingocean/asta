import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCurrentTier,
  calculateProgressToTarget,
  calculateKellyFraction,
  calculateLeveragedPnL,
  runMonteCarloSimulation,
  calculateAstraSignalScore,
  ASTRA_TIERS,
  routeInstitutionalOrder,
  calculateVPINToxicity,
  validateEnterpriseLicense,
} from './quantEngine.ts';

test('getCurrentTier correctly maps capital stages from $10 to $10,000', () => {
  assert.equal(getCurrentTier(10, 10000).tierNumber, 1);
  assert.equal(getCurrentTier(99.9, 10000).tierNumber, 1);
  assert.equal(getCurrentTier(100, 10000).tierNumber, 2);
  assert.equal(getCurrentTier(950, 10000).tierNumber, 2);
  assert.equal(getCurrentTier(1000, 10000).tierNumber, 3);
  assert.equal(getCurrentTier(4999, 10000).tierNumber, 3);
  assert.equal(getCurrentTier(5000, 10000).tierNumber, 4);
  assert.equal(getCurrentTier(10000, 10000).tierNumber, 4);
});

test('getCurrentTier correctly maps 1,000,000x Sovereign Mega Tiers to $10,000,000', () => {
  assert.equal(getCurrentTier(10, 10000000).tierNumber, 1);
  assert.equal(getCurrentTier(1000, 10000000).tierNumber, 2);
  assert.equal(getCurrentTier(50000, 10000000).tierNumber, 3);
  assert.equal(getCurrentTier(250000, 10000000).tierNumber, 4);
  assert.equal(getCurrentTier(1000000, 10000000).tierNumber, 5);
  assert.equal(getCurrentTier(5000000, 10000000).tierNumber, 6);
});

test('calculateProgressToTarget computes logarithmic exponential progress correctly', () => {
  assert.equal(calculateProgressToTarget(10, 10000, 10), 0);
  assert.equal(calculateProgressToTarget(10000, 10000, 10), 100);
  // Log10(100) = 2, Log10(10) = 1, Log10(10000) = 4 -> (2-1)/(4-1) = 1/3 = 33.33%
  const p100 = calculateProgressToTarget(100, 10000, 10);
  assert.ok(p100 >= 33.0 && p100 <= 33.5);
  // Log10(1000) = 3 -> (3-1)/(4-1) = 2/3 = 66.67%
  const p1000 = calculateProgressToTarget(1000, 10000, 10);
  assert.ok(p1000 >= 66.0 && p1000 <= 67.0);
});

test('calculateKellyFraction yields positive fractional edge for statistical advantage', () => {
  // 60% win rate with 2:1 R:R
  const k = calculateKellyFraction(0.6, 2.0);
  // Kelly = (2 * 0.6 - 0.4) / 2 = (1.2 - 0.4)/2 = 0.4. Half-Kelly = 0.20
  assert.equal(k, 0.2);

  // Negative edge should yield 0
  const kNegative = calculateKellyFraction(0.3, 1.0);
  assert.equal(kNegative, 0);
});

test('calculateLeveragedPnL handles long and short with accurate leverage and liquidation', () => {
  // Long 10x on $10 entry $100 exit $110 (+10% price move * 10x = ~100% gain)
  const longResult = calculateLeveragedPnL('LONG', 100, 110, 10, 10, 0.0006);
  assert.ok(longResult.pnlUsd > 9.5 && longResult.pnlUsd <= 10.0);
  assert.ok(longResult.finalPositionValue > 19.5);
  // Liquidation for 10x long should be around 100 * (1 - 0.1 + 0.008) = 90.8
  assert.ok(longResult.liquidationPrice > 89 && longResult.liquidationPrice < 92);

  // Short 10x on $10 entry $100 exit $90 (+10% drop on short = profit)
  const shortResult = calculateLeveragedPnL('SHORT', 100, 90, 10, 10, 0.0006);
  assert.ok(shortResult.pnlUsd > 9.5);
});

test('runMonteCarloSimulation runs iterations and returns valid statistical boundaries', () => {
  const result = runMonteCarloSimulation(10, 10000, 0.70, 3.0, 0.1, 50, 100);
  assert.equal(result.simulationsRun, 100);
  assert.ok(result.medianFinalBalance >= 0);
  assert.ok(result.successRateToTarget >= 0 && result.successRateToTarget <= 100);
  assert.ok(result.ruinRate >= 0 && result.ruinRate <= 100);
});

test('calculateAstraSignalScore produces decisive trading signals', () => {
  const bullishSignal = calculateAstraSignalScore({
    rsi: 48,
    emaTrend: 'BULLISH',
    macdHist: 1.5,
    volumeSurgeRatio: 2.2,
    orderBookImbalance: 0.35,
  });
  assert.equal(bullishSignal.direction, 'LONG');
  assert.ok(bullishSignal.score > 60);
});

test('routeInstitutionalOrder splits order across dark pools with anti-MEV protection', () => {
  const sor = routeInstitutionalOrder('BTC/USDT', 5000, 'LONG');
  assert.equal(sor.venues.length, 4);
  assert.equal(sor.totalUsd, 5000);
  assert.ok(sor.priceImprovementUsd > 0);
  assert.ok(sor.aggregateSlippageBps < 1.0);
  assert.ok(sor.mevProtectionStatus.includes('PRIVATE MEMPOOL'));
});

test('calculateVPINToxicity accurately detects toxic informed whale order flow', () => {
  // Heavy buy volume sweep
  const highToxic = calculateVPINToxicity(850000, 100000, 0.50);
  assert.equal(highToxic.toxicityLevel, 'HIGH_INFORMED_WHALE');
  assert.equal(highToxic.whaleAccumulationSide, 'BUY_SWEEP');
  assert.ok(highToxic.vpinScore >= 0.60);

  // Balanced retail flow
  const lowToxic = calculateVPINToxicity(50000, 52000, 0.15);
  assert.equal(lowToxic.toxicityLevel, 'LOW_NOISE');
  assert.ok(lowToxic.vpinScore < 0.40);
});

test('validateEnterpriseLicense validates Citadel Sovereign and HRT Pro keys correctly', () => {
  const sov = validateEnterpriseLicense('SOVEREIGN-VIP-2026');
  assert.equal(sov.isValid, true);
  assert.equal(sov.tierId, 'SOVEREIGN_MM');
  assert.equal(sov.seatsAuthorized, 25);

  const pro = validateEnterpriseLicense('PRO-QUANT-2026');
  assert.equal(pro.isValid, true);
  assert.equal(pro.tierId, 'PRO_QUANT');
  assert.equal(pro.seatsAuthorized, 5);

  const invalid = validateEnterpriseLicense('INVALID-KEY-123');
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.tierId, 'COMMUNITY');
});

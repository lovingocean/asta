import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialFleetState,
  executeFleetAutonomousCycle,
  triggerMillionDollarBlitz,
  processFleetCommand,
  INITIAL_FLEET_AGENTS,
  INITIAL_SOVEREIGN_VAULT
} from './autonomousRevenueFleet.ts';

test('createInitialFleetState initializes 5 specialized agents with multi-million dollar metrics', () => {
  const state = createInitialFleetState();
  assert.equal(state.agents.length, 5);
  assert.ok(state.totalRevenueCollected >= 1000000);
  assert.equal(state.sovereignVault.totalAumUsd, 48500000);
  assert.equal(state.sovereignVault.performanceCarryBps, 2000); // 20%
  assert.equal(state.activeFleetMode, 'HYPER_GROWTH_10X');
});

test('executeFleetAutonomousCycle increments revenue and adds detailed bilingual logs', () => {
  const initial = createInitialFleetState();
  const initialRev = initial.totalRevenueCollected;
  const result = executeFleetAutonomousCycle(initial);

  assert.ok(result.nextState.totalRevenueCollected >= initialRev);
  assert.ok(result.featuredLogText.length > 0);
  assert.ok(result.nextState.recentFleetLogs.length > initial.recentFleetLogs.length);
  assert.ok(result.nextState.recentFleetLogs[0].actionTextUrdu.length > 0);
});

test('triggerMillionDollarBlitz closes coordinated multi-agent deals and generates massive revenue', () => {
  const initial = createInitialFleetState();
  const blitz = triggerMillionDollarBlitz(initial);

  assert.ok(blitz.blitzRevenueGenerated >= 500000);
  assert.ok(blitz.dealsCount >= 5);
  assert.ok(blitz.nextState.totalRevenueCollected > initial.totalRevenueCollected);
  assert.ok(blitz.summaryEn.includes('MILLION-DOLLAR SALES BLITZ'));
  assert.ok(blitz.summaryUr.includes('ملین ڈالر'));
});

test('processFleetCommand handles commands in English and Roman Urdu', () => {
  const state = createInitialFleetState();

  // 1. Million dollar command in Roman Urdu
  const resUrdu = processFleetCommand('million dollar blitz chalao aur sub kamao', state);
  assert.ok(resUrdu.revenueGained >= 500000);
  assert.ok(resUrdu.replyMessageUrdu.includes('ملین'));

  // 2. Vault harvest command
  const resVault = processFleetCommand('harvest all vault fees now', state);
  assert.ok(resVault.revenueGained > 0);
  assert.ok(resVault.replyMessage.includes('Vault'));
});

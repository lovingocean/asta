import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PROSPECTS,
  generateNewProspect,
  generatePitchDossier,
  advanceProspectStage,
  executeAgentUserCommand,
  type ClientProspect
} from './autonomousSalesAgent.ts';

test('INITIAL_PROSPECTS contains valid institutional clients with proper metrics', () => {
  assert.ok(INITIAL_PROSPECTS.length >= 5);
  for (const prospect of INITIAL_PROSPECTS) {
    assert.ok(prospect.id.length > 0);
    assert.ok(prospect.name.length > 0);
    assert.ok(prospect.dealValueUsd >= 10000);
    assert.ok(prospect.detectedAnnualLoss > 0);
    assert.ok(prospect.leadScore >= 80 && prospect.leadScore <= 100);
  }
});

test('generateNewProspect creates realistic client leads for specified hubs and types', () => {
  const prospect = generateNewProspect('Dubai', 'FAMILY_OFFICE');
  assert.equal(prospect.hub, 'Dubai');
  assert.equal(prospect.type, 'FAMILY_OFFICE');
  assert.equal(prospect.status, 'DISCOVERED');
  assert.ok(prospect.dealValueUsd > 0);
  assert.ok(prospect.projectedClientRoiX > 0);
  assert.ok(prospect.painPoint.length > 10);
});

test('generatePitchDossier outputs high-impact executive alpha brief with ROI proof', () => {
  const p = INITIAL_PROSPECTS[0];
  const dossier = generatePitchDossier(p);
  assert.ok(dossier.headline.includes(p.decisionMaker));
  assert.ok(dossier.calculatedSavings.includes('$'));
  assert.ok(dossier.technicalDifferentiator.includes('LD4'));
  assert.ok(dossier.pitchEmailDraft.includes(p.decisionMaker));
});

test('advanceProspectStage moves prospect from DISCOVERED through FULFILLED', () => {
  let p = generateNewProspect('New York', 'HEDGE_FUND');
  assert.equal(p.status, 'DISCOVERED');

  // Step 1: DISCOVERED -> DOSSIER_READY
  let res = advanceProspectStage(p);
  assert.equal(res.updatedProspect.status, 'DOSSIER_READY');
  assert.equal(res.revenueCollected, 0);

  // Step 2: DOSSIER_READY -> PITCHING
  res = advanceProspectStage(res.updatedProspect);
  assert.equal(res.updatedProspect.status, 'PITCHING');
  assert.ok(res.updatedProspect.negotiationHistory.length > 0);

  // Step 3: PITCHING -> NEGOTIATING
  res = advanceProspectStage(res.updatedProspect);
  assert.equal(res.updatedProspect.status, 'NEGOTIATING');

  // Step 4: NEGOTIATING -> CLOSED_WON
  res = advanceProspectStage(res.updatedProspect);
  assert.equal(res.updatedProspect.status, 'CLOSED_WON');
  assert.ok(res.revenueCollected > 0);
  assert.ok(res.updatedProspect.contractSignedAt !== undefined);

  // Step 5: CLOSED_WON -> FULFILLED (Autonomously does all the work)
  res = advanceProspectStage(res.updatedProspect);
  assert.equal(res.updatedProspect.status, 'FULFILLED');
  assert.ok(res.updatedProspect.fulfillmentData !== undefined);
  assert.ok(res.updatedProspect.fulfillmentData.apiKey.startsWith('ASTRA-SOV'));
  assert.ok(res.updatedProspect.fulfillmentData.allocatedBots > 0);
  assert.equal(res.updatedProspect.fulfillmentData.executionStatus, 'EXECUTING_TRADES');
});

test('executeAgentUserCommand handles hunting, selling, and status in English and Urdu', () => {
  const prospects = [...INITIAL_PROSPECTS];

  // Hunt command in English
  const huntRes = executeAgentUserCommand('hunt Dubai family offices', prospects, 'en');
  assert.ok(huntRes.newProspectsAdded > 0);
  assert.ok(huntRes.replyMessage.toLowerCase().includes('discovered'));

  // Close all command in Roman Urdu
  const closeRes = executeAgentUserCommand('sub ko sell kero aur close kero', prospects, 'ur');
  assert.ok(closeRes.dealsClosedCount > 0);
  assert.ok(closeRes.newRevenue > 0);
  assert.ok(closeRes.replyMessageUrdu.includes('معاہدے'));

  // Status report command
  const statusRes = executeAgentUserCommand('give me a status report', prospects, 'en');
  assert.ok(statusRes.replyMessage.includes('Pipeline'));
});

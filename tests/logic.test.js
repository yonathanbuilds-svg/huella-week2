import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  EVIDENCE_SCHEMA,
  createAppeal,
  createConsentRecord,
  generateOperatingRecord,
  simulateExtraction,
  validateEvidenceSource,
  validateSelection
} from '../src/logic.js';

const selectedIds = ['receipt-001', 'receipt-002', 'receipt-003'];

test('requires exactly the three permitted demo sources', () => {
  assert.equal(validateSelection([]).valid, false);
  assert.equal(validateSelection(['receipt-001', 'receipt-002']).valid, false);
  assert.equal(validateSelection(selectedIds).valid, true);
  assert.equal(validateSelection(['receipt-001', 'receipt-002', 'unknown']).valid, false);
});

test('simulated extraction stays inside the declared schema', () => {
  const extraction = simulateExtraction(selectedIds);
  assert.equal(extraction.length, 3);

  for (const source of extraction) {
    for (const key of Object.keys(source)) {
      assert.ok(EVIDENCE_SCHEMA.allowedKeys.includes(key), `Unexpected field: ${key}`);
      assert.ok(!EVIDENCE_SCHEMA.prohibitedKeys.includes(key), `Prohibited field: ${key}`);
    }
    assert.equal(source.extractionMode, 'simulated_ai');
    assert.equal(source.sourceAuthenticity, 'not_independently_verified');
  }
});

test('rejects impossible and future receipt dates in the logic layer', () => {
  const base = { supplierDisplayName: 'Proveedor Demo', totalMxn: 500 };
  assert.equal(validateEvidenceSource({ ...base, purchaseDate: '2026-02-30' }).valid, false);
  assert.equal(validateEvidenceSource({ ...base, purchaseDate: '2027-01-01' }).valid, false);
  assert.equal(validateEvidenceSource({ ...base, purchaseDate: '2026-08-23' }).valid, true);
});

test('missing confirmation produces a visible repair path, not a negative judgment', () => {
  const result = generateOperatingRecord(simulateExtraction(selectedIds));
  assert.equal(result.status, 'unable_to_verify');
  assert.match(result.message, /confirmar/i);
  assert.match(result.repair, /compara/i);
});

test('confirmed sources generate a limited record with sources, gaps and action', () => {
  const sources = simulateExtraction(selectedIds).map((source) => ({ ...source, userConfirmed: true }));
  const record = generateOperatingRecord(sources);

  assert.equal(record.status, 'demo_activity_verified');
  assert.equal(record.evidence.length, 3);
  assert.equal(record.materialGaps.length, 3);
  assert.deepEqual(record.verifiedClaim.notAssessed, ['sales', 'profitability', 'repayment_capacity']);
  assert.match(record.institutionalAction.commitment, /human inventory-financing review/i);
});

test('refusing to share records no penalty', () => {
  const refusal = createConsentRecord({
    recordId: 'HUELLA-DEMO-2026-001',
    recipient: 'Inventario Justo',
    shared: false
  });

  assert.equal(refusal.valid, true);
  assert.equal(refusal.shared, false);
  assert.equal(refusal.refusalPenalty, false);
  assert.equal(refusal.sharedAt, null);
});

test('appeal is routed to a human with authority to change the next step', () => {
  const appeal = createAppeal({
    recordId: 'HUELLA-DEMO-2026-001',
    reason: 'incorrect_field',
    detail: 'La fecha de la segunda fuente debe ser corregida.'
  });

  assert.equal(appeal.valid, true);
  assert.equal(appeal.automaticDecision, false);
  assert.deepEqual(appeal.reviewerAuthority, ['correct_evidence', 'change_next_step']);
});

test('persona fix makes the no-approval boundary prominent in the final UI', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Tres compras recurrentes respaldadas por sus fuentes/);
  assert.match(html, /Esto no es una aprobación de crédito/);
  assert.doesNotMatch(html, /<h1 id="record-title">Actividad operativa recurrente verificada<\/h1>/);
});

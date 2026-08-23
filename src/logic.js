export const DEMO_RECEIPTS = Object.freeze([
  {
    sourceId: 'receipt-001',
    sourceType: 'supplier_receipt',
    imagePath: 'assets/demo-receipt-01.png',
    supplierDisplayName: 'Distribuidora Central Demo',
    purchaseDate: '2026-05-14',
    totalMxn: 2220,
    extractionMode: 'simulated_ai',
    sourceAuthenticity: 'not_independently_verified'
  },
  {
    sourceId: 'receipt-002',
    sourceType: 'supplier_receipt',
    imagePath: 'assets/demo-receipt-02.png',
    supplierDisplayName: 'Distribuidora Central Demo',
    purchaseDate: '2026-06-07',
    totalMxn: 1420,
    extractionMode: 'simulated_ai',
    sourceAuthenticity: 'not_independently_verified'
  },
  {
    sourceId: 'receipt-003',
    sourceType: 'supplier_receipt',
    imagePath: 'assets/demo-receipt-03.png',
    supplierDisplayName: 'Distribuidora Central Demo',
    purchaseDate: '2026-07-09',
    totalMxn: 2600,
    extractionMode: 'simulated_ai',
    sourceAuthenticity: 'not_independently_verified'
  }
]);

export const EVIDENCE_SCHEMA = Object.freeze({
  allowedKeys: [
    'sourceId',
    'sourceType',
    'imagePath',
    'supplierDisplayName',
    'purchaseDate',
    'totalMxn',
    'extractionMode',
    'sourceAuthenticity',
    'userConfirmed'
  ],
  prohibitedKeys: [
    'creditScore',
    'riskGrade',
    'approvalProbability',
    'repaymentCapacity',
    'contacts',
    'familyRelationships',
    'socialGraph',
    'customerIdentities',
    'preciseLocation',
    'neighborhoodRisk'
  ]
});

export function sanitizeText(value, maxLength = 80) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function validateSelection(selectedIds) {
  const unique = new Set(selectedIds);
  if (unique.size !== 3) {
    return {
      valid: false,
      message: `Selecciona exactamente 3 comprobantes. Actualmente seleccionaste ${unique.size}.`
    };
  }

  const allowed = new Set(DEMO_RECEIPTS.map((receipt) => receipt.sourceId));
  if ([...unique].some((id) => !allowed.has(id))) {
    return { valid: false, message: 'La selección contiene una fuente no permitida en esta demo.' };
  }

  return { valid: true, message: 'Tres fuentes ficticias seleccionadas.' };
}

export function simulateExtraction(selectedIds) {
  const selection = validateSelection(selectedIds);
  if (!selection.valid) throw new Error(selection.message);

  return DEMO_RECEIPTS
    .filter((receipt) => selectedIds.includes(receipt.sourceId))
    .map((receipt) => ({ ...receipt, userConfirmed: false }));
}

export function validateEvidenceSource(source) {
  const supplier = sanitizeText(source.supplierDisplayName);
  const rawDate = String(source.purchaseDate ?? '');
  const date = new Date(`${rawDate}T00:00:00Z`);
  const total = Number(source.totalMxn);

  if (supplier.length < 2) return { valid: false, field: 'supplierDisplayName', message: 'Escribe un proveedor de 2 a 80 caracteres.' };
  const isExactIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    && !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === rawDate;
  if (!isExactIsoDate) return { valid: false, field: 'purchaseDate', message: 'Usa una fecha válida.' };
  if (rawDate > '2026-08-23') return { valid: false, field: 'purchaseDate', message: 'La fecha no puede estar en el futuro.' };
  if (!Number.isFinite(total) || total <= 0 || total > 100000) return { valid: false, field: 'totalMxn', message: 'El total debe estar entre $1 y $100,000 MXN.' };
  return { valid: true };
}

export function validateEvidence(sources) {
  if (!Array.isArray(sources) || sources.length !== 3) {
    return {
      valid: false,
      message: 'Se requieren exactamente tres fuentes para este registro.',
      repair: 'Selecciona los tres comprobantes ficticios y vuelve a revisar sus campos.'
    };
  }

  for (const source of sources) {
    const validation = validateEvidenceSource(source);
    if (!validation.valid) {
      return { valid: false, message: validation.message, repair: 'Corrige el campo marcado en la fuente correspondiente.' };
    }
    if (!source.userConfirmed) {
      return {
        valid: false,
        message: 'Debes confirmar los campos de cada fuente antes de generar el registro.',
        repair: 'Compara cada campo con su imagen y marca “Revisé esta fuente”.'
      };
    }
  }

  const distinctDates = new Set(sources.map((source) => source.purchaseDate));
  if (distinctDates.size < 2) {
    return {
      valid: false,
      message: 'Las fuentes no muestran recurrencia porque tienen menos de dos fechas distintas.',
      repair: 'Agrega un comprobante de otra fecha. Esta ausencia no se trata como evidencia negativa.'
    };
  }

  return { valid: true };
}

export function generateOperatingRecord(sources) {
  const validation = validateEvidence(sources);
  if (!validation.valid) return { status: 'unable_to_verify', ...validation };

  const ordered = [...sources].sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate));
  const periodStart = ordered[0].purchaseDate;
  const periodEnd = ordered[ordered.length - 1].purchaseDate;

  return {
    recordId: 'HUELLA-DEMO-2026-001',
    status: 'demo_activity_verified',
    verificationBoundary: 'Source presence and user-confirmed fields were checked. Document authenticity was not independently verified.',
    evidence: ordered.map((source) => ({
      ...source,
      supplierDisplayName: sanitizeText(source.supplierDisplayName),
      sourceLinked: true
    })),
    verifiedClaim: {
      claimType: 'recurring_operating_activity',
      periodStart,
      periodEnd,
      label: `Recurring operating activity verified from the listed sources between ${periodStart} and ${periodEnd}.`,
      notAssessed: ['sales', 'profitability', 'repayment_capacity']
    },
    materialGaps: [
      {
        gap: 'Autenticidad documental independiente',
        status: 'No evaluada en esta demo',
        repair: 'Opcional: pedir al proveedor una confirmación limitada del folio y la fecha.'
      },
      {
        gap: 'Ventas del negocio',
        status: 'No evaluadas',
        repair: 'Opcional: añadir un resumen limitado de cobros o una libreta de ventas; negarse no reduce este registro.'
      },
      {
        gap: 'Utilidad y capacidad de pago',
        status: 'No evaluadas',
        repair: 'La institución debe explicar qué fuente adicional necesita durante la revisión humana; Huella no la adivina.'
      }
    ],
    institutionalAction: {
      recipient: 'Inventario Justo — institución simulada',
      commitment: 'Advance past automatic rejection to a human inventory-financing review.',
      appealAuthority: 'The reviewer may correct evidence and change the next step.'
    }
  };
}

export function createConsentRecord({ recordId, recipient, shared }) {
  const cleanRecipient = sanitizeText(recipient, 80);
  if (!recordId || cleanRecipient.length < 2) {
    return { valid: false, message: 'El registro y el destinatario deben estar identificados.' };
  }

  return {
    valid: true,
    recordId,
    recipient: cleanRecipient,
    commitment: 'Advance past automatic rejection to a human inventory-financing review.',
    shared: Boolean(shared),
    sharedAt: shared ? '2026-08-23T18:00:00.000Z' : null,
    refusalPenalty: false
  };
}

export function createAppeal({ recordId, reason, detail }) {
  const allowedReasons = ['incorrect_field', 'missing_source', 'next_step'];
  const cleanDetail = sanitizeText(detail, 240);
  if (!recordId || !allowedReasons.includes(reason) || cleanDetail.length < 10) {
    return { valid: false, message: 'Elige un motivo y explica la corrección en al menos 10 caracteres.' };
  }

  return {
    valid: true,
    appealId: 'APPEAL-DEMO-001',
    recordId,
    reason,
    detail: cleanDetail,
    status: 'queued_for_human_review',
    reviewerAuthority: ['correct_evidence', 'change_next_step'],
    automaticDecision: false
  };
}

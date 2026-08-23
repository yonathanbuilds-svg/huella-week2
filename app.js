import { createAppeal, createConsentRecord, generateOperatingRecord, simulateExtraction, validateEvidenceSource, validateSelection } from './src/logic.js';

const screens = [...document.querySelectorAll('[data-screen]')];
const progressBar = document.querySelector('#progress-bar');
const progressLabel = document.querySelector('#progress-label');
const statusRegion = document.querySelector('#status-region');

const progress = {
  welcome: { width: 8, label: 'Introducción' },
  commitment: { width: 20, label: 'Paso 1 de 5 · Compromiso' },
  evidence: { width: 40, label: 'Paso 2 de 5 · Evidencia' },
  review: { width: 60, label: 'Paso 3 de 5 · Revisión' },
  record: { width: 80, label: 'Paso 4 de 5 · Registro' },
  share: { width: 92, label: 'Paso 5 de 5 · Compartir' },
  'not-shared': { width: 92, label: 'Registro no compartido' },
  submitted: { width: 100, label: 'Revisión humana iniciada' },
  'safe-exit': { width: 20, label: 'Sesión cerrada sin compartir' }
};

function navigate(screenName) {
  screens.forEach((screen) => {
    const active = screen.dataset.screen === screenName;
    screen.hidden = !active;
    screen.classList.toggle('is-active', active);
  });
  const step = progress[screenName] ?? progress.welcome;
  progressBar.style.width = `${step.width}%`;
  progressLabel.textContent = step.label;
  statusRegion.textContent = `Pantalla: ${step.label}`;
  document.querySelector('#app-main')?.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelector('#start-button').addEventListener('click', () => navigate('commitment'));
document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.back)));

const commitmentAck = document.querySelector('#commitment-ack');
const commitmentContinue = document.querySelector('#commitment-continue');
const commitmentError = document.querySelector('#commitment-error');

commitmentAck.addEventListener('change', () => {
  commitmentContinue.disabled = !commitmentAck.checked;
  commitmentError.hidden = true;
});

commitmentContinue.addEventListener('click', () => {
  if (!commitmentAck.checked) {
    commitmentError.hidden = false;
    commitmentAck.focus();
    return;
  }
  navigate('evidence');
});

document.querySelector('#decline-button').addEventListener('click', () => navigate('safe-exit'));
document.querySelector('.brand').addEventListener('click', (event) => { event.preventDefault(); navigate('welcome'); });

const receiptCheckboxes = [...document.querySelectorAll('.receipt-checkbox')];
const selectionCount = document.querySelector('#selection-count');
const selectionError = document.querySelector('#selection-error');
const extractButton = document.querySelector('#extract-button');
const extractionProgress = document.querySelector('#extraction-progress');
const extractionReady = document.querySelector('#extraction-ready');

function selectedReceiptIds() {
  return receiptCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
}

function refreshSelection() {
  const selected = selectedReceiptIds();
  selectionCount.textContent = `${selected.length} de 3`;
  extractButton.disabled = !validateSelection(selected).valid;
  selectionError.hidden = true;
  extractionReady.hidden = true;
}

receiptCheckboxes.forEach((checkbox) => checkbox.addEventListener('change', refreshSelection));

extractButton.addEventListener('click', () => {
  const selected = selectedReceiptIds();
  const validation = validateSelection(selected);
  if (!validation.valid) {
    selectionError.textContent = validation.message;
    selectionError.hidden = false;
    return;
  }

  extractionProgress.hidden = false;
  extractionReady.hidden = true;
  extractButton.disabled = true;

  window.setTimeout(() => {
    window.huellaExtraction = simulateExtraction(selected);
    extractionProgress.hidden = true;
    extractionReady.hidden = false;
    document.querySelector('#review-button').disabled = false;
    extractButton.disabled = false;
    statusRegion.textContent = 'Extracción simulada terminada. Tres objetos estructurados están listos para revisión.';
    extractionReady.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 650);
});

const reviewSources = document.querySelector('#review-sources');
const reviewForm = document.querySelector('#review-form');
const reviewError = document.querySelector('#review-error');
let currentRecord = null;

function renderReview(sources) {
  reviewSources.innerHTML = sources.map((source, index) => `
    <article class="review-card" data-source-card="${source.sourceId}">
      <div class="review-card-header">
        <img src="${source.imagePath}" alt="Vista previa de la fuente ficticia ${index + 1}" />
        <div><strong>Fuente ${index + 1}</strong><span>Extracción simulada · autenticidad no verificada</span></div>
      </div>
      <div class="field-grid">
        <div class="field field-wide">
          <label for="supplier-${source.sourceId}">Proveedor extraído</label>
          <input id="supplier-${source.sourceId}" name="supplierDisplayName" value="${source.supplierDisplayName}" maxlength="80" />
        </div>
        <div class="field">
          <label for="date-${source.sourceId}">Fecha</label>
          <input id="date-${source.sourceId}" name="purchaseDate" type="date" value="${source.purchaseDate}" max="2026-08-23" />
        </div>
        <div class="field">
          <label for="total-${source.sourceId}">Total MXN</label>
          <input id="total-${source.sourceId}" name="totalMxn" type="number" min="1" max="100000" step="1" value="${source.totalMxn}" />
        </div>
      </div>
      <label class="consent-box source-confirm" for="confirm-${source.sourceId}">
        <input id="confirm-${source.sourceId}" name="userConfirmed" type="checkbox" />
        <span>Revisé esta imagen y confirmé que los tres campos coinciden.</span>
      </label>
    </article>
  `).join('');
}

function collectReviewedSources() {
  return window.huellaExtraction.map((source) => {
    const card = document.querySelector(`[data-source-card="${source.sourceId}"]`);
    return {
      ...source,
      supplierDisplayName: card.querySelector('[name="supplierDisplayName"]').value,
      purchaseDate: card.querySelector('[name="purchaseDate"]').value,
      totalMxn: Number(card.querySelector('[name="totalMxn"]').value),
      userConfirmed: card.querySelector('[name="userConfirmed"]').checked
    };
  });
}

document.querySelector('#review-button').addEventListener('click', () => {
  renderReview(window.huellaExtraction);
  reviewError.hidden = true;
  navigate('review');
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const sources = collectReviewedSources();

  document.querySelectorAll('.review-card input').forEach((input) => input.removeAttribute('aria-invalid'));
  for (const source of sources) {
    const validation = validateEvidenceSource(source);
    if (!validation.valid) {
      const card = document.querySelector(`[data-source-card="${source.sourceId}"]`);
      card.querySelector(`[name="${validation.field}"]`)?.setAttribute('aria-invalid', 'true');
      reviewError.textContent = validation.message;
      reviewError.hidden = false;
      return;
    }
  }

  currentRecord = generateOperatingRecord(sources);
  if (currentRecord.status !== 'demo_activity_verified') {
    reviewError.textContent = `${currentRecord.message} Reparación: ${currentRecord.repair}`;
    reviewError.hidden = false;
    return;
  }

  renderRecord(currentRecord);
  reviewError.hidden = true;
  navigate('record');
});

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${isoDate}T00:00:00Z`));
}

function formatMxn(value) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);
}

function renderRecord(record) {
  document.querySelector('#record-period').textContent = `Fuentes revisadas entre ${formatDate(record.verifiedClaim.periodStart)} y ${formatDate(record.verifiedClaim.periodEnd)}.`;
  document.querySelector('#record-sources').innerHTML = record.evidence.map((source) => `
    <a class="source-row" href="${source.imagePath}" target="_blank" rel="noreferrer">
      <div><strong>${source.supplierDisplayName}</strong><span>${formatDate(source.purchaseDate)} · ${formatMxn(source.totalMxn)}</span></div>
      <span class="source-link-label">Ver fuente ↗</span>
    </a>
  `).join('');
  document.querySelector('#record-gaps').innerHTML = record.materialGaps.map((gap) => `
    <article class="gap-card"><strong>${gap.gap}</strong><span class="gap-status">${gap.status}</span><p><b>Reparación:</b> ${gap.repair}</p></article>
  `).join('');
}

document.querySelector('#continue-to-share').addEventListener('click', () => {
  navigate('share');
});

const shareConsent = document.querySelector('#share-consent');
const shareButton = document.querySelector('#share-button');
const shareError = document.querySelector('#share-error');

shareConsent.addEventListener('change', () => {
  shareButton.disabled = !shareConsent.checked;
  shareError.hidden = true;
});

shareButton.addEventListener('click', () => {
  const consent = createConsentRecord({
    recordId: currentRecord?.recordId,
    recipient: 'Inventario Justo',
    shared: shareConsent.checked
  });

  if (!consent.valid || !consent.shared) {
    shareError.textContent = consent.message ?? 'Confirma el consentimiento específico para compartir.';
    shareError.hidden = false;
    return;
  }

  window.huellaConsent = consent;
  navigate('submitted');
});

document.querySelector('#do-not-share').addEventListener('click', () => {
  window.huellaConsent = createConsentRecord({ recordId: currentRecord?.recordId, recipient: 'Inventario Justo', shared: false });
  navigate('not-shared');
});

const openAppeal = document.querySelector('#open-appeal');
const appealForm = document.querySelector('#appeal-form');
const appealError = document.querySelector('#appeal-error');
const appealSuccess = document.querySelector('#appeal-success');

openAppeal.addEventListener('click', () => {
  appealForm.hidden = false;
  appealSuccess.hidden = true;
  openAppeal.hidden = true;
  document.querySelector('#appeal-reason').focus();
});

appealForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const appeal = createAppeal({
    recordId: currentRecord?.recordId,
    reason: document.querySelector('#appeal-reason').value,
    detail: document.querySelector('#appeal-detail').value
  });

  if (!appeal.valid) {
    appealError.textContent = appeal.message;
    appealError.hidden = false;
    return;
  }

  window.huellaAppeal = appeal;
  appealError.hidden = true;
  appealForm.hidden = true;
  appealSuccess.hidden = false;
  statusRegion.textContent = 'Solicitud de corrección enviada a revisión humana simulada.';
});

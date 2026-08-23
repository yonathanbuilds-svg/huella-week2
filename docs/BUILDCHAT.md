# BUILDCHAT — Week 2 Business Bending

**Builder:** Yonathan Zeitoune Mattout  
**Team:** 6  
**Role:** USER  
**Product:** Huella  
**Build date:** 23 August 2026

## Transcript note

This document preserves the substantive development back-and-forth, decisions, implementation checkpoints, test output and pushback from the Week 2 build session. Short repetitive tool messages are condensed, while the actual product constraints, rejected approaches, code decisions, bug evidence and commit history are kept visible. All demo people, institutions, receipts and outputs are invented unless a public source is named.

---

## 1. The build request arrives

**YONATHAN / USER INPUT**

> Build a Verified Operating Record for an informal merchant seeking inventory financing, showing verified activity, sources, missing evidence, and the institutional next step. Primary condition: every material evidence gap must be visible and accompanied by a realistic correction or repair path.

**TEAM 6 BLUEPRINT INPUT**

> Evidence-to-Action for informal merchants: turn user-controlled, source-linked informal business evidence into a record that a participating institution commits to act on.

The Blueprint also imposed six non-negotiable constraints:

1. Source links and uncertainty disclosure; AI extraction cannot be presented as verification.
2. Qualifying evidence must unlock a defined institutional action.
3. Every evidence gap needs a realistic repair path.
4. No guessing or reverse-engineering hidden lender decisions.
5. No family, contacts, social graph, customer identity, precise location or neighborhood-risk proxy.
6. Human appeal must be able to correct evidence and change an outcome.

**MODEL PUSHBACK**

> “Verified Operating Record” can overclaim. Three supplier receipts show recurring purchases. They do not prove sales, profit, cash flow or repayment capacity. The build must decide exactly which claim it can support before writing code.

**BUILDER DECISION**

> The product will verify only a narrow source-backed operating claim. It will never generate a score, default probability, approval recommendation or repayment-capacity conclusion.

---

## 2. Packet before code

**MODEL QUESTION**

> Who is the exact first user, what must work before the module closes, and what is deliberately outside scope?

**BUILDER RESPONSE**

The exact user is a Mexican informal or semi-formal seasonal merchant who repeatedly buys inventory, sells partly in cash, uses an inexpensive Android phone, lacks conventional proof of stable income and does not want to expose WhatsApp conversations, contacts or precise location.

Success before the module closes:

- see a specific institutional commitment before evidence is selected;
- select three clearly invented receipt images;
- review and correct simulated AI extraction;
- generate a structured, source-linked limited record;
- see what is missing and how to repair it;
- consent to a named recipient; and
- reach a human review or correction path without receiving a score.

**MODEL CHALLENGE**

> A polished evidence dossier is useless if no institution commits to a consequence. “We will consider it” is not a consequence. What exactly happens after the evidence qualifies?

**BUILDER DECISION**

The institution must state before data collection:

> “If your record demonstrates recurring inventory purchases, your request will advance past automatic rejection to a human inventory-financing review.”

The demo institution is invented and named **Inventario Justo**. Refusing to share creates no score, mark or negative record.

**MODEL CHALLENGE**

> If no real lender integration exists, do not fake one. The interface must label the institution, extraction, verification and review as simulated.

**BUILDER DECISION**

All three receipts are purpose-built invented data. “AI” extraction is deterministic structured demo output and is labeled **simulated AI**. The app stores nothing permanently and calls no external model or database.

---

## 3. Implementation prompt produced from the Packet

**MODEL → CODING AGENT PROMPT**

Build a mobile-first Spanish web app named **Huella**. Use HTML/CSS/JavaScript with structured JSON. Implement one end-to-end path:

1. Show the simulated institution’s review commitment and privacy exclusions before any evidence interaction.
2. Permit selection of exactly three invented receipt assets.
3. Simulate extraction of only supplier, date, total and source reference.
4. Label extraction as simulated and distinct from document verification.
5. Let the merchant edit and confirm every field.
6. Generate a limited record with source links, uncertainty, three material evidence gaps and repair paths.
7. Repeat the recipient and action before explicit sharing consent.
8. Provide a penalty-free “do not share” path.
9. Route correction requests to a simulated human with authority to correct evidence and change the next step.

Acceptance criteria:

- no score, risk grade, approval probability or repayment-capacity field exists;
- no association or neighborhood data exists;
- missing evidence is not negative evidence;
- every form input is bounded and sanitized;
- all personal data is invented and labeled;
- the complete flow works on a narrow phone;
- test output and a real bug-fix cycle are documented;
- at least five meaningful commits and two deployments are visible.

---

## 4. Commit-by-commit build argument

### Commit 1 — `74c0434`

**Message:** `chore: initialize Huella app and document Blueprint constraints`

**Decision represented:** Start with the Packet, Blueprint, security floor and explicit prohibited fields before implementing interaction.

**Pushback resolved:** A generic upload app would be easier, but would miss the institutional action and shadow clause. The repository began with those boundaries instead.

### Commit 2 — `f0518d5`

**Message:** `feat: add commitment and privacy boundary flow`

**Decision represented:** The first data-related screen belongs to the institution, not the merchant. It must commit to human review and display what it will never request.

**Alternative rejected:** Ask for receipts first and explain the use later. Rejected because consent would not be informed.

### Commit 3 — `0f8a1ec`

**Message:** `feat: add validated demo receipt selection and extraction schema`

**Decision represented:** Exactly three invented receipts enter a fixed schema. Allowed fields are source ID, image, supplier, date, total, extraction mode, authenticity boundary and user confirmation.

**Forbidden schema fields:** score, risk grade, approval probability, repayment capacity, contacts, family, social graph, customer identity, precise location and neighborhood risk.

### Commit 4 — `1613031`

**Message:** `feat: add editable simulated AI review and limited claim generation`

**Decision represented:** Extraction is editable and remains unverified until the user checks every image. The final record names three gaps: independent authenticity, sales, and profit/repayment capacity.

**Alternative rejected:** Convert receipts into a single “trust” number. Rejected as a disguised credit score and a violation of the Forbidden Zone.

### Commit 5 — `873452c`

**Message:** `feat: add recipient consent human review and repair path`

**Decision represented:** Consent is recipient-specific. The user can refuse without penalty. A human appeal can correct evidence and change the next step.

**Raw logic check**

```text
Consent: valid=true, recipient=Inventario Justo, shared=true,
refusalPenalty=false

Appeal: valid=true, status=queued_for_human_review,
reviewerAuthority=[correct_evidence, change_next_step],
automaticDecision=false
```

---

## 5. Mechanical test — failure, fix, retest

**MODEL TEST ATTACK**

> The visible date input has a maximum date, but is the same rule enforced in the logic layer? A modified request must not bypass the form.

**FAILING TEST OUTPUT**

```text
Input: supplier=Proveedor Demo, purchaseDate=2027-01-01, totalMxn=500
Observed result: {"valid":true}
Expected result: valid=false
```

**BUG FOUND**

The interface showed a 23 August 2026 maximum, but the core validator accepted a future date when called directly. The screen looked safe while the underlying function was not.

**FIX**

The logic layer now requires an exact real ISO date, rejects impossible dates such as `2026-02-30`, and rejects dates after `2026-08-23`. The rule no longer depends on the browser.

**REGRESSION TESTS AFTER FIX**

```text
PASS requires exactly the three permitted demo sources
PASS simulated extraction stays inside the declared schema
PASS rejects impossible and future receipt dates in the logic layer
PASS missing confirmation produces a visible repair path
PASS confirmed sources generate a limited source-linked record
PASS refusing to share records no penalty
PASS appeal reaches a human with authority to change the next step

tests 7 | pass 7 | fail 0
```

### Commit 6 — `eb484ea`

**Message:** `test: reject future evidence dates and document mechanical pass`

**Cycle evidenced:** test → real failure → code fix → regression test → retest.

---

## 6. Synthetic persona test — a second product correction

**PERSONA PROMPT**

> You are Javier, 41, a seasonal clothing reseller in Guerrero. You use WhatsApp but distrust financial apps, read slowly, receive most sales in cash, and quit silently when wording is confusing. Attempt the task screen by screen and narrate where you would hesitate or leave.

**PERSONA REACTION AT THE ORIGINAL RECORD SCREEN**

> “Ya salió la palomita verde y dice verificada; yo pensaría que ya me aprobaron.”

**MODEL DIAGNOSIS**

The smaller disclaimer was technically correct, but the visual hierarchy was wrong. The green check and “Actividad operativa recurrente verificada” created a stronger promise than the disclosure could undo.

**BUILDER FIX**

- Rename the headline to **“Tres compras recurrentes respaldadas por sus fuentes.”**
- Replace the badge with **“Registro limitado · fuentes revisadas.”**
- Put **“Esto no es una aprobación de crédito”** before the technical boundary.

**PERSONA RETEST**

> “Las tres compras tienen sus comprobantes. No me aprobaron todavía; solo va a revisar mi solicitud una persona y me pueden pedir algo más.”

### Commit 7 — `03fcfe0`

**Message:** `fix: clarify record outcome after synthetic persona test`

**FINAL AUTOMATED RETEST**

```text
PASS 8 tests
FAIL 0 tests
Includes UI regression test for the no-approval boundary
```

---

## 7. Deployment argument

**MODEL CHECK**

> The rubric asks for two deploys, not merely two commits. Record each production checkpoint and keep the final URL visible in the repository.

**CHECKPOINT 1**

- Full flow built successfully.
- Production URL: `https://huella-evidencia.yonazet.chatgpt.site`
- Result: succeeded.

### Commit 8 — `f756c71`

**Message:** `docs: record first production deployment`

**CHECKPOINT 2**

The final social-preview asset and production metadata were added. A second immutable production version built and deployed successfully at the same public URL.

---

## 8. Final Blueprint reconciliation

| Blueprint condition | Product evidence |
|---|---|
| 1. Source linkage + uncertainty | Each row opens its receipt; simulated AI and authenticity limits are explicit. |
| 2. Defined action | Inventario Justo commits before collection to advance qualifying evidence to human review. |
| 3. Visible gap + repair | Three material gaps each contain a specific optional repair path. |
| 4. No black-box speculation | The app describes evidence status only; it never invents a lender reason. |
| 5. Shadow clause | No contact, family, customer, location, neighborhood or association field exists. |
| 6. Meaningful appeal | The human reviewer can correct evidence and change the next step. |

**Final builder position:** Huella does not prove that an informal merchant can repay. It proves only that three user-confirmed sources support recurring purchases across a stated period, displays the limits, and makes that narrow evidence consequential through a pre-committed human review.

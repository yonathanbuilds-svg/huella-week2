# Decisions — Week 2

## Session 1 — Blueprint reconciliation

- **Decision:** Build Evidence-to-Action, not a credit score.
- **Decision:** Honor Condition 3 most directly by making every missing claim visible and repairable.
- **Decision:** Use three clearly invented receipt assets and deterministic simulated AI output.
- **Decision:** Keep all demo data ephemeral; no database or authentication is needed because no personal data is stored.
- **Decision:** Separate extraction, user confirmation and simulated verification in the interface.
- **Open question:** Final Vercel and GitHub URLs must be added after deployment.
- **Next move:** Build the institutional pre-commitment and privacy boundary.

## Session 2 — End-to-end slice

- **Decision:** The record exposes three material gaps with a realistic repair path for each.
- **Decision:** Sharing is recipient-specific and repeats the institution's commitment immediately before consent.
- **Decision:** Refusing to share produces no penalty or negative record.
- **Decision:** The appeal form routes to a simulated human reviewer with authority to correct evidence and change the next step.
- **Decision:** Explanations describe only submitted evidence or verified institutional actions; the app never guesses hidden lender logic.
- **Next move:** Run the mechanical pass, document a real defect, fix it, and redeploy.

## Session 3 — Mechanical test and bug fix

- **Bug found:** The browser date field had a maximum date, but the core function still accepted future-dated evidence when called directly.
- **Fix:** Enforce exact ISO dates and the 23 August 2026 cutoff in the logic layer, not only in the interface.
- **Test:** Added regression coverage for impossible and future dates plus the complete evidence, refusal and appeal flow.
- **Retest:** All seven logic tests pass.
- **Next move:** Run the synthetic-persona walkthrough, fix the worst comprehension problem, and prepare deployment checkpoint 1.

## Session 4 — Synthetic persona test

- **Persona:** Javier, 41, a fictional seasonal clothing reseller in Guerrero who reads slowly, uses WhatsApp, receives cash and distrusts financial apps.
- **Worst confusion:** The green check and “Actividad operativa recurrente verificada” sounded like a credit approval even though the smaller text denied that claim.
- **Fix:** Rename the record around three source-backed purchases, replace the verification badge, and put “Esto no es una aprobación de crédito” before the technical disclosure.
- **Retest:** Javier's intended interpretation became: the receipts support three purchases; a person will review the request; no credit has been approved.
- **Next move:** Create the final packet, persona log, build transcript and delivery checklist, then deploy twice.

## Session 5 — Deployment checkpoint 1

- **Result:** The complete Huella flow built successfully and reached production at `https://huella-evidencia.yonazet.chatgpt.site`.
- **Security:** The live build stores no personal data, uses no secrets and transmits no receipt data to an external service.
- **Next move:** Add the final social-preview asset and documentation, then create checkpoint 2 at the same production URL.

## Session 6 — Deployment checkpoint 2 and close

- **Result:** The final social-preview and metadata build succeeded as a second immutable production version.
- **Final URL:** `https://huella-evidencia.yonazet.chatgpt.site`.
- **Evidence:** Eight automated tests pass; the mechanical bug and persona comprehension issue both have regression coverage.
- **Next move:** Record the demo and reflection videos, create the public GitHub mirror, and upload the prepared PDFs.

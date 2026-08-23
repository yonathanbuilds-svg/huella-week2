# Persona test — Huella

**Run:** 23 August 2026  
**Builder:** Yonathan Zeitoune Mattout  
**Product:** Huella — Verified Operating Record  
**Method:** synthetic persona walkthrough using ordered prototype screens and invented demo data

## Synthetic user

**Javier, 41**, is a seasonal clothing reseller in Guerrero. He uses WhatsApp every day on an inexpensive Android phone, reads slowly, receives most sales in cash, distrusts financial apps, and tends to abandon a task silently when privacy language is unclear. Javier is fictional and inspired by the user need documented in the Week 2 research; he is not Nadir and does not represent a real interview.

## Persona instruction

> You are Javier, 41, a seasonal clothing reseller in Guerrero. You use WhatsApp but distrust financial apps, read slowly, receive most sales in cash, and quit silently when wording is confusing. I will show you Huella one screen at a time. Attempt the task as Javier. Narrate what you think will happen, what worries you, what you would refuse to share, and the exact point where you would leave. Do not evaluate the design as an expert.

## Walkthrough log

### 1. Welcome

Javier understood that the product organizes evidence instead of giving him a score. His first concern was whether continuing would expose WhatsApp or location. The screen answered this with “No pediremos contactos, ubicación ni conversaciones,” so he continued.

**Confusion logged:** “¿Me van a revisar todo el teléfono?”  
**Severity:** medium; resolved by visible privacy boundary.

### 2. Institutional commitment

He understood that Inventario Justo was the only institution in the demonstration and that it promised a human review. The words “tu solicitud pasa a revisión humana” were useful, but Javier still wondered whether passing the evidence check meant the financing was already approved.

**Confusion logged:** “Entonces, si salen las tres compras, ¿ya me prestan?”  
**Severity:** high; remained unresolved at this point.

### 3. Evidence selection

Javier recognized the three invented receipts and understood that the extraction was simulated. He liked that customer names, messages and location were not requested. He hesitated at “extracción no es verificación,” but interpreted it correctly after reading the next line: he had to check each field himself.

**Confusion logged:** “¿La máquina está diciendo que el recibo es verdadero?”  
**Severity:** medium; the existing extraction boundary clarified that it was not.

### 4. Field review

He could compare supplier, date and total. He said he would continue because every field was editable and the confirmation referred only to matching the image, not to promising that his entire business was formal.

**Confusion logged:** none that would cause abandonment.

### 5. Operating record — worst problem

The green check and the original title “Actividad operativa recurrente verificada” caused Javier to believe the application had succeeded. He overlooked the smaller disclosure that sales, profit and repayment capacity were not assessed.

**Exact persona reaction:** “Ya salió la palomita verde y dice verificada; yo pensaría que ya me aprobaron.”  
**Severity:** critical. This could create a false financial expectation and contradicted the product's narrow evidence claim.

### 6. Sharing and review

Javier understood the named recipient and appreciated the explicit “No compartir” option without penalty. Once told that the result only starts a human review, he understood the final timeline and correction route. He still wanted a response-time promise, but the prototype deliberately does not invent one.

**Remaining friction:** no proven service-level time for human review.  
**Decision:** disclose the uncertainty rather than promise an unsupported deadline.

## Worst issue fixed before the final deploy

The operating-record screen was changed in three ways:

1. **Before:** “Actividad operativa recurrente verificada.”  
   **After:** “Tres compras recurrentes respaldadas por sus fuentes.”
2. The badge now says **“Registro limitado · fuentes revisadas,”** not “Verificación simulada.”
3. A high-contrast message now appears before the technical boundary: **“Esto no es una aprobación de crédito. El único resultado es pasar a una revisión humana.”**

The detailed record can still state the accepted narrow claim, but the first thing a slow reader sees no longer implies approval or repayment capacity.

## Retest

After the wording change, the synthetic persona summarized the result as:

> “Las tres compras tienen sus comprobantes. No me aprobaron todavía; solo van a revisar mi solicitud una persona y me pueden pedir algo más.”

This is the intended mental model. The worst confusion was fixed. The unresolved review-time question remains visible as a limitation rather than being hidden behind a false promise.

## What changed in the product

- No score, approval, probability or recommendation was added.
- The claim was narrowed in the visual hierarchy.
- Missing evidence still has a repair path and is never treated as negative evidence.
- Sharing remains recipient-specific and refusal remains penalty-free.
- Human review remains consequential: the reviewer can correct evidence and change the next step.

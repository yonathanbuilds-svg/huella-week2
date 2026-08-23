# IMPLEMENTATION PROMPT — Huella

## Context to paste before execution

**Final primary vacuum:** Evidence-to-Action for informal merchants.  
**Primary condition honored:** Every material evidence gap must be visible and accompanied by a realistic correction or repair path.  
**Shadow clause:** Opportunity may not be determined by association. Family relationships, contact lists, social graphs, customer identities, precise home location, and neighborhood-level risk proxies may not be used to judge repayment ability.  
**Yonathan’s final declaration:** Build a Verified Operating Record for an informal merchant seeking inventory financing, showing verified activity, sources, missing evidence, and the institutional next step.

## Prompt for the coding agent

You are the senior coding agent for a one-week university prototype called **Huella**. Read `docs/PACKET.md` and the final Week 2 Blueprint before editing any code. If the Blueprint fields above are still blank or contradict the Packet, stop and report the exact conflict instead of guessing.

### Product outcome

Build one mobile-first, deployable path for a Mexican informal seasonal merchant:

1. The user first sees a named demo institution’s specific commitment: if recurring inventory purchases are verified, the request advances past automatic rejection to a human inventory-financing review.
2. The user sees that contacts, location, neighborhood and private conversations are not requested.
3. The user selects exactly three invented supplier-receipt images from `public/demo-receipts/`.
4. A server route returns structured receipt fields using a fixed JSON schema. The default university demo may use deterministic, pre-generated simulated LLM output, but it must display **“Simulated AI extraction — demo data”** on screen.
5. The user reviews and edits supplier name, purchase date and total for every receipt.
6. The system checks only whether the listed sources support recurring purchases across at least two dates. This is a rule-based claim check, not a credit model.
7. The result says exactly: “Recurring operating activity verified from the listed sources between [date] and [date]. Sales, profitability, and repayment capacity were not assessed.”
8. The user chooses whether to share the limited record with the named simulated institution.
9. Sharing leads to a simulated human-review status and a specific repair path. Refusal to share creates no penalty or negative record.

### Forbidden behavior

Never create or display a credit score, risk grade, default probability, approval probability, ranking, recommendation, automatic approval or automatic denial. Do not collect contacts, messages, social relationships, family data, precise location, neighborhood, device fingerprint or real personal data. Do not claim that receipts prove sales, profit, cash flow or repayment capacity. Do not send raw unvalidated text from a form directly into a database or model prompt.

### Final stack

- Dependency-free HTML, CSS and JavaScript for a reliable mobile-first static application.
- A shared validation module used by both the interface and Node tests.
- Schema-constrained JSON for the record and extraction output.
- Deterministic pre-generated extraction with `AI_MODE=simulated`; every output is visibly labeled and source-linked.
- No database or personal-data persistence; the demo session remains ephemeral.
- Vercel deployment and GitHub version control.
- Node's built-in test runner for focused logic tests.

### Required routes or states

- `/` — concise explanation and “Begin” action.
- `/commitment` — institutional commitment, data exclusions and consent to proceed.
- `/evidence` — exactly three demo receipts with validation.
- `/review` — editable AI-extracted fields and visible simulated-AI label.
- `/record` — limited verified claim, disclosure and correction action.
- `/share` — named recipient, recipient-specific consent and human-review/repair result.

Routing may be implemented as a single-page stepper if that is simpler and more reliable on mobile. Preserve browser refresh state only if doing so does not introduce personal-data storage.

### Data schema

Create TypeScript and Zod schemas for:

- `EvidenceSource`: source ID, source type, supplier display name, purchase date, total MXN, extraction mode, user-confirmed flag.
- `VerifiedClaim`: claim type, period start/end, label, and `notAssessed` array.
- `ConsentRecord`: named recipient, exact institutional commitment, shared boolean and timestamp when shared.
- `RepairPath`: missing item, why it is needed, one achievable next action and human-review availability.

There must be no score, location, contacts, social graph or repayment-capacity field anywhere in the schema.

### Validation rules

- Exactly three PNG or JPEG demo files.
- Maximum 5 MB per file.
- Supplier name: 2–80 characters.
- Purchase date: valid ISO date, not in the future.
- Total MXN: positive number no greater than 100,000.
- Record generation requires three user-confirmed sources across at least two distinct dates.
- A failed rule produces “Unable to verify this claim from the listed sources” plus a repair path; it must not assign negative status.

### Accessibility and median-user requirements

- Spanish UI; code and documentation may be English.
- Minimum 16 px body text, high contrast and large tap targets.
- One main decision per screen.
- Plain language; explain “actividad operativa recurrente” before using it as a result.
- Never hide the limitation disclosure below an accordion.
- Mobile width must work at 320 px without horizontal scrolling.

### Security floor

- No secrets in the repository. Environment variables are server-only and configured in Vercel.
- Only invented assets and seed values; every demo screen visibly labels them as fictitious.
- Do not permanently store uploaded images.
- Validate input on both client and server.
- Parse model output against the fixed Zod schema; reject extra fields.
- Add a short `SECURITY.md` explaining the prototype’s data boundaries.

### Acceptance criteria

1. The deployed URL loads without authentication errors.
2. A user can complete the full happy path on a 320 px-wide viewport.
3. The commitment appears before any upload/select control.
4. Exactly three invented receipts can be selected.
5. The visible AI label says the output is simulated.
6. Every extracted field can be corrected.
7. The record contains the exact limitation disclosure.
8. The record can be corrected before sharing.
9. The named recipient and commitment reappear at consent.
10. Declining to share returns safely with no penalty language.
11. An insufficient-evidence path gives one achievable repair action.
12. No prohibited fields or score-like UI exist.
13. Inputs are validated client-side and server-side.
14. Automated tests cover validation, claim generation and refusal to share.
15. README contains local setup, environment-variable names, test command, deploy URL placeholder, invented-data notice and Blueprint conditions honored.

### Commit and deploy plan

Make at least these six meaningful commits; never bundle unrelated work:

1. `chore: initialize Huella app and document Blueprint constraints`
2. `feat: add commitment and privacy boundary flow`
3. `feat: add validated demo receipt selection and extraction schema`
4. `feat: add editable simulated AI review and limited claim generation`
5. `feat: add recipient consent human review and repair path`
6. `test: fix documented mobile or validation bug and finalize persona improvement`

Create **Deploy 1 after commit 3** and **Deploy 2 after commit 6**. Record both URLs and timestamps in `DECISIONS.md`; the final submission uses Deploy 2.

### Required documentation

- `docs/PACKET.md`
- `DECISIONS.md`, updated at every session close with decisions, open questions and tomorrow’s first move.
- `SECURITY.md`
- `docs/MECHANICAL_TEST.md`
- `docs/PERSONA_TEST.md`
- `README.md`

### Testing sequence

Run automated tests and the manual Packet test table against Deploy 1. Find and document at least one real bug, fix it, commit it and redeploy. Then run the synthetic-persona test using screenshots in order; fix the worst confusion before Deploy 2.

### Session close

At the end of every development session:

1. Update `DECISIONS.md`.
2. Write tomorrow’s first move.
3. Run tests and record the result.
4. Commit with a meaningful message.
5. Push to GitHub.

Start by restating the final Blueprint constraints and proposing the file tree. Do not write code until I confirm that your restatement is accurate.

## Persona-test prompt to use later in a fresh chat

> You are Javier, a synthetic test persona inspired by documented research but not a real person. You are 41, sell seasonal clothing and accessories in Guerrero, receive most customer payments in cash, use WhatsApp on an inexpensive Android phone, read slowly, distrust financial apps, and tend to quit silently when privacy language or consequences are unclear. All names, receipts and amounts in this test are invented. I will show you screenshots of a product one at a time. Attempt the task as Javier and narrate out loud: what you think the screen is asking, what you believe will happen, what information you refuse to share, every word you do not understand, where you hesitate and the exact point where you would quit. Do not help the designer or act tech-savvy. After the final screen, list every confusion from most damaging to least damaging and state whether you mistakenly believed the product guaranteed credit approval.

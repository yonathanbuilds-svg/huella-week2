# Huella — Evidence-to-Action

Huella is a mobile-first Week 2 prototype for an informal Mexican merchant seeking inventory financing. It converts three invented supplier receipts into a source-linked operating record, shows every material evidence gap, and shares the record only after a simulated institution commits to a specific human review.

## What it is not

Huella is not a credit score, underwriting model, approval engine, cash-flow verifier or black-box explanation tool. The demo never uses real personal data.

## Run locally

```bash
npm start
```

Open `http://localhost:4173`.

## Test

```bash
npm test
```

## Deployment

The project is static and can be imported directly into Vercel from GitHub. No build command, API key or environment variable is required. A production version is also deployed through OpenAI Sites.

- Deploy 1 URL: `https://huella-evidencia.yonazet.chatgpt.site`
- Deploy 2 / final URL: `https://huella-evidencia.yonazet.chatgpt.site` (updated in place after the final checkpoint)

## Invented-data notice

All receipt images, organizations, transactions, names and outputs are invented for an academic demonstration. The “AI” extraction is deterministic simulated output and is labeled on screen.

## Blueprint conditions honored

1. Source linkage and uncertainty disclosure.
2. Defined institutional action before sharing.
3. Visible evidence gaps with realistic correction or repair paths.
4. No speculation about hidden lender logic.
5. No association or neighborhood-level opportunity signals.
6. Human appeal with authority to correct evidence and change the next step.

See `docs/BLUEPRINT.md`, `docs/PACKET.md` and `SECURITY.md`.

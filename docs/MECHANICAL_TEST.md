# Huella — mechanical test log

**Run:** 23 August 2026  
**Tester:** Yonathan Zeitoune Mattout  
**Build:** local commit `873452c` before the fix; final commit recorded below  
**Data:** invented demo data only

## Test plan

1. Validate that exactly three permitted demo sources are required.
2. Confirm that structured extraction contains only declared evidence fields and none of the forbidden score or association fields.
3. Try to generate a record without confirming its sources and verify that the product returns a repair path rather than a negative judgment.
4. Generate a complete limited record and check that it preserves source links, three visible evidence gaps, uncertainty language, and the promised institutional action.
5. Refuse sharing and confirm that no penalty or negative record is created.
6. Submit an appeal and confirm that it is routed to a human with authority to correct evidence and change the next step.
7. Stress-test date validation outside the visible form controls.

## Bug found

The date input displayed a maximum of 23 August 2026, but the core validation function accepted `2027-01-01` when called directly. A modified request could therefore add future-dated evidence even though the screen appeared to prevent it.

## Fix

The logic layer now requires an exact real ISO date and rejects dates after 23 August 2026. A regression test covers both an impossible date (`2026-02-30`) and a future date (`2027-01-01`). Validation no longer relies only on the browser control.

## Retest result

All seven automated logic tests pass after the fix. The flow still produces a limited operating record only after all three sources are reviewed and confirmed. Refusal remains penalty-free, and appeal authority remains explicit.

## Deployment checkpoints

- **Checkpoint 1:** succeeded on 23 August 2026 at `https://huella-evidencia.yonazet.chatgpt.site`.
- **Checkpoint 2:** succeeded on 23 August 2026 after the final social-preview and metadata update at the same production URL.

The GitHub mirror remains the separate repository handoff; both deployments use the same production URL with immutable version history behind it.

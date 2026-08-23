# Security floor

- No secrets or API keys are required or stored.
- Only invented demo receipts and values are included.
- No upload is transmitted or permanently stored.
- No account, contact, message, customer identity, precise location, neighborhood or social-graph field exists.
- Inputs are checked for type, length, date and amount before a record is generated.
- Simulated AI output is constrained to a fixed evidence schema and must be reviewed by the user.
- Consent is specific to one named simulated recipient.
- The static deployment sets defensive browser headers through `vercel.json`.

If the prototype later stores personal data, Google authentication and Supabase Row Level Security must be implemented before launch.

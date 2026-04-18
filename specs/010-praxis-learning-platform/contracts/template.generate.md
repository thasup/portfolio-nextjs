# Contract: `POST /api/praxis/template`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-023, FR-024, FR-025

Generates a personalized downloadable template. Two-phase: `action: "preview"` returns an in-browser preview spec; `action: "download"` returns the rendered binary.

## Authorization

- Authenticated Supabase session required.
- `topicId` must be owned by caller.

## Request — preview

```http
POST /api/praxis/template
Content-Type: application/json

{
  "action": "preview",
  "topicId": "uuid",
  "unitId": "uuid | null",
  "kind": "docx" | "xlsx",
  "prompt": "discovery prep sheet for SaaS payroll discovery calls",
  "regenerateFromTemplateId": "uuid | null"
}
```

If `regenerateFromTemplateId` is set, the generator receives the prior spec plus the new `prompt` as a regenerate instruction.

## Response — preview

### 200 OK

```json
{
  "template": {
    "id": "uuid",
    "kind": "docx",
    "title": "Discovery Prep — SaaS Payroll",
    "specJson": {
      "kind": "docx",
      "title": "Discovery Prep — SaaS Payroll",
      "sections": [
        {
          "heading": "Buyer context",
          "body": "Company: ___\nRole: CFO / Finance Lead\nTeam size: 20–50"
        },
        {
          "heading": "Pain probes",
          "body": "...",
          "table": {
            "columns": ["Symptom", "Root cause probe", "Quantifier"],
            "rows": [
              ["Slow payroll close", "How many days end-to-end today?", "days/month"],
              ["Filing errors", "How often, and what downstream impact?", "errors/quarter"]
            ]
          }
        }
      ]
    }
  }
}
```

## Request — download

```http
POST /api/praxis/template
Content-Type: application/json

{
  "action": "download",
  "templateId": "uuid"
}
```

## Response — download

### 200 OK

Binary body with:

```http
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Discovery Prep — SaaS Payroll.docx"
```

For XLSX: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

## Error states

- `400 INVALID_BODY` / `UNSUPPORTED_KIND`
- `401 NOT_AUTHENTICATED`
- `403 NOT_OWNER`
- `404 TEMPLATE_NOT_FOUND`
- `503 BUDGET_EXCEEDED`
- `502 UPSTREAM_FAILED`

## Side effects

### preview

1. Call Anthropic via `template.generator` prompt with topic context, unit context (if any), onboarding profile, and the learner's prompt.
2. Insert `praxis_templates` row with the returned `specJson`. Return `id`.
3. Record `praxis_spend_ledger` entry with endpoint `TEMPLATE`.
4. Spec JSON is the unit of cache — re-downloads never regenerate.

### download

1. Load `praxis_templates` row.
2. Render via `src/lib/praxis/templates/docx.ts` (or `xlsx.ts`) from `specJson`.
3. Stream the binary.
4. No ledger entry (pure rendering, no Anthropic call).

## Prompt

Uses `src/lib/praxis/prompts/template.generator.ts`. Returns JSON conforming to the `TemplateSpec` schema in `data-model.md`.

## Phase 1 scope

- DOCX and XLSX only. PDF deferred to Phase 3.
- Per-request render. No binary caching, no Supabase Storage.

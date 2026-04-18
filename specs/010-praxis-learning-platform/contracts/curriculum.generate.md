# Contract: `POST /api/praxis/curriculum`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-008, FR-009, FR-010, FR-011, FR-031

Generates a curriculum outline for a topic string. Two-phase: `action: "outline"` for the reviewable outline, `action: "accept"` to lock the outline and initialize the learner's topic.

## Authorization

- Authenticated Supabase session required.

## Request — outline generation

```http
POST /api/praxis/curriculum
Content-Type: application/json

{
  "action": "outline",
  "rawInput": "I want to learn negotiation",
  "locale": "en"
}
```

## Response — outline

### 200 OK

```json
{
  "admitted": true,
  "topic": {
    "fingerprint": "sha1-...",
    "title": "Negotiation",
    "rawInput": "I want to learn negotiation",
    "locale": "en"
  },
  "outline": {
    "cached": false,
    "modelVersion": "curriculum.outline@1",
    "units": [
      { "index": 1, "title": "Anchoring", "objective": "...", "summary": "..." },
      { "index": 2, "title": "BATNA", "objective": "...", "summary": "..." },
      { "index": 3, "title": "Tactics", "objective": "...", "summary": "..." },
      { "index": 4, "title": "Under pressure", "objective": "...", "summary": "..." },
      { "index": 5, "title": "Closing", "objective": "...", "summary": "..." }
    ]
  }
}
```

### 200 OK — rejected by scope guardrail

```json
{
  "admitted": false,
  "category": "medical",
  "explanation": "PRAXIS doesn't teach medical topics..."
}
```

## Request — accept outline

```http
POST /api/praxis/curriculum
Content-Type: application/json

{
  "action": "accept",
  "fingerprint": "sha1-...",
  "locale": "en",
  "editedUnits": [
    { "index": 1, "title": "Anchoring (edited)", "objective": "...", "summary": "..." },
    { "index": 2, "title": "BATNA", "objective": "...", "summary": "..." }
  ]
}
```

`editedUnits` is optional. If omitted, the cached outline is used verbatim. If provided, it replaces the outline before persistence.

## Response — accept

### 201 Created

```json
{
  "topicId": "uuid",
  "curriculumId": "uuid",
  "units": [
    { "id": "uuid", "index": 1, "title": "...", "status": "pending" }
  ]
}
```

## Error states

- `400 INVALID_BODY`
- `401 NOT_AUTHENTICATED`
- `409 TOPIC_EXISTS` — this learner already has a topic with this fingerprint (prevent accidental duplicates; editable via a `force: true` param not in Phase 1).
- `503 BUDGET_EXCEEDED`
- `502 UPSTREAM_FAILED`

## Side effects

### outline

1. Scope guardrail call (records ledger entry `GUARDRAIL`).
2. If admitted and cache miss: outline generation (records ledger entry `CURRICULUM`), insert into `praxis_curriculum_cache`.
3. If cache hit: increment `hit_count` in `praxis_curriculum_cache`.

### accept

1. Insert `praxis_topics` with `curriculum_id = <cache row id>`, `status = 'outline_ready'`.
2. Insert one `praxis_units` row per outline unit with `status = 'pending'`.
3. If `editedUnits` diverges materially from the cached outline (Levenshtein > 30% on concatenated titles), a fresh cache entry is created rather than mutating the shared cache.

## Prompt

Uses `src/lib/praxis/prompts/curriculum.outline.ts`. Input includes topic string + locale. Output is JSON with schema `{ units: [...] }`. On parse failure, the endpoint retries once with a stricter "return ONLY valid JSON" suffix before returning `502`.

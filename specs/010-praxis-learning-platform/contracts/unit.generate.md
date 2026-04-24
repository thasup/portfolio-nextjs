# Contract: `POST /api/praxis/unit`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-012, FR-013, FR-026, NFR-006

Generates or regenerates unit content. Supports full-unit generation on first access and block-level regeneration after that.

## Authorization

- Authenticated Supabase session required.
- `unitId` must belong to a topic owned by the caller (RLS).

## Request — full unit generation

```http
POST /api/praxis/unit
Content-Type: application/json

{
  "action": "generate",
  "unitId": "uuid"
}
```

## Response — full generation

### 200 OK

```json
{
  "unit": {
    "id": "uuid",
    "status": "ready",
    "blocks": [
      { "id": "uuid", "kind": "objectives", "content": "..." },
      { "id": "uuid", "kind": "explainer", "content": "..." },
      { "id": "uuid", "kind": "example", "content": "..." },
      { "id": "uuid", "kind": "diagram_note", "content": "..." },
      { "id": "uuid", "kind": "practice", "content": "..." }
    ],
    "cached": true
  }
}
```

`cached: true` indicates the `praxis_unit_cache` was hit; blocks were copied into `praxis_units.blocks` and `cache_id` linked.

## Request — block regeneration

```http
POST /api/praxis/unit
Content-Type: application/json

{
  "action": "regenerate_block",
  "unitId": "uuid",
  "blockId": "uuid",
  "instruction": "the example doesn't feel real — use a Thai tech company offer"
}
```

## Response — block regeneration

### 200 OK

```json
{
  "block": {
    "id": "uuid-new",
    "kind": "example",
    "content": "...",
    "regeneratedFrom": "uuid-old"
  }
}
```

## Error states

- `400 INVALID_BODY` / `INVALID_ACTION`
- `401 NOT_AUTHENTICATED`
- `403 NOT_OWNER`
- `404 UNIT_NOT_FOUND` / `BLOCK_NOT_FOUND`
- `409 UNIT_GENERATING` — another request is in flight; client should poll.
- `503 BUDGET_EXCEEDED`
- `502 UPSTREAM_FAILED`

## Side effects

### generate

1. Mark unit `status = 'generating'` before generation (prevents duplicate concurrent generation).
2. Check `praxis_unit_cache` by `(fingerprint, locale, unit_index, model_version)`.
   - Hit: copy blocks, link `cache_id`, `status = 'ready'`, skip generation.
   - Miss: call Anthropic via `curriculum.unit` prompt with outline context + onboarding profile for personalization, record `praxis_spend_ledger` entry, insert into cache, copy blocks to unit, `status = 'ready'`.
3. Units never cache per-learner personalization — personalization flows through Nori conversation (see research §6).

### regenerate_block

1. Call Anthropic with a block-specific prompt using: topic context, unit context, previous block content, learner instruction.
2. Append new block to `praxis_units.blocks` with `regeneratedFrom: <old block id>`; the old block remains in the array (append-only) so history is preserved.
3. Record `praxis_spend_ledger` entry.
4. Regeneration does NOT update the shared `praxis_unit_cache`.

## Prompt

Uses `src/lib/praxis/prompts/curriculum.unit.ts` for full generation. For regeneration, uses a dedicated block-regen prompt that takes the previous block content plus the learner's instruction as input.

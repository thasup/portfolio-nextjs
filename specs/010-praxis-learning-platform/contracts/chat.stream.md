# Contract: `POST /api/praxis/chat`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-017, FR-018, FR-019, FR-020, FR-022, FR-028, FR-029, NFR-001, NFR-008

Streams a Nori response for the current conversation. Used by both the unit chat surface and the full-screen mate surface.

## Authorization

- Requires authenticated Supabase session (cookie).
- The `conversationId` in the body must belong to the authenticated learner (RLS-enforced).

## Request

```http
POST /api/praxis/chat
Content-Type: application/json

{
  "conversationId": "uuid",
  "message": "How would you open a discovery call for SaaS payroll in Thailand?",
  "surface": "unit" | "mate",
  "intent": "roleplay" | "review" | "prep" | "free" | null
}
```

### Validation

- `conversationId` — required, uuid, owned by caller.
- `message` — required, 1–4,000 chars.
- `surface` — required.
- `intent` — optional. When surface === "mate" and intent is set, selects a prompt variant.

## Response

Streaming `text/event-stream` (via Vercel AI SDK data-stream protocol) with frames:

- `0:` text deltas
- `d:` finishReason metadata (at end)
- `e:` error frame if upstream fails

### Example stream

```
data: {"type":"text","value":"Before we roleplay — "}
data: {"type":"text","value":"what industry is your buyer in?"}
data: {"type":"finish","finishReason":"stop","usage":{"inputTokens":1420,"outputTokens":48}}
```

## Error states

Returned as HTTP status before the stream begins, or as an `e:` frame if mid-stream.

- `400 INVALID_BODY`
- `401 NOT_AUTHENTICATED`
- `403 NOT_OWNER` — conversation does not belong to caller.
- `429 RATE_LIMITED` — Anthropic 429 propagated with `Retry-After` header; message input preserved client-side.
- `503 BUDGET_EXCEEDED` — monthly spend guardrail hit. Chat is normally exempt; this state is only surfaced as a warning toast for mate surface, never a hard block (see research §9).
- `502 UPSTREAM_FAILED` — generic Anthropic failure.

## Side effects

1. `praxis_messages` insert for the user message (before streaming).
2. Conversation summary recomputed if input-token budget exceeded (see research §7).
3. Stream is wired to an `AbortController`. On client disconnect, upstream Anthropic call is aborted and billing stops.
4. On successful completion: `praxis_messages` insert for assistant message, `praxis_spend_ledger` entry with endpoint `CHAT`.

## System prompt composition

Assembled by `src/lib/praxis/prompts/nori.persona.ts` from:

1. Nori identity + tone.
2. Learner profile block (from `praxis_onboarding` latest version).
3. Topic block.
4. Unit block (surface === "unit" only).
5. Conversation summary (`praxis_conversations.summary` if present).
6. Behavioral rules (scope refusals, follow-up question pattern, length cap).
7. Intent overlay (surface === "mate" only) — short prompt fragment per intent.

Total static scaffolding ≤ 800 tokens (NFR-008).

# Research: PRAXIS Phase 1

**Feature**: 005-praxis-learning-platform  
**Date**: 2026-04-18  
**Scope**: Resolve the open technical questions blocking implementation. Each section ends with a recommendation captured as an action for `tasks.md`.

## 1. Claude streaming via Next.js App Router

### Question

How should PRAXIS stream Claude responses from a Next.js 15 App Router route handler to a React 19 client in a way that is cancellable, rate-limit-resilient, and cheap to instrument?

### Findings

- The Anthropic TypeScript SDK (`@anthropic-ai/sdk`) exposes `messages.stream()` which yields block delta events. The SDK does not itself produce an HTTP stream for downstream consumers; it returns an async iterator.
- Vercel's AI SDK (`ai` + `@ai-sdk/anthropic`) wraps the SDK and provides `streamText` + `toDataStreamResponse()` helpers that turn the iterator into a `ReadableStream` HTTP response compatible with `fetch`/`useChat`.
- App Router route handlers (`route.ts`) natively return `Response` objects, including streaming ones. Default runtime is Node.js; Edge runtime introduces cold starts and caps on max duration that conflict with full-curriculum generation.
- Client disconnects are signalled via the `AbortSignal` on the incoming `Request`. Both `streamText` and raw SDK calls accept an `AbortSignal`, which allows us to stop billing when the user navigates away.

### Recommendation

- Use `@ai-sdk/anthropic` + `streamText` for the **chat** endpoint (short, interactive, `useChat`-friendly).
- Use the raw `@anthropic-ai/sdk` with `messages.stream()` directly for **curriculum outline, unit, onboarding, and template generation** — these are structured, longer, and benefit from explicit prompt control and JSON-mode parsing.
- All PRAXIS route handlers run on the **Node.js runtime** (`export const runtime = 'nodejs'`).
- Wrap every stream in a cancellation-aware helper that forwards the request's `AbortSignal` to the SDK call.

### Actions

- Install `@ai-sdk/anthropic`, `ai`, `@anthropic-ai/sdk` in Week 1.
- Create `src/lib/praxis/anthropic/stream.ts` with `streamChat` (uses `streamText`) and `streamStructured` (raw SDK wrapper returning parsed JSON).

## 2. Supabase auth: magic-link, invite-only, cross-device

### Question

How do we implement invite-only magic-link auth that persists sessions across devices and keeps the invite list server-owned, without introducing a second email provider alongside Resend (which is already installed)?

### Findings

- Supabase Auth `signInWithOtp()` supports magic links, but by default accepts any email. Invite-only requires an explicit allowlist check before the OTP is issued.
- Three patterns exist:
  - **(a)** Database-enforced allowlist checked by a server route wrapping `signInWithOtp`.
  - **(b)** Dashboard-issued invites — not programmable.
  - **(c)** Resend-owned links: Resend sends the email, a signed token returns to a custom callback that uses Supabase admin API (`generateLink`) to mint the session.
- `@supabase/ssr` is the current recommended Supabase adapter for App Router (correct cookie handling in server components, middleware, route handlers).
- FR-003 mandates Resend for delivery. Adopting Supabase's built-in SMTP would contradict FR-003 and double the email-provider surface area.

### Recommendation

**Pattern (c)**: Resend-owned magic links.

- `praxis_invitations` table: `id`, `email`, `invited_at`, `revoked_at`, `invited_by`.
- `POST /api/praxis/invite` (service-role only) creates the row and sends a Resend email containing a link to `/learn/callback?token=<signed>`.
- Token is a short-lived JWT (15-min expiry) signed with `PRAXIS_INVITE_SECRET`, claims `{ email, invitation_id, exp }`.
- `/learn/callback` verifies the token, checks the invitation row is not revoked, then calls Supabase admin `generateLink({ type: 'magiclink', email })` and exchanges it into the learner's session cookie.
- `middleware.ts` redirects unauthenticated `/learn/*` requests to `/learn/not-invited` (FR-001 requires a dedicated page — **not** a generic 404 or login).

### Actions

- Install `@supabase/supabase-js` + `@supabase/ssr` in Week 1.
- Add env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PRAXIS_INVITE_SECRET`, `ANTHROPIC_API_KEY`.
- Add a `scripts/praxis-invite.ts` developer convenience that invokes the invite endpoint locally.

## 3. Prompt architecture: six modules, two categories

### Question

What is the minimum viable prompt architecture to produce content that does not embarrass the product, given generation quality is the biggest risk?

### Findings

- Monolithic "generate the entire topic in one call" prompts fail on token limits, error recovery, and partial regeneration.
- The wireframes (Tab 08 TA·2) and the PRD both endorse two-phase generation: outline first, then per-unit, then per-template.
- Conversational prompts (Nori) and generation prompts (curriculum/unit/template) have different shapes. Conversation uses a four-section system prompt (identity + learner + unit + behavioral rules). Generation uses structured JSON output with a schema embedded in the prompt.
- Adaptive onboarding questions are themselves generation — a meta-prompt that produces 3–5 calibration questions keyed to a topic string.

### Recommendation

Organize `src/lib/praxis/prompts/` as six modules, each exporting a pure `build(input): string` and a `fixtures` array for tests:

1. **`nori.persona.ts`** — composes chat system prompt.
2. **`curriculum.outline.ts`** — JSON `{ units: [{ title, objective, summary }] }`.
3. **`curriculum.unit.ts`** — JSON `{ blocks: [{ kind, content }] }`, `kind ∈ { objectives, explainer, example, diagram_note, practice }`.
4. **`onboarding.meta.ts`** — JSON `{ questions: [{ id, prompt, helperText, inputType }] }`.
5. **`scope.guardrail.ts`** — JSON `{ admitted, category, explanation }`, `category ∈ { ok, medical, legal, financial, explicit, minors, other }`.
6. **`template.generator.ts`** — JSON `{ kind: 'docx' | 'xlsx' | 'pdf', sections }` followed by a renderer.

Every module is unit-tested with Vitest against its fixtures. A small eval harness at `scripts/praxis-eval.ts` runs ten seed topics through every prompt and records rubric scores.

### Actions

- Week 0 work is prompt work only. No component code is written until the outline and unit prompts pass rubric.
- Keep each prompt ≤ 800 static tokens (NFR-008).

## 4. Topic scope guardrails

### Question

Where and how tightly should topic admissibility be enforced?

### Findings

- **Entry-gate** check (classifier call on the topic string) is cheap, fast, and can be bypassed by euphemism.
- **Outline-gate** check (classify the generated outline) is more accurate but doubles the generation cost per topic.
- **Per-turn** check is most robust and most expensive; at conversation volume it becomes prohibitive.
- False positives hurt more than false negatives when the audience is small and known (Phase 1 is fewer than 20 invited learners).

### Recommendation

**Two gates**, neither per-turn:

1. **Entry gate** — `scope.guardrail.ts` classifier on the submitted topic string. Refuses only on high-confidence `medical`, `legal`, `financial-advice`, `explicit`, `minors`. Ambiguous cases are admitted.
2. **Runtime gate** — embedded behavioral rule in Nori's system prompt: "Never provide medical, legal, or financial advice. Decline and redirect the learner to a qualified professional." Zero marginal tokens. Covers drift.

Skip per-turn classification in Phase 1. Monitor SC-006 (zero audited bad responses). If missed, escalate to per-turn only on the unit chat surface.

### Actions

- `scope.guardrail.ts` runs at blank-canvas submission.
- Behavioral refusals are covered by prompt-eval fixtures.

## 5. Prompt eval harness and the Week-0 quality bar

### Question

How do we know the prompts are good enough to start building UI on top of them?

### Findings

- Ten diverse seed topics surface most prompt regressions without ballooning eval cost.
- Rubric scoring (0–3 per criterion) is cheaper than pairwise preference testing and catches the specific failure modes we care about: generic output, missing personalization, weak examples, vague practice.

### Recommendation

Ten seed topics covering diverse depth/domain/culture:

- sales
- negotiation
- public speaking
- giving feedback
- SQL fundamentals
- product management basics
- UX research
- Thai cooking basics
- pickleball fundamentals
- async leadership

Three fixed synthetic personas per topic. Rubric criteria per generated unit: **(a)** objective specificity, **(b)** concept coverage, **(c)** example concreteness, **(d)** practice usefulness, **(e)** personalization fidelity to the provided persona.

### Week-0 exit bar

- Outline prompt ≥ 2.5/3 average rubric across all ten topics.
- Unit prompt ≥ 2.3/3 average across three randomly selected units per topic.
- Scope guardrail: zero false negatives on a curated probe set of five adversarial prompts (medical, legal, financial, explicit, minors).

### Actions

- `scripts/praxis-eval.ts` writes rubric CSV + summary to `.windsurf/docs/praxis-eval/<date>.md`.
- Track eval scores in the living plan's changelog.

## 6. Caching: topic fingerprints and shared curriculum reuse

### Question

How do we get the ≥ 50% cost reduction target (SC-004) without serving stale or mismatched content to later learners?

### Findings

- Curriculum outlines are highly cacheable: "sales", "learn sales", "i want to learn sales" should all resolve to the same cached outline.
- Full unit content is cacheable too, but has diminishing returns once learners personalize onboarding context. Cache per `(topic_fingerprint, persona_class)` rather than per learner.
- Personalization is best applied as a thin overlay at read time (Nori's conversational injection) rather than baked into cached unit text, so the cache hit-rate stays high.

### Recommendation

- `src/lib/praxis/cache/topicFingerprint.ts`: lowercase, strip stop words ("i want to learn X"), singularize, collapse whitespace, SHA-1. "sales" and "learn sales" fingerprint identically.
- `curriculum_cache` table: `fingerprint`, `outline_json`, `model_version`, `created_at`, `hit_count`.
- `unit_cache` table: `fingerprint`, `unit_index`, `blocks_json`, `model_version`. Units are NOT keyed by learner persona in Phase 1 — personalization flows through Nori conversation, not unit text rewriting.
- `model_version` bumps invalidate the cache; prompt module exports a `VERSION` constant.

### Actions

- Week 2 ships fingerprinting + curriculum cache.
- Week 4 ships unit cache.
- Week 7 instruments hit-rate dashboard for SC-004 tracking.

## 7. Token budget and pruning

### Question

How does PRAXIS stay inside NFR-008 (static prompt ≤ 800 tokens, conversation context ≤ 8,000 tokens) without losing learner-referenced facts?

### Findings

- A naive "truncate the oldest N messages" strategy silently drops facts the learner referenced early ("I sell SaaS payroll to Thai SMBs").
- Summarization at a threshold preserves the facts while compressing history. Claude is reliable at single-pass conversation summarization with an explicit "preserve named entities" instruction.
- The learner profile block (onboarding answers) carries most persistent facts already; pruning older turns is safer if onboarding is canonical.

### Recommendation

- Hard cap persisted conversation per unit at 20 turns. Older turns are summarized into a single `<history_summary>` block prepended to new requests.
- Whenever input tokens exceed 6,500 (75% of budget), trigger summarization on the oldest un-summarized third of the conversation.
- Never prune the learner profile block or the unit block — they are small and the product's core differentiator.

### Actions

- `src/lib/praxis/anthropic/pruning.ts` contains the summarizer and the threshold check.
- Unit tests cover: (i) no fact loss across 3 synthetic summarization cycles, (ii) token budget stays under 8,000 at 30-turn length.

## 8. Template rendering: DOCX, XLSX, PDF

### Question

How does PRAXIS generate downloadable templates server-side without heavyweight rendering infrastructure?

### Findings

- `docx` (npm `docx`) produces Word files in pure Node without headless browsers; ~150 KB dependency.
- `exceljs` renders XLSX; moderately heavy but works under Vercel serverless function limits for small files.
- `@react-pdf/renderer` or `pdfkit` renders PDF; `@react-pdf/renderer` is JSX-friendly and composes well with existing React skillset.
- Each generation is small enough (≤ 2 MB output) to fit in a single Vercel serverless function response without requiring Storage.

### Recommendation

- Phase 1 ships DOCX and XLSX only. PDF deferred to Phase 3 (aligns with playbook-export scope).
- No Supabase Storage in Phase 1: templates are generated per request and streamed directly as `Content-Disposition: attachment`. Cache the underlying LLM JSON (not the binary) in `template_cache` keyed by `(fingerprint, template_kind, learner_id)` so regenerations are cheap while the binary stays fresh.

### Actions

- Install `docx` and `exceljs` in Week 6.
- `src/lib/praxis/templates/docx.ts` and `xlsx.ts` render from the JSON produced by `template.generator.ts`.

## 9. Monthly spend guardrail

### Question

How do we enforce SC-009 (stay under the Phase 1 Anthropic budget) without building billing infrastructure?

### Findings

- Anthropic responses include `usage.input_tokens` and `usage.output_tokens`. Multiplying by the current model's price yields a per-request cost.
- A rolling monthly sum in a `praxis_spend_ledger` table is cheap to write on every call and cheap to read on every call with a single aggregate query.
- Hard-stop behavior (refuse all generation) is a better failure mode than soft degradation for Phase 1 because the invited audience is small and the curator is reachable.

### Recommendation

- `praxis_spend_ledger` table: `timestamp`, `endpoint`, `input_tokens`, `output_tokens`, `estimated_cents`.
- `src/lib/praxis/anthropic/ledger.ts` exposes `record(usage)` and `getMonthlySpendCents()`.
- Every generation endpoint checks `getMonthlySpendCents()` before issuing the upstream call; if over the configured `PRAXIS_MONTHLY_BUDGET_CENTS`, returns a 503 with a specific error code `BUDGET_EXCEEDED`.
- Nori chat is exempt from hard-stop to avoid breaking mid-conversation experiences; it emits a soft warning instead.

### Actions

- Week 7 ships ledger + budget env var + UI error state.

## 10. Mobile reality check

### Question

What specifically breaks on 375px iOS Safari that we need to design around from Week 1?

### Findings

- The iOS Safari keyboard overlay reduces viewport height without triggering `resize`. Using `100vh` in chat surfaces pushes the input under the keyboard.
- File download via `window.location.href` or `<a download>` is unreliable on iOS Safari; the preferred path is a `fetch` → `Blob` → `URL.createObjectURL` chain with explicit user activation.
- Streaming chat causes frequent layout reflows; wrapping the message list in `content-visibility: auto` on desktop and a virtualized list on mobile cuts jank dramatically.

### Recommendation

- Chat surface uses `100svh` (small viewport) plus `dvh` where supported, with a sticky input bar and keyboard-offset padding via `env(keyboard-inset-height)`.
- Template downloads go through `POST → Blob → objectURL → anchor.click()` with explicit cleanup.
- Mobile message list uses a simple list for Phase 1 (< 20 turns); virtualization is deferred until turn count grows.

### Actions

- Week 7 dedicated mobile audit on Jane's actual device.
- Playwright test covers keyboard overlay case using device emulation.

## Open questions remaining after research

- **Anthropic model choice** — deferred to Week 0 by comparing latency and quality between Sonnet and Haiku on the eval harness; Sonnet is the default until data says otherwise.
- **Soft-launch rollout cadence** — one invitee (Jane) on day 1 of Week 8, two more on day 3, two more at end of Week 8, decided by observed bug rate.
- **Constitutional amendment** — a `PATCH` bump clarifying that "narrowly scoped learning subsystems" fall under the permitted dynamic category. Logged in the living plan; not a blocker for Week 0.

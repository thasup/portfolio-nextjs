# Checklist: Pre-Launch (Soft-Launch to Jane)

**Feature**: 005-praxis-learning-platform  
**Trigger**: Completed at end of Week 7, before Jane receives her invitation.

## Functional readiness

- [ ] Invite → magic-link → authenticated library works in production on `thanachon.me`.
- [ ] `/learn/not-invited` renders correctly for any unauthenticated access.
- [ ] Blank-canvas topic entry accepts input, scope guardrail refuses known bad topics.
- [ ] Outline generation returns within 30s for all ten seed topics.
- [ ] Outline editing persists correctly.
- [ ] Onboarding generates topic-appropriate questions for at least five test topics.
- [ ] Unit generation works on first access; block regeneration produces distinct variants.
- [ ] Nori streams responses within 3s (NFR-001) on production Vercel deployment.
- [ ] Full-screen mate surface loads with visible context rail.
- [ ] DOCX download succeeds on macOS Chrome and iOS Safari.
- [ ] XLSX download succeeds on macOS Chrome and iOS Safari.
- [ ] Template regeneration produces a new spec (not byte-identical to the prior).
- [ ] Progress persists across sign-out / sign-in on a different device.
- [ ] Conversation history restores correctly after 24 hours.
- [ ] Conversation summarization triggers at the 6,500-token threshold without fact loss (verified by unit test).

## Performance

- [ ] Lighthouse Performance ≥ 90 mobile, ≥ 95 desktop on `/learn`.
- [ ] Lighthouse Accessibility ≥ 95 on all `/learn/*` routes.
- [ ] FCP under 1.5s desktop / 2.5s mobile.
- [ ] TTFT (time to first streamed token) under 3s on a typical broadband connection.
- [ ] The portfolio's existing Lighthouse scores are unchanged from pre-PRAXIS baseline.

## Accessibility

- [ ] All `/learn/*` routes keyboard-navigable with visible focus indicators.
- [ ] Chat input, buttons, and all interactive elements meet 44×44px minimum.
- [ ] Screen-reader announces streaming chat responses as they complete.
- [ ] Reduced-motion users see no gratuitous animation in generation progress indicators.

## Mobile

- [ ] Every `/learn/*` route renders without horizontal scroll at 320px.
- [ ] Chat keyboard does not obstruct input.
- [ ] Template download saves successfully on Jane's actual iPhone (iOS Safari tested).
- [ ] One-handed interaction tested on a 375px viewport.

## Security

- [ ] All API routes check authentication and ownership before Supabase reads.
- [ ] Anthropic API key never leaves the server. No `NEXT_PUBLIC_*` leak.
- [ ] Supabase service-role key only used in server-side code (`src/lib/praxis/supabase/admin.ts`).
- [ ] Invite JWT expires at 15 minutes and is rejected after revocation.
- [ ] RLS policies prevent cross-learner data access (verified by dedicated test).
- [ ] PRAXIS_ADMIN_TOKEN not committed; only set in Vercel env.

## Cost discipline

- [ ] `PRAXIS_MONTHLY_BUDGET_CENTS` set to a value that covers ten active invited learners for one month.
- [ ] Spend ledger records entries for every Anthropic call.
- [ ] BUDGET_EXCEEDED error state renders correctly when simulated.
- [ ] Curriculum cache hit-rate observable via a simple SQL query or admin panel.

## Observability

- [ ] `praxis_session_start`, `praxis_topic_created`, `praxis_unit_completed`, `praxis_template_downloaded`, `praxis_conversation_turn` events firing in analytics.
- [ ] 7-day return rate query returns a valid (empty or not) result.
- [ ] Error responses logged server-side with enough context to debug.

## Content quality (Week 0 eval bar still met)

- [ ] Prompt eval harness rerun on the current prompts; scores within tolerance of Week 0 baseline.
- [ ] No regression on the adversarial scope probes.

## Jane-specific

- [ ] Jane's invitation email rehearsed (copy, subject line, sender name).
- [ ] Jane's onboarding session has a scheduled observation window (with her consent).
- [ ] A "you will need: a phone, a quiet 20 minutes, and a real topic" email sent before the invite.

## Rollback plan

- [ ] If Nori produces harmful advice during the soft launch, an operator runbook exists to disable `/api/praxis/chat` via a feature flag without a redeploy.
- [ ] If Supabase auth has an outage, `/learn/not-invited` provides a clear "we're down, try later" message.
- [ ] A single deploy can revert to portfolio-only (the `005-*` branch, not trunk).

## Sign-off

- [ ] First reviews this checklist.
- [ ] Living plan entry dated and signed: "Pre-launch complete."

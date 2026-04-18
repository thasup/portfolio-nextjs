# Contract: `POST /api/praxis/onboarding`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-014, FR-015, FR-016

Generates topic-adaptive onboarding questions and persists learner answers. Replaces the PRD's hardcoded four sales questions with a meta-prompted generator.

## Authorization

- Authenticated Supabase session required.
- Topic must be owned by caller.

## Request — generate questions

```http
POST /api/praxis/onboarding
Content-Type: application/json

{
  "action": "generate_questions",
  "topicId": "uuid"
}
```

## Response — questions

### 200 OK

```json
{
  "questions": [
    {
      "id": "q-role",
      "prompt": "What kinds of negotiations are you preparing for?",
      "helperText": "Salary, vendor contracts, team disputes — whatever is most relevant.",
      "inputType": "text_long"
    },
    {
      "id": "q-goal",
      "prompt": "Think of a negotiation you lost. What happened?",
      "helperText": "I'll use this as our running example in later units.",
      "inputType": "text_long"
    }
  ]
}
```

`inputType ∈ { text_short, text_long, single_choice, multi_choice }`. Phase 1 generates only text types.

## Request — save answers

```http
POST /api/praxis/onboarding
Content-Type: application/json

{
  "action": "save_answers",
  "topicId": "uuid",
  "answers": [
    { "questionId": "q-role", "prompt": "What kinds...", "answer": "Salary, vendor contracts", "helperText": "..." },
    { "questionId": "q-goal", "prompt": "Think of...", "answer": "Accepted first offer...", "helperText": "..." }
  ]
}
```

## Response — save

### 201 Created

```json
{
  "profile": {
    "id": "uuid",
    "version": 1,
    "topicId": "uuid"
  }
}
```

## Error states

- `400 INVALID_BODY`
- `401 NOT_AUTHENTICATED`
- `403 NOT_OWNER`
- `404 TOPIC_NOT_FOUND`
- `503 BUDGET_EXCEEDED`
- `502 UPSTREAM_FAILED`

## Side effects

### generate_questions

1. Call Anthropic via `onboarding.meta` prompt with topic + outline summary.
2. Record `praxis_spend_ledger` entry with endpoint `ONBOARDING`.
3. Questions are NOT cached in Phase 1 (cost low, uniqueness valued).

### save_answers

1. Increment `version` on any existing `praxis_onboarding` row for `(learner_id, topic_id)`.
2. Insert a new row with the new version number. Old versions are preserved.
3. Update `praxis_topics.status = 'active'` if not already.

## Prompt

Uses `src/lib/praxis/prompts/onboarding.meta.ts`. The meta-prompt instructs Claude to generate 3–5 questions tailored to the topic that cover: background, context specificity, stated goal, obstacle. Returns JSON `{ questions: [...] }` with strict schema.

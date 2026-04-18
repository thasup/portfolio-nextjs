# Contract: `POST /api/praxis/invite`

**Feature**: 005-praxis-learning-platform  
**Related requirements**: FR-002, FR-003, FR-005

Creates an invitation record and dispatches a magic-link email via Resend. Curator-only.

## Authorization

- Requires `x-praxis-admin-token` header matching server env `PRAXIS_ADMIN_TOKEN`.
- Not exposed to client. Callable only from local dev scripts or a future admin UI.

## Request

```http
POST /api/praxis/invite
Content-Type: application/json
x-praxis-admin-token: <PRAXIS_ADMIN_TOKEN>

{
  "email": "jane@example.com",
  "note": "primary Phase 1 learner"
}
```

### Validation

- `email` — required, RFC 5322 valid.
- `note` — optional, ≤ 200 chars.

## Response

### 201 Created

```json
{
  "invitation": {
    "id": "f4c9...-uuid",
    "email": "jane@example.com",
    "invitedAt": "2026-04-21T12:00:00Z",
    "note": "primary Phase 1 learner"
  },
  "deliveryStatus": "sent"
}
```

### 400 Bad Request

- `INVALID_EMAIL` — email failed validation.
- `ALREADY_INVITED` — active (non-revoked) invitation exists.

### 401 Unauthorized

- `BAD_ADMIN_TOKEN` — admin header missing or wrong.

### 502 Bad Gateway

- `RESEND_FAILED` — email provider returned an error. Invitation row is created and marked for retry.

## Side effects

1. Insert into `praxis_invitations`.
2. Generate a signed JWT (15-minute expiry, `HS256`, secret `PRAXIS_INVITE_SECRET`) with claims `{ email, invitation_id, exp }`.
3. Send Resend email with subject "You're invited to PRAXIS" and a link to `${NEXT_PUBLIC_SITE_URL}/learn/callback?token=<jwt>`.
4. Append `praxis_spend_ledger` entry is NOT created for this endpoint.

## Revocation

- A separate endpoint (`DELETE /api/praxis/invite/:id`) sets `revoked_at` and invalidates any pending tokens by checking `revoked_at IS NULL` at callback time.

# Quickstart: Bilingual Portfolio Development

**Branch**: `002-bilingual-portfolio` | **Date**: 2026-03-08 | **Context**: [plan.md](../plan.md)

This guide documents the standardized execution procedures for building, testing, and deploying the Next.js App Router application locally and via the CI pipeline to Vercel.

## 1. Local Environment Setup

Clone the repository and install all dependencies:

```bash
git clone <repository_url>
cd <project-directory>
npm install
```

### Environment Variables

Duplicate the `.env.local.example` strictly organizing values into the documented scope partitions:

```bash
cp .env.local.example .env.local
```

Modify `.env.local`:

```bash
# =========================================
# CLIENT-VISIBLE (Available in Client Components)
# =========================================
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# =========================================
# SERVER-ONLY (Vercel Serverless Functions - e.g. /api/contact)
# =========================================
RESEND_API_KEY="re_123456789"

```

## 2. Running Local Development

Start the localized Next.js development server. This server dynamically handles the `/th/...` routing structures via `next-intl` middleware mapping:

```bash
npm run dev
```

## 3. Production Build Process

The `vercel.json` file dictates hybrid-static mapping implicitly. Attempt to generate the optimized compilation. Ensure no errors flag blocking outputs:

```bash
npm run build
```

All content is sourced from version-controlled static data files, so no prebuild scripts or external fetches are required.
Ensure static data edits are committed before triggering CI/CD builds.

## 4. Code Quality & Pre-Commit Pipelines

All merged commits must clear standard TS validations and ESLint enforcement checks. Lighthouse performance checking guarantees are prioritized at PR creation.

```bash
npm run lint
```

*(Optionally setup `npm run format` mapping native Prettier checks if implemented).*

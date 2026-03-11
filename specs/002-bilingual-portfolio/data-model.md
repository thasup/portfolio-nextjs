# Data Model: Bilingual Portfolio
**Branch**: `002-bilingual-portfolio` | **Date**: 2026-03-08 | **Context**: [plan.md](./plan.md)

## Core Entities
This architecture defines all typed schema representations needed to populate the bilingual static content structure at build-time. Types exist independently in `src/types/`.

### `TimelineChapter`
Segments the individual career milestones into overarching storytelling blocks.
- `id` (string): e.g., "chapter-1-pivot"
- `order` (number): 1, 2, 3...
- `titleEn`, `titleTh` (string): Localized chapter header values
- `descriptionEn`, `descriptionTh` (string): Localized broad summaries
- `period` (string): Formatted year segment (e.g., "2021–2022")
- `accentColor` (string): Hex constraint indicating the unique scroll spine progression marker color (e.g., `#F59E0B`).
- `eventIds` (string[]): Relationships mapping explicitly to `TimelineEvent`.

### `TimelineEvent`
Specific career moments grouped under chapters mapping localized insights regarding outcomes.
- `id` (string): e.g., "ap-thai", "kmitl"
- `chapterId` (string): Relational map back up to `TimelineChapter`
- `date` (string): Display date string ("Mid 2022")
- `titleEn`, `titleTh` (string): Localized event title
- `summaryEn`, `summaryTh` (string): Deep dive narrative
- `impactEn`, `impactTh` (string): Actionable outcomes measured
- `tech` (string[]): Optional tags denoting stacked utilized skills (e.g., ["React", "AWS"])
- `isFeatured` (boolean): Flag indicating priority display treatments

### `Project`
Production applications represented individually with specific domain tagging arrays.
- `slug` (string): unique identifier (e.g., "ai-event-platform")
- `domain` (enum: `'ai' | 'web3' | 'ecommerce' | 'frontend'`)
- `featured` (boolean): Flag marking display prioritization.
- `year` (number)
- `titleEn`, `titleTh` (string): The explicit localized title
- `taglineEn`, `taglineTh` (string): Quick elevator pitch array
- `problemEn`, `problemTh` (string): Narrative framing the difficulty encountered
- `approachEn`, `approachTh` (string): Narrative framing the solution architecture
- `outcomesEn`, `outcomesTh` (string): Measurable impact details
- `tech` (string[])

### `SkillCluster`
Groups related distinct proficiencies.
- `id` (string): e.g., "ai-intelligent-systems"
- `order` (number): Sorting index
- `nameEn`, `nameTh` (string)
- `narrativeEn`, `narrativeTh` (string): Explaining *why* they matter
- `skills` (Array of objects containing `name` (string) and `proficiency` (number 0-100))

### `ValueProposition`
A specific metric mapping back to related events validating the user.
- `id` (string): e.g., "vp-1-ships-ai"
- `titleEn`, `titleTh` (string)
- `descriptionEn`, `descriptionTh` (string)
- `crossRefType` (enum: `'project' | 'timeline' | 'section' | null`)
- `crossRefId` (string): Points back to `Project.slug` or `TimelineEvent.id`

### `Testimonial`
Feedback arrays stored for rotation across Swiper blocks mapping author intent to value validation.
- `id` (string)
- `author` (string)
- `role` (string)
- `relationshipEn`, `relationshipTh` (string): e.g., "Direct manager · 3 years"
- `quoteEn`, `quoteTh` (string): Explicit textual arrays
- `avatar` (string): Relative URL or next-image compatible string

### `ContactIntent`
Values mapping form intent drop-downs triggering alternative validation behaviors.
- `value` (string): e.g., "hire_engineer"
- `labelEn`, `labelTh` (string)

## Validation Rules
- Content objects strictly forbid complex nesting. Any deep linking points backward simply to the primitive `slug` or `id`.
- The `generateStaticParams` must iterate directly from these exported array exports without needing `try/catch` runtime mutation inside `.tsx` presentation components.

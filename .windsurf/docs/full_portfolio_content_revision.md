# Full Portfolio Content Revision

## Grounded in All Source Documents — Ready for Implementation

---

## What These Documents Fundamentally Change

Before writing a single word of revised content, here are the critical facts these PDFs unlock that the previous plan had wrong or incomplete:

| Previous Assumption | Actual Truth |
|---|---|
| 4 years of experience | **7+ years** total (MEP engineering 2018–2021 + self-study + software 2022–present) |
| Currently at MAQE | **Currently at TeamStack** (Apr 2025–Present) |
| No real testimonials | **6 real quotes** from named colleagues, a client, and a CEO |
| AWS cert at MAQE (2024) | **AWS cert at TeamStack transition (Feb 2025)** |
| No pre-tech career | **2.3 years as MEP Engineer at Toparch** — the systems thinking origin story |
| AI Event Platform = biggest project | **The Air Product at TeamStack** is the current flagship |
| Self-designated "Thanachon" only | Goes by **"First"** — critical for Thai market warmth |
| Gaia Project = side project | Gaia is a **personal life OS** — his INTJ systems thinking made tangible |

---

## The Master Narrative (Revised)

The through-line that connects everything — from mechanical engineering to MEP to self-taught programmer to AI product builder to founder-in-training:

> **"I am a systems thinker who builds systems for humans."**
>
> From engineering mechanical systems at Toparch, to architecting software systems at MAQE, to building AI-first product systems at TeamStack — the domain changes but the instinct never does. I don't just write code. I design the underlying order that makes complex things manageable, scalable, and human.

This framing works because:

- It explains the MEP → software pivot as **evolution, not escape**
- It makes "Gaia Project" feel like **inevitable expression**, not a quirky hobby
- It positions the SaaS founder vision as **logical conclusion**, not aspiration
- It resonates equally with **AI Engineer** (systems architecture) and **Product Owner** (systems for users) audiences

---

## Section 1 — Hero

### Strategic Architecture

The hero must answer two questions simultaneously:

| Question | Within | Copy |
|---|---|---|
| "Who is this?" | 2 seconds | Name + title + location |
| "Why is this different?" | 5 seconds | Tagline + trust strip + differentiator |

### EN Copy

```
Thanachon "First" Suppasatian

Senior Software Engineer
Building AI-first products. Thinking like a founder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7 years in engineering. 4 years shipping software.
1 clear direction: AI systems that actually work.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[See My Work]    [Get In Touch]

↓ MIT Engineer → Self-taught Dev → AI Product Builder

TRUST STRIP:
▸ AWS Certified Cloud Practitioner · 2025
▸ TOEIC 915/990 · English proficiency
▸ MEP Engineering → Software → AI (7 years compounding)
▸ Bangkok, Thailand · Open to international roles
```

### TH Copy

```
ธนชน "เฟิร์ส" ศุภเสถียร

Senior Software Engineer
สร้างผลิตภัณฑ์ AI ที่ใช้งานได้จริง คิดแบบ Founder

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7 ปีในวิศวกรรม 4 ปี Ship ซอฟต์แวร์
ทิศทางเดียว: AI systems ที่ทำงานได้จริงใน production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ดูผลงาน]    [ติดต่อ]
```

### Tagline Variations by Audience

```typescript
// src/data/heroTaglines.ts
export const taglines = {
  default: {
    en: "I build AI-first systems that turn complexity into control.",
    th: "ผมสร้าง AI-first systems ที่เปลี่ยนความซับซ้อนให้กลายเป็นการควบคุม"
  },
  aiEngineer: {
    en: "Production AI engineer. From MEP blueprints to LLM pipelines.",
    th: "AI Engineer ที่ ship ใน production ได้จริง จาก blueprint สู่ LLM pipeline"
  },
  productOwner: {
    en: "Engineer who speaks product. Builder who thinks in outcomes.",
    th: "วิศวกรที่คุยภาษา product ได้ Builder ที่คิดเรื่อง outcome"
  },
  founder: {
    en: "Systems thinker. Product builder. Founder in formation.",
    th: "นักคิดเชิงระบบ Builder ผลิตภัณฑ์ Founder ที่กำลังก่อตัว"
  }
}
```

### CTA Micro-copy

```
[See My Work]
"Best way to assess execution quality fast"

[Get In Touch]
"Open to hiring, collaboration, and founder conversations"
```

---

## Section 2 — Timeline (Complete 7-Year Arc)

### The Chapter System — Revised

The timeline now covers the **full 7-year arc**, not just the 4 MAQE years. This makes the story enormously more compelling — the MEP engineering chapter gives the pivot emotional weight.

```typescript
// src/data/timelineChapters.ts (REVISED)

export const YEAR_THEMES = {
  2018: {
    label: "The Foundation",
    labelTh: "รากฐาน",
    spineColor: "#78716C",   // stone-500 — solid, grounded
    dotColor:   "#A8A29E",
    accentHex:  "#78716C",
    period:     "2018–2021",
    tagEn:      "Systems Thinking Origin",
    tagTh:      "จุดเริ่มต้นของการคิดเชิงระบบ",
  },
  2021: {
    label: "The Bet",
    labelTh: "การพนัน",
    spineColor: "#F97316",   // orange-500 — bold, courageous
    dotColor:   "#FDBA74",
    accentHex:  "#F97316",
    period:     "2021–2022",
    tagEn:      "Career Reinvention",
    tagTh:      "การสร้างอาชีพใหม่",
  },
  2022: {
    label: "The Craft",
    labelTh: "การฝึกฝนฝีมือ",
    spineColor: "#F59E0B",   // amber-500 — warm, earning trust
    dotColor:   "#FCD34D",
    accentHex:  "#F59E0B",
    period:     "2022–2023",
    tagEn:      "Professional Engineering Foundation",
    tagTh:      "รากฐานวิศวกรรมมืออาชีพ",
  },
  2023: {
    label: "The Frontier",
    labelTh: "ชายแดนใหม่",
    spineColor: "#8B5CF6",   // violet-500 — Web3 exploration
    dotColor:   "#C4B5FD",
    accentHex:  "#8B5CF6",
    period:     "2023–2024",
    tagEn:      "Web3 & Leadership Emergence",
    tagTh:      "Web3 และการเกิดขึ้นของภาวะผู้นำ",
  },
  2024: {
    label: "The Intelligence Layer",
    labelTh: "ชั้น Intelligence",
    spineColor: "#6366F1",   // indigo-500 — AI, precision
    dotColor:   "#A5B4FC",
    accentHex:  "#6366F1",
    period:     "2024–2025",
    tagEn:      "AI Integration & Transition",
    tagTh:      "AI Integration และการเปลี่ยนผ่าน",
  },
  2025: {
    label: "The Vision",
    labelTh: "วิสัยทัศน์",
    spineColor: "#10B981",   // emerald-500 — growth, founder
    dotColor:   "#6EE7B7",
    accentHex:  "#10B981",
    period:     "2025–Present",
    tagEn:      "Product Builder & Founder Formation",
    tagTh:      "Product Builder และการก่อตัวของ Founder",
  },
}
```

### All Timeline Events — Revised & Expanded

```typescript
// src/data/timelineEvents.ts (FULL REVISED DATASET)

export const timelineEvents: TimelineEvent[] = [

  // ═══════════════════════════════════════
  // CHAPTER 0: THE FOUNDATION (2018–2021)
  // ═══════════════════════════════════════

  {
    id: "toparch-mep",
    date: "Dec 2018",
    sortDate: "2018-12-15",
    title: "MEP Engineer — Toparch",
    titleTh: "วิศวกร MEP — Toparch",
    company: "Toparch",
    type: "work",
    chapter: 2018,
    featured: false,
    summary: "First professional role as a Mechanical, Electrical, and Plumbing engineer in Bangkok. Designed building systems, read blueprints, debugged real-world infrastructure failures.",
    summaryTh: "บทบาทอาชีพแรกในฐานะวิศวกร MEP ในกรุงเทพฯ ออกแบบระบบอาคาร อ่าน blueprint และแก้ไขปัญหา infrastructure ในโลกจริง",
    description: "Spent 2.3 years designing mechanical, electrical, and plumbing systems for commercial buildings. Every project was a constraint satisfaction problem — budget, physics, regulations, and the needs of people who would live inside these systems. This is where I learned that good engineering is not about elegant solutions in isolation. It is about solutions that survive contact with reality.",
    descriptionTh: "ใช้เวลา 2.3 ปีในการออกแบบระบบ MEP สำหรับอาคารพาณิชย์ ทุกโปรเจกต์คือปัญหาการหาค่าเหมาะสมภายใต้ข้อจำกัด — งบประมาณ ฟิสิกส์ กฎระเบียบ และความต้องการของผู้อาศัย นี่คือที่ที่ผมเรียนรู้ว่าวิศวกรรมที่ดีไม่ใช่แค่วิธีแก้ปัญหาที่ดูดี แต่คือวิธีแก้ปัญหาที่รอดได้เมื่อเจอความเป็นจริง",
    impact: "Built a systems-thinking foundation that transfers directly into how I architect software today — thinking about failure modes, edge cases, and the humans who depend on what I build.",
    impactTh: "สร้างรากฐานการคิดเชิงระบบที่ถ่ายทอดโดยตรงสู่การออกแบบซอฟต์แวร์ในปัจจุบัน — การคิดเรื่อง failure modes, edge cases และมนุษย์ที่ต้องพึ่งพาสิ่งที่ผมสร้าง",
    capabilityGained: "Systems Thinking",
    capabilityGainedTh: "การคิดเชิงระบบ",
    skills: ["MEP Engineering", "AutoCAD", "Systems Design", "Project Management"],
    signals: ["systems-thinking", "technical-rigor"],
    duration: "845 days",
  },

  // ═══════════════════════════════════════
  // CHAPTER 1: THE BET (2021–2022)
  // ═══════════════════════════════════════

  {
    id: "career-pivot",
    date: "Apr 2021",
    sortDate: "2021-04-07",
    title: "Resigned. Started Over. On Purpose.",
    titleTh: "ลาออก เริ่มใหม่ อย่างตั้งใจ",
    type: "milestone",
    chapter: 2021,
    featured: true,
    summary: "Left Toparch after 2.3 years to self-study programming full-time. No job lined up. No bootcamp. Just a decision, a laptop, and a conviction that software was the right medium for my mind.",
    summaryTh: "ลาออกจาก Toparch หลังจาก 2.3 ปี เพื่อเรียนเขียนโปรแกรมด้วยตัวเองเต็มเวลา ไม่มีงานรอ ไม่มีบูทแคมป์ แค่การตัดสินใจ laptop และความเชื่อว่าซอฟต์แวร์คือสื่อที่เหมาะกับจิตใจของผม",
    description: "The most expensive bet I ever made — and the best. I walked away from a stable engineering career in a field I was competent in, in a country where stability is prized, to spend a year learning to code from scratch. I studied JavaScript, HTML, CSS, and the fundamentals of software architecture from online resources. I built projects. I failed at projects. I documented everything. Twelve months later, I had a portfolio that got me into MAQE.",
    descriptionTh: "การพนันที่แพงที่สุดที่ผมเคยทำ — และดีที่สุด ผมเดินออกจากอาชีพวิศวกรรมที่มั่นคงในสาขาที่ผมมีความสามารถ ในประเทศที่ให้ความสำคัญกับความมั่นคง เพื่อใช้เวลาหนึ่งปีเรียนเขียนโค้ดตั้งแต่ต้น ผมเรียน JavaScript, HTML, CSS และพื้นฐาน software architecture จากแหล่งข้อมูลออนไลน์ สร้างโปรเจกต์ ล้มเหลวกับโปรเจกต์ บันทึกทุกอย่าง 12 เดือนต่อมา ผมมี portfolio ที่พาเข้าสู่ MAQE",
    impact: "Proved to myself that I can rebuild competence in a new domain from scratch — under financial pressure, without external structure. This is the data point that makes every subsequent technology pivot feel manageable.",
    impactTh: "พิสูจน์ให้ตัวเองเห็นว่าสามารถสร้างความสามารถใหม่ในโดเมนใหม่ตั้งแต่ต้นได้ — ภายใต้แรงกดดันทางการเงิน โดยไม่มีโครงสร้างภายนอก นี่คือข้อมูลที่ทำให้การเปลี่ยนเทคโนโลยีทุกครั้งในภายหลังรู้สึกจัดการได้",
    capabilityGained: "Self-Directed Learning & Courage",
    capabilityGainedTh: "การเรียนรู้ด้วยตัวเองและความกล้าหาญ",
    skills: ["JavaScript", "HTML", "CSS", "Self-directed learning"],
    signals: ["fast-learner", "founder-signal", "high-agency"],
    duration: "377 days",
  },

  {
    id: "toeic-first",
    date: "Feb 2022",
    sortDate: "2022-02-01",
    title: "TOEIC 890 — First Attempt",
    titleTh: "TOEIC 890 — ครั้งแรก",
    type: "achievement",
    chapter: 2021,
    featured: false,
    summary: "Scored 890/990 on first TOEIC attempt — while simultaneously learning software engineering. Intentional investment in English fluency for international work opportunities.",
    summaryTh: "ได้ 890/990 ครั้งแรก — ขณะเดียวกันกับการเรียนรู้ software engineering ลงทุนอย่างตั้งใจในความคล่องแคล่วภาษาอังกฤษสำหรับโอกาสการทำงานระหว่างประเทศ",
    impact: "Cleared the English barrier that stops most Thai engineers from accessing international clients and global roles.",
    impactTh: "ทำลายอุปสรรคด้านภาษาอังกฤษที่ขัดขวางวิศวกรไทยส่วนใหญ่จากการเข้าถึงลูกค้าต่างประเทศและบทบาทระดับโลก",
    capabilityGained: "Global Communication Readiness",
    capabilityGainedTh: "ความพร้อมด้านการสื่อสารระดับโลก",
    skills: ["English", "TOEIC"],
    signals: ["bilingual", "global-ready"],
  },

  // ═══════════════════════════════════════
  // CHAPTER 2: THE CRAFT (2022–2023)
  // ═══════════════════════════════════════

  {
    id: "join-maqe",
    date: "Apr 2022",
    sortDate: "2022-04-18",
    title: "Joined MAQE Bangkok",
    titleTh: "เข้าร่วม MAQE Bangkok",
    company: "MAQE Bangkok Co., Ltd.",
    type: "milestone",
    chapter: 2022,
    featured: true,
    summary: "First day as a professional Software Engineer — after a 12-month self-study pivot. Joined one of Bangkok's premier digital agencies, working with Japanese enterprise clients and global brands.",
    summaryTh: "วันแรกในฐานะ Software Engineer มืออาชีพ — หลังจากการเปลี่ยนสาย 12 เดือน เข้าร่วม digital agency ชั้นนำของกรุงเทพฯ ทำงานกับลูกค้าองค์กรญี่ปุ่นและแบรนด์ระดับโลก",
    impact: "The pivot worked. Day one confirmed: systems thinking from MEP engineering accelerates software learning in ways pure CS graduates rarely experience.",
    impactTh: "การเปลี่ยนสายได้ผล วันแรกยืนยัน: การคิดเชิงระบบจากวิศวกรรม MEP เร่งการเรียนรู้ซอฟต์แวร์ในแบบที่บัณฑิต CS โดยตรงแทบไม่มีโอกาสสัมผัส",
    capabilityGained: "Professional Software Delivery",
    capabilityGainedTh: "การส่งมอบซอฟต์แวร์มืออาชีพ",
    skills: ["React", "Vue 3", "TypeScript", "Professional Git workflow"],
    signals: ["career-pivot-success", "fast-learner"],
  },

  {
    id: "ap-thai",
    date: "Apr–Jun 2022",
    sortDate: "2022-04-18",
    title: "AP Thai — Property Discovery Platform",
    titleTh: "AP Thai — แพลตฟอร์มค้นหาอสังหาริมทรัพย์",
    company: "MAQE / AP Thailand",
    type: "project",
    chapter: 2022,
    featured: false,
    summary: "Consumer-facing home discovery platform for AP Thailand — one of the country's largest residential developers. First production experience with CMS-backed architecture at scale.",
    summaryTh: "แพลตฟอร์มค้นหาบ้านสำหรับผู้บริโภคของ AP Thailand — หนึ่งในผู้พัฒนาที่อยู่อาศัยรายใหญ่ที่สุดของประเทศ ประสบการณ์ production ครั้งแรกกับ CMS-backed architecture ในระดับ scale",
    impact: "Shipped a modernized homebuying journey for thousands of AP Thailand customers. First exposure to GA4-driven product decisions — watching user behavior data change what we build next.",
    impactTh: "Ship ประสบการณ์การซื้อบ้านที่ทันสมัยให้กับลูกค้า AP Thailand นับพัน ครั้งแรกที่สัมผัสการตัดสินใจด้านผลิตภัณฑ์ที่ขับเคลื่อนด้วย GA4",
    capabilityGained: "Scale & Analytics-Driven Development",
    capabilityGainedTh: "การพัฒนาที่ขับเคลื่อนด้วย Analytics ในระดับ Scale",
    skills: ["NuxtJS", "SCSS", "Laravel", "MariaDB", "Docker", "Cypress", "GA4", "GTM", "AWS"],
    signals: ["production-delivery", "analytics"],
    duration: "64 days",
  },

  {
    id: "peatix-tangier-primrose",
    date: "Sep 2022",
    sortDate: "2022-09-13",
    title: "Peatix Series — Long-Term Product Partnership",
    titleTh: "Peatix Series — ความร่วมมือด้านผลิตภัณฑ์ระยะยาว",
    company: "MAQE / Peatix (Japan)",
    type: "project",
    chapter: 2022,
    featured: true,
    summary: "Long-running engagement with Peatix — a major Japanese event platform. Started with Tangier (event community features) and Primrose, evolving into a 3+ year product partnership. My longest and deepest client relationship.",
    summaryTh: "การมีส่วนร่วมระยะยาวกับ Peatix — event platform ชั้นนำของญี่ปุ่น เริ่มด้วย Tangier และ Primrose พัฒนาสู่ความร่วมมือด้านผลิตภัณฑ์กว่า 3 ปี ความสัมพันธ์กับลูกค้าที่ยาวนานและลึกซึ้งที่สุด",
    impact: "Became the trusted frontend owner for Peatix's development cycle. Client explicitly cited this as a reason to continue working with MAQE. Happiness score: 7/10 — consistently among the highest of my career.",
    impactTh: "กลายเป็น frontend owner ที่น่าเชื่อถือสำหรับ development cycle ของ Peatix ลูกค้าอ้างสิ่งนี้อย่างชัดเจนว่าเป็นเหตุผลที่จะทำงานกับ MAQE ต่อ ความสุข: 7/10 — สูงที่สุดตลอดอาชีพอย่างต่อเนื่อง",
    capabilityGained: "Long-term Product Ownership & Client Trust",
    capabilityGainedTh: "การเป็นเจ้าของผลิตภัณฑ์ระยะยาวและความไว้วางใจของลูกค้า",
    skills: ["Vue 3", "TypeScript", "Event-driven architecture", "Cross-cultural collaboration"],
    signals: ["product-ownership", "client-trust", "cross-functional"],
    testimonialRef: "edward-lee",
  },

  // ═══════════════════════════════════════
  // CHAPTER 3: THE FRONTIER (2023–2024)
  // ═══════════════════════════════════════

  {
    id: "fedx-guild",
    date: "Aug 2023",
    sortDate: "2023-08-25",
    title: "FEDx Guild — Knowledge Leadership",
    titleTh: "FEDx Guild — ภาวะผู้นำด้านความรู้",
    company: "MAQE",
    type: "milestone",
    chapter: 2023,
    featured: true,
    summary: "Co-founded and led MAQE's Frontend Excellence Guild. Organized sessions, defined standards, and became the go-to knowledge anchor for cross-team frontend practices. 434+ days of sustained leadership.",
    summaryTh: "ร่วมก่อตั้งและนำ Frontend Excellence Guild ของ MAQE จัด sessions กำหนด standards และกลายเป็นต้นแบบความรู้สำหรับ frontend practices ข้ามทีม มากกว่า 434 วันของภาวะผู้นำอย่างต่อเนื่อง",
    impact: "Made the entire team better, not just the codebase. The FEDx sessions became the cultural foundation for how MAQE engineers think about frontend quality. Co-facilitator Praew: 'you glued everyone together and you nail it!'",
    impactTh: "ทำให้ทั้งทีมดีขึ้น ไม่ใช่แค่ codebase sessions ของ FEDx กลายเป็นรากฐานทางวัฒนธรรมสำหรับวิธีคิดของวิศวกร MAQE เรื่อง frontend quality ผู้ร่วมดำเนินการ Praew: 'คุณทำให้ทุกคนเชื่อมกันและทำได้ดีมาก!'",
    capabilityGained: "Knowledge Multiplication & Engineering Culture",
    capabilityGainedTh: "การขยายความรู้และวัฒนธรรมวิศวกรรม",
    skills: ["Technical leadership", "Curriculum design", "Public speaking", "Team facilitation"],
    signals: ["leadership", "knowledge-multiplier", "product-thinking"],
    duration: "434 days",
    testimonialRef: "praew",
  },

  {
    id: "token-gating",
    date: "Late 2023",
    sortDate: "2023-09-01",
    title: "Token Gating — NFT Access Control",
    titleTh: "Token Gating — การควบคุมการเข้าถึงด้วย NFT",
    company: "MAQE",
    type: "project",
    chapter: 2023,
    featured: false,
    summary: "Full-stack NFT-based access control system for digital communities. Validates token ownership across Ethereum mainnet and L2 networks. Learned Web3 in production — under delivery pressure.",
    summaryTh: "ระบบควบคุมการเข้าถึงแบบ NFT full-stack สำหรับชุมชนดิจิทัล ตรวจสอบความเป็นเจ้าของ token บน Ethereum mainnet และ L2 networks เรียนรู้ Web3 ใน production — ภายใต้แรงกดดันการส่งมอบ",
    impact: "Shipped on Ethereum before fully understanding it — and shipped it correctly. Proved the systems-thinking baseline transfers to entirely unfamiliar technical domains.",
    impactTh: "Ship บน Ethereum ก่อนที่จะเข้าใจอย่างถ่องแท้ — และ ship ถูกต้อง พิสูจน์ว่าพื้นฐานการคิดเชิงระบบถ่ายทอดไปยังโดเมนเทคนิคที่ไม่คุ้นเคยอย่างสิ้นเชิงได้",
    capabilityGained: "Blockchain Domain Adaptation",
    capabilityGainedTh: "การปรับตัวสู่โดเมน Blockchain",
    skills: ["Vue 3", "NestJS", "Web3.js", "TypeScript", "Alchemy", "Vitest", "GitHub Actions", "AWS", "Docker"],
    signals: ["fast-learner", "full-stack", "frontier-tech"],
  },

  {
    id: "maqe-website-v5",
    date: "Aug 2023",
    sortDate: "2023-08-15",
    title: "MAQE Website v5 — Full Ownership",
    titleTh: "MAQE Website v5 — ความเป็นเจ้าของเต็มรูปแบบ",
    company: "MAQE",
    type: "project",
    chapter: 2023,
    featured: false,
    summary: "Led the v5 rebuild of MAQE's corporate website. Primary owner end-to-end — architecture, design implementation, performance, and maintenance. 444 days of sustained ownership.",
    summaryTh: "นำการ rebuild MAQE's corporate website v5 เป็นเจ้าของหลัก end-to-end — architecture การ implement design ประสิทธิภาพ และการบำรุงรักษา มากกว่า 444 วันของความเป็นเจ้าของอย่างต่อเนื่อง",
    impact: "First experience owning a production asset completely — not just delivering features but caring about the whole system. Designer collaborator Meow noted: 'Think systematically. This trait of yours is a rare gem.'",
    impactTh: "ประสบการณ์แรกของการเป็นเจ้าของ production asset อย่างสมบูรณ์ — ไม่ใช่แค่ส่งมอบ features แต่ดูแลทั้งระบบ ผู้ร่วมงานด้าน design Meow กล่าว: 'คิดอย่างเป็นระบบ คุณสมบัตินี้หายากมาก'",
    capabilityGained: "End-to-End Product Ownership",
    capabilityGainedTh: "การเป็นเจ้าของผลิตภัณฑ์ End-to-End",
    skills: ["WordPress", "PHP", "jQuery", "SCSS", "ACF", "Docker"],
    signals: ["product-ownership", "reliability"],
    duration: "444 days",
    testimonialRef: "meow",
  },

  {
    id: "toeic-second",
    date: "Nov 2023",
    sortDate: "2023-11-04",
    title: "TOEIC 915 — Improved Score",
    titleTh: "TOEIC 915 — คะแนนที่ดีขึ้น",
    type: "achievement",
    chapter: 2023,
    featured: false,
    summary: "Retook TOEIC and improved from 890 to 915 — top 10% globally. Deliberate investment during an already demanding work period.",
    summaryTh: "สอบ TOEIC ใหม่และปรับปรุงจาก 890 เป็น 915 — top 10% ระดับโลก การลงทุนโดยตั้งใจในช่วงที่ทำงานหนักอยู่แล้ว",
    impact: "Demonstrates commitment to continuous improvement even when workload is high. English proficiency opens every international door.",
    impactTh: "แสดงให้เห็นถึงความมุ่งมั่นในการพัฒนาอย่างต่อเนื่องแม้ภาระงานจะสูง ความสามารถด้านภาษาอังกฤษเปิดประตูระหว่างประเทศทุกบาน",
    capabilityGained: "Global Communication Mastery",
    capabilityGainedTh: "ความเชี่ยวชาญด้านการสื่อสารระดับโลก",
    skills: ["English", "TOEIC 915/990"],
    signals: ["bilingual", "continuous-improvement"],
  },

  {
    id: "online-catalog",
    date: "Apr–Sep 2023",
    sortDate: "2023-04-19",
    title: "B2B Online Catalog Platform",
    titleTh: "แพลตฟอร์มแคตตาล็อก B2B",  
    company: "MAQE",
    type: "project",
    chapter: 2023,
    featured: false,
    summary: "Headless e-commerce frontend replacing manual B2B sales processes with an automated digital catalog. First deep exposure to GraphQL architecture and the Magento commerce ecosystem.",
    summaryTh: "Headless e-commerce frontend ที่แทนที่กระบวนการขาย B2B แบบ manual ด้วยแคตตาล็อกดิจิทัลอัตโนมัติ การสัมผัส GraphQL architecture และ Magento commerce ecosystem ครั้งแรก",
    impact: "Streamlined B2B ordering operations for a medium-sized enterprise. Learned that B2B UX has unique constraints B2C never faces — bulk ordering, approval workflows, contract pricing.",
    impactTh: "ปรับปรุงการสั่งซื้อ B2B สำหรับองค์กรขนาดกลาง เรียนรู้ว่า B2B UX มีข้อจำกัดเฉพาะที่ B2C ไม่เคยเผชิญ",
    capabilityGained: "Commerce Architecture & Business Context",
    capabilityGainedTh: "สถาปัตยกรรม Commerce และ Business Context",
    skills: ["React", "GraphQL", "Apollo Client", "Magento", "TailwindCSS", "PHP"],
    signals: ["full-stack", "product-thinking"],
    duration: "136 days",
  },

  // ═══════════════════════════════════════
  // CHAPTER 4: THE INTELLIGENCE LAYER (2024–2025)
  // ═══════════════════════════════════════

  {
    id: "tangier-dao",
    date: "Mid 2024",
    sortDate: "2024-04-01",
    title: "Tangier — Web3 DAO Giving Circles",
    titleTh: "Tangier — Web3 DAO Giving Circles",
    company: "MAQE",
    type: "project",
    chapter: 2024,
    featured: true,
    summary: "Decentralized governance infrastructure on Ethereum. Communities create DAOs, raise funds, submit proposals, vote, and distribute money — all governed by immutable smart contracts I wrote.",
    summaryTh: "โครงสร้างพื้นฐาน governance แบบกระจายศูนย์บน Ethereum ชุมชนสร้าง DAOs ระดมทุน ส่งข้อเสนอ โหวต และแจกจ่ายเงิน — ทั้งหมดถูกควบคุมโดย smart contracts ที่ผมเขียน",
    impact: "Wrote Solidity, built the frontend, shipped it. Rare production Solidity experience in the Bangkok developer market. Learned that on-chain governance is now being adopted by traditional organizations — not just crypto projects.",
    impactTh: "เขียน Solidity สร้าง frontend และ ship ประสบการณ์ Solidity ระดับ production ที่หายากในตลาดนักพัฒนากรุงเทพฯ เรียนรู้ว่า on-chain governance กำลังถูกนำมาใช้โดยองค์กรดั้งเดิม — ไม่ใช่แค่โปรเจกต์ crypto",
    capabilityGained: "Smart Contract Development & On-Chain Architecture",
    capabilityGainedTh: "การพัฒนา Smart Contract และ On-Chain Architecture",
    skills: ["Vue 3", "Solidity", "Smart Contracts", "TypeScript", "Alchemy", "Web3.js", "NestJS", "Vite"],
    signals: ["frontier-tech", "full-stack", "systems-thinking"],
  },

  {
    id: "ai-event-platform",
    date: "Late 2024",
    sortDate: "2024-09-01",
    title: "AI Event Creation Platform — Production GenAI",
    titleTh: "AI Event Creation Platform — Production GenAI",
    company: "MAQE / Peatix",
    type: "project",
    chapter: 2024,
    featured: true,
    summary: "Integrated generative AI into a live event management platform used by real organizers. AI assists in content creation and event discovery. First production AI feature shipped — the moment my mental model shifted permanently from 'building interfaces' to 'building interfaces that think.'",
    summaryTh: "ผสาน generative AI เข้าสู่ event management platform จริงที่ใช้โดยผู้จัดงานจริง AI ช่วยสร้างเนื้อหาและค้นพบอีเวนต์ AI feature production ตัวแรกที่ ship — ช่วงเวลาที่ mental model ของผมเปลี่ยนอย่างถาวร จาก 'สร้าง interfaces' เป็น 'สร้าง interfaces ที่คิดได้'",
    impact: "Measurably reduced event creation time for organizers. Established patterns for AI integration that the team reused in subsequent projects. Most importantly: proved that the gap between AI demos and AI products is enormous — and I bridged it.",
    impactTh: "ลดเวลาสร้างอีเวนต์ได้อย่างวัดผลได้ สร้างรูปแบบ AI integration ที่ทีมนำกลับมาใช้ใหม่ ที่สำคัญกว่า: พิสูจน์ว่าช่องว่างระหว่าง AI demos และ AI products นั้นใหญ่มาก — และผมเชื่อมช่องว่างนั้นได้",
    capabilityGained: "Production AI Integration",
    capabilityGainedTh: "การ Integrate AI ใน Production",
    skills: ["Vue 3", "OpenAI SDK", "TypeScript", "Vuetify", "Vite", "Pinia", "GA4", "GTM", "AWS"],
    signals: ["production-ai", "product-thinking", "founder-signal"],
    testimonialRef: "edward-lee",
  },

  {
    id: "aws-certified",
    date: "Feb 2025",
    sortDate: "2025-02-09",
    title: "AWS Certified Cloud Practitioner",
    titleTh: "AWS Certified Cloud Practitioner",
    type: "achievement",
    chapter: 2024,
    featured: false,
    summary: "Passed AWS certification at the TeamStack transition — formalizing cloud architecture knowledge built across years of production deployments.",
    summaryTh: "ผ่าน AWS certification ในช่วงการเปลี่ยนผ่านสู่ TeamStack — ทำให้ความรู้ด้าน cloud architecture ที่สั่งสมจาก production deployments หลายปีเป็นทางการ",
    impact: "Now able to make infrastructure decisions independently and participate in architecture discussions at the systems level, not just the API call level.",
    impactTh: "สามารถตัดสินใจด้าน infrastructure ได้อย่างอิสระและเข้าร่วมการหารือเรื่อง architecture ในระดับ systems ไม่ใช่แค่ระดับ API call",
    capabilityGained: "Cloud Architecture Independence",
    capabilityGainedTh: "ความเป็นอิสระด้าน Cloud Architecture",
    skills: ["AWS", "Cloud Architecture", "Security", "Pricing Models"],
    signals: ["continuous-improvement", "systems-thinking"],
  },

  // ═══════════════════════════════════════
  // CHAPTER 5: THE VISION (2025–Present)
  // ═══════════════════════════════════════

  {
    id: "join-teamstack",
    date: "Apr 2025",
    sortDate: "2025-04-01",
    title: "Joined TeamStack — Building From the Ground Up",
    titleTh: "เข้าร่วม TeamStack — สร้างจากศูนย์",
    company: "TeamStack",
    type: "milestone",
    chapter: 2025,
    featured: true,
    summary: "Left MAQE after 3 years of client delivery to join TeamStack — a product-focused environment building tools for high-performance teams. First time working directly on products, not client projects.",
    summaryTh: "ออกจาก MAQE หลังจาก 3 ปีของการส่งมอบให้ลูกค้า เพื่อเข้าร่วม TeamStack — สภาพแวดล้อมที่มุ่งเน้นผลิตภัณฑ์ที่สร้างเครื่องมือสำหรับทีมประสิทธิภาพสูง ครั้งแรกที่ทำงานกับผลิตภัณฑ์โดยตรง ไม่ใช่โปรเจกต์ลูกค้า",
    impact: "Stepped into a role with direct product ownership, founder-proximity, and a 3-year strategic roadmap. The closest thing to building my own product while learning from people who've done it.",
    impactTh: "ก้าวเข้าสู่บทบาทที่มีการเป็นเจ้าของผลิตภัณฑ์โดยตรง ใกล้ชิดกับ founder และมี roadmap เชิงกลยุทธ์ 3 ปี สิ่งที่ใกล้เคียงที่สุดกับการสร้างผลิตภัณฑ์ของตัวเองในขณะที่เรียนรู้จากคนที่ทำมันมาแล้ว",
    capabilityGained: "Product Builder Mindset",
    capabilityGainedTh: "Mindset ของ Product Builder",
    skills: ["Product strategy", "Direct stakeholder collaboration", "0→1 product development"],
    signals: ["product-thinking", "founder-signal", "high-agency"],
    testimonialRef: "andreas",
  },

  {
    id: "the-air-product",
    date: "May 2025",
    sortDate: "2025-05-20",
    title: "The Air Product — AI-First SaaS",
    titleTh: "The Air Product — AI-First SaaS",
    company: "TeamStack",
    type: "project",
    chapter: 2025,
    featured: true,
    summary: "Currently building The Air Product — an AI-first internal tool with a 3-year strategic roadmap. Working directly with the CEO on the vision, the architecture, and the user experience. This is the closest I've been to building a product I'd want to exist in the world.",
    summaryTh: "กำลังสร้าง The Air Product — AI-first internal tool ที่มี roadmap เชิงกลยุทธ์ 3 ปี ทำงานโดยตรงกับ CEO ในเรื่อง vision, architecture และ user experience นี่คือช่วงเวลาที่ผมใกล้ชิดกับการสร้างผลิตภัณฑ์ที่อยากให้มีในโลกมากที่สุด",
    impact: "Active project. CEO Andreas: 'What's impressive is all the things you do behind the day-to-day — from learning new skills to working on Air. Showing up, being dependable, speaking up in meetings.'",
    impactTh: "โปรเจกต์ที่กำลังดำเนินอยู่ CEO Andreas: 'สิ่งที่น่าประทับใจคือทุกอย่างที่คุณทำนอกเหนือจากงานประจำ — จากการเรียนรู้ทักษะใหม่ไปจนถึงการทำงานกับ Air'",
    capabilityGained: "AI Product Architecture & Founder-Proximity Execution",
    capabilityGainedTh: "สถาปัตยกรรม AI Product และการ execute ใกล้ชิด Founder",
    skills: ["AI product design", "LangChain", "RAG", "NestJS", "Vue 3", "TypeScript", "System architecture"],
    signals: ["production-ai", "founder-signal", "product-ownership"],
    testimonialRef: "andreas",
    duration: "Ongoing — 3Y Strategy",
  },

  {
    id: "teamstack-roster",
    date: "Apr 2025",
    sortDate: "2025-04-01",
    title: "TeamStack Roster — Team Management Product",
    titleTh: "TeamStack Roster — ผลิตภัณฑ์จัดการทีม",
    company: "TeamStack",
    type: "project",
    chapter: 2025,
    featured: false,
    summary: "Built and shipped TeamStack Roster — a team management and rostering tool. Reached MVP milestone by Apr 24, 2025. 220 days of end-to-end ownership from architecture to release.",
    summaryTh: "สร้างและ ship TeamStack Roster — เครื่องมือจัดการและจัดตารางทีม ถึง MVP milestone ภายใน 24 เม.ย. 2025 220 วันของการเป็นเจ้าของ end-to-end จาก architecture ถึง release",
    impact: "Shipped a real product to real users. First product I can fully point to as 'mine' from architecture decisions to user-facing features.",
    impactTh: "Ship ผลิตภัณฑ์จริงให้กับผู้ใช้จริง ผลิตภัณฑ์แรกที่ผมสามารถชี้ได้อย่างเต็มที่ว่า 'ของผม' จากการตัดสินใจด้าน architecture ถึง user-facing features",
    capabilityGained: "0→1 Product Delivery",
    capabilityGainedTh: "การส่งมอบผลิตภัณฑ์ 0→1",
    skills: ["Full-stack", "Product management", "Team collaboration", "MVP thinking"],
    signals: ["product-ownership", "founder-signal"],
    duration: "220 days, MVP Apr 24 2025",
  },

  {
    id: "gaia-project",
    date: "2025",
    sortDate: "2025-06-01",
    title: "Gaia Project — Personal Life Operating System",
    titleTh: "Gaia Project — ระบบปฏิบัติการชีวิตส่วนตัว",
    type: "learning",
    chapter: 2025,
    featured: false,
    summary: "Built Gaia — a personal second brain and life operating system in Airtable. Tracks work, learning, values, goals, and reflections. An INTJ engineer's attempt to apply systems thinking to the most complex system of all: one's own life.",
    summaryTh: "สร้าง Gaia — second brain และระบบปฏิบัติการชีวิตส่วนตัวใน Airtable ติดตามงาน การเรียนรู้ ค่านิยม เป้าหมาย และการสะท้อนคิด ความพยายามของวิศวกร INTJ ในการนำการคิดเชิงระบบมาใช้กับระบบที่ซับซ้อนที่สุด: ชีวิตตัวเอง",
    impact: "The Gaia Project is what happens when a systems engineer turns the lens inward. It's also the infrastructure behind the AI-powered portfolio you're reading right now.",
    impactTh: "Gaia Project คือสิ่งที่เกิดขึ้นเมื่อวิศวกรเชิงระบบหันเลนส์เข้าหาตัวเอง มันยังเป็น infrastructure ด้านหลัง AI-powered portfolio ที่คุณกำลังอ่านอยู่นี้ด้วย",
    capabilityGained: "Systems Applied to Self-Mastery",
    capabilityGainedTh: "ระบบที่นำมาใช้กับการเชี่ยวชาญตัวเอง",
    skills: ["Airtable", "Systems design", "Knowledge management", "No-code", "Self-directed learning"],
    signals: ["founder-signal", "systems-thinking", "lifelong-learner"],
  },

];
```

---

## Section 3 — Projects (Revised Order + New Entries)

### Strategic Re-Ranking

Projects now sorted by **strategic signal strength**, not chronology:

```typescript
// src/data/projects.ts (REVISED ORDER + NEW PROJECTS)

export const PROJECTS: Project[] = [

  // ═══ TIER 1: FLAGSHIP PROOF ═══════════════

  {
    slug: "the-air-product",
    title: "The Air Product",
    titleTh: "The Air Product",
    domain: ["ai"],
    featured: true,
    year: 2025,
    status: "active",
    tagline: "AI-first internal tool with a 3-year strategic vision",
    taglineTh: "AI-first internal tool ที่มีวิสัยทัศน์เชิงกลยุทธ์ 3 ปี",
    problemSummary: "Teams lack intelligent, context-aware tooling that adapts to how they actually work.",
    problemSummaryTh: "ทีมขาดเครื่องมือที่อัจฉริยะและรับรู้บริบทซึ่งปรับตัวตามวิธีทำงานจริงๆ",
    signals: ["production-ai", "founder-signal", "product-ownership", "3y-strategy"],
    whatIOwnedEn: "Architecture, frontend, AI workflow integration, direct strategy collaboration with CEO",
    whatIOwnedTh: "Architecture, frontend, AI workflow integration, ร่วมบริหารกลยุทธ์โดยตรงกับ CEO",
    company: "TeamStack",
    heroImage: "/images/projects/the-air-product/hero.webp",
  },

  {
    slug: "ai-event-platform",
    title: "AI Event Creation Platform",
    titleTh: "AI Event Creation Platform",
    domain: ["ai"],
    featured: true,
    year: 2024,
    status: "shipped",
    tagline: "Making event creation intelligent — not just digital",
    taglineTh: "ทำให้การสร้างอีเวนต์มีความฉลาด — ไม่ใช่แค่ดิจิทัล",
    problemSummary: "Event organizers waste time on repetitive AI-replaceable content tasks.",
    problemSummaryTh: "ผู้จัดงานเสียเวลากับงาน content ซ้ำๆ ที่ AI ทำแทนได้",
    signals: ["production-ai", "shipped", "real-users"],
    whatIOwnedEn: "OpenAI SDK integration, AI UX patterns, full frontend, AWS deployment",
    whatIOwnedTh: "OpenAI SDK integration, AI UX patterns, frontend ทั้งหมด, AWS deployment",
    company: "MAQE / Peatix",
    heroImage: "/images/projects/ai-event-platform/hero.webp",
  },

  // ═══ TIER 2: PRODUCT-THINKING PROOF ═══════

  {
    slug: "teamstack-roster",
    title: "TeamStack Roster",
    titleTh: "TeamStack Roster",
    domain: ["frontend", "ai"],
    featured: false,
    year: 2025,
    status: "shipped",
    tagline: "Team management product — shipped from 0 to MVP",
    taglineTh: "ผลิตภัณฑ์จัดการทีม — ship จาก 0 ถึง MVP",
    problemSummary: "High-performance teams need better tooling for roster management and coordination.",
    problemSummaryTh: "ทีมประสิทธิภาพสูงต้องการเครื่องมือที่ดีกว่าสำหรับการจัดการและประสานงาน",
    signals: ["product-ownership", "0-to-1", "team-building"],
    whatIOwnedEn: "Full product — architecture to user experience to deployment",
    whatIOwnedTh: "ผลิตภัณฑ์ทั้งหมด — จาก architecture ถึง user experience ถึง deployment",
    company: "TeamStack",
    heroImage: "/images/projects/teamstack-roster/hero.webp",
  },

  {
    slug: "tangier-dao",
    title: "Tangier — Decentralized Giving Circles",
    titleTh: "Tangier — วงการให้แบบกระจายศูนย์",
    domain: ["web3"],
    featured: true,
    year: 2024,
    status: "shipped",
    tagline: "Trustless community fundraising on Ethereum",
    taglineTh: "การระดมทุนชุมชนแบบ trustless บน Ethereum",
    signals: ["frontier-tech", "full-stack", "solidity"],
    whatIOwnedEn: "Smart contract (Solidity), full frontend, Web3 integration architecture",
    whatIOwnedTh: "Smart contract (Solidity), frontend ทั้งหมด, สถาปัตยกรรม Web3 integration",
    company: "MAQE",
    heroImage: "/images/projects/tangier-dao/hero.webp",
  },

  // ═══ TIER 3: EXECUTION-DEPTH PROOF ════════

  {
    slug: "token-gating",
    title: "Token Gating — NFT Access Control",
    titleTh: "Token Gating — ควบคุมการเข้าถึงด้วย NFT",
    domain: ["web3"],
    featured: false,
    year: 2023,
    status: "shipped",
    tagline: "Your NFT is your ticket — verified on any chain",
    taglineTh: "NFT ของคุณคือตั๋ว — ตรวจสอบได้บน chain ใดก็ได้",
    signals: ["full-stack", "multi-chain", "production-web3"],
    whatIOwnedEn: "Full-stack — Vue 3 frontend, NestJS API, multi-chain Web3 integration",
    whatIOwnedTh: "Full-stack — Vue 3 frontend, NestJS API, multi-chain Web3 integration",
    company: "MAQE",
    heroImage: "/images/projects/token-gating/hero.webp",
  },

  // ═══ TIER 4: RANGE PROOF ══════════════════

  {
    slug: "ap-thai",
    title: "AP Thai — Property Discovery Platform",
    titleTh: "AP Thai — แพลตฟอร์มค้นหาอสังหาริมทรัพย์",
    domain: ["ecommerce"],
    featured: false,
    year: 2022,
    status: "shipped",
    tagline: "Modernizing homebuying for Thailand's largest developer",
    taglineTh: "ปรับปรุงประสบการณ์ซื้อบ้านสำหรับผู้พัฒนาอสังหาฯ รายใหญ่สุดของไทย",
    signals: ["scale", "analytics", "b2c"],
    whatIOwnedEn: "Full NuxtJS frontend, GA4 analytics pipeline, Cypress E2E test suite",
    whatIOwnedTh: "Frontend NuxtJS ทั้งหมด, GA4 analytics pipeline, Cypress E2E test suite",
    company: "MAQE / AP Thailand",
    heroImage: "/images/projects/ap-thai/hero.webp",
  },

  {
    slug: "b2b-catalog",
    title: "B2B Online Catalog Platform",
    titleTh: "แพลตฟอร์มแคตตาล็อก B2B",
    domain: ["ecommerce"],
    featured: false,
    year: 2023,
    status: "shipped",
    tagline: "Replacing manual B2B sales with headless commerce",
    taglineTh: "แทนที่การขาย B2B แบบ manual ด้วย headless commerce",
    signals: ["headless-commerce", "graphql", "b2b"],
    whatIOwnedEn: "React/GraphQL/Apollo frontend, Magento integration architecture",
    whatIOwnedTh: "React/GraphQL/Apollo frontend, สถาปัตยกรรม Magento integration",
    company: "MAQE",
    heroImage: "/images/projects/b2b-catalog/hero.webp",
  },
];
```

### Project Card "What I Owned" Pattern

This is the most important structural addition. Each card exposes **ownership**, not just tech stack:

```
┌─────────────────────────────────────────────────────┐
│  [Signal chips: Production AI | Shipped | 2024]     │
│                                                     │
│  AI Event Creation Platform                         │
│  Making event creation intelligent                  │
│                                                     │
│  PROBLEM                                            │
│  Event organizers waste time on repetitive          │
│  AI-replaceable content tasks                       │
│                                                     │
│  WHAT I OWNED                                       │
│  OpenAI SDK integration · AI UX patterns            │
│  Full frontend · AWS deployment                     │
│                                                     │
│  [Vue 3] [OpenAI SDK] [TypeScript] [+4]            │
│                                                     │
│  [See Full Case Study →]                           │
└─────────────────────────────────────────────────────┘
```

---

## Section 4 — Signal System

A site-wide taxonomy of semantic markers that create **cognitive reinforcement** across sections:

```typescript
// src/data/signals.ts

export const SIGNALS = {
  "production-ai": {
    label: "Production AI",
    labelTh: "AI ใน Production",
    color: "indigo",
    icon: "Sparkles",
    description: "AI feature shipped to real users, not a demo",
  },
  "product-ownership": {
    label: "Product Ownership",
    labelTh: "ความเป็นเจ้าของผลิตภัณฑ์",
    color: "emerald",
    icon: "Target",
    description: "Owned the full product lifecycle",
  },
  "founder-signal": {
    label: "Founder Trajectory",
    labelTh: "แนวทาง Founder",
    color: "amber",
    icon: "Rocket",
    description: "Demonstrates entrepreneurial ownership thinking",
  },
  "systems-thinking": {
    label: "Systems Thinking",
    labelTh: "การคิดเชิงระบบ",
    color: "cyan",
    icon: "GitBranch",
    description: "Approached problem as a system, not a feature",
  },
  "knowledge-multiplier": {
    label: "Knowledge Multiplier",
    labelTh: "ผู้ขยายความรู้",
    color: "violet",
    icon: "Users",
    description: "Made the team better through knowledge sharing",
  },
  "fast-learner": {
    label: "Fast Domain Shift",
    labelTh: "เรียนรู้โดเมนใหม่เร็ว",
    color: "rose",
    icon: "Zap",
    description: "Mastered new technical domain under production conditions",
  },
  "cross-functional": {
    label: "Cross-Functional",
    labelTh: "ข้ามสายงาน",
    color: "sky",
    icon: "Layers",
    description: "Collaborated across design, backend, product, and client",
  },
  "full-stack": {
    label: "Full Stack Delivery",
    labelTh: "ส่งมอบ Full Stack",
    color: "teal",
    icon: "Code2",
    description: "Owned frontend through infrastructure",
  },
} as const;
```

---

## Section 5 — Real Testimonials (Verbatim)

These are the **actual quotes** from the testimonials PDF, attributed correctly:

```typescript
// src/data/testimonials.ts (REAL QUOTES)

export const testimonials: Testimonial[] = [

  {
    id: "edward-lee",
    // The strongest testimonial — a client praising ownership
    quote: "First is responsible for all of the frontend development work. During practically every sprint, First has demonstrated all of these things — providing guidance, removing obstacles, collaborating effectively, sharing knowledge, and contributing to the success of the team and project. I believe First has done a tremendous job of taking ownership and responsibility and we trust his knowledge and expertise. First is a great asset to our project and also a primary reason why I want to keep working with MAQE.",
    quoteTh: "เฟิร์สรับผิดชอบงาน frontend development ทั้งหมด ในแทบทุก sprint เฟิร์สได้แสดงให้เห็นทุกสิ่งเหล่านี้ — การให้คำแนะนำ การขจัดอุปสรรค การร่วมมือที่มีประสิทธิภาพ การแบ่งปันความรู้ และการมีส่วนร่วมต่อความสำเร็จของทีมและโปรเจกต์ ผมเชื่อว่าเฟิร์สทำงานได้ยอดเยี่ยมในการรับผิดชอบ และเราไว้วางใจในความรู้และความเชี่ยวชาญของเขา เฟิร์สเป็นทรัพยากรที่ดีมากสำหรับโปรเจกต์ของเรา และยังเป็นเหตุผลหลักที่ผมอยากทำงานกับ MAQE ต่อ",
    // Pull the sharpest line for preview
    sharpestLineEn: "A primary reason why I want to keep working with MAQE.",
    sharpestLineTh: "เหตุผลหลักที่ผมอยากทำงานกับ MAQE ต่อ",
    authorName: "Edward Lee",
    authorRole: "Client",
    relationship: "Direct client · Peatix Series · 2+ years",
    relationshipTh: "ลูกค้าโดยตรง · Peatix Series · 2+ ปี",
    validates: ["product-ownership", "client-trust", "cross-functional"],
    avatar: "/images/testimonials/edward-lee.webp",
  },

  {
    id: "andreas-ceo",
    // CEO at TeamStack — founder proximity signal
    quote: "You and Bank are handling PTX well, as always. What's impressive is all the things you do behind the day-to-day — from learning new skills to working on Air. Showing up, being dependable, speaking up in meetings. The list goes on. An honorable mention: being patient with me as I am wrapping my head around the first Air pitch.",
    quoteTh: "คุณและ Bank จัดการ PTX ได้ดีเสมอ สิ่งที่น่าประทับใจคือทุกอย่างที่คุณทำนอกเหนือจากงานประจำ — จากการเรียนรู้ทักษะใหม่ไปจนถึงการทำงานกับ Air การแสดงตัวตน การเชื่อถือได้ การพูดในการประชุม รายการยังมีอีก อีกสิ่งที่น่ายกย่อง: การอดทนกับผมในขณะที่ผมกำลังทำความเข้าใจกับ Air pitch ครั้งแรก",
    sharpestLineEn: "What's impressive is all the things you do behind the day-to-day.",
    sharpestLineTh: "สิ่งที่น่าประทับใจคือทุกอย่างที่คุณทำนอกเหนือจากงานประจำ",
    authorName: "Andreas",
    authorRole: "CEO & Co-founder",
    company: "TeamStack",
    relationship: "Direct manager / CEO · 1+ year",
    relationshipTh: "ผู้จัดการโดยตรง / CEO · 1+ ปี",
    validates: ["founder-signal", "reliability", "product-ownership"],
    avatar: "/images/testimonials/andreas.webp",
  },

  {
    id: "meow-designops",
    // Designer/manager — systems thinking cross-validation
    quote: "Reliable & Responsible. It's admirable that you usually share your working progress and thoughts behind those solutions every week. Think systematically. This trait of yours is a rare gem to encounter. It applies to your working process, problem-solving approach, and how to work better as a team. You take one step further to solve the problem in the long run. Open-minded/Compromisable. When we discussed technical feasibility, you shared opinions and built on top of each other's ideas to find better ways to reach the same goal.",
    quoteTh: "น่าเชื่อถือและรับผิดชอบ น่ายกย่องที่คุณมักแบ่งปันความคืบหน้าและความคิดเบื้องหลังวิธีแก้ปัญหาทุกสัปดาห์ คิดอย่างเป็นระบบ คุณสมบัตินี้ของคุณหายากมาก มันใช้กับกระบวนการทำงาน แนวทางการแก้ปัญหา และวิธีการทำงานเป็นทีม คุณก้าวไปอีกขั้นเพื่อแก้ปัญหาในระยะยาว เปิดใจ/ยืดหยุ่น เมื่อเราหารือเรื่องความเป็นไปได้ทางเทคนิค คุณแบ่งปันความคิดเห็นและสร้างต่อยอดจากแนวคิดของกันและกัน",
    sharpestLineEn: "Think systematically. This trait of yours is a rare gem to encounter.",
    sharpestLineTh: "คิดอย่างเป็นระบบ คุณสมบัตินี้ของคุณหายากมาก",
    authorName: "Meow",
    authorRole: "Manager, DesignOps & Innovation",
    company: "MAQE",
    relationship: "Direct manager · MAQE Website v5",
    relationshipTh: "ผู้จัดการโดยตรง · MAQE Website v5",
    validates: ["systems-thinking", "reliability", "cross-functional"],
    avatar: "/images/testimonials/meow.webp",
  },

  {
    id: "praew-designer",
    // Peer — team glue and positive energy
    quote: "Thanachon (First) works effectively in a team and encourages teamwork and collaboration across teams. Thank you for last time we organized FeDX Solomon session — you glued everyone together and you nail it! I am glad you're here. You're on my top rank of trust. I know things will be just fine if I am collaborating with you. I love the way you mentioned in Slack that you will be positive energy anywhere you go. I really believe that WILL always happen.",
    quoteTh: "ธนชน (เฟิร์ส) ทำงานในทีมอย่างมีประสิทธิภาพและส่งเสริมการทำงานเป็นทีมและความร่วมมือข้ามทีม ขอบคุณสำหรับ FeDX Solomon session ครั้งที่แล้ว คุณทำให้ทุกคนเชื่อมกันและทำได้ดีมาก! ดีใจที่คุณอยู่ที่นี่ คุณอยู่ใน top rank แห่งความไว้วางใจของฉัน รู้ว่าทุกอย่างจะโอเคถ้าร่วมงานกับคุณ",
    sharpestLineEn: "You're on my top rank of trust. Things will be just fine if I'm collaborating with you.",
    sharpestLineTh: "คุณอยู่ใน top rank แห่งความไว้วางใจของฉัน",
    authorName: "Praew",
    authorRole: "UX/UI Designer",
    company: "MAQE",
    relationship: "Colleague · FEDx Guild co-organizer",
    relationshipTh: "เพื่อนร่วมงาน · ผู้จัดร่วม FEDx Guild",
    validates: ["knowledge-multiplier", "cross-functional", "leadership"],
    avatar: "/images/testimonials/praew.webp",
  },

  {
    id: "bank-backend",
    // Colleague — knowledge sharing and filling gaps
    quote: "First always helps fill in the gaps I miss. Since he focuses on frontend and I work on backend, he often reminds me of things from the frontend side and explains what's going on. He makes sure the team always shares the same understanding. After important or complex meetings, First usually starts a small huddle to re-capture so everyone can catch up. He has a lot of positive energy and always learns new things, and he often shares what he learns with everyone.",
    quoteTh: "เฟิร์สช่วยเติมเต็มช่องว่างที่ผมพลาดอยู่เสมอ เนื่องจากเขาทำ frontend และผมทำ backend เขามักเตือนผมในสิ่งที่เกี่ยวกับ frontend และอธิบายสิ่งที่เกิดขึ้น เขาทำให้แน่ใจว่าทีมมีความเข้าใจร่วมกัน หลังการประชุมที่สำคัญหรือซับซ้อน เฟิร์สมักเริ่ม huddle เล็กน้อยเพื่อสรุปให้ทุกคนตามทัน เขามีพลังงานบวกมากและเรียนรู้สิ่งใหม่อยู่เสมอ และมักแบ่งปันสิ่งที่เรียนรู้กับทุกคน",
    sharpestLineEn: "He makes sure the team always shares the same understanding.",
    sharpestLineTh: "เขาทำให้แน่ใจว่าทีมมีความเข้าใจร่วมกันเสมอ",
    authorName: "Bank",
    authorRole: "Backend Engineer",
    company: "MAQE / TeamStack",
    relationship: "Colleague · 3+ years",
    relationshipTh: "เพื่อนร่วมงาน · 3+ ปี",
    validates: ["knowledge-multiplier", "cross-functional", "team-glue"],
    avatar: "/images/testimonials/bank.webp",
  },

  {
    id: "chok-senior-fe",
    // Senior peer — initiative and helping others grow
    quote: "He always raises his hand to contribute to extra work that benefits the company such as MAQE website, standard and lint for developers, and also contributes to the guild. Even though he does a lot of things he can keep good performance on his main project. Another thing — he always liked to help people near him improve their soft skills like English, financial tracking. I also benefited from this as well — my English skills improved after I practiced with him.",
    quoteTh: "เขายกมือเสมอเพื่อมีส่วนร่วมกับงานพิเศษที่เป็นประโยชน์ต่อบริษัท เช่น MAQE website, standard และ lint สำหรับนักพัฒนา และยังมีส่วนร่วมกับ guild แม้ว่าจะทำหลายอย่างแต่ยังรักษาผลงานที่ดีในโปรเจกต์หลัก อีกอย่างหนึ่ง เขาชอบช่วยคนรอบข้างพัฒนา soft skills เช่น ภาษาอังกฤษ การติดตามการเงิน ผมก็ได้ประโยชน์ด้วย ทักษะภาษาอังกฤษของผมดีขึ้นหลังจากฝึกกับเขา",
    sharpestLineEn: "He always raises his hand to contribute to work that benefits the company.",
    sharpestLineTh: "เขายกมือเสมอเพื่อมีส่วนร่วมกับงานที่เป็นประโยชน์ต่อบริษัท",
    authorName: "Chok",
    authorRole: "Senior Frontend Engineer",
    company: "MAQE",
    relationship: "Senior colleague · 2+ years",
    relationshipTh: "เพื่อนร่วมงานอาวุโส · 2+ ปี",
    validates: ["initiative", "knowledge-multiplier", "reliability"],
    avatar: "/images/testimonials/chok.webp",
  },

];
```

---

## Section 6 — Skills (Capability Model Reframe)

Replace percentage bars with **narrative capability clusters** backed by real evidence:

```typescript
// src/data/skills.ts (REVISED — capability model)

export const skillClusters: SkillCluster[] = [
  {
    id: "ai-systems",
    name: "AI & Intelligent Systems",
    nameTh: "AI และระบบอัจฉริยะ",
    narrative: "Where I'm doubling down. Shipped production OpenAI integration. Now architecting deeper: LangChain pipelines, RAG systems, agentic workflows.",
    narrativeTh: "จุดที่ผมกำลังเพิ่มความพยายามสองเท่า Ship OpenAI integration ใน production แล้ว ตอนนี้กำลังออกแบบที่ลึกขึ้น: LangChain pipelines, RAG systems, agentic workflows",
    status: "current-focus",   // shows "🎯 Current Focus" badge
    statusTh: "โฟกัสปัจจุบัน",
    order: 1,
    emphasized: true,
    evidenceRef: ["the-air-product", "ai-event-platform"],
    skills: [
      { name: "OpenAI SDK", level: 90, tag: "Shipped in production" },
      { name: "LangChain", level: 72, tag: "Active learning" },
      { name: "RAG / Vector DB", level: 68, tag: "Building now" },
      { name: "AI SDK (Vercel)", level: 75, tag: "Applied" },
      { name: "Prompt Engineering", level: 85, tag: "Production-tested" },
      { name: "Python", level: 62, tag: "Applied" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend Engineering",
    nameTh: "Frontend Engineering",
    narrative: "My craft foundation. 4 years of production React, Vue, and TypeScript across enterprise-scale applications from Bangkok to Japan.",
    narrativeTh: "รากฐานฝีมือของผม 4 ปีกับ production React, Vue และ TypeScript ในแอปพลิเคชันระดับ enterprise จากกรุงเทพฯ ถึงญี่ปุ่น",
    status: "core-strength",
    statusTh: "จุดแข็งหลัก",
    order: 2,
    emphasized: false,
    evidenceRef: ["ap-thai", "maqe-website", "b2b-catalog"],
    skills: [
      { name: "React / Next.js", level: 95, tag: "Core strength" },
      { name: "Vue 3 / Nuxt", level: 93, tag: "Core strength" },
      { name: "TypeScript", level: 92, tag: "Core strength" },
      { name: "TailwindCSS", level: 93, tag: "Core strength" },
      { name: "Framer Motion", level: 80, tag: "Applied" },
      { name: "Vitest / Jest", level: 78, tag: "Applied" },
    ],
  },
  {
    id: "backend-infra",
    name: "Backend & Infrastructure",
    nameTh: "Backend & Infrastructure",
    narrative: "Full-stack fluency. From NestJS APIs to AWS deployment — I own the entire delivery chain without needing handoffs.",
    narrativeTh: "ความคล่องตัว full-stack จาก NestJS APIs ถึง AWS deployment — ผมเป็นเจ้าของ delivery chain ทั้งหมดโดยไม่ต้องรอ handoffs",
    status: "strong-working",
    statusTh: "ทำงานได้แข็งแกร่ง",
    order: 3,
    emphasized: false,
    evidenceRef: ["token-gating", "tangier-dao", "teamstack-roster"],
    skills: [
      { name: "Node.js / NestJS", level: 80, tag: "Production" },
      { name: "GraphQL / Apollo", level: 78, tag: "Production" },
      { name: "Docker", level: 78, tag: "Production" },
      { name: "AWS", level: 75, tag: "Certified" },
      { name: "Supabase / Firebase", level: 82, tag: "Production" },
      { name: "PostgreSQL", level: 70, tag: "Applied" },
    ],
  },
  {
    id: "web3",
    name: "Web3 & Blockchain",
    nameTh: "Web3 และ Blockchain",
    narrative: "Rare production Solidity experience in the Bangkok developer market. Shipped on Ethereum mainnet. Understands DAO governance, token standards, and the UX challenges of on-chain interactions.",
    narrativeTh: "ประสบการณ์ Solidity ระดับ production ที่หายากในตลาดนักพัฒนากรุงเทพฯ Ship บน Ethereum mainnet เข้าใจ DAO governance, token standards และ UX challenges ของ on-chain interactions",
    status: "frontier-experience",
    statusTh: "ประสบการณ์แนวหน้า",
    order: 4,
    emphasized: false,
    evidenceRef: ["tangier-dao", "token-gating"],
    skills: [
      { name: "Solidity", level: 65, tag: "Production shipped" },
      { name: "Web3.js", level: 78, tag: "Production" },
      { name: "Alchemy", level: 75, tag: "Production" },
      { name: "Smart Contracts", level: 68, tag: "Shipped on mainnet" },
      { name: "NFT Standards", level: 72, tag: "Applied" },
    ],
  },
];
```

---

## Section 7 — Value Propositions (Revised as Decision Framework)

```typescript
// src/data/valuePropositions.ts (REVISED — decision framework)

export const valuePropositions: ValueProposition[] = [
  {
    id: "production-ai",
    icon: "Sparkles",
    titleEn: "Ships Production AI",
    titleTh: "Ship Production AI ได้จริง",
    descriptionEn: "Integrated OpenAI SDK into a live event platform used by real organizers — not a demo, not a side project. I know the difference between AI that works in a notebook and AI that survives production.",
    descriptionTh: "Integrate OpenAI SDK เข้าสู่ event platform จริงที่ใช้โดยผู้จัดงานจริง — ไม่ใช่ demo ไม่ใช่ side project ผมรู้ความแตกต่างระหว่าง AI ที่ทำงานใน notebook และ AI ที่รอดใน production",
    proofEn: "AI Event Platform + The Air Product at TeamStack",
    proofTh: "AI Event Platform + The Air Product ที่ TeamStack",
    crossRef: "project:ai-event-platform",
    signalTag: "production-ai",
  },
  {
    id: "product-thinking",
    icon: "Target",
    titleEn: "Thinks Product, Not Tickets",
    titleTh: "คิดเรื่อง Product ไม่ใช่แค่ Ticket",
    descriptionEn: "I host guild sessions, write internal docs, and built a personal second brain to manage my own learning system. Engineers who think about product impact ship features that actually matter to the business.",
    descriptionTh: "ผมจัด guild sessions เขียน internal docs และสร้าง second brain ส่วนตัวเพื่อจัดการระบบการเรียนรู้ของตัวเอง วิศวกรที่คิดถึง product impact จะ ship features ที่มีความหมายต่อธุรกิจจริงๆ",
    proofEn: "FEDx Guild (434 days) + MAQE Website v5 ownership",
    proofTh: "FEDx Guild (434 วัน) + MAQE Website v5 ownership",
    crossRef: "timeline:fedx-guild",
    signalTag: "product-thinking",
    clientValidation: "edward-lee",
  },
  {
    id: "full-stack-delivery",
    icon: "Layers",
    titleEn: "Owns the Full Delivery Chain",
    titleTh: "เป็นเจ้าของ Delivery Chain ทั้งหมด",
    descriptionEn: "From Figma handoff to AWS deployment. No waiting for specialists, no throwing over the fence. From MEP blueprints to Solidity contracts — I've always operated across the full system.",
    descriptionTh: "จาก Figma handoff ถึง AWS deployment ไม่ต้องรอ specialists ไม่โยนข้ามรั้ว จาก MEP blueprints ถึง Solidity contracts — ผมดำเนินงานข้ามระบบทั้งหมดเสมอ",
    proofEn: "7 years across MEP → Frontend → Full-stack → AI",
    proofTh: "7 ปีข้าม MEP → Frontend → Full-stack → AI",
    crossRef: "section:skills",
    signalTag: "full-stack",
  },
  {
    id: "fast-domain-mastery",
    icon: "Zap",
    titleEn: "Masters New Domains Under Pressure",
    titleTh: "เชี่ยวชาญโดเมนใหม่ภายใต้แรงกดดัน",
    descriptionEn: "MEP Engineer → self-taught dev → Web3 → AI. Every domain switch delivered production software. I don't spend months studying before contributing — I learn by shipping.",
    descriptionTh: "วิศวกร MEP → นักพัฒนาที่สอนตัวเอง → Web3 → AI การเปลี่ยนโดเมนทุกครั้งส่งมอบซอฟต์แวร์ production ผมไม่ใช้เดือนๆ ในการศึกษาก่อนมีส่วนร่วม — ผมเรียนรู้โดยการ ship",
    proofEn: "Solidity, Web3.js, OpenAI SDK — all shipped in production",
    proofTh: "Solidity, Web3.js, OpenAI SDK — ทุกอย่าง ship ใน production",
    crossRef: "section:timeline",
    signalTag: "fast-learner",
    clientValidation: "meow",
  },
  {
    id: "founder-trajectory",
    icon: "Rocket",
    titleEn: "Thinks Like an Owner — Because I'm Becoming One",
    titleTh: "คิดแบบเจ้าของ — เพราะผมกำลังจะเป็น",
    descriptionEn: "Every project, certification, and skill has been deliberate preparation. The Gaia Project is my personal life OS. The Air Product is my first product built with founder proximity. SaaS in Southeast Asia is the destination.",
    descriptionTh: "ทุก project ใบรับรอง และทักษะเป็นการเตรียมตัวโดยตั้งใจ Gaia Project คือ life OS ส่วนตัว The Air Product คือผลิตภัณฑ์แรกที่สร้างใกล้ชิด founder SaaS ใน Southeast Asia คือจุดหมาย",
    proofEn: "TeamStack → The Air Product → 3-Year SaaS Strategy",
    proofTh: "TeamStack → The Air Product → กลยุทธ์ SaaS 3 ปี",
    crossRef: null,
    signalTag: "founder-signal",
    clientValidation: "andreas-ceo",
  },
];
```

---

## Section 8 — About Page (Revised with Full Arc)

```typescript
// Content for src/app/[locale]/about/page.tsx

const aboutContent = {
  en: {
    headline: "From Blueprint to Bytecode to Intelligence",
    subheadline: "A systems engineer who found his real medium.",

    act1: {
      title: "Act I: The Engineer (2018–2021)",
      content: `I spent the first chapter of my career designing mechanical, electrical, and plumbing systems for commercial buildings at Toparch in Bangkok. MEP engineering is not glamorous work. It is constraint management at scale — budget limits, physics, building codes, and the needs of thousands of people who will live inside the systems you design but never see.

That is where I learned what good engineering actually is: solutions that survive contact with reality.

I was competent. I was stable. I was also quietly writing my first lines of JavaScript on evenings and weekends, and realizing that software was the same discipline in a different, more malleable medium.`
    },

    act2: {
      title: "Act II: The Bet (2021–2022)",
      content: `In April 2021, I resigned.

No job lined up. No bootcamp enrolled. Just a year of savings, a conviction, and the systems-thinking discipline I'd built in engineering.

I taught myself JavaScript, TypeScript, React, and the fundamentals of modern software architecture. I scored 890 on my first TOEIC attempt — clearing the language barrier that stops most Thai engineers from accessing global opportunities. Twelve months later, I had a portfolio and walked into MAQE.

The bet worked.`
    },

    act3: {
      title: "Act III: The Craft (2022–2025)",
      content: `Three years at MAQE Bangkok, one of Thailand's premier digital agencies. I shipped software that real people use — a homebuying platform for AP Thailand's thousands of customers, a decentralized governance tool for Web3 communities, an AI-powered event platform that made creation intelligent.

I also learned something more important than any technology: that the engineers who compound their value are the ones who make their teams better, not just their codebases. I co-founded the FEDx Frontend Guild, hosted knowledge sessions, mentored peers, and became the kind of engineer that clients specifically ask to keep working with.

Edward Lee, a client who worked with me for 2+ years, said it directly: 'First is a primary reason why I want to keep working with MAQE.'`
    },

    act4: {
      title: "Act IV: The Vision (2025–Present)",
      content: `I joined TeamStack in 2025 — a product-focused environment where I could work directly on building products, not just delivering client projects. I'm currently building The Air Product: an AI-first internal tool with a 3-year strategic roadmap, working directly with the CEO on vision and architecture.

This is the closest I've been to the work I ultimately want to do: building a product that genuinely solves a problem, with a team that cares about the outcome, in a market that needs it.

The decade-long goal is a SaaS product in Southeast Asia. Every project, every certification, every deliberate technology choice has been preparation. The Gaia Project — my personal second brain and life operating system — is what happens when a systems engineer turns the lens inward.

You are reading the portfolio of someone who is not just looking for a job. I am looking for the next chapter in a deliberate story.`
    },

    personality: {
      title: "The INTJ Behind the Work",
      content: `MBTI: INTJ — The Architect. I design systems before I build them, and I prefer a precise vision over broad ambiguity. I am direct, I work independently, and I have a deep aversion to work that does not compound toward something.

I believe in three things professionally: relentless progress, autonomy with integrity, and leverage through knowledge — meaning I invest in learning that makes me and everyone around me more capable, not just checking boxes.

Outside the terminal: I track everything (Gaia Project), think in systems, and am building in public documentation habits that would eventually make a founder easy to understand.`
    },
  },

  th: {
    headline: "จาก Blueprint สู่ Bytecode สู่ Intelligence",
    subheadline: "วิศวกรเชิงระบบที่ค้นพบสื่อที่เหมาะสมที่สุด",

    act1: {
      title: "บทที่ 1: วิศวกร (2018–2021)",
      content: `บทแรกของอาชีพผมใช้ไปกับการออกแบบระบบ MEP สำหรับอาคารพาณิชย์ที่ Toparch ในกรุงเทพฯ วิศวกรรม MEP ไม่ใช่งานที่หรูหรา มันคือการจัดการข้อจำกัดในระดับ scale — งบประมาณ ฟิสิกส์ กฎอาคาร และความต้องการของผู้คนนับพันที่จะอาศัยอยู่ในระบบที่คุณออกแบบแต่ไม่เคยเห็น

นั่นคือที่ที่ผมเรียนรู้ว่าวิศวกรรมที่ดีคืออะไรจริงๆ: วิธีแก้ปัญหาที่รอดได้เมื่อเจอความเป็นจริง

ผมมีความสามารถ มั่นคง และในขณะเดียวกันก็เขียน JavaScript บรรทัดแรกในช่วงเย็นและวันหยุด และตระหนักว่าซอฟต์แวร์เป็นวินัยเดียวกันในสื่อที่ต่างออกไปและยืดหยุ่นกว่า`
    },

    act2: {
      title: "บทที่ 2: การพนัน (2021–2022)",
      content: `ในเดือนเมษายน 2021 ผมลาออก

ไม่มีงานรอ ไม่ได้เข้าบูทแคมป์ มีแค่เงินออมหนึ่งปี ความเชื่อมั่น และวินัยการคิดเชิงระบบที่สร้างมาจากวิศวกรรม

ผมสอนตัวเองด้าน JavaScript, TypeScript, React และพื้นฐานสถาปัตยกรรมซอฟต์แวร์สมัยใหม่ ได้ 890 ใน TOEIC ครั้งแรก สิบสองเดือนต่อมา ผมมี portfolio และเดินเข้า MAQE

การพนันได้ผล`
    },

    act3: {
      title: "บทที่ 3: การฝึกฝนฝีมือ (2022–2025)",
      content: `สามปีที่ MAQE Bangkok หนึ่งใน digital agency ชั้นนำของไทย ผม ship ซอฟต์แวร์ที่คนจริงใช้ — แพลตฟอร์มซื้อบ้านให้กับลูกค้า AP Thailand นับพัน เครื่องมือ governance แบบกระจายศูนย์สำหรับชุมชน Web3 AI event platform ที่ทำให้การสร้างมีความฉลาด

ผมยังเรียนรู้สิ่งที่สำคัญกว่าเทคโนโลยีใดๆ: วิศวกรที่สร้างคุณค่าแบบทบต้นคือคนที่ทำให้ทีมดีขึ้น ไม่ใช่แค่ codebase ผมร่วมก่อตั้ง FEDx Frontend Guild โฮสต์ knowledge sessions พี่เลี้ยงเพื่อนร่วมงาน และกลายเป็นวิศวกรที่ลูกค้าขอโดยเฉพาะ`
    },

    act4: {
      title: "บทที่ 4: วิสัยทัศน์ (2025–ปัจจุบัน)",
      content: `ผมเข้าร่วม TeamStack ในปี 2025 — สภาพแวดล้อมที่เน้นผลิตภัณฑ์ซึ่งผมสามารถทำงานกับผลิตภัณฑ์โดยตรง ไม่ใช่แค่ส่งมอบโปรเจกต์ลูกค้า ตอนนี้กำลังสร้าง The Air Product: AI-first internal tool ที่มี roadmap เชิงกลยุทธ์ 3 ปี ทำงานโดยตรงกับ CEO ในเรื่อง vision และ architecture

นี่คือช่วงเวลาที่ผมใกล้ชิดกับงานที่อยากทำสุดท้ายมากที่สุด: สร้างผลิตภัณฑ์ที่แก้ปัญหาจริงๆ กับทีมที่ใส่ใจผลลัพธ์ ในตลาดที่ต้องการมัน

เป้าหมายสิบปีคือ SaaS product ใน Southeast Asia ทุก project ใบรับรอง และการเลือกเทคโนโลยีทุกอย่างโดยตั้งใจคือการเตรียมตัว Gaia Project — second brain และระบบปฏิบัติการชีวิตส่วนตัว — คือสิ่งที่เกิดขึ้นเมื่อวิศวกรเชิงระบบหันเลนส์เข้าหาตัวเอง

คุณกำลังอ่าน portfolio ของคนที่ไม่ได้แค่มองหางาน ผมกำลังมองหาบทถัดไปในเรื่องราวที่ตั้งใจสร้าง`
    },
  }
};
```

---

## Section 9 — Contact (Intent-Aware Copy)

```typescript
// src/data/contactIntents.ts (REVISED with tailored previews)

export const contactIntents: ContactIntent[] = [
  {
    key: "hire-ai",
    icon: "Sparkles",
    labelEn: "Hire as AI Engineer",
    labelTh: "จ้างเป็น AI Engineer",
    headingEn: "Let's talk AI engineering",
    headingTh: "คุยเรื่อง AI Engineering",
    previewEn: "Tell me about the AI product you're building. What's the problem it solves, what's the technical context, and what gap you're trying to fill. I'll reply with genuine thoughts on fit.",
    previewTh: "เล่าเรื่อง AI product ที่คุณกำลังสร้าง ปัญหาที่แก้ บริบทเทคนิค และช่องว่างที่คุณพยายามเติม ผมจะตอบกลับด้วยความคิดจริงๆ เกี่ยวกับความเหมาะสม",
    placeholderEn: "E.g. We're building a RAG-based internal knowledge tool and need someone who can own the AI integration layer and frontend...",
    placeholderTh: "เช่น เรากำลังสร้างเครื่องมือ knowledge ภายในแบบ RAG และต้องการคนที่รับผิดชอบ AI integration layer และ frontend...",
  },
  {
    key: "hire-po",
    icon: "Target",
    labelEn: "Hire as Product Owner",
    labelTh: "จ้างเป็น Product Owner",
    headingEn: "Let's talk product ownership",
    headingTh: "คุยเรื่อง Product Ownership",
    previewEn: "Tell me about your product and team. What decisions need to be owned, what's the technical complexity, and what success looks like at 6 months. Engineers who think in products are rare — I'm one.",
    previewTh: "เล่าเรื่อง product และทีมของคุณ การตัดสินใจอะไรที่ต้องการเจ้าของ ความซับซ้อนทางเทคนิคเป็นอย่างไร และความสำเร็จในรอบ 6 เดือนหน้าตาอย่างไร วิศวกรที่คิดแบบ product หายาก ผมเป็นคนนั้น",
    placeholderEn: "E.g. We're a Series A startup with a technical product and need a PO who can translate between engineering and business...",
    placeholderTh: "เช่น เราเป็น startup Series A ที่มีผลิตภัณฑ์ทางเทคนิคและต้องการ PO ที่เชื่อมวิศวกรรมกับธุรกิจได้...",
  },
  {
    key: "collaborate",
    icon: "Handshake",
    labelEn: "Co-build Something",
    labelTh: "ร่วมสร้างบางอย่าง",
    headingEn: "Let's build together",
    headingTh: "สร้างด้วยกัน",
    previewEn: "Have an idea for a SaaS product — especially targeting Southeast Asia? Tell me the problem, the market, and why now. I'm actively looking for the right co-founder conversation.",
    previewTh: "มีไอเดียสำหรับ SaaS product โดยเฉพาะ Southeast Asia? เล่าปัญหา ตลาด และทำไมต้องตอนนี้ ผมกำลังมองหาการสนทนา co-founder ที่ใช่อยู่",
    placeholderEn: "E.g. I've been working on an AI tool for Thai SMEs and need a technical co-founder who can own the product...",
    placeholderTh: "เช่น ผมกำลังทำ AI tool สำหรับ SME ไทยและต้องการ co-founder ทางเทคนิคที่รับผิดชอบผลิตภัณฑ์ได้...",
  },
  {
    key: "general",
    icon: "MessageSquare",
    labelEn: "Just Saying Hi",
    labelTh: "แค่ทักทาย",
    headingEn: "Say hi",
    headingTh: "ทักทาย",
    previewEn: "Even if you're not sure of fit yet, send context and I'll reply thoughtfully. I usually respond within 24 hours on weekdays.",
    previewTh: "แม้ยังไม่แน่ใจว่าเหมาะสมหรือเปล่า ส่งบริบทมาและผมจะตอบกลับอย่างใส่ใจ ปกติตอบภายใน 24 ชั่วโมงในวันทำงาน สามารถติดต่อเป็นภาษาไทยได้เลย 🙏",
    placeholderEn: "Whatever's on your mind...",
    placeholderTh: "อะไรก็ตามที่อยู่ในใจ...",
  },
];
```

---

## Implementation Priority Order

| Priority | Task | Impact |
|---|---|---|
| **P1** | Update `timelineEvents.ts` with full 7-year arc | Transforms the flagship section |
| **P1** | Replace placeholder testimonials with real quotes | Highest trust signal on entire site |
| **P1** | Add The Air Product + TeamStack Roster to projects | Missing current-role proof |
| **P1** | Fix hero copy — reflect current role (TeamStack) | First impression accuracy |
| **P2** | Implement signal system chips across all sections | Creates cognitive reinforcement |
| **P2** | Add "What I Owned" field to every project card | PM-facing credibility |
| **P2** | Update About page with full 7-year narrative | Completes the human story |
| **P3** | Add `sharpestLine` preview to testimonial carousel | Captures attention before expand |
| **P3** | Add `capabilityGained` to each timeline event | Powers the "capability evolution" layer |
| **P3** | Add `validates` tags to testimonials → cross-link with Value Props | Creates evidence loops |

> **The single most impactful change in all of this**: replacing the placeholder testimonials with the six real quotes. Edward Lee's quote alone — *"First is a primary reason why I want to keep working with MAQE"* — is worth more than any technical claim on the entire site. Ship that first.

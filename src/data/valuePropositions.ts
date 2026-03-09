import type { ValueProposition } from '@/types/valueProposition'

export const valuePropositions: ValueProposition[] = [
  {
    id: 'ships-ai',
    titleEn: 'Ships Production AI',
    titleTh: 'ส่งมอบ AI สู่การใช้งานจริง',
    descriptionEn:
      'Not just experimenting with AI — building and deploying LLM-powered features that real users depend on. From RAG pipelines to intelligent content generation at enterprise scale.',
    descriptionTh:
      'ไม่ใช่แค่ทดลอง — แต่นำ AI ลงระบบจริงจาก RAG สู่ Content Generation ระดับองค์กร',
    icon: 'Brain',
    crossRefType: 'project',
    crossRefId: 'ai-event-platform',
  },
  {
    id: 'product-first',
    titleEn: 'Thinks Product-First',
    titleTh: 'คิดแบบ Product-First',
    descriptionEn:
      'Every technical decision starts with "what problem does this solve for the user?" Engineering excellence in service of business outcomes, not technology for its own sake.',
    descriptionTh:
      'ผลลัพธ์ทางธุรกิจสำคัญที่สุด วิศวกรรมคือเครื่องมือ ไม่ใช่เป้าหมาย การตัดสินใจทางเทคนิคเริ่มจากคำถามเสมอ',
    icon: 'Target',
    crossRefType: 'section',
    crossRefId: 'timeline',
  },
  {
    id: 'full-stack',
    titleEn: 'Operates Full-Stack',
    titleTh: 'ทำงานแบบ Full-Stack',
    descriptionEn:
      'Comfortable across the entire stack — React frontends, Node.js APIs, PostgreSQL databases, AWS infrastructure. No handoff friction, no "that\'s not my job" gaps.',
    descriptionTh:
      'ทำงานได้ครอบคลุมทั้ง Frontend, DB, สู่ CI/CD',
    icon: 'Layers',
    crossRefType: 'section',
    crossRefId: 'skills',
  },
  {
    id: 'fast-adopter',
    titleEn: 'Adopts Tech Fast',
    titleTh: 'เรียนรู้เทคโนโลยีใหม่รวดเร็ว',
    descriptionEn:
      'Went from zero LangChain experience to a production RAG system in 3 weeks. Picks up new frameworks, languages, and paradigms through building, not just reading.',
    descriptionTh:
      'ใช้ LangChain ภายใน 3 สัปดาห์ เพื่อขึ้น Production ระบบ RAG',
    icon: 'Zap',
    crossRefType: 'section',
    crossRefId: 'projects',
  },
  {
    id: 'founder-trajectory',
    titleEn: 'Building Toward Founder',
    titleTh: 'เป้าหมายสู่การเป็น Founder',
    descriptionEn:
      'Every role, project, and skill is intentionally building toward a 10-year goal of founding a SaaS company. That means caring about business models, not just code quality.',
    descriptionTh:
      'เป้าหมายการสร้างของตนเอง ภายใน 10 ปี ทำให้สนใจทั้ง Product และ Business Model',
    icon: 'Rocket',
  },
]

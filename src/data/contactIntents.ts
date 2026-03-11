import type { ContactIntent } from '@/types/contact'

export const contactIntents: ContactIntent[] = [
  {
    key: 'hire-ai',
    labelEn: 'Hire as AI Engineer',
    labelTh: 'จ้างเป็น AI Engineer',
    headingEn: "Let's talk AI engineering",
    headingTh: 'คุยเรื่อง AI Engineering',
    previewEn:
      "Tell me about the AI product you're building. What's the problem it solves, what's the technical context, and what gap you're trying to fill. I'll reply with genuine thoughts on fit.",
    previewTh:
      'เล่าเรื่อง AI product ที่คุณกำลังสร้าง ปัญหาที่แก้ บริบทเทคนิค และช่องว่างที่คุณพยายามเติม ผมจะตอบกลับด้วยความคิดจริงๆ เกี่ยวกับความเหมาะสม',
    placeholderEn:
      "E.g. We're building a RAG-based internal knowledge tool and need someone who can own the AI integration layer and frontend...",
    placeholderTh:
      'เช่น เรากำลังสร้างเครื่องมือ knowledge ภายในแบบ RAG และต้องการคนที่รับผิดชอบ AI integration layer และ frontend...',
    icon: 'Sparkles',
  },
  {
    key: 'hire-po',
    labelEn: 'Hire as Product Owner',
    labelTh: 'จ้างเป็น Product Owner',
    headingEn: "Let's talk product ownership",
    headingTh: 'คุยเรื่อง Product Ownership',
    previewEn:
      "Tell me about your product and team. What decisions need to be owned, what's the technical complexity, and what success looks like at 6 months. Engineers who think in products are rare — I'm one.",
    previewTh:
      'เล่าเรื่อง product และทีมของคุณ การตัดสินใจอะไรที่ต้องการเจ้าของ ความซับซ้อนทางเทคนิคเป็นอย่างไร และความสำเร็จในรอบ 6 เดือนหน้าตาอย่างไร วิศวกรที่คิดแบบ product หายาก ผมเป็นคนนั้น',
    placeholderEn:
      "E.g. We're a Series A startup with a technical product and need a PO who can translate between engineering and business...",
    placeholderTh:
      'เช่น เราเป็น startup Series A ที่มีผลิตภัณฑ์ทางเทคนิคและต้องการ PO ที่เชื่อมวิศวกรรมกับธุรกิจได้...',
    icon: 'Target',
  },
  {
    key: 'collaborate',
    labelEn: 'Co-build Something',
    labelTh: 'ร่วมสร้างบางอย่าง',
    headingEn: "Let's build together",
    headingTh: 'สร้างด้วยกัน',
    previewEn:
      "Have an idea for a SaaS product — especially targeting Southeast Asia? Tell me the problem, the market, and why now. I'm actively looking for the right co-founder conversation.",
    previewTh:
      'มีไอเดียสำหรับ SaaS product โดยเฉพาะ Southeast Asia? เล่าปัญหา ตลาด และทำไมต้องตอนนี้ ผมกำลังมองหาการสนทนา co-founder ที่ใช่อยู่',
    placeholderEn:
      "E.g. I've been working on an AI tool for Thai SMEs and need a technical co-founder who can own the product...",
    placeholderTh:
      'เช่น ผมกำลังทำ AI tool สำหรับ SME ไทยและต้องการ co-founder ทางเทคนิคที่รับผิดชอบผลิตภัณฑ์ได้...',
    icon: 'Handshake',
  },
  {
    key: 'general',
    labelEn: 'Just Saying Hi',
    labelTh: 'แค่ทักทาย',
    headingEn: 'Say hi',
    headingTh: 'ทักทาย',
    previewEn:
      "Even if you're not sure of fit yet, send context and I'll reply thoughtfully. I usually respond within 24 hours on weekdays.",
    previewTh:
      'แม้ยังไม่แน่ใจว่าเหมาะสมหรือเปล่า ส่งบริบทมาและผมจะตอบกลับอย่างใส่ใจ ปกติตอบภายใน 24 ชั่วโมงในวันทำงาน สามารถติดต่อเป็นภาษาไทยได้เลย 🙏',
    placeholderEn: "Whatever's on your mind...",
    placeholderTh: 'อะไรก็ตามที่อยู่ในใจ...',
    icon: 'MessageSquare',
  },
]

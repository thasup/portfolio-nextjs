import type { SkillCluster } from '@/types/skill'

export const skillClusters: SkillCluster[] = [
  {
    id: 'ai-systems',
    nameEn: 'AI & Intelligent Systems',
    nameTh: 'AI และระบบอัจฉริยะ',
    narrativeEn:
      "Where I'm doubling down. Shipped production OpenAI integration. Now architecting deeper: LangChain pipelines, RAG systems, agentic workflows.",
    narrativeTh:
      'จุดที่ผมกำลังเพิ่มความพยายามสองเท่า Ship OpenAI integration ใน production แล้ว ตอนนี้กำลังออกแบบที่ลึกขึ้น: LangChain pipelines, RAG systems, agentic workflows',
    statusEn: 'Current Focus',
    statusTh: 'โฟกัสปัจจุบัน',
    order: 1,
    emphasized: true,
    evidenceRefs: ['the-air-product', 'ai-event-platform'],
    skills: [
      { name: 'OpenAI SDK', level: 90, tagEn: 'Shipped in production', tagTh: 'ส่งมอบใน production' },
      { name: 'LangChain', level: 72, tagEn: 'Active learning', tagTh: 'กำลังลงลึกต่อเนื่อง' },
      { name: 'RAG / Vector DB', level: 68, tagEn: 'Building now', tagTh: 'กำลังสร้างตอนนี้' },
      { name: 'AI SDK (Vercel)', level: 75, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
      { name: 'Prompt Engineering', level: 85, tagEn: 'Production-tested', tagTh: 'ผ่านการใช้งานจริง' },
      { name: 'Python', level: 62, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
    ],
  },
  {
    id: 'frontend',
    nameEn: 'Frontend Engineering',
    nameTh: 'Frontend Engineering',
    narrativeEn:
      "My craft foundation. 4 years of production React, Vue, and TypeScript across enterprise-scale applications from Bangkok to Japan.",
    narrativeTh:
      'รากฐานฝีมือของผม 4 ปีกับ production React, Vue และ TypeScript ในแอปพลิเคชันระดับ enterprise จากกรุงเทพฯ ถึงญี่ปุ่น',
    statusEn: 'Core Strength',
    statusTh: 'จุดแข็งหลัก',
    order: 2,
    emphasized: false,
    evidenceRefs: ['ap-thai', 'maqe-website', 'b2b-catalog'],
    skills: [
      { name: 'React / Next.js', level: 95, tagEn: 'Core strength', tagTh: 'จุดแข็งหลัก' },
      { name: 'Vue 3 / Nuxt', level: 93, tagEn: 'Core strength', tagTh: 'จุดแข็งหลัก' },
      { name: 'TypeScript', level: 92, tagEn: 'Core strength', tagTh: 'จุดแข็งหลัก' },
      { name: 'TailwindCSS', level: 93, tagEn: 'Core strength', tagTh: 'จุดแข็งหลัก' },
      { name: 'Framer Motion', level: 80, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
      { name: 'Vitest / Jest', level: 78, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
    ],
  },
  {
    id: 'backend-infra',
    nameEn: 'Backend & Infrastructure',
    nameTh: 'แบ็คเอนด์และโครงสร้างพื้นฐาน',
    narrativeEn:
      'Full-stack fluency. From NestJS APIs to AWS deployment — I own the entire delivery chain without needing handoffs.',
    narrativeTh:
      'ความคล่องตัว full-stack จาก NestJS APIs ถึง AWS deployment — ผมเป็นเจ้าของ delivery chain ทั้งหมดโดยไม่ต้องรอ handoffs',
    statusEn: 'Strong Working Capability',
    statusTh: 'ทำงานได้แข็งแกร่ง',
    order: 3,
    emphasized: false,
    evidenceRefs: ['token-gating', 'tangier-dao', 'teamstack-roster'],
    skills: [
      { name: 'Node.js / NestJS', level: 80, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'GraphQL / Apollo', level: 78, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'Docker', level: 78, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'AWS', level: 75, tagEn: 'Certified', tagTh: 'มีใบรับรอง' },
      { name: 'Supabase / Firebase', level: 82, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'PostgreSQL', level: 70, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
    ],
  },
  {
    id: 'web3',
    nameEn: 'Web3 & Blockchain',
    nameTh: 'Web3 และ Blockchain',
    narrativeEn:
      'Rare production Solidity experience in the Bangkok developer market. Shipped on Ethereum mainnet. Understands DAO governance, token standards, and the UX challenges of on-chain interactions.',
    narrativeTh:
      'ประสบการณ์ Solidity ระดับ production ที่หายากในตลาดนักพัฒนากรุงเทพฯ Ship บน Ethereum mainnet เข้าใจ DAO governance, token standards และ UX challenges ของ on-chain interactions',
    statusEn: 'Frontier Experience',
    statusTh: 'ประสบการณ์แนวหน้า',
    order: 4,
    emphasized: false,
    evidenceRefs: ['tangier-dao', 'token-gating'],
    skills: [
      { name: 'Solidity', level: 65, tagEn: 'Production shipped', tagTh: 'ship ใน production แล้ว' },
      { name: 'Web3.js', level: 78, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'Alchemy', level: 75, tagEn: 'Production', tagTh: 'ใช้งานจริงใน production' },
      { name: 'Smart Contracts', level: 68, tagEn: 'Shipped on mainnet', tagTh: 'ship บน mainnet' },
      { name: 'NFT Standards', level: 72, tagEn: 'Applied', tagTh: 'นำไปใช้จริง' },
    ],
  },
]

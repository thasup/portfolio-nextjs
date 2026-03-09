import type { ContactIntent } from '@/types/contact'

export const contactIntents: ContactIntent[] = [
  {
    key: 'hire_ai',
    label: 'Hire as AI Engineer',
    labelTh: 'ร่วมงานในฐานะ AI Engineer',
    heading: "Let's talk about AI engineering",
    headingTh: 'คุยเรื่อง AI Engineering',
    placeholder: 'Tell me about the AI/LLM challenges your team is facing...',
    placeholderTh: 'เล่าให้ผมฟังเกี่ยวกับโจทย์ AI/LLM ที่ทีมคุณกำลังเจอ...',
    icon: 'Cpu',
  },
  {
    key: 'hire_po',
    label: 'Hire as Product Owner',
    labelTh: 'ร่วมงานในฐานะ Product Owner',
    heading: "Let's talk about product leadership",
    headingTh: 'คุยเรื่องการบริหารผลิตภัณฑ์',
    placeholder: 'Tell me about the product challenges and team dynamics...',
    placeholderTh: 'เล่าให้ผมฟังเกี่ยวกับความท้าทายของผลิตภัณฑ์และทีม...',
    icon: 'Target',
  },
  {
    key: 'collaborate',
    label: 'Collaborate on SaaS',
    labelTh: 'ร่วมสร้าง SaaS ด้วยกัน',
    heading: "Let's build something together",
    headingTh: 'สร้างอะไรบางอย่างด้วยกัน',
    placeholder: 'Tell me about your SaaS idea and what you need from a co-founder...',
    placeholderTh: 'เล่าไอเดีย SaaS ของคุณและสิ่งที่คุณมองหาจาก Co-founder...',
    icon: 'Handshake',
  },
  {
    key: 'general',
    label: 'General Inquiry',
    labelTh: 'เรื่องอื่นๆ',
    heading: "What's on your mind?",
    headingTh: 'คุณมีอะไรในใจ?',
    placeholder: 'Ask me anything — I respond to every message...',
    placeholderTh: 'สอบถามได้ทุกเรื่อง ผมตอบทุกข้อความครับ...',
    icon: 'MessageSquare',
  },
]

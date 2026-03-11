import type { SignalDefinition } from '@/types/content'

export const signals: SignalDefinition[] = [
  {
    id: 'production-ai',
    labelEn: 'Production AI',
    labelTh: 'Production AI',
    shortLabelEn: 'AI',
    shortLabelTh: 'AI',
    descriptionEn: 'Shipped AI and LLM-powered product work that moved beyond experiments into real use.',
    descriptionTh: 'ส่งมอบงาน AI และ LLM สู่การใช้งานจริง ไม่ใช่แค่การทดลอง',
  },
  {
    id: 'product-ownership',
    labelEn: 'Product Ownership',
    labelTh: 'Product Ownership',
    shortLabelEn: 'Ownership',
    shortLabelTh: 'Ownership',
    descriptionEn: 'Works from user and business outcomes, not just implementation tasks.',
    descriptionTh: 'ทำงานจากผลลัพธ์ของผู้ใช้และธุรกิจ ไม่ใช่แค่ส่งงานทางเทคนิค',
  },
  {
    id: 'systems-thinking',
    labelEn: 'Systems Thinking',
    labelTh: 'Systems Thinking',
    shortLabelEn: 'Systems',
    shortLabelTh: 'Systems',
    descriptionEn: 'Connects architecture, operations, and product decisions into coherent systems.',
    descriptionTh: 'เชื่อมโยงสถาปัตยกรรม การปฏิบัติงาน และการตัดสินใจเชิงผลิตภัณฑ์อย่างเป็นระบบ',
  },
  {
    id: 'founder-trajectory',
    labelEn: 'Founder Trajectory',
    labelTh: 'Founder Trajectory',
    shortLabelEn: 'Founder',
    shortLabelTh: 'Founder',
    descriptionEn: 'Builds toward founding with long-term strategic, product, and business intent.',
    descriptionTh: 'สะสมประสบการณ์เพื่อก้าวสู่การเป็น Founder ด้วยความตั้งใจเชิงกลยุทธ์ระยะยาว',
  },
  {
    id: 'cross-functional-trust',
    labelEn: 'Cross-Functional Trust',
    labelTh: 'Cross-Functional Trust',
    shortLabelEn: 'Trust',
    shortLabelTh: 'Trust',
    descriptionEn: 'Earns trust across teams through reliability, clarity, and collaboration.',
    descriptionTh: 'ได้รับความไว้วางใจจากหลายฝ่ายผ่านความน่าเชื่อถือ ความชัดเจน และการร่วมงานที่ดี',
  },
  {
    id: 'knowledge-sharing',
    labelEn: 'Knowledge Sharing',
    labelTh: 'Knowledge Sharing',
    shortLabelEn: 'Knowledge',
    shortLabelTh: 'Knowledge',
    descriptionEn: 'Improves teams by documenting, teaching, and spreading practical knowledge.',
    descriptionTh: 'ยกระดับทีมด้วยการแบ่งปันความรู้ การสื่อสาร และการถ่ายทอดประสบการณ์',
  },
  {
    id: 'full-stack-delivery',
    labelEn: 'Full-Stack Delivery',
    labelTh: 'Full-Stack Delivery',
    shortLabelEn: 'Full-stack',
    shortLabelTh: 'Full-stack',
    descriptionEn: 'Can move across frontend, backend, data, and infrastructure to ship complete outcomes.',
    descriptionTh: 'สามารถทำงานตั้งแต่ frontend, backend, data ถึง infrastructure เพื่อส่งมอบผลลัพธ์ครบวงจร',
  },
]

export const signalMap = Object.fromEntries(signals.map((signal) => [signal.id, signal]))

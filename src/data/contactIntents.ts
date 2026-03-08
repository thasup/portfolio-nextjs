import type { ContactIntent } from '@/types/contact'

export const contactIntents: ContactIntent[] = [
  {
    key: 'hire_ai',
    label: 'Hire as AI Engineer',
    heading: "Let's talk about AI engineering",
    placeholder: 'Tell me about the AI/LLM challenges your team is facing...',
    icon: 'Cpu',
  },
  {
    key: 'hire_po',
    label: 'Hire as Product Owner',
    heading: "Let's talk about product leadership",
    placeholder: 'Tell me about the product challenges and team dynamics...',
    icon: 'Target',
  },
  {
    key: 'collaborate',
    label: 'Collaborate on SaaS',
    heading: "Let's build something together",
    placeholder: 'Tell me about your SaaS idea and what you need from a co-founder...',
    icon: 'Handshake',
  },
  {
    key: 'general',
    label: 'General Inquiry',
    heading: "What's on your mind?",
    placeholder: 'Ask me anything — I respond to every message...',
    icon: 'MessageSquare',
  },
]

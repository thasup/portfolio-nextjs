import type { SkillCluster } from '@/types/skill'

export const skillClusters: SkillCluster[] = [
  {
    id: 'ai-llm',
    name: 'AI & LLM',
    narrative:
      'Building production LLM pipelines and AI-powered features — from RAG architectures to prompt engineering for enterprise applications.',
    order: 1,
    emphasized: true,
    skills: [
      { name: 'LangChain', level: 85 },
      { name: 'OpenAI API', level: 90 },
      { name: 'RAG Architecture', level: 80 },
      { name: 'Prompt Engineering', level: 88 },
      { name: 'Python', level: 75 },
      { name: 'Vector Databases', level: 70 },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Engineering',
    narrative:
      'Crafting performant, accessible web experiences with modern React patterns — from pixel-perfect UIs to complex state management.',
    order: 2,
    emphasized: false,
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'TailwindCSS', level: 90 },
      { name: 'Framer Motion', level: 80 },
      { name: 'HTML/CSS', level: 95 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Infrastructure',
    narrative:
      'Full-stack capability spanning Node.js APIs, PostgreSQL databases, and AWS cloud architecture for scalable applications.',
    order: 3,
    emphasized: false,
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'REST API Design', level: 88 },
      { name: 'AWS', level: 75 },
      { name: 'Docker', level: 70 },
      { name: 'CI/CD', level: 72 },
    ],
  },
  {
    id: 'web3',
    name: 'Web3 & Blockchain',
    narrative:
      'Hands-on smart contract development and DApp building — from token gating to DAO governance with Solidity and Ethers.js.',
    order: 4,
    emphasized: false,
    skills: [
      { name: 'Solidity', level: 70 },
      { name: 'Ethers.js', level: 75 },
      { name: 'Smart Contracts', level: 72 },
      { name: 'IPFS', level: 65 },
      { name: 'MetaMask SDK', level: 70 },
    ],
  },
]

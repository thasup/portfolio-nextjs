import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    slug: 'the-air-product',
    titleTh: 'The Air Product',
    titleEn: 'The Air Product',
    domain: 'ai',
    company: 'TeamStack',
    taglineTh: 'AI-first internal product ที่มีวิสัยทัศน์เชิงกลยุทธ์ 3 ปี',
    taglineEn: 'AI-first internal product with a 3-year strategic vision',
    problemSummaryTh: 'ทีมขาดเครื่องมือที่อัจฉริยะและรับรู้บริบทซึ่งปรับตัวตามวิธีทำงานจริงๆ',
    problemSummaryEn: 'Teams lack intelligent, context-aware tooling that adapts to how they actually work.',
    problemTh:
      'TeamStack กำลังสร้างผลิตภัณฑ์ภายในที่ต้องคิดไกลกว่า dashboard ธรรมดา เครื่องมือนี้ต้องช่วยให้ทีมทำงานได้ดีขึ้นจากบริบทจริง ต้องรองรับ roadmap ระยะยาว และต้อง balance ทั้ง UX, product strategy และความเป็นไปได้ทางเทคนิคตั้งแต่วันแรก',
    problemEn:
      'TeamStack needed an internal product that went beyond a simple dashboard. The product had to support how real teams operate, fit a long-range roadmap, and balance UX, product strategy, and technical feasibility from day one.',
    approachTh:
      'ผมทำงานใกล้ชิดกับ CEO ในการตีความ vision ให้กลายเป็น product architecture ที่ทำได้จริง รับผิดชอบทั้ง frontend experience, การออกแบบ AI workflow, และการแปลงความต้องการเชิงกลยุทธ์เป็นระบบที่ต่อยอดได้ในระยะยาว',
    approachEn:
      'I work directly with the CEO to translate product vision into a system that can actually be built. I own the frontend experience, AI workflow integration, and the architectural decisions that keep the product extensible over a multi-year roadmap.',
    featuresTh: [
      'AI-assisted workflows ที่ออกแบบจากบริบทการใช้งานจริง',
      'การร่วมวาง product direction กับ CEO แบบใกล้ชิด',
      'สถาปัตยกรรมที่รองรับ roadmap ระยะ 3 ปี',
      'เชื่อม product thinking, UX และ technical execution เข้าด้วยกัน',
    ],
    featuresEn: [
      'AI-assisted workflows shaped around real operating context',
      'Direct product-direction collaboration with the CEO',
      'Architecture designed to support a 3-year roadmap',
      'Tight integration between product thinking, UX, and technical execution',
    ],
    techStack: ['Vue 3', 'TypeScript', 'NestJS', 'LangChain', 'RAG', 'System Architecture'],
    outcomesTh: 'โปรเจกต์เชิงกลยุทธ์ที่กำลังดำเนินอยู่ ซึ่งสะท้อน product ownership, founder proximity และการออกแบบ AI product ในบริบทจริง',
    outcomesEn:
      'An active strategic product that demonstrates product ownership, founder proximity, and real AI product architecture work.',
    challengesTh:
      'ความท้าทายหลักคือการออกแบบสิ่งที่ยัง evolving อยู่ตลอดเวลา ต้องแปลง strategic intent ให้เป็นระบบที่เริ่มใช้งานได้จริงโดยไม่ล็อกทีมไว้กับ architecture ที่แข็งตัวเกินไป',
    challengesEn:
      'The hardest part is designing for an evolving product. The system has to become useful now without freezing the team into an architecture that is too rigid for what comes next.',
    heroImage: '/images/projects/the-air-product/hero.svg',
    screenshots: [],
    featured: true,
    strategicPriority: 1,
    whatIOwnedEn: 'Architecture, frontend, AI workflow integration, and direct strategy collaboration with the CEO',
    whatIOwnedTh: 'Architecture, frontend, AI workflow integration และการร่วมวางกลยุทธ์กับ CEO โดยตรง',
    signals: ['production-ai', 'product-ownership', 'founder-trajectory'],
    proofRefs: ['join-teamstack', 'the-air-product', 'andreas-ceo'],
    year: '2025',
  },
  {
    slug: 'ai-event-platform',
    titleTh: 'AI Event Creation Platform',
    titleEn: 'AI Event Creation Platform',
    domain: 'ai',
    company: 'MAQE / Peatix',
    taglineTh: 'ทำให้การสร้างอีเวนต์มีความฉลาด ไม่ใช่แค่ดิจิทัล',
    taglineEn: 'Making event creation intelligent, not just digital',
    problemSummaryTh: 'ผู้จัดงานเสียเวลากับงาน content ซ้ำๆ ที่ AI สามารถช่วยแทนได้จริง',
    problemSummaryEn: 'Event organizers spent too much time on repetitive content tasks that AI could meaningfully assist.',
    problemTh:
      'ผู้จัดงานต้องเขียนคำอธิบายอีเวนต์ ปรับข้อความ และตัดสินใจด้าน content ซ้ำๆ ภายใต้เวลาจำกัด โจทย์ไม่ใช่การทำ AI demo แต่คือการทำให้ AI เข้าไปอยู่ใน production workflow ที่ผู้ใช้จริงเชื่อถือและใช้งานได้',
    problemEn:
      'Organizers were spending too much time creating and refining event content under real delivery pressure. The challenge was not building an AI demo, but embedding AI into a production workflow that real users could trust.',
    approachTh:
      'ผมรับผิดชอบการ integrate OpenAI SDK เข้ากับ product จริง ออกแบบรูปแบบ AI UX ที่ใช้งานได้ใน production ดูแล frontend ทั้งหมด และเชื่อม AI feature เข้ากับระบบ deployment และ analytics ที่ทีมใช้อยู่แล้ว',
    approachEn:
      'I integrated OpenAI into a live product, designed AI UX patterns that fit production usage, owned the full frontend implementation, and connected the feature to the deployment and analytics reality of the existing platform.',
    featuresTh: [
      'Generative AI สำหรับช่วยสร้าง event content',
      'AI UX patterns ที่ออกแบบให้ใช้ได้จริงใน production',
      'การเชื่อม analytics และการวัดผลหลังเปิดใช้งาน',
      'frontend experience ที่ทำให้ AI ไม่รู้สึกเป็นส่วนเสริมที่หลุดจาก product',
    ],
    featuresEn: [
      'Generative AI to assist event-content creation',
      'AI UX patterns designed for real production behavior',
      'Integrated analytics and post-launch learning loops',
      'A frontend experience where AI feels native to the product instead of bolted on',
    ],
    techStack: ['Vue 3', 'TypeScript', 'OpenAI SDK', 'Vuetify', 'Pinia', 'GA4', 'AWS'],
    outcomesTh: 'พิสูจน์ว่าผมสามารถเชื่อมช่องว่างระหว่าง AI demo กับ AI product ได้ และสร้าง pattern ที่ทีมใช้ต่อได้',
    outcomesEn:
      'Proved I can bridge the gap between AI demos and AI products, while establishing reusable AI integration patterns for the team.',
    challengesTh:
      'ความท้าทายคือการทำให้ AI เข้ากับ product behavior จริง ต้องตัดสินใจทั้งด้าน prompt behavior, UX confidence และ production reliability พร้อมกัน',
    challengesEn:
      'The main challenge was making AI fit real product behavior. Prompt design, user confidence, and production reliability all had to be solved together.',
    heroImage: '/images/projects/ai-event-platform/hero.webp',
    screenshots: [],
    featured: true,
    strategicPriority: 2,
    whatIOwnedEn: 'OpenAI SDK integration, AI UX patterns, full frontend delivery, and AWS-aligned production rollout',
    whatIOwnedTh: 'OpenAI SDK integration, AI UX patterns, การส่งมอบ frontend ทั้งหมด และ production rollout ที่สอดคล้องกับ AWS',
    signals: ['production-ai', 'product-ownership'],
    proofRefs: ['ai-event-platform', 'edward-lee'],
    year: '2024',
  },
  {
    slug: 'teamstack-roster',
    titleTh: 'TeamStack Roster',
    titleEn: 'TeamStack Roster',
    domain: 'frontend',
    company: 'TeamStack',
    taglineTh: 'ผลิตภัณฑ์จัดการทีมที่ ship จาก 0 ถึง MVP',
    taglineEn: 'Team management product shipped from 0 to MVP',
    problemSummaryTh: 'ทีมประสิทธิภาพสูงต้องการเครื่องมือที่ดีกว่าสำหรับการจัดการ roster และการประสานงาน',
    problemSummaryEn: 'High-performance teams needed better tooling for roster management and coordination.',
    problemTh:
      'การจัดการทีมและ roster ในบริบทธุรกิจจริงมี workflow ที่ซับซ้อนกว่าตารางทั่วไป ต้องรองรับการทำงานร่วมกัน การเปลี่ยนแปลงบ่อย และการตัดสินใจระดับ product ว่าอะไรคือ MVP ที่ควร ship ก่อน',
    problemEn:
      'Team and roster management has more complexity than it first appears. The product had to support real collaboration, frequent change, and the product judgment required to decide what an MVP should actually include.',
    approachTh:
      'ผมเป็นเจ้าของงานตั้งแต่ architecture ไปถึง user-facing features ช่วยผลักผลิตภัณฑ์จากแนวคิดสู่ MVP ที่ใช้งานได้จริง โดยต้องตัดสินใจทั้งด้านระบบ การจัดลำดับความสำคัญ และคุณภาพการส่งมอบ',
    approachEn:
      'I owned the work from architecture through user-facing implementation, helping push the product from concept to a usable MVP while making trade-offs across system design, prioritization, and delivery quality.',
    featuresTh: [
      'workflow สำหรับการจัดการทีมและ roster',
      'การออกแบบ MVP ที่คำนึงถึงการใช้งานจริง',
      'ownership ครบตั้งแต่ architecture ถึง release',
      'การประสานงานใกล้ชิดกับทีมผลิตภัณฑ์',
    ],
    featuresEn: [
      'Roster and team-management workflows',
      'MVP shaping grounded in real usage needs',
      'End-to-end ownership from architecture to release',
      'Close collaboration with the product team',
    ],
    techStack: ['TypeScript', 'Frontend Architecture', 'Product Thinking', 'MVP Delivery'],
    outcomesTh: 'เป็นหนึ่งในหลักฐาน 0→1 delivery ที่ชัดที่สุดในพอร์ต และเป็นผลิตภัณฑ์แรกที่ผมชี้ได้ชัดว่าเป็นของผมตั้งแต่ระบบถึงประสบการณ์ผู้ใช้',
    outcomesEn:
      'One of the clearest 0→1 delivery proofs in the portfolio and the first product I can point to as mine from system design through user experience.',
    challengesTh:
      'โจทย์สำคัญคือการตัดขอบเขตให้คมพอสำหรับ MVP โดยไม่ทำลายทิศทางระยะยาวของผลิตภัณฑ์',
    challengesEn:
      'The hardest part was scoping sharply enough for MVP without undermining the longer-term direction of the product.',
    heroImage: '/images/projects/teamstack-roster/hero.svg',
    screenshots: [],
    featured: false,
    strategicPriority: 3,
    whatIOwnedEn: 'Full product ownership from architecture and feature shaping to release readiness',
    whatIOwnedTh: 'เป็นเจ้าของผลิตภัณฑ์ทั้งหมด ตั้งแต่ architecture การกำหนดฟีเจอร์ ไปจนถึงความพร้อมในการ release',
    signals: ['product-ownership', 'full-stack-delivery'],
    proofRefs: ['teamstack-roster', 'join-teamstack'],
    year: '2025',
  },
  {
    slug: 'tangier-dao',
    titleTh: 'Tangier — วงการให้แบบกระจายศูนย์',
    titleEn: 'Tangier — Decentralized Giving Circles',
    domain: 'web3',
    company: 'MAQE',
    taglineTh: 'การระดมทุนชุมชนแบบ trustless บน Ethereum',
    taglineEn: 'Trustless community fundraising on Ethereum',
    problemSummaryTh: 'ชุมชนต้องการระบบ governance และการจัดสรรเงินที่โปร่งใสและแก้ไขย้อนหลังไม่ได้',
    problemSummaryEn: 'Communities needed transparent, tamper-resistant governance and fund distribution.',
    problemTh:
      'โจทย์คือการสร้างระบบ governance ที่ชุมชนไว้วางใจได้จริง ไม่ใช่แค่หน้าตาสวย แต่ต้องมี smart contract logic ที่รองรับข้อเสนอ การโหวต และ treasury behavior แบบ on-chain',
    problemEn:
      'The product needed more than a polished interface. It required governance logic that could actually be trusted on-chain, including proposals, voting flows, and treasury behavior.',
    approachTh:
      'ผมเขียน Solidity contracts เอง พร้อมสร้าง frontend และเชื่อม Web3 flow ให้เป็นประสบการณ์ที่ใช้งานได้จริงใน production',
    approachEn:
      'I wrote the Solidity contracts, built the frontend, and connected the Web3 flows into a usable production experience.',
    featuresTh: [
      'smart contract governance บน Ethereum',
      'proposal และ voting flow สำหรับชุมชน',
      'frontend ที่เชื่อมประสบการณ์ on-chain ให้ใช้งานได้จริง',
      'ระบบที่ผสาน product และ protocol thinking เข้าด้วยกัน',
    ],
    featuresEn: [
      'Ethereum-based smart-contract governance',
      'Proposal and voting flows for communities',
      'A frontend that makes on-chain behavior usable',
      'A system combining product and protocol thinking',
    ],
    techStack: ['Vue 3', 'Solidity', 'Smart Contracts', 'TypeScript', 'Web3.js', 'NestJS'],
    outcomesTh: 'เป็นหลักฐานด้าน frontier-tech และ full-stack delivery ที่หาได้ยาก โดยเฉพาะในบริบทตลาดนักพัฒนากรุงเทพฯ',
    outcomesEn:
      'A rare proof point for frontier-tech and full-stack delivery, especially in the Bangkok developer market.',
    challengesTh:
      'ต้องออกแบบทั้ง contract behavior และ user trust พร้อมกัน เพราะ on-chain systems ลงผิดพลาดแล้วแก้ย้อนหลังได้ยากกว่าซอฟต์แวร์ทั่วไป',
    challengesEn:
      'Both contract behavior and user trust had to be designed together, because mistakes in on-chain systems are far less forgiving than in ordinary software.',
    heroImage: '/images/projects/tangier-dao/hero.webp',
    screenshots: [],
    featured: true,
    strategicPriority: 4,
    whatIOwnedEn: 'Solidity contracts, full frontend delivery, and Web3 integration architecture',
    whatIOwnedTh: 'Solidity contracts, การส่งมอบ frontend ทั้งหมด และสถาปัตยกรรมการเชื่อม Web3',
    signals: ['full-stack-delivery', 'systems-thinking'],
    proofRefs: ['tangier-dao'],
    year: '2024',
  },
  {
    slug: 'token-gating',
    titleTh: 'Token Gating — ควบคุมการเข้าถึงด้วย NFT',
    titleEn: 'Token Gating — NFT Access Control',
    domain: 'web3',
    company: 'MAQE',
    taglineTh: 'NFT ของคุณคือตั๋ว ตรวจสอบได้บนหลาย chain',
    taglineEn: 'Your NFT is your ticket, verified across chains',
    problemSummaryTh: 'ลูกค้าต้องการควบคุมการเข้าถึงด้วยการถือครอง NFT โดยไม่ทำให้ผู้ใช้เจอ friction สูงเกินไป',
    problemSummaryEn: 'Clients needed NFT-based access control without making the user experience painfully high-friction.',
    problemTh:
      'การควบคุมการเข้าถึงด้วย NFT ไม่ได้ยากแค่เรื่องการตรวจสอบ token แต่ยากที่การผสาน wallet flow, backend checks และการใช้งานจริงให้ smooth พอสำหรับผู้ใช้',
    problemEn:
      'Token gating was not just about checking ownership. It required making wallet flows, backend validation, and actual user behavior work together smoothly enough to ship.',
    approachTh:
      'ผมสร้างระบบ reusable ที่เชื่อม frontend, API และ Web3 checks เข้าด้วยกัน เพื่อให้การตรวจสอบสิทธิ์ใช้งานทำได้จริงใน production',
    approachEn:
      'I built a reusable system connecting frontend, API, and Web3 ownership checks so access control could work in production instead of staying as a concept.',
    featuresTh: [
      'การตรวจสอบสิทธิ์จากการถือครอง NFT',
      'wallet-integrated access control',
      'full-stack flow ตั้งแต่ frontend ถึง backend checks',
      'pattern ที่นำไปใช้ซ้ำได้',
    ],
    featuresEn: [
      'NFT-based ownership verification',
      'Wallet-integrated access control',
      'A full-stack flow from frontend to backend checks',
      'A reusable delivery pattern',
    ],
    techStack: ['Vue 3', 'NestJS', 'Web3.js', 'TypeScript', 'Alchemy', 'AWS', 'Docker'],
    outcomesTh: 'พิสูจน์ว่าผมสามารถเรียนรู้โดเมนใหม่เร็วและเปลี่ยนมันให้กลายเป็นระบบที่ ship ได้จริง',
    outcomesEn:
      'Proved I can learn a new domain quickly and turn it into a system that actually ships.',
    heroImage: '/images/projects/token-gating/hero.webp',
    screenshots: [],
    featured: false,
    strategicPriority: 5,
    whatIOwnedEn: 'Full-stack delivery across Vue 3 frontend, NestJS API, and multi-chain Web3 integration',
    whatIOwnedTh: 'การส่งมอบแบบ full-stack ครอบคลุม Vue 3 frontend, NestJS API และ multi-chain Web3 integration',
    signals: ['full-stack-delivery', 'systems-thinking'],
    proofRefs: ['token-gating'],
    year: '2023',
  },
  {
    slug: 'ap-thai',
    titleTh: 'AP Thai — แพลตฟอร์มค้นหาอสังหาริมทรัพย์',
    titleEn: 'AP Thai — Property Discovery Platform',
    domain: 'ecommerce',
    company: 'MAQE / AP Thailand',
    taglineTh: 'ปรับปรุงประสบการณ์ซื้อบ้านสำหรับผู้พัฒนาอสังหาฯ รายใหญ่ของไทย',
    taglineEn: 'Modernizing homebuying for one of Thailand’s largest developers',
    problemSummaryTh: 'แพลตฟอร์มค้นหาอสังหาฯ ต้องรองรับผู้ใช้จำนวนมากและพฤติกรรมการค้นหาที่ซับซ้อนบน mobile-first experience',
    problemSummaryEn: 'A large property platform needed to support real search behavior at scale in a mobile-first experience.',
    problemTh:
      'AP Thai ต้องการประสบการณ์ค้นหาอสังหาริมทรัพย์ที่ทันสมัยและทำงานได้ดีในโลกจริง ทั้งด้าน scale, analytics, การค้นหา และคุณภาพของการใช้งานบน mobile',
    problemEn:
      'AP Thai needed a modern property-discovery experience that could hold up in the real world across scale, analytics, search complexity, and mobile-first behavior.',
    approachTh:
      'ผมดูแล frontend หลักของระบบ พร้อม analytics instrumentation และ test coverage ที่ทำให้งานระดับ production มีความมั่นคงมากขึ้น',
    approachEn:
      'I owned the core frontend work, along with analytics instrumentation and test coverage that made the product stronger in production.',
    featuresTh: [
      'property discovery flow ที่รองรับผู้ใช้จริงจำนวนมาก',
      'analytics instrumentation ที่เชื่อมกับ product decisions',
      'test coverage สำหรับงาน production',
      'mobile-first delivery',
    ],
    featuresEn: [
      'A property-discovery flow for real production usage',
      'Analytics instrumentation tied to product decisions',
      'Test coverage for delivery confidence',
      'Mobile-first implementation',
    ],
    techStack: ['NuxtJS', 'SCSS', 'Laravel', 'MariaDB', 'Docker', 'Cypress', 'GA4', 'GTM', 'AWS'],
    outcomesTh: 'เป็นหลักฐานแรกของ scale, analytics-driven development และการส่งมอบคุณภาพ production ในเส้นทาง software ของผม',
    outcomesEn:
      'An early proof point for scale, analytics-driven development, and production-quality delivery in my software career.',
    heroImage: '/images/projects/ap-thai/hero.webp',
    screenshots: [],
    featured: false,
    strategicPriority: 6,
    whatIOwnedEn: 'Core NuxtJS frontend, GA4 analytics instrumentation, and Cypress E2E coverage',
    whatIOwnedTh: 'NuxtJS frontend หลัก, GA4 analytics instrumentation และ Cypress E2E coverage',
    signals: ['cross-functional-trust', 'full-stack-delivery'],
    proofRefs: ['ap-thai'],
    year: '2022',
  },
  {
    slug: 'b2b-catalog',
    titleTh: 'แพลตฟอร์มแคตตาล็อก B2B',
    titleEn: 'B2B Online Catalog Platform',
    domain: 'ecommerce',
    company: 'MAQE',
    taglineTh: 'แทนที่การขาย B2B แบบ manual ด้วย headless commerce',
    taglineEn: 'Replacing manual B2B sales with headless commerce',
    problemSummaryTh: 'งาน B2B มีข้อจำกัดเฉพาะ เช่น bulk ordering, pricing logic และ workflow ทางธุรกิจที่ซับซ้อน',
    problemSummaryEn: 'B2B workflows carry special constraints like bulk ordering, pricing logic, and operational complexity.',
    problemTh:
      'ระบบแคตตาล็อกสำหรับลูกค้าองค์กรไม่ได้ต้องการแค่ UI ที่ดี แต่ต้องสะท้อน logic ทางธุรกิจจริง เช่น inventory, filtering, pricing และ workflow การสั่งซื้อจำนวนมาก',
    problemEn:
      'An enterprise catalog needed more than a polished UI. It had to reflect real business logic around inventory, filtering, pricing, and large-order workflows.',
    approachTh:
      'ผมสร้าง frontend บน React/GraphQL/Apollo ที่เชื่อมเข้ากับ ecosystem ฝั่ง commerce และช่วยเปลี่ยนงานขายแบบ manual ให้กลายเป็นประสบการณ์ดิจิทัลที่ใช้งานได้',
    approachEn:
      'I built a React/GraphQL/Apollo frontend connected to the commerce stack, helping replace manual B2B sales work with a usable digital experience.',
    featuresTh: [
      'headless commerce frontend',
      'GraphQL-driven data flow',
      'ประสบการณ์สำหรับบริบท B2B จริง',
      'เชื่อม technical decisions กับ business constraints',
    ],
    featuresEn: [
      'A headless commerce frontend',
      'GraphQL-driven data flow',
      'UX designed for real B2B context',
      'Technical choices grounded in business constraints',
    ],
    techStack: ['React', 'GraphQL', 'Apollo Client', 'Magento', 'TailwindCSS', 'PHP'],
    outcomesTh: 'ขยาย range ของผมไปสู่ commerce architecture และย้ำว่าผมเข้าใจวิธีที่ business context เปลี่ยนงานวิศวกรรม',
    outcomesEn:
      'Expanded my range into commerce architecture and reinforced how deeply business context reshapes engineering work.',
    heroImage: '/images/projects/b2b-catalog/hero.webp',
    screenshots: [],
    featured: false,
    strategicPriority: 7,
    whatIOwnedEn: 'React, GraphQL, Apollo frontend delivery and Magento integration architecture',
    whatIOwnedTh: 'การส่งมอบ React, GraphQL, Apollo frontend และสถาปัตยกรรม Magento integration',
    signals: ['full-stack-delivery', 'cross-functional-trust'],
    proofRefs: ['online-catalog'],
    year: '2023',
  },
  {
    slug: 'maqe-website',
    titleTh: 'MAQE Website v5',
    titleEn: 'MAQE Website v5',
    domain: 'frontend',
    company: 'MAQE',
    taglineTh: 'งาน ownership เต็มรูปแบบของ production asset',
    taglineEn: 'A production asset owned end to end',
    problemSummaryTh: 'เว็บไซต์องค์กรต้องการการดูแลทั้งด้าน architecture, design implementation, performance และ maintenance อย่างต่อเนื่อง',
    problemSummaryEn: 'A corporate website needed sustained ownership across architecture, design implementation, performance, and maintenance.',
    problemTh:
      'ความท้าทายของเว็บไซต์องค์กรไม่ได้จบแค่ launch แต่รวมถึงการดูแลสินทรัพย์ production ที่ต้องเชื่อม design quality กับความเสถียรระยะยาว',
    problemEn:
      'A corporate website is not just a launch project. It is a production asset that requires design quality, technical stability, and long-term care at the same time.',
    approachTh:
      'ผมเป็นเจ้าของการ rebuild และการดูแลระบบต่อเนื่อง ทำงานร่วมกับทีม design อย่างใกล้ชิด พร้อมตัดสินใจทั้งด้าน implementation และความเสถียรของระบบ',
    approachEn:
      'I owned the rebuild and its ongoing care, working closely with design while making the implementation and system-stability decisions needed for long-term quality.',
    featuresTh: [
      'การเป็นเจ้าของ production asset แบบ end-to-end',
      'การทำงานใกล้ชิดกับ design',
      'ดูแลทั้งการ build และ maintenance',
      'ยกระดับคุณภาพเชิงระบบ ไม่ใช่แค่ feature-by-feature',
    ],
    featuresEn: [
      'End-to-end ownership of a production asset',
      'Close collaboration with design',
      'Responsibility for both build and maintenance',
      'System-level quality rather than feature-by-feature work',
    ],
    techStack: ['WordPress', 'PHP', 'jQuery', 'SCSS', 'ACF', 'Docker'],
    outcomesTh: 'เป็นจุดพิสูจน์ด้านความน่าเชื่อถือ ความคิดเชิงระบบ และความสามารถในการเป็นเจ้าของงานอย่างต่อเนื่อง',
    outcomesEn:
      'A proof point for reliability, systematic thinking, and sustained ownership over a real production asset.',
    heroImage: '/images/projects/maqe-website/hero.webp',
    screenshots: [],
    featured: false,
    strategicPriority: 8,
    whatIOwnedEn: 'Primary ownership across architecture, implementation quality, performance, and maintenance',
    whatIOwnedTh: 'เป็นเจ้าของหลักทั้ง architecture, implementation quality, performance และ maintenance',
    signals: ['product-ownership', 'systems-thinking'],
    proofRefs: ['maqe-website-v5', 'meow'],
    year: '2023',
  },
]

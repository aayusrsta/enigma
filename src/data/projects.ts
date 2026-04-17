export interface Project {
  id: string
  num: string
  name: string
  desc: string
  tags: string[]
  url: string
  inProgress?: boolean
}

export const professionalProjects: Project[] = [
  {
    id: 'ncell',
    num: 'PROFESSIONAL_01',
    name: 'Ncell App',
    desc: "Feature engineering for Nepal's largest telecom mobile application. Deep linking, auto-renewal scheduler, OTP auth, referral system & widget support.",
    tags: ['REACT NATIVE', 'REDUX', 'FIREBASE', 'DEEP LINKING'],
    url: '#',
  },
  {
    id: 'interpreter',
    num: 'PROFESSIONAL_02',
    name: 'Interpreter Booking',
    desc: 'Full-stack booking platform with role-based access control, real-time WebSocket chat, GraphQL API and Firebase Cloud Messaging push notifications.',
    tags: ['NEXT.JS', 'NODE.JS', 'GRAPHQL', 'WEBSOCKET', 'FCM'],
    url: '#',
  },
  {
    id: 'pixel-revive',
    num: 'PROFESSIONAL_03',
    name: 'Pixel Revive',
    desc: 'AI-powered photo enhancement web app. Sharpening, noise reduction, color correction & text summarization powered by machine learning models.',
    tags: ['REACT.JS', 'RTK QUERY', 'REDUX TOOLKIT', 'AI/ML'],
    url: '#',
  },
  {
    id: 'nepal-in-data',
    num: 'PROFESSIONAL_04',
    name: 'Nepal In Data',
    desc: 'Interactive data visualisation platform for Nepal. Built entire frontend architecture — dynamic charts, search & filter across complex datasets, lazy loading & code splitting.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'DATA VIZ'],
    url: '#',
  },
  {
    id: 'global-chautari',
    num: 'PROFESSIONAL_05',
    name: 'Global Chautari',
    desc: 'Community platform connecting Nepali users globally. Built and maintained core app features, integrating real-time capabilities and a clean mobile-first experience.',
    tags: ['REACT NATIVE', 'REDUX', 'NODE.JS'],
    url: '#',
  },
  {
    id: 'flowzen',
    num: 'PROFESSIONAL_06',
    name: 'Flowzen ProcessMaker',
    desc: 'End-to-end process management platform and developer SDK. Currently in active development — building the core workflow engine, form builder and API integration layer.',
    tags: ['REACT', 'NODE.JS', 'SDK', 'IN BUILDING'],
    url: '#',
    inProgress: true,
  },
]

export const personalProjects: Project[] = [
  {
    id: 'ecommerce',
    num: 'PERSONAL_01',
    name: 'E-Commerce Dashboard',
    desc: 'Product management dashboard with cart system, JWT authentication, category filters & pagination. Built to explore Next.js 16 App Router and Zustand state architecture.',
    tags: ['NEXT.JS 16', 'TYPESCRIPT', 'ZUSTAND', 'TAILWIND'],
    url: '#',
  },
  {
    id: 'old-portfolio',
    num: 'PERSONAL_02',
    name: 'Old Portfolio',
    desc: 'The original aayu.com.np — a vanilla HTML/CSS/JS portfolio with Swiper.js carousel and W3.CSS. Where it all started.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'SWIPER.JS'],
    url: '/old-portfolio',
  },
  {
    id: 'portfolio',
    num: 'PERSONAL_03',
    name: 'This Portfolio',
    desc: "You're looking at it. Rebuilt from scratch in Next.js with Framer Motion animations, custom cursor, 3D card tilt, scroll reveals, and a matte black terminal aesthetic.",
    tags: ['NEXT.JS', 'FRAMER MOTION', 'TYPESCRIPT', 'SSG'],
    url: 'https://aayu.com.np',
  },
]

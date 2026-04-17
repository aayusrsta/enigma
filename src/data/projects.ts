export interface AppLinks {
  android?: string
  ios?: string
  web?: string
}

export interface Project {
  id: string
  num: string
  name: string
  desc: string
  tags: string[]
  url: string
  inProgress?: boolean
  color: string
  previewType: 'web' | 'mobile' | 'internal' | 'wip'
  previewUrl?: string
  screenshots?: string[]
  appLinks?: AppLinks
  year?: string
  role?: string
}

export const professionalProjects: Project[] = [
  {
    id: 'ncell',
    num: 'PROFESSIONAL_01',
    name: 'Ncell App',
    desc: "Feature engineering for Nepal's largest telecom mobile application. Deep linking, auto-renewal scheduler, OTP auth, referral system & widget support.",
    tags: ['REACT NATIVE', 'REDUX', 'FIREBASE', 'DEEP LINKING'],
    url: 'https://www.ncell.com.np/en/individual/ncellapp',
    color: '#0ea5e9',
    previewType: 'mobile',
    screenshots: [
      'https://webapi.ncell.com.np/upload/Others/ncellapp_download.png',
    ],
    appLinks: {
      web: 'https://www.ncell.com.np/en/individual/ncellapp',
    },
    year: '2024–Present',
    role: 'Software Engineer @ Amnil Technologies',
  },
  {
    id: 'interpreter',
    num: 'PROFESSIONAL_02',
    name: 'Interpreter Booking',
    desc: 'Full-stack booking platform with role-based access control, real-time WebSocket chat, GraphQL API and Firebase Cloud Messaging push notifications.',
    tags: ['NEXT.JS', 'NODE.JS', 'GRAPHQL', 'WEBSOCKET', 'FCM'],
    url: '#',
    color: '#6366f1',
    previewType: 'internal',
    year: '2023–2024',
    role: 'React Developer @ Smart Solutions Technology',
  },
  {
    id: 'pixel-revive',
    num: 'PROFESSIONAL_03',
    name: 'Pixel Revive',
    desc: 'AI-powered photo enhancement web app. Sharpening, noise reduction, color correction & text summarization powered by machine learning models.',
    tags: ['REACT.JS', 'RTK QUERY', 'REDUX TOOLKIT', 'AI/ML'],
    url: '#',
    color: '#f43f5e',
    previewType: 'internal',
    year: '2023–2024',
    role: 'React Developer @ Smart Solutions Technology',
  },
  {
    id: 'nepal-in-data',
    num: 'PROFESSIONAL_04',
    name: 'Nepal In Data',
    desc: 'Interactive data visualisation platform for Nepal. Built entire frontend architecture — dynamic charts, search & filter across complex datasets, lazy loading & code splitting.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'DATA VIZ'],
    url: 'https://nepalindata.com',
    color: '#10b981',
    previewType: 'web',
    previewUrl: 'https://nepalindata.com',
    appLinks: { web: 'https://nepalindata.com' },
    year: '2023–2024',
    role: 'React Developer @ Smart Solutions Technology',
  },
  {
    id: 'global-chautari',
    num: 'PROFESSIONAL_05',
    name: 'Global Chautari',
    desc: 'Community platform connecting Nepali users globally. Built and maintained core app features, integrating real-time capabilities and a clean mobile-first experience.',
    tags: ['REACT NATIVE', 'REDUX', 'NODE.JS'],
    url: 'https://play.google.com/store/apps/details?id=com.giblintranet&pli=1',
    color: '#f59e0b',
    previewType: 'mobile',
    screenshots: [
      'https://play-lh.googleusercontent.com/Eb2rPEMd692XA0-uD_u7WF1BCb5fESgtPeuQ3_HKgyxKUNLeRuz44Uw3X3S6lMpfi6KbH3eTdQtLaZirq3-0l7Y=w526-h296-rw',
      'https://play-lh.googleusercontent.com/pzB4B1n4dCV6WwKo404uGvznfqssipUoLDrY7PlYYOW4gDKvt4TLl24Q7ploDXKTV_kRySfKqDvdHkiBrJtven8=w526-h296-rw',
      'https://play-lh.googleusercontent.com/cKZdJy98SAfM8rYvY_oQVXLLCFIpULOJAuRRqUjGLhk1mDA3oJElxIxao1n2fuKD3M1aiclB_7ivDKMyD1q6vQ=w526-h296-rw',
      'https://play-lh.googleusercontent.com/P3bisHGyZdI4xkI6jbdGx1S1wiUcM6oGMb8ZbHpN3D50vHk_jM6xRHKvJGilwcmjRfyhSprxl0qSF8R2JSHilw=w526-h296-rw',
    ],
    appLinks: {
      android: 'https://play.google.com/store/apps/details?id=com.giblintranet&pli=1',
      ios: 'https://apps.apple.com/lb/app/global-chautari/id6742215910',
    },
    year: '2024–Present',
    role: 'Software Engineer @ Amnil Technologies',
  },
  {
    id: 'flowzen',
    num: 'PROFESSIONAL_06',
    name: 'Flowzen ProcessMaker',
    desc: 'End-to-end process management platform and developer SDK. Currently in active development — building the core workflow engine, form builder and API integration layer.',
    tags: ['REACT', 'NODE.JS', 'SDK', 'IN BUILDING'],
    url: '#',
    color: '#14b8a6',
    previewType: 'wip',
    inProgress: true,
    year: '2025–Present',
    role: 'Software Engineer @ Amnil Technologies',
  },
]

export const personalProjects: Project[] = [
  {
    id: 'ecommerce',
    num: 'PERSONAL_01',
    name: 'E-Commerce Dashboard',
    desc: 'Product management dashboard with cart system, JWT authentication, category filters & pagination. Built to explore Next.js 16 App Router and Zustand state architecture.',
    tags: ['NEXT.JS 16', 'TYPESCRIPT', 'ZUSTAND', 'TAILWIND'],
    url: 'https://ecommerce-dashboard-five-omega.vercel.app',
    color: '#8b5cf6',
    previewType: 'web',
    previewUrl: 'https://ecommerce-dashboard-five-omega.vercel.app',
    appLinks: { web: 'https://ecommerce-dashboard-five-omega.vercel.app' },
    year: '2024',
    role: 'Personal Project',
  },
  {
    id: 'old-portfolio',
    num: 'PERSONAL_02',
    name: 'Old Portfolio',
    desc: 'The original aayu.com.np — a vanilla HTML/CSS/JS portfolio with Swiper.js carousel and W3.CSS. Where it all started.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'SWIPER.JS'],
    url: '/old-portfolio',
    color: '#64748b',
    previewType: 'web',
    previewUrl: '/old-portfolio',
    appLinks: { web: 'https://aayu.com.np/old-portfolio' },
    year: '2020–2024',
    role: 'Personal Project',
  },
  {
    id: 'portfolio',
    num: 'PERSONAL_03',
    name: 'This Portfolio',
    desc: "You're looking at it. Rebuilt from scratch in Next.js with Framer Motion animations, custom cursor, 3D card tilt, scroll reveals, and a matte black terminal aesthetic.",
    tags: ['NEXT.JS', 'FRAMER MOTION', 'TYPESCRIPT', 'SSG'],
    url: 'https://aayu.com.np',
    color: '#5eead4',
    previewType: 'web',
    previewUrl: 'https://aayu.com.np',
    appLinks: { web: 'https://aayu.com.np' },
    year: '2025',
    role: 'Personal Project',
  },
]

export interface AppLinks {
  android?: string
  ios?: string
  web?: string
  admin?: string
}

export type Platform = 'mobile' | 'web'
export type Kind = 'work' | 'personal'

export interface Project {
  id: string
  /** Display index within its platform, e.g. MOBILE_03 (filled in below). */
  num: string
  name: string
  /** Who the product belongs to — bank, telecom, or "Personal". */
  client: string
  desc: string
  tags: string[]
  url: string
  inProgress?: boolean
  color: string
  platform: Platform
  kind: Kind
  previewType: 'web' | 'mobile' | 'internal' | 'wip'
  /** App icon shown on the device stage and in the client strip. */
  icon?: string
  cardImage?: string
  previewUrl?: string
  /** Phone screenshots, or a single laptop-sized capture for web apps. */
  screenshots?: string[]
  appLinks?: AppLinks
  year?: string
  role?: string
}

const AMNIL = 'Software Engineer @ Amnil Technologies'
const SMART = 'React Developer @ Smart Solutions Technology'
const PERSONAL = 'Personal Project — Full Stack'

const play = (id: string) => `https://play.google.com/store/apps/details?id=${id}`
const shots = (dir: string, n: number, ext = 'jpg') =>
  Array.from({ length: n }, (_, i) => `/apps/${dir}/shot${i + 1}.${ext}`)

type Draft = Omit<Project, 'num'>

const mobile: Draft[] = [
  {
    id: 'ncell',
    name: 'Ncell App',
    client: 'Ncell',
    desc: "Feature engineering for Nepal's largest telecom app. Deep linking from anywhere into app screens, auto-renewal scheduler, product referrals, resource exchange, OTP sign-in and home-screen widgets.",
    tags: ['REACT NATIVE', 'REDUX', 'FIREBASE', 'DEEP LINKING'],
    url: 'https://www.ncell.com.np/en/individual/ncellapp',
    color: '#a855f7',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/ncell/icon.png',
    cardImage: '/projects/ncell.png',
    screenshots: shots('ncell', 3),
    appLinks: {
      android: play('com.mventus.ncell.activity'),
      ios: 'https://apps.apple.com/np/app/ncell/id922410448',
    },
    year: '2024–Present',
    role: AMNIL,
  },
  {
    id: 'mbl-connect',
    name: 'MBL Connect',
    client: 'Machhapuchchhre Bank',
    desc: 'Staff super-app for Machhapuchchhre Bank. Biometric sign-in with device registration, leave requests with attachments and live balances, duty schedules, FOREX and interest rates, staff directory, news, kudos and an embedded Flowzen workflow screen.',
    tags: ['REACT NATIVE', 'REDUX TOOLKIT', 'ZUSTAND', 'BIOMETRICS', 'I18N'],
    url: play('com.mblconnect'),
    color: '#2f5bd3',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/mbl-connect/icon.png',
    screenshots: shots('mbl-connect', 4),
    appLinks: { android: play('com.mblconnect') },
    year: '2026',
    role: AMNIL,
  },
  {
    id: 'global-chautari',
    name: 'Global Chautari',
    client: 'Global IME Bank',
    desc: "Global IME Bank's staff app. Built the quick-chat drawer with live unread counts and presence dots on top of my own Rocket.Chat SDK, push notifications that match web, RigoHR deep links, chunked large-video uploads, leave, LMS and branch/ATM directories.",
    tags: ['REACT NATIVE', 'REDUX', 'ROCKET.CHAT', 'FIREBASE', 'WATERMELONDB'],
    url: play('com.giblintranet'),
    color: '#e11d48',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/global-chautari/icon.png',
    cardImage: '/projects/global-chautari.png',
    screenshots: shots('global-chautari', 3),
    appLinks: {
      android: play('com.giblintranet'),
      ios: 'https://apps.apple.com/np/app/global-chautari/id6777895784',
    },
    year: '2024–Present',
    role: AMNIL,
  },
  {
    id: 'nabil-gen-alpha',
    name: 'Nabil Gen Alpha',
    client: 'Nabil Bank',
    desc: 'Banking for kids and their parents. Parents create child accounts, set savings goals and tasks with rewards, and send money; kids track goals and payments from their own login. Biometric sign-in and Lottie-animated onboarding.',
    tags: ['REACT NATIVE', 'REDUX TOOLKIT', 'BIOMETRICS', 'LOTTIE'],
    url: play('com.amniltech.nabil.genalpha'),
    color: '#22c55e',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/nabil-gen-alpha/icon.png',
    screenshots: shots('nabil-gen-alpha', 4),
    appLinks: {
      android: play('com.amniltech.nabil.genalpha'),
      ios: 'https://apps.apple.com/np/app/nabil-gen-alpha/id1632860287',
    },
    year: '2024–2025',
    role: AMNIL,
  },
  {
    id: 'dh-care',
    name: 'DH Care',
    client: 'DishHome',
    desc: "DishHome's dealer and support app. Customer activation, package changes, pay-per-view, top-ups and credit extensions, dealer fund transfers, ISP trouble tickets and map-based field footprints.",
    tags: ['REACT NATIVE', 'FIREBASE', 'MAPS', 'NOTIFEE'],
    url: play('com.dishhome'),
    color: '#ef4444',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/dh-care/icon.png',
    screenshots: shots('dh-care', 3),
    appLinks: {
      android: play('com.dishhome'),
      ios: 'https://apps.apple.com/np/app/dh-care/id1455594686',
    },
    year: '2024–2025',
    role: AMNIL,
  },
  {
    id: 'epharmacy',
    name: 'ePharmacy',
    client: 'Mahendra ePharmacy',
    desc: 'Online pharmacy for Nepal. Product search and detail, prescription upload, saved delivery locations, medicine reminders, in-app messaging and over-the-air updates.',
    tags: ['REACT NATIVE', 'REDUX THUNK', 'MAPS', 'FIREBASE'],
    url: play('com.epharmacy_app'),
    color: '#14b8a6',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/epharmacy/icon.png',
    appLinks: {
      android: play('com.epharmacy_app'),
      ios: 'https://apps.apple.com/np/app/epharmacy-nepal/id1502948401',
    },
    year: '2025–2026',
    role: AMNIL,
  },
  {
    id: 'midtown',
    name: 'MidTown Cinemas',
    client: 'MidTown Cinemas',
    desc: 'Movie ticketing end to end: now showing and coming soon, seat-layout picker, payments, QR tickets, reservations and history, and the MTC Advantage loyalty programme.',
    tags: ['REACT NATIVE', 'REDUX SAGA', 'QR', 'PAYMENTS'],
    url: play('com.mobile.midtown'),
    color: '#f59e0b',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/midtown/icon.png',
    screenshots: shots('midtown', 3),
    appLinks: {
      android: play('com.mobile.midtown'),
      ios: 'https://apps.apple.com/np/app/midtown-cinemas/id1352271616',
    },
    year: '2025–2026',
    role: AMNIL,
  },
  {
    id: 'fcube',
    name: 'FCube Cinemas',
    client: 'FCube Cinemas',
    desc: 'Cinema app for FCube: movie details and showtimes, ticket booking, QR and PDF tickets, and push notifications for new releases.',
    tags: ['REACT NATIVE', 'ZUSTAND', 'REDUX SAGA', 'QR'],
    url: play('com.mobile.fcube'),
    color: '#8b5cf6',
    platform: 'mobile', kind: 'work', previewType: 'mobile',
    icon: '/apps/fcube/icon.png',
    screenshots: shots('fcube', 4),
    appLinks: {
      android: play('com.mobile.fcube'),
      ios: 'https://apps.apple.com/np/app/fcube-cinemas/id892689976',
    },
    year: '2025–2026',
    role: AMNIL,
  },
  {
    id: 'muktinath-isara',
    name: 'Muktinath ISARA',
    client: 'Muktinath Bikas Bank',
    desc: 'Internal loan-recovery app for field staff: recovery dashboards, employee lists, structured recovery forms and English/Nepali support.',
    tags: ['REACT NATIVE', 'REDUX TOOLKIT', 'I18N'],
    url: '#',
    color: '#0ea5e9',
    platform: 'mobile', kind: 'work', previewType: 'internal',
    icon: '/apps/muktinath-isara/icon.png',
    year: '2025–2026',
    role: AMNIL,
  },
  {
    id: 'flowzen',
    name: 'Flowzen Mobile',
    client: 'Amnil Technologies',
    desc: 'Mobile client for the Flowzen process platform, plus the SDK that embeds it in bank apps like MBL Connect. Dashboard KPIs and charts, task inbox with swipe-to-approve, dynamic process forms, drafts and reports.',
    tags: ['EXPO', 'REACT NATIVE', 'ZUSTAND', 'SDK'],
    url: '#',
    color: '#14b8a6',
    platform: 'mobile', kind: 'work', previewType: 'wip',
    inProgress: true,
    year: '2026–Present',
    role: AMNIL,
  },
  {
    id: 'rocketchat-sdk',
    name: 'Rocket.Chat RN SDK',
    client: 'Amnil Technologies',
    desc: 'A drop-in React Native SDK that embeds the full Rocket.Chat client in any host app: auth and theme bridges, isolated navigation, real-time DDP, push wiring, a setup CLI and Metro shims. Powers chat in Global Chautari.',
    tags: ['REACT NATIVE', 'TYPESCRIPT', 'SDK', 'DDP', 'CLI'],
    url: '#',
    color: '#f5455c',
    platform: 'mobile', kind: 'work', previewType: 'internal',
    year: '2026',
    role: AMNIL,
  },
]

const web: Draft[] = [
  {
    id: 'collective-finance',
    name: 'Collective Finance',
    client: 'Personal',
    desc: 'Savings-and-loan manager for community funds. Double-entry ledger in paisa, Bikram Sambat calendar that keeps itself up to date, nightly interest accrual, loans with review steps before money moves, screenshot proofs, and an installable iOS app.',
    tags: ['REACT', 'TYPESCRIPT', 'EXPRESS', 'NEON POSTGRES', 'PWA'],
    url: 'https://www.aayu.com.np/finance-management/',
    color: '#1f9d7a',
    platform: 'web', kind: 'personal', previewType: 'internal',
    screenshots: ['/apps/web-collective-finance.jpg'],
    appLinks: { web: 'https://www.aayu.com.np/finance-management/' },
    year: '2026',
    role: PERSONAL,
  },
  {
    id: 'sports-platform',
    name: 'XO Predict',
    client: 'Personal',
    desc: 'Multi-sport prediction platform with a user app and a full admin panel. Predict Football, F1, UFC, NBA and Cricket, score points and climb leaderboards. ESPN data sync, Vercel Blob uploads, TOTP 2FA and cookie auth that works on iOS Safari.',
    tags: ['REACT', 'NODE.JS', 'PRISMA', 'NEON POSTGRES', 'VERCEL'],
    url: 'https://sp-web-iota.vercel.app',
    color: '#2563eb',
    platform: 'web', kind: 'personal', previewType: 'web',
    cardImage: '/projects/sports.png',
    previewUrl: 'https://sp-web-iota.vercel.app',
    screenshots: ['/apps/web-sports.jpg'],
    appLinks: { web: 'https://sp-web-iota.vercel.app', admin: 'https://sp-admin-nu.vercel.app' },
    year: '2026',
    role: PERSONAL,
  },
  {
    id: 'guffgaaf',
    name: 'GuffGaaf',
    client: 'Personal',
    desc: 'Social platform built from scratch: 24-hour stories, real-time DMs over Socket.io, reactions, follows, notifications and OTP email verification. Glassmorphism UI with dark and light modes and live typing indicators.',
    tags: ['REACT', 'NODE.JS', 'SOCKET.IO', 'PRISMA', 'POSTGRESQL'],
    url: 'https://aayu.com.np/guffgaaf',
    color: '#a855f7',
    platform: 'web', kind: 'personal', previewType: 'web',
    cardImage: '/projects/guffgaaf.png',
    previewUrl: 'https://aayu.com.np/guffgaaf',
    screenshots: ['/apps/web-guffgaaf.jpg'],
    appLinks: { web: 'https://aayu.com.np/guffgaaf' },
    year: '2026',
    role: PERSONAL,
  },
  {
    id: 'love-melodies-studio',
    name: 'Love Melodies Studio',
    client: 'Personal',
    desc: 'Private AI studio for a YouTube music channel. Writes lyrics with Gemini, produces instrumentals, renders animated lyric videos with FFmpeg, generates thumbnails and uploads to YouTube daily — from one button.',
    tags: ['FASTAPI', 'REACT', 'GEMINI AI', 'FFMPEG', 'YOUTUBE API'],
    url: 'https://aayu.com.np/studio-love-melodies',
    color: '#ec4899',
    platform: 'web', kind: 'personal', previewType: 'internal',
    screenshots: ['/apps/web-love-melodies.jpg'],
    appLinks: { web: 'https://aayu.com.np/studio-love-melodies' },
    year: '2025',
    role: 'Personal Project',
  },
  {
    id: 'nepal-in-data',
    name: 'Nepal In Data',
    client: 'Nepal In Data',
    desc: 'Interactive data platform for Nepal. Built the whole frontend: dynamic charts, search and filters across large datasets, lazy loading and code splitting.',
    tags: ['JAVASCRIPT', 'DATA VIZ', 'HTML', 'CSS'],
    url: 'https://nepalindata.com',
    color: '#10b981',
    platform: 'web', kind: 'work', previewType: 'internal',
    cardImage: '/projects/nid.jpg',
    screenshots: ['/apps/web-nepal-in-data.jpg'],
    appLinks: { web: 'https://nepalindata.com' },
    year: '2023–2024',
    role: SMART,
  },
  {
    id: 'interpreter',
    name: 'Interpreter Booking',
    client: 'Smart Solutions',
    desc: 'Booking platform with role-based access, real-time WebSocket chat, a GraphQL API and Firebase push notifications.',
    tags: ['NEXT.JS', 'NODE.JS', 'GRAPHQL', 'WEBSOCKET', 'FCM'],
    url: '#',
    color: '#6366f1',
    platform: 'web', kind: 'work', previewType: 'internal',
    year: '2023–2024',
    role: SMART,
  },
  {
    id: 'pixel-revive',
    name: 'Pixel Revive',
    client: 'Smart Solutions',
    desc: 'AI photo enhancement: sharpening, noise reduction, colour correction and text summarisation powered by machine-learning models.',
    tags: ['REACT', 'RTK QUERY', 'REDUX TOOLKIT', 'AI/ML'],
    url: '#',
    color: '#f43f5e',
    platform: 'web', kind: 'work', previewType: 'internal',
    year: '2023–2024',
    role: SMART,
  },
  {
    id: 'ecommerce',
    name: 'KinMel Dashboard',
    client: 'Personal',
    desc: 'Product management dashboard with a cart, JWT auth, category filters and pagination — built to explore the Next.js App Router and Zustand.',
    tags: ['NEXT.JS', 'TYPESCRIPT', 'ZUSTAND', 'TAILWIND'],
    url: 'https://ecommerce-dashboard-five-omega.vercel.app',
    color: '#8b5cf6',
    platform: 'web', kind: 'personal', previewType: 'web',
    previewUrl: 'https://ecommerce-dashboard-five-omega.vercel.app',
    screenshots: ['/apps/web-ecommerce.jpg'],
    appLinks: { web: 'https://ecommerce-dashboard-five-omega.vercel.app' },
    year: '2024',
    role: 'Personal Project',
  },
  {
    id: 'portfolio',
    name: 'This Portfolio',
    client: 'Personal',
    desc: "You're looking at it. Next.js with a Three.js device showroom, a CSS3D project ring, Framer Motion and a matte-black terminal look.",
    tags: ['NEXT.JS', 'THREE.JS', 'FRAMER MOTION', 'SSG'],
    url: 'https://aayu.com.np',
    color: '#5eead4',
    platform: 'web', kind: 'personal', previewType: 'internal',
    screenshots: ['/apps/web-portfolio.jpg'],
    appLinks: { web: 'https://aayu.com.np' },
    year: '2025–2026',
    role: 'Personal Project',
  },
  {
    id: 'old-portfolio',
    name: 'Old Portfolio',
    client: 'Personal',
    desc: 'The original aayu.com.np — vanilla HTML, CSS and JavaScript with a Swiper.js carousel. Where it all started.',
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'SWIPER.JS'],
    url: 'https://aayu.com.np/old-portfolio',
    color: '#64748b',
    platform: 'web', kind: 'personal', previewType: 'web',
    previewUrl: 'https://aayu.com.np/old-portfolio',
    screenshots: ['/apps/web-old-portfolio.jpg'],
    appLinks: { web: 'https://aayu.com.np/old-portfolio' },
    year: '2020–2024',
    role: 'Personal Project',
  },
]

const number = (list: Draft[], prefix: string): Project[] =>
  list.map((p, i) => ({ ...p, num: `${prefix}_${String(i + 1).padStart(2, '0')}` }))

export const mobileProjects = number(mobile, 'MOBILE')
export const webProjects = number(web, 'WEB')
export const allProjects = [...mobileProjects, ...webProjects]

/** Clients whose apps are live in the stores, for the hero strip. */
export const shippedFor = mobileProjects.filter(p => p.icon && p.appLinks && (p.appLinks.android || p.appLinks.ios))

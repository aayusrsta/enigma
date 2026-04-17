export interface ExperienceItem {
  period: string
  role: string
  company: string
  location: string
  bullets: string[]
  tags: string[]
}

export const experience: ExperienceItem[] = [
  {
    period: '2024 — PRESENT',
    role: 'Software Engineer',
    company: 'Amnil Technologies Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Developed and maintained Ncell App features with React Native and React',
      'Built deep linking enabling seamless navigation from external sources into app screens',
      'Owned full sprint features: Auto Renewal, Product Referral, Resource Exchange, OTP auth, widgets',
    ],
    tags: ['REACT NATIVE', 'FIREBASE', 'REDUX'],
  },
  {
    period: '2023 — 2024',
    role: 'React Developer',
    company: 'Smart Solutions Technology Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Built web applications with React.js and Next.js, integrating Redux Toolkit',
      'Integrated WebSocket and GraphQL for a real-time chat system',
      'Translated UI/UX wireframes into responsive, performant interfaces',
    ],
    tags: ['NEXT.JS', 'GRAPHQL', 'WS'],
  },
  {
    period: 'JAN — MAY 2023',
    role: 'React Native Intern',
    company: 'Amnil Technologies Pvt. Ltd.',
    location: 'KATHMANDU, NEPAL',
    bullets: [
      'Intensive React Native training, built a complete e-commerce demo project independently',
      'Applied Redux Saga for state management and Axios for data fetching',
    ],
    tags: ['REACT NATIVE', 'REDUX SAGA'],
  },
]

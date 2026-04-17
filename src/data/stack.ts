export interface StackGroup {
  label: string
  skills: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'Frontend',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Redux Toolkit', 'React Query', 'Tailwind CSS', 'JavaScript', 'Axios'],
  },
  {
    label: 'Mobile',
    skills: ['React Native', 'Deep Linking', 'iOS Deploy', 'Play Store', 'App Signing', 'Firebase'],
  },
  {
    label: 'Backend & Cloud',
    skills: ['Node.js', 'Express.js', 'GraphQL', 'WebSocket', 'MongoDB', 'Docker', 'RabbitMQ', 'REST API'],
  },
]

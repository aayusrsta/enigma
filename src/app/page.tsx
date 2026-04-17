import React from 'react'
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
      </main>
    </>
  )
}

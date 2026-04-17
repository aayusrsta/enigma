import React from 'react'
import Cursor from '@/components/Cursor/Cursor'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Marquee from '@/components/Marquee/Marquee'
import Projects from '@/components/Projects/Projects'
import About from '@/components/About/About'
import Stack from '@/components/Stack/Stack'
import Experience from '@/components/Experience/Experience'
import Contact from '@/components/Contact/Contact'

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Stack />
        <Experience />
        <Contact />
      </main>
    </>
  )
}

'use client'
import React from 'react'
import { use3DTilt } from '@/hooks/use3DTilt'
import type { Project } from '@/data/projects'
import './ProjectCard.css'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const { ref, onMouseMove, onMouseLeave } = use3DTilt()
  const isWip = project.inProgress

  return (
    <div
      ref={ref}
      className={`proj-card${isWip ? ' proj-card--wip' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="proj-card__crawl" />
      <div className="proj-card__dot" />
      <div className="proj-card__num">{project.num}</div>
      <div className="proj-card__name">{project.name}</div>
      <div className="proj-card__desc">{project.desc}</div>
      <div className="proj-card__tags">
        {project.tags.map(tag => (
          <span key={tag} className="proj-card__tag">{tag}</span>
        ))}
      </div>
      {isWip ? (
        <div className="proj-card__wip-badge">◉ IN PROGRESS</div>
      ) : (
        <a
          className="proj-card__arrow"
          href={project.url}
          target={project.url.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          aria-label={`View ${project.name}`}
        >
          ↗
        </a>
      )}
    </div>
  )
}

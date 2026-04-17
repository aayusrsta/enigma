'use client'
import React from 'react'
import { use3DTilt } from '@/hooks/use3DTilt'
import type { Project } from '@/data/projects'
import './ProjectCard.css'

interface Props {
  project: Project
  onClick: (project: Project) => void
}

export default function ProjectCard({ project, onClick }: Props) {
  const { ref, onMouseMove, onMouseLeave } = use3DTilt()
  const isWip = project.inProgress

  const previewLabel = {
    web: '↗ WEB APP',
    mobile: '↗ MOBILE APP',
    internal: '🔒 INTERNAL',
    wip: '⚙ IN PROGRESS',
  }[project.previewType]

  return (
    <div
      ref={ref}
      className={`proj-card${isWip ? ' proj-card--wip' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(project)}
      aria-label={`View ${project.name} details`}
    >
      {/* Crawl line */}
      <div
        className="proj-card__crawl"
        style={{
          background: project.color,
          boxShadow: `0 0 12px ${project.color}88`,
        }}
      />

      {/* Corner bracket via inline style on a sibling div */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          borderTop: '0px solid transparent',
          borderRight: '0px solid transparent',
        }}
      />

      {/* Preview strip */}
      <div className="proj-card__preview">
        <div className="proj-card__preview-bg" />
        <div className="proj-card__preview-grid" />
        <div
          className="proj-card__preview-orb"
          style={{
            background: `radial-gradient(circle, ${project.color}22 0%, transparent 70%)`,
          }}
        />
        <span
          className="proj-card__preview-label"
          style={{
            color: project.color,
            background: `${project.color}11`,
            border: `1px solid ${project.color}33`,
          }}
        >
          {previewLabel}
        </span>
        <span className="proj-card__preview-explore">CLICK TO EXPLORE &#x2192;</span>
      </div>

      {/* Card body */}
      <div className="proj-card__body">
        <div className="proj-card__num">{project.num}</div>
        <div className="proj-card__name">{project.name}</div>
        <div className="proj-card__desc">{project.desc}</div>
        <div className="proj-card__tags">
          {project.tags.map(tag => (
            <span key={tag} className="proj-card__tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

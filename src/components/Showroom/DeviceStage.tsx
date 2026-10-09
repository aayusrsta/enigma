'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { Platform, Project } from '@/data/projects'
import type { StageApi } from './stage/createStage'

interface Props {
  platform: Platform
  project: Project | undefined
  /** The featured project of the other platform, shown on the parked device. */
  parked: Project | undefined
  shot: number
  dir: number
  onSelectPlatform: (p: Platform) => void
  onOpenProject: () => void
}

/**
 * The Three.js showroom. The scene is created once and driven imperatively;
 * React only tells it which platform and project to show. Without WebGL it
 * falls back to the project's first screenshot.
 */
export default function DeviceStage({ platform, project, parked, shot, dir, onSelectPlatform, onOpenProject }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<StageApi | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  // Latest values for the async init and the scene's callbacks.
  const latest = useRef({ platform, project, parked, shot, dir, onSelectPlatform, onOpenProject })
  useEffect(() => {
    latest.current = { platform, project, parked, shot, dir, onSelectPlatform, onOpenProject }
  })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    let api: StageApi | null = null

    import('./stage/createStage')
      .then(({ createStage }) =>
        createStage(mount, {
          onSelectPlatform: p => latest.current.onSelectPlatform(p),
          onOpenProject: () => latest.current.onOpenProject(),
        }),
      )
      .then(created => {
        if (disposed) return created.dispose()
        api = apiRef.current = created
        const l = latest.current
        created.setPlatform(l.platform)
        created.show(l.parked, 0, 1)
        created.show(l.project, l.shot, l.dir)
        setState('ready')
      })
      .catch(err => {
        console.error('[DeviceStage] 3D unavailable:', err)
        if (!disposed) setState('failed')
      })

    return () => {
      disposed = true
      api?.dispose()
      apiRef.current = null
    }
  }, [])

  useEffect(() => { apiRef.current?.setPlatform(platform) }, [platform])
  useEffect(() => { apiRef.current?.show(project, shot, dir) }, [project, shot, dir])
  useEffect(() => { apiRef.current?.show(parked, 0, 1) }, [parked])

  const fallback = project?.screenshots?.[0]

  return (
    <div className="stage" data-state={state}>
      <div ref={mountRef} className="stage-mount" aria-hidden="true" />
      {state === 'loading' && <div className="stage-loading"><span /></div>}
      {state === 'failed' && fallback && (
        <div className={`stage-fallback stage-fallback--${platform}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fallback} alt={`${project?.name} screenshot`} />
        </div>
      )}
    </div>
  )
}

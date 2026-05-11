import { useEffect, useRef } from 'react'

const BALL_SIZE = 18
const LED_SIZE = 14
const FLASH_DURATION = 90

export default function MetronomeCard({ song, color }) {
  const ballRef = useRef(null)
  const leftLedRef = useRef(null)
  const rightLedRef = useRef(null)

  useEffect(() => {
    const bpm = Math.max(20, Math.min(300, song.bpm))
    const period = (60 / bpm) * 1000
    const fullCycle = period * 2

    let startTime = null
    let prevPhase = -1
    let rafId

    const flash = (ref) => {
      const el = ref.current
      if (!el) return
      el.style.opacity = '1'
      el.style.boxShadow = `0 0 14px 5px ${color}`
      const id = setTimeout(() => {
        if (el) {
          el.style.opacity = '0.12'
          el.style.boxShadow = 'none'
        }
      }, FLASH_DURATION)
      return id
    }

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp
        flash(leftLedRef)
      }

      const elapsed = (timestamp - startTime) % fullCycle
      const phase = elapsed < period ? 0 : 1

      if (phase !== prevPhase) {
        if (phase === 1) flash(rightLedRef)
        else flash(leftLedRef)
        prevPhase = phase
      }

      const t = elapsed < period
        ? elapsed / period
        : 1 - (elapsed - period) / period

      const ball = ballRef.current
      if (ball) {
        ball.style.left = `calc(${t.toFixed(5)} * (100% - ${BALL_SIZE}px))`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [song.bpm, color])

  return (
    <div style={{
      borderBottom: '1px solid #111',
      borderLeft: `3px solid ${color}`,
      padding: '10px 16px 12px',
    }}>
      {/* Header row */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 28,
            fontWeight: 800,
            color,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            flexShrink: 0,
          }}>
            {song.bpm}
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: '#ddd',
            lineHeight: 1.4,
          }}>
            {song.name}
          </span>
        </div>
        {song.memo && (
          <span style={{
            fontSize: 12,
            color: '#888',
            lineHeight: 1.4,
            display: 'block',
            marginTop: 2,
          }}>
            {song.memo}
          </span>
        )}
      </div>

      {/* Metronome track */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: BALL_SIZE }}>
        {/* Left LED */}
        <div
          ref={leftLedRef}
          style={{
            width: LED_SIZE,
            height: LED_SIZE,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.12,
            flexShrink: 0,
            transition: 'none',
          }}
        />

        {/* Track */}
        <div style={{ flex: 1, position: 'relative', height: BALL_SIZE, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', inset: '50% 0', height: 1, background: '#1e1e1e' }} />
          <div
            ref={ballRef}
            style={{
              position: 'absolute',
              width: BALL_SIZE,
              height: BALL_SIZE,
              borderRadius: '50%',
              backgroundColor: color,
              top: 0,
              left: 0,
            }}
          />
        </div>

        {/* Right LED */}
        <div
          ref={rightLedRef}
          style={{
            width: LED_SIZE,
            height: LED_SIZE,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.12,
            flexShrink: 0,
            transition: 'none',
          }}
        />
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import NoSleep from 'nosleep.js'
import MetronomeCard from './MetronomeCard'

const CARD_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
]

export default function LiveView({ songs, parseErrors }) {
  useEffect(() => {
    const noSleep = new NoSleep()
    noSleep.enable()

    // モダンブラウザはNoSleep.jsがWake Lock APIを使用
    // 旧iOS等のフォールバックは内部で無音動画ループを使用
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !noSleep.isEnabled) {
        noSleep.enable()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      noSleep.disable()
    }
  }, [])

  if (songs.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#333' }}>
        <div style={{ fontSize: 48 }}>♩</div>
        <div style={{ fontSize: 14 }}>EDIT で曲を追加してください</div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {parseErrors.length > 0 && (
        <div style={{
          margin: '12px 16px 4px',
          padding: '10px 14px',
          background: '#150a0a',
          border: '1px solid #7f1d1d',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#f87171', fontWeight: 700, marginBottom: 6, letterSpacing: '0.05em' }}>
            ⚠ 認識できなかった行
          </div>
          {parseErrors.map((e, i) => (
            <div key={i} style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.7 }}>
              <span style={{ color: '#f87171', fontFamily: 'monospace' }}>行{e.lineNum}</span>
              {'  '}
              <span style={{ color: '#888', fontFamily: 'monospace' }}>{e.text}</span>
              {'  —  '}
              {e.reason}
            </div>
          ))}
        </div>
      )}
      {songs.map((song, index) => (
        <MetronomeCard
          key={song.id}
          song={song}
          color={CARD_COLORS[index % CARD_COLORS.length]}
        />
      ))}
    </div>
  )
}

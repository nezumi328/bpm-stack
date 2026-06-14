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

export default function LiveView({ songs }) {
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

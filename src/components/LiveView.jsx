import { useEffect } from 'react'
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
    let wakeLock = null
    const acquire = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch (_) {}
    }
    acquire()
    return () => { wakeLock?.release() }
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

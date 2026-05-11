import { useState, useEffect } from 'react'
import EditView from './components/EditView'
import LiveView from './components/LiveView'

const STORAGE_KEY = 'bpm-stack-input'

const DEFAULT_INPUT = `Norwegian Wood,187,6/8
A Hard Days Night,140,カウント始まり
Penny Lane,112,4/4シャッフル
Let It Be,76`

function parseInput(text) {
  return text
    .split('\n')
    .map((line, i) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return null
      const parts = trimmed.split(',').map(p => p.trim())

      const bpmIndex = parts.findIndex(p => /^\d+/.test(p))
      if (bpmIndex === -1) return null

      const bpmRaw = parts[bpmIndex]
      const bpmMatch = bpmRaw.match(/^(\d+)(.*)$/)
      const bpm = parseInt(bpmMatch[1])
      if (bpm < 20 || bpm > 300) return null

      const name = bpmIndex > 0
        ? parts.slice(0, bpmIndex).join(', ')
        : `Track ${i + 1}`
      const bpmExtra = bpmMatch[2].replace(/^[.,]/, '')
      const memo = [bpmExtra, ...parts.slice(bpmIndex + 1)].filter(Boolean).join(', ')

      return { id: `${i}-${bpm}-${name}`, name, bpm, memo }
    })
    .filter(Boolean)
}

export default function App() {
  const [view, setView] = useState('edit')
  const [inputText, setInputText] = useState(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_INPUT
  )
  const [songs, setSongs] = useState(() => parseInput(
    localStorage.getItem(STORAGE_KEY) || DEFAULT_INPUT
  ))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, inputText)
  }, [inputText])

  const handleUpdateStack = () => {
    setSongs(parseInput(inputText))
    setView('live')
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.15em', color: '#fff' }}>
            BPM STACK
          </h1>
          {view === 'edit' && (
            <p style={{ margin: 0, fontSize: 13, color: '#666', letterSpacing: '0.03em', marginTop: 2 }}>
              複数曲のBPMを一括表示！
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <TabButton active={view === 'edit'} onClick={() => setView('edit')}>EDIT</TabButton>
          <TabButton active={view === 'live'} onClick={handleUpdateStack}>LIVE</TabButton>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'edit'
          ? <EditView inputText={inputText} setInputText={setInputText} onUpdateStack={handleUpdateStack} />
          : <LiveView songs={songs} />
        }
      </main>

      <footer style={{
        height: 50,
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: '0.05em' }}>AD SPACE 320×50</span>
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 14px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.1em',
        background: active ? '#fff' : 'transparent',
        color: active ? '#000' : '#555',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

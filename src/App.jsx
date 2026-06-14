import { useState, useEffect } from 'react'
import EditView from './components/EditView'
import LiveView from './components/LiveView'

const STORAGE_KEY = 'bpm-stack-input'

const DEFAULT_INPUT = `Norwegian Wood,187,6/8
A Hard Days Night,140,カウント始まり
Penny Lane,112,4/4シャッフル
Let It Be,76`

function parseInput(text) {
  const errors = []
  const songs = text
    .split('\n')
    .map((line, i) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return null

      // 全角カンマ・読点・タブを半角カンマに正規化
      const normalized = trimmed.replace(/[，、\t]/g, ',')

      let parts
      if (normalized.includes(',')) {
        parts = normalized.split(',').map(p => p.trim()).filter(Boolean)
      } else {
        // カンマなし①：空白でBPM数字の手前を区切りとみなす
        const m = normalized.match(/^(.*?)\s+(\d+.*)$/)
        if (m) {
          parts = [m[1].trim(), m[2].trim()].filter(Boolean)
        } else {
          // カンマなし②：行末2〜3文字がBPMの数字の場合（例: "Norwegian Wood187", "Let It Be76"）
          const last3 = normalized.slice(-3)
          const rest3 = normalized.slice(0, -3).trim()
          const last2 = normalized.slice(-2)
          const rest2 = normalized.slice(0, -2).trim()
          if (/^\d{3}$/.test(last3) && !/^0/.test(last3) && rest3.length > 0 && /\D/.test(rest3)) {
            parts = [rest3, last3]
          } else if (/^\d{2}$/.test(last2) && !/^0/.test(last2) && rest2.length > 0 && /\D/.test(rest2)) {
            parts = [rest2, last2]
          } else {
            parts = [normalized]
          }
        }
      }

      const bpmIndex = parts.findIndex(p => /^\d+/.test(p))
      if (bpmIndex === -1) {
        errors.push({ lineNum: i + 1, text: trimmed, reason: 'BPMが見つかりません' })
        return null
      }

      const bpmRaw = parts[bpmIndex]
      const bpmMatch = bpmRaw.match(/^(\d+)(.*)$/)
      const bpm = parseInt(bpmMatch[1])
      if (bpm < 20 || bpm > 300) {
        errors.push({ lineNum: i + 1, text: trimmed, reason: `BPM ${bpm} は範囲外です（20〜300）` })
        return null
      }

      const name = bpmIndex > 0
        ? parts.slice(0, bpmIndex).join(', ')
        : `Track ${i + 1}`
      const bpmExtra = bpmMatch[2].replace(/^[.,\s]+/, '')
      const memo = [bpmExtra, ...parts.slice(bpmIndex + 1)].filter(Boolean).join(', ')

      // ④ キーを行番号ではなくコンテンツベースにする
      return { id: `${name}-${bpm}-${memo}`, name, bpm, memo }
    })
    .filter(Boolean)

  return { songs, errors }
}

export default function App() {
  const [view, setView] = useState('edit')
  const [inputText, setInputText] = useState(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_INPUT
  )
  const [songs, setSongs] = useState(
    () => parseInput(localStorage.getItem(STORAGE_KEY) || DEFAULT_INPUT).songs
  )
  const [parseErrors, setParseErrors] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, inputText)
  }, [inputText])

  const handleTextChange = (text) => {
    setInputText(text)
    if (parseErrors.length > 0) setParseErrors([])
  }

  const handleUpdateStack = () => {
    const { songs: parsed, errors } = parseInput(inputText)
    setSongs(parsed)
    setParseErrors(errors)
    setView('live')
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
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
          ? <EditView
              inputText={inputText}
              setInputText={handleTextChange}
              onUpdateStack={handleUpdateStack}
            />
          : <LiveView songs={songs} parseErrors={parseErrors} />
        }
      </main>

      <footer style={{
        height: 50,
        background: '#000',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <a
          href="https://www.youtube.com/user/up80k"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', lineHeight: 0 }}
        >
          <img
            src="/banner.png"
            alt="Music Studio レ"
            style={{ height: 50, width: 'auto', display: 'block' }}
          />
        </a>
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

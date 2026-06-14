export default function EditView({ inputText, setInputText, onUpdateStack, parseErrors }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, gap: 12, overflow: 'hidden' }}>
      <p style={{ margin: 0, fontSize: 12, color: '#444', lineHeight: 1.6 }}>
        フォーマット：<span style={{ color: '#666', fontFamily: 'monospace' }}>曲名,BPM,メモ</span>（カンマ区切り、改行で複数曲）
      </p>
      <textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder={'Let It Be,76\nNorwegian Wood,187.6/8\nA Hard Days Night,140,カウント始まり\nPenny Lane,112,4/4シャッフル'}
        spellCheck={false}
        style={{
          flex: 1,
          background: '#0d0d0d',
          color: '#e0e0e0',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 16,
          lineHeight: 1.8,
          padding: '14px 16px',
          borderRadius: 10,
          border: '1px solid #222',
          outline: 'none',
          resize: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = '#444' }}
        onBlur={e => { e.target.style.borderColor = '#222' }}
      />
      {parseErrors.length > 0 && (
        <div style={{
          padding: '10px 14px',
          background: '#150a0a',
          border: '1px solid #7f1d1d',
          borderRadius: 8,
          flexShrink: 0,
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
      <button
        onClick={onUpdateStack}
        style={{
          padding: '16px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '0.12em',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.target.style.background = '#e0e0e0' }}
        onMouseLeave={e => { e.target.style.background = '#fff' }}
      >
        STACK を更新 →
      </button>
    </div>
  )
}

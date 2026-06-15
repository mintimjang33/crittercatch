import { colorFor } from '../lib/colors'

const PEST_META = {
  roach: { emoji: '🪳', label: '바퀴벌레' },
  mosquito: { emoji: '🦟', label: '모기' },
  fly: { emoji: '🪰', label: '파리' },
}

export default function SummaryCards({ summary }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {Object.entries(PEST_META).map(([key, meta]) => {
        const s = summary[key] || { count: 0, changePct: 0 }
        const isDown = s.changePct <= 0
        const color = isDown ? colorFor('green').text : colorFor('amber').text
        return (
          <div
            key={key}
            style={{
              background: 'var(--color-background-primary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '12px 10px',
              textAlign: 'center',
              border: '0.5px solid var(--color-border-tertiary)',
            }}
          >
            <p style={{ fontSize: 20, margin: '0 0 2px' }}>{meta.emoji}</p>
            <p
              style={{
                fontSize: 11,
                color: 'var(--color-text-secondary)',
                margin: '0 0 4px',
              }}
            >
              {meta.label}
            </p>
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {s.count}
            </p>
            <p style={{ fontSize: 10, color, margin: '2px 0 0' }}>
              {isDown ? '▼' : '▲'} {Math.abs(s.changePct)}%
            </p>
          </div>
        )
      })}
    </div>
  )
}

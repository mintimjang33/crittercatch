import { colorFor } from '../lib/colors'
import { PEST_ICONS } from '../lib/icons'
import { translatePestLabel } from '../lib/i18n'

const PEST_KEYS = ['roach', 'mosquito', 'fly']

export default function SummaryCards({ summary, lang }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {PEST_KEYS.map((key) => {
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
            <i
              className={PEST_ICONS[key]}
              aria-hidden="true"
              style={{ fontSize: 20, color: 'var(--color-text-secondary)' }}
            />
            <p
              style={{
                fontSize: 11,
                color: 'var(--color-text-secondary)',
                margin: '4px 0 4px',
              }}
            >
              {translatePestLabel(lang, key)}
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

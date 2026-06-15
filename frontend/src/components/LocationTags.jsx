import { colorFor } from '../lib/colors'
import { translateLocation } from '../lib/i18n'

export default function LocationTags({ title, locations, lang }) {
  return (
    <div
      style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '12px 14px',
        border: '0.5px solid var(--color-border-tertiary)',
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          margin: '0 0 8px',
          fontWeight: 500,
        }}
      >
        {title}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
        {locations.map((loc) => {
          const c = colorFor(loc.color)
          return (
            <span
              key={loc.label}
              style={{
                background: c.bg,
                color: c.text,
                padding: '3px 8px',
                borderRadius: 10,
              }}
            >
              {translateLocation(lang, loc.label)} {loc.pct}%
            </span>
          )
        })}
      </div>
    </div>
  )
}

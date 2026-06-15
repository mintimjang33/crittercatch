import { colorFor } from '../lib/colors'
import LocationTags from './LocationTags'

export default function PestDetailCard({ detail }) {
  const c = colorFor(detail.color)
  const weekLabels = ['1주차', '2주차', '3주차', '4주차']

  return (
    <div>
      <div
        style={{
          background: c.bg,
          borderRadius: 'var(--border-radius-md)',
          padding: 14,
          border: `0.5px solid ${c.bar}`,
          marginBottom: 12,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: c.text, margin: '0 0 4px' }}>
          {detail.emoji} {detail.label} 박멸 {detail.eradicationPct}%
        </p>
        <div style={{ background: c.bar, borderRadius: 10, height: 6, margin: '6px 0' }}>
          <div
            style={{
              background: c.text,
              borderRadius: 10,
              height: 6,
              width: `${detail.eradicationPct}%`,
            }}
          />
        </div>
        <p style={{ fontSize: 11, color: c.text, margin: 0 }}>{detail.summaryText}</p>
      </div>

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
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            margin: '0 0 8px',
          }}
        >
          주간 감지 수
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--color-text-primary)',
          }}
        >
          {detail.weekly.map((val, i) => (
            <span key={i}>
              {weekLabels[i]} <b>{val}마리</b>
            </span>
          ))}
        </div>
      </div>

      <LocationTags title="주요 출몰 위치" locations={detail.locations} />
    </div>
  )
}

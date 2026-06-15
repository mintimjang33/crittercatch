import { colorFor } from '../lib/colors'
import { PEST_ICONS } from '../lib/icons'
import { translate, translatePestLabel } from '../lib/i18n'
import LocationTags from './LocationTags'

export default function PestDetailCard({ detail, lang }) {
  const c = colorFor(detail.color)
  const t = (key, ...args) => translate(lang, key, ...args)
  const label = translatePestLabel(lang, detail.key)

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
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: c.text,
            margin: '0 0 4px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <i className={PEST_ICONS[detail.key]} aria-hidden="true" style={{ fontSize: 16 }} />
          {label} {t('eradication', detail.eradicationPct)}
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
        <p style={{ fontSize: 11, color: c.text, margin: 0 }}>
          {detail.changePct <= 0
            ? t('summaryDown', detail.thisWeek, Math.abs(detail.changePct))
            : t('summaryUp', detail.thisWeek)}
        </p>
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
          {t('weeklyDetections')}
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
              {t('weekLabel', i + 1)} <b>{t('unitCount', val)}</b>
            </span>
          ))}
        </div>
      </div>

      <LocationTags title={t('mainOutbreakLocations')} locations={detail.locations} lang={lang} />
    </div>
  )
}

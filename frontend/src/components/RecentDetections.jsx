import { useState } from 'react'
import { PEST_ICONS } from '../lib/icons'
import { translate, translateLocation, timeAgo } from '../lib/i18n'

export default function RecentDetections({ items, lang }) {
  const [playingId, setPlayingId] = useState(null)
  const t = (key, ...args) => translate(lang, key, ...args)

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
        {t('recentDetectionsTitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => {
          const isPlaying = playingId === item.id
          const pestLabel = t('pestTypeLabel')[item.pest_type] || item.pest_type
          return (
            <div key={item.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <i
                    className={PEST_ICONS[item.pest_type]}
                    aria-hidden="true"
                    style={{ fontSize: 16, color: 'var(--color-text-secondary)', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-primary)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {pestLabel} · {translateLocation(lang, item.location)}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: 0 }}>
                      {timeAgo(lang, item.created_at)}
                    </p>
                  </div>
                </div>

                {item.video_url ? (
                  <button
                    onClick={() => setPlayingId(isPlaying ? null : item.id)}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 'var(--border-radius-md)',
                      border: '0.5px solid var(--color-border-secondary)',
                      background: isPlaying
                        ? 'var(--color-text-primary)'
                        : 'var(--color-background-primary)',
                      color: isPlaying
                        ? 'var(--color-background-primary)'
                        : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isPlaying ? t('closeVideo') : t('watchVideo')}
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                    {t('noVideo')}
                  </span>
                )}
              </div>

              {isPlaying && item.video_url && (
                <video
                  src={item.video_url}
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    borderRadius: 'var(--border-radius-md)',
                    marginTop: 4,
                    marginBottom: 4,
                    background: '#000',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <p
        style={{
          fontSize: 10,
          color: 'var(--color-text-tertiary)',
          margin: '8px 0 0',
          lineHeight: 1.5,
        }}
      >
        {t('videoHelp')}
      </p>
    </div>
  )
}

import { translate } from '../lib/i18n'

export default function DeviceStatus({ status, lang }) {
  const isNormal = status.status === 'normal'
  const t = (key, ...args) => translate(lang, key, ...args)

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <div
        style={{
          flex: 1,
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '10px 12px',
          border: '0.5px solid var(--color-border-tertiary)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
          {t('chemicalLevel')}
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            margin: '2px 0 0',
          }}
        >
          {status.chemicalLevel}%
        </p>
      </div>
      <div
        style={{
          flex: 1,
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '10px 12px',
          border: '0.5px solid var(--color-border-tertiary)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
          {t('battery')}
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            margin: '2px 0 0',
          }}
        >
          {status.batteryLevel}%
        </p>
      </div>
      <div
        style={{
          flex: 1,
          background: isNormal ? '#EAF3DE' : '#FCEBEB',
          borderRadius: 'var(--border-radius-md)',
          padding: '10px 12px',
          border: `0.5px solid ${isNormal ? '#C0DD97' : '#F7C1C1'}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: isNormal ? '#3B6D11' : '#A32D2D',
            margin: 0,
          }}
        >
          {t('deviceStatus')}
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: isNormal ? '#3B6D11' : '#A32D2D',
            margin: '2px 0 0',
          }}
        >
          {isNormal ? t('deviceNormal') : t('deviceWarning')}
        </p>
      </div>
    </div>
  )
}

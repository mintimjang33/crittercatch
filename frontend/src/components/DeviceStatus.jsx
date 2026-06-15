export default function DeviceStatus({ status }) {
  const isNormal = status.status === 'normal'

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
          약품 잔량
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
          배터리
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
          기기 상태
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: isNormal ? '#3B6D11' : '#A32D2D',
            margin: '2px 0 0',
          }}
        >
          {isNormal ? '정상' : '점검 필요'}
        </p>
      </div>
    </div>
  )
}

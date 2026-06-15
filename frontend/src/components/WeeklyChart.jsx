const BAR_COLORS = ['#F09595', '#FAC775', '#C0DD97', '#9FE1CB', '#85B7EB']

export default function WeeklyChart({ title, data }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div
      style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-md)',
        padding: 14,
        border: '0.5px solid var(--color-border-tertiary)',
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          margin: '0 0 10px',
          fontWeight: 500,
        }}
      >
        {title}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 70 }}>
        {data.map((d, i) => (
          <div
            key={d.week}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                width: '100%',
                background: BAR_COLORS[i % BAR_COLORS.length],
                borderRadius: '3px 3px 0 0',
                height: Math.max(4, (d.value / max) * 65),
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>
              {d.week}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

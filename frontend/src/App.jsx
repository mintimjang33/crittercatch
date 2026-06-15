import { useState } from 'react'
import { usePestData } from './lib/usePestData'
import SummaryCards from './components/SummaryCards'
import WeeklyChart from './components/WeeklyChart'
import LocationTags from './components/LocationTags'
import PestDetailCard from './components/PestDetailCard'
import DeviceStatus from './components/DeviceStatus'

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'roach', label: '바퀴벌레' },
  { key: 'mosquito', label: '모기' },
  { key: 'fly', label: '파리' },
]

export default function App() {
  const [tab, setTab] = useState('all')
  const { loading, usingDummy, summary, weeklyAll, locationsAll, pestDetail, deviceStatus } =
    usePestData()

  const allNormal =
    deviceStatus.status === 'normal' &&
    Object.values(summary).every((s) => s.changePct <= 0)

  return (
    <div style={{ maxWidth: 380, margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      <div
        style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 16,
          border: '0.5px solid var(--color-border-tertiary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
              CritterCatch · 스마트 해충 퇴치
            </p>
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                margin: '2px 0 0',
                color: 'var(--color-text-primary)',
              }}
            >
              우리집 해충 현황
            </p>
          </div>
          <div
            style={{
              background: allNormal ? '#EAF3DE' : '#FAEEDA',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              color: allNormal ? '#3B6D11' : '#854F0B',
              fontWeight: 500,
            }}
          >
            {allNormal ? '전체 정상' : '확인 필요'}
          </div>
        </div>

        {usingDummy && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-text-tertiary)',
              background: 'var(--color-background-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '6px 10px',
              marginBottom: 12,
            }}
          >
            Supabase가 연결되지 않아 샘플 데이터를 표시하고 있습니다. .env 설정 후
            새로고침하면 실시간 데이터로 전환됩니다.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 'var(--border-radius-md)',
                  border: '0.5px solid var(--color-border-secondary)',
                  fontSize: 12,
                  fontWeight: active ? 500 : 400,
                  background: active
                    ? 'var(--color-text-primary)'
                    : 'var(--color-background-primary)',
                  color: active
                    ? 'var(--color-background-primary)'
                    : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>불러오는 중...</p>
        ) : tab === 'all' ? (
          <div>
            <SummaryCards summary={summary} />
            <WeeklyChart title="이번달 전체 감지 추이" data={weeklyAll} />
            <LocationTags title="출몰 위치" locations={locationsAll} />
          </div>
        ) : (
          <PestDetailCard detail={pestDetail[tab]} />
        )}

        <DeviceStatus status={deviceStatus} />
      </div>
    </div>
  )
}

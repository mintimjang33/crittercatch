import { useState } from 'react'
import { usePestData } from './lib/usePestData'
import { translate, translatePestLabel } from './lib/i18n'
import SummaryCards from './components/SummaryCards'
import WeeklyChart from './components/WeeklyChart'
import LocationTags from './components/LocationTags'
import PestDetailCard from './components/PestDetailCard'
import DeviceStatus from './components/DeviceStatus'
import RecentDetections from './components/RecentDetections'
import DeviceSettings from './components/DeviceSettings'
import BabyCam from './components/BabyCam'

const TAB_KEYS = ['all', 'roach', 'mosquito', 'fly', 'baby']

export default function App() {
  const [tab, setTab] = useState('all')
  const [lang, setLang] = useState('ko')
  const [showSettings, setShowSettings] = useState(false)
  const {
    loading,
    usingDummy,
    summary,
    weeklyAll,
    locationsAll,
    pestDetail,
    deviceStatus,
    recentDetections,
    devices,
    babyStatus,
    updateDevice,
    addDevice,
  } = usePestData()

  const t = (key, ...args) => translate(lang, key, ...args)

  // 기기 상태(배터리/약품/오류)와 "신규 감지 발생"은 서로 다른 의미이므로 분리해서 표시합니다.
  const deviceNormal = deviceStatus.status === 'normal'
  const hasNewDetections = Object.values(summary).some((s) => s.changePct > 0)

  let badgeLabel
  let badgeBg
  let badgeColor
  if (!deviceNormal) {
    badgeLabel = t('statusAttention')
    badgeBg = '#FCEBEB'
    badgeColor = '#A32D2D'
  } else if (hasNewDetections) {
    badgeLabel = t('statusNewDetections')
    badgeBg = '#FAEEDA'
    badgeColor = '#854F0B'
  } else {
    badgeLabel = t('statusNormal')
    badgeBg = '#EAF3DE'
    badgeColor = '#3B6D11'
  }

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
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 16,
            gap: 8,
          }}
        >
          <div>
            <a
              href="/crittercatch/landing.html"
              style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, textDecoration: 'none', display: 'block' }}
            >
              {t('brand')}
            </a>
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                margin: '2px 0 0',
                color: 'var(--color-text-primary)',
              }}
            >
              {t('title')}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  background: badgeBg,
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 12,
                  color: badgeColor,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {badgeLabel}
              </div>
              <button
                onClick={() => setShowSettings((v) => !v)}
                aria-label={t('settingsTab')}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 'var(--border-radius-md)',
                  border: '0.5px solid var(--color-border-secondary)',
                  background: showSettings
                    ? 'var(--color-text-primary)'
                    : 'var(--color-background-primary)',
                  color: showSettings
                    ? 'var(--color-background-primary)'
                    : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-settings" aria-hidden="true" style={{ fontSize: 14 }} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['ko', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background:
                      lang === l ? 'var(--color-text-primary)' : 'var(--color-background-primary)',
                    color:
                      lang === l ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
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
            {t('dummyNotice')}
          </div>
        )}

        {showSettings ? (
          <DeviceSettings devices={devices} updateDevice={updateDevice} addDevice={addDevice} lang={lang} />
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {TAB_KEYS.map((key) => {
                const active = tab === key
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
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
                    {key === 'all' ? t('tabs').all : key === 'baby' ? t('tabs').baby : translatePestLabel(lang, key)}
                  </button>
                )
              })}
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{t('loading')}</p>
            ) : tab === 'all' ? (
              <div>
                <SummaryCards summary={summary} lang={lang} />
                <WeeklyChart title={t('monthlyTrend')} data={weeklyAll} lang={lang} />
                <LocationTags title={t('outbreakLocations')} locations={locationsAll} lang={lang} />
                <RecentDetections items={recentDetections} lang={lang} />
              </div>
            ) : tab === 'baby' ? (
              <BabyCam
                device={devices.find((d) => d.device_type === 'babycam') || devices.find((d) => d.device_id.includes('babycam'))}
                babyStatus={babyStatus}
                updateDevice={updateDevice}
                lang={lang}
              />
            ) : (
              <PestDetailCard detail={pestDetail[tab]} lang={lang} />
            )}
          </>
        )}

        <DeviceStatus status={deviceStatus} lang={lang} />

        {/* 하단 링크바 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            marginTop: 12,
            paddingTop: 12,
            borderTop: '0.5px solid var(--color-border-tertiary)',
          }}
        >
          <a
            href="/crittercatch/landing.html"
            style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            🏠 {lang === 'ko' ? '홈' : 'Home'}
          </a>
          <a
            href="/crittercatch/blog/"
            style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            📝 {lang === 'ko' ? '블로그' : 'Blog'}
          </a>
          <a
            href="/crittercatch/admin/"
            style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            ⚙️ {lang === 'ko' ? '관리자' : 'Admin'}
          </a>
        </div>
      </div>
    </div>
  )
}

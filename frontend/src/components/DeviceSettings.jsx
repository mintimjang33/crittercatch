import { useState } from 'react'
import { translate } from '../lib/i18n'
import { QRCodeSVG } from 'qrcode.react'

const LOCATION_OPTIONS = [
  { ko: '주방', en: 'Kitchen' },
  { ko: '욕실', en: 'Bathroom' },
  { ko: '거실', en: 'Living Room' },
  { ko: '침실', en: 'Bedroom' },
  { ko: '창문', en: 'Window' },
  { ko: '현관', en: 'Entrance' },
  { ko: '기타', en: 'Other' },
]

const MY_SERVICES = [
  {
    id: 'realtime',
    icon: '📹',
    nameKo: '실시간 영상',
    nameEn: 'Live Stream',
    descKo: '감지 시 실시간 영상 스트리밍',
    descEn: 'Live video streaming on detection',
    active: true,
  },
  {
    id: 'storage',
    icon: '☁️',
    nameKo: '영상 저장',
    nameEn: 'Video Storage',
    descKo: '감지 영상 클라우드 30일 보관',
    descEn: 'Cloud storage for 30 days',
    active: true,
  },
  {
    id: 'report',
    icon: '📋',
    nameKo: '위생 리포트',
    nameEn: 'Hygiene Report',
    descKo: '월간 위생 관리 보고서 자동 생성',
    descEn: 'Monthly hygiene report auto-generated',
    active: false,
  },
  {
    id: 'babycam',
    icon: '🍼',
    nameKo: '베이비캠',
    nameEn: 'Baby Cam',
    descKo: '아기 수면 모니터링 + 울음 감지',
    descEn: 'Baby sleep monitoring + cry detection',
    active: false,
  },
]

export default function DeviceSettings({ devices, updateDevice, addDevice, lang }) {
  const t = (key, ...args) => translate(lang, key, ...args)
  const [edits, setEdits] = useState({})
  const [savedId, setSavedId] = useState(null)
  const [qrDeviceId, setQrDeviceId] = useState(null)
  const [wifiDeviceId, setWifiDeviceId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDevice, setNewDevice] = useState({ device_id: '', display_name: '', location_label: '' })
  const [addError, setAddError] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPw, setWifiPw] = useState('')
  const [wifiSaved, setWifiSaved] = useState({})

  const ko = lang === 'ko'

  function getValue(device, field) {
    const edit = edits[device.device_id]
    if (edit && field in edit) return edit[field]
    return device[field] || ''
  }

  function handleChange(deviceId, field, value) {
    setEdits((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], [field]: value } }))
  }

  async function handleSave(device) {
    const edit = edits[device.device_id]
    if (!edit) return
    await updateDevice(device.device_id, edit)
    setSavedId(device.device_id)
    setTimeout(() => setSavedId(null), 1500)
  }

  async function handleAddDevice() {
    if (!newDevice.device_id.trim()) {
      setAddError(ko ? '기기 번호를 입력해주세요' : 'Device ID is required')
      return
    }
    if (devices.find((d) => d.device_id === newDevice.device_id.trim())) {
      setAddError(ko ? '이미 등록된 기기 번호입니다' : 'Device ID already exists')
      return
    }
    await addDevice({
      device_id: newDevice.device_id.trim(),
      display_name: newDevice.display_name.trim() || newDevice.device_id.trim(),
      location_label: newDevice.location_label.trim(),
      chemical_level: 100,
      battery_level: 100,
      status: 'normal',
    })
    setNewDevice({ device_id: '', display_name: '', location_label: '' })
    setAddError('')
    setShowAddForm(false)
  }

  function getQrUrl(deviceId) {
    return `https://mintimjang33.github.io/crittercatch/?register=${encodeURIComponent(deviceId)}`
  }

  function getConnectionStatus(device) {
    if (device.status === 'error') return { color: '#A32D2D', bg: '#FCEBEB', dot: '#E24B4A', label: ko ? '연결 끊김' : 'Disconnected' }
    if (device.status === 'warning') return { color: '#854F0B', bg: '#FAEEDA', dot: '#EF9F27', label: ko ? '신호 약함' : 'Weak Signal' }
    return { color: '#3B6D11', bg: '#EAF3DE', dot: '#1D9E75', label: ko ? '연결됨' : 'Connected' }
  }

  const cardStyle = {
    border: '0.5px solid var(--color-border-tertiary)',
    borderRadius: 'var(--border-radius-md)',
    padding: 12,
    marginBottom: 10,
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    color: 'var(--color-text-secondary)',
    marginBottom: 4,
  }

  const inputStyle = { width: '100%', fontSize: 12, marginBottom: 8 }

  const btnStyle = (active) => ({
    fontSize: 12,
    padding: '5px 12px',
    borderRadius: 'var(--border-radius-md)',
    border: '0.5px solid var(--color-border-secondary)',
    background: active ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
    color: active ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── 기기 설정 ── */}
      <div style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', border: '0.5px solid var(--color-border-tertiary)' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
            {ko ? '기기 설정' : 'Device Settings'}
          </p>
          <button
            onClick={() => { setShowAddForm((v) => !v); setAddError('') }}
            style={btnStyle(showAddForm)}
          >
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 12 }} />
            {ko ? '기기 추가' : 'Add Device'}
          </button>
        </div>

        {/* 기기 추가 폼 */}
        {showAddForm && (
          <div style={{ border: '0.5px solid #5DCAA5', borderRadius: 'var(--border-radius-md)', padding: 12, marginBottom: 12, background: '#E1F5EE' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#085041', margin: '0 0 10px' }}>
              {ko ? '새 기기 등록' : 'Register New Device'}
            </p>
            {[
              { field: 'device_id', ko: '기기 번호 *', en: 'Device ID *', ph: 'roach-kitchen-01' },
              { field: 'display_name', ko: '기기 이름', en: 'Device Name', ph: ko ? '주방 바퀴벌레 감지기' : 'Kitchen Roach Detector' },
            ].map(({ field, ko: lKo, en: lEn, ph }) => (
              <div key={field} style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#085041', marginBottom: 3 }}>{ko ? lKo : lEn}</label>
                <input type="text" value={newDevice[field]} onChange={(e) => setNewDevice((p) => ({ ...p, [field]: e.target.value }))} placeholder={ph} style={{ width: '100%', fontSize: 12 }} />
              </div>
            ))}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#085041', marginBottom: 3 }}>{ko ? '설치 위치' : 'Install Location'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc.ko}
                    onClick={() => setNewDevice((p) => ({ ...p, location_label: loc.ko }))}
                    style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      border: `0.5px solid ${newDevice.location_label === loc.ko ? '#1D9E75' : '#9FE1CB'}`,
                      background: newDevice.location_label === loc.ko ? '#1D9E75' : 'transparent',
                      color: newDevice.location_label === loc.ko ? '#fff' : '#085041',
                      cursor: 'pointer',
                    }}
                  >
                    {ko ? loc.ko : loc.en}
                  </button>
                ))}
              </div>
            </div>
            {addError && <p style={{ fontSize: 11, color: '#A32D2D', margin: '0 0 8px' }}>{addError}</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAddDevice} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#1D9E75', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                {ko ? '등록' : 'Register'}
              </button>
              <button onClick={() => { setShowAddForm(false); setAddError('') }} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                {ko ? '취소' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* 기기 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {devices.map((device) => {
            const hasEdit = !!edits[device.device_id]
            const justSaved = savedId === device.device_id
            const isQrOpen = qrDeviceId === device.device_id
            const isWifiOpen = wifiDeviceId === device.device_id
            const conn = getConnectionStatus(device)

            return (
              <div key={device.device_id} style={cardStyle}>

                {/* 기기 헤더: ID + 연결 상태 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                    {device.device_id}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: conn.bg, fontSize: 11, color: conn.color, fontWeight: 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: conn.dot, display: 'inline-block' }} />
                    {conn.label}
                  </div>
                </div>

                {/* 기기 이름 */}
                <label style={labelStyle}>{ko ? '기기 이름' : 'Device Name'}</label>
                <input type="text" value={getValue(device, 'display_name')} onChange={(e) => handleChange(device.device_id, 'display_name', e.target.value)} style={inputStyle} />

                {/* 설치 위치 — 버튼 선택 */}
                <label style={labelStyle}>{ko ? '설치 위치' : 'Install Location'}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {LOCATION_OPTIONS.map((loc) => {
                    const cur = getValue(device, 'location_label')
                    const sel = cur === loc.ko
                    return (
                      <button
                        key={loc.ko}
                        onClick={() => handleChange(device.device_id, 'location_label', loc.ko)}
                        style={{
                          fontSize: 11, padding: '4px 10px', borderRadius: 20,
                          border: `0.5px solid ${sel ? 'var(--color-text-primary)' : 'var(--color-border-secondary)'}`,
                          background: sel ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
                          color: sel ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {ko ? loc.ko : loc.en}
                      </button>
                    )
                  })}
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={() => handleSave(device)} disabled={!hasEdit} style={btnStyle(hasEdit)}>
                    {t('saveButton')}
                  </button>
                  <button onClick={() => setWifiDeviceId(isWifiOpen ? null : device.device_id)} style={btnStyle(isWifiOpen)}>
                    <i className="ti ti-wifi" aria-hidden="true" style={{ fontSize: 13 }} />
                    Wi-Fi
                  </button>
                  <button onClick={() => setQrDeviceId(isQrOpen ? null : device.device_id)} style={btnStyle(isQrOpen)}>
                    <i className="ti ti-qrcode" aria-hidden="true" style={{ fontSize: 13 }} />
                    QR
                  </button>
                  {justSaved && <span style={{ fontSize: 11, color: '#3B6D11' }}>{t('savedMessage')}</span>}
                </div>

                {/* Wi-Fi 설정 패널 */}
                {isWifiOpen && (
                  <div style={{ marginTop: 10, padding: 12, borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-wifi" aria-hidden="true" style={{ fontSize: 14, color: '#1D9E75' }} />
                      {ko ? 'Wi-Fi 연결 설정' : 'Wi-Fi Connection'}
                    </p>
                    <label style={labelStyle}>SSID ({ko ? '네트워크 이름' : 'Network Name'})</label>
                    <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder={ko ? '공유기 이름 입력' : 'Enter Wi-Fi name'} style={{ ...inputStyle, marginBottom: 6 }} />
                    <label style={labelStyle}>{ko ? '비밀번호' : 'Password'}</label>
                    <input type="password" value={wifiPw} onChange={(e) => setWifiPw(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, marginBottom: 8 }} />
                    <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 8, lineHeight: 1.5 }}>
                      {ko
                        ? '설정 저장 후 QR 코드를 기기에 스캔하면 자동으로 연결됩니다.'
                        : 'After saving, scan the QR code with the device to connect automatically.'}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => {
                          setWifiSaved((p) => ({ ...p, [device.device_id]: { ssid: wifiSsid, saved: true } }))
                          setWifiDeviceId(null)
                          setWifiSsid('')
                          setWifiPw('')
                        }}
                        style={{ fontSize: 12, padding: '5px 14px', borderRadius: 'var(--border-radius-md)', border: 'none', background: '#1D9E75', color: '#fff', cursor: 'pointer', fontWeight: 500 }}
                      >
                        {ko ? '저장' : 'Save'}
                      </button>
                      <button onClick={() => setWifiDeviceId(null)} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        {ko ? '취소' : 'Cancel'}
                      </button>
                    </div>
                    {wifiSaved[device.device_id]?.saved && (
                      <p style={{ fontSize: 11, color: '#3B6D11', marginTop: 6 }}>
                        ✓ {wifiSaved[device.device_id].ssid} {ko ? '저장됨' : 'saved'}
                      </p>
                    )}
                  </div>
                )}

                {/* QR 패널 */}
                {isQrOpen && (
                  <div style={{ marginTop: 10, padding: 12, borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '0 0 8px' }}>
                      {ko ? '스마트폰으로 스캔해서 기기를 등록하세요' : 'Scan with your smartphone to register'}
                    </p>
                    <div style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 8 }}>
                      <QRCodeSVG value={getQrUrl(device.device_id)} size={130} level="M" includeMargin={false} />
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '6px 0 0', wordBreak: 'break-all' }}>
                      {device.device_id}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {devices.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '20px 0' }}>
            {ko ? '등록된 기기가 없습니다' : 'No devices registered'}
          </p>
        )}
      </div>

      {/* ── 내 서비스 ── */}
      <div style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', border: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 12px', fontWeight: 500 }}>
          {ko ? '내 서비스' : 'My Services'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MY_SERVICES.map((svc) => (
            <div
              key={svc.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 'var(--border-radius-md)',
                background: svc.active ? 'var(--color-background-secondary)' : 'transparent',
                border: `0.5px solid ${svc.active ? 'var(--color-border-secondary)' : 'var(--color-border-tertiary)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{svc.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: svc.active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                    {ko ? svc.nameKo : svc.nameEn}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 1 }}>
                    {ko ? svc.descKo : svc.descEn}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: 10, padding: '2px 9px', borderRadius: 20, fontWeight: 500,
                background: svc.active ? '#EAF3DE' : 'var(--color-background-tertiary)',
                color: svc.active ? '#3B6D11' : 'var(--color-text-tertiary)',
              }}>
                {svc.active ? (ko ? '이용 중' : 'Active') : (ko ? '미이용' : 'Inactive')}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 10, lineHeight: 1.5 }}>
          {ko
            ? '서비스 변경은 랜딩페이지 → 요금제에서 가능합니다.'
            : 'To change services, visit the landing page → Pricing.'}
        </p>
        <a
          href="/crittercatch/landing.html#plans"
          style={{ display: 'inline-block', marginTop: 6, fontSize: 11, color: '#1D9E75', textDecoration: 'none' }}
        >
          {ko ? '요금제 보기 →' : 'View Plans →'}
        </a>
      </div>

    </div>
  )
}

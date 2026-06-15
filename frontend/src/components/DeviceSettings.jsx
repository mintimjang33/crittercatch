import { useState } from 'react'
import { translate } from '../lib/i18n'
import { QRCodeSVG } from 'qrcode.react'

const PLAN_OPTIONS = [
  { value: 'realtime', labelKo: '실시간 보기만', labelEn: 'Realtime Only', priceKo: '월 9,900원', priceEn: '₩9,900/mo' },
  { value: 'storage', labelKo: '영상 저장만', labelEn: 'Storage Only', priceKo: '월 14,900원', priceEn: '₩14,900/mo' },
  { value: 'both', labelKo: '실시간 + 저장', labelEn: 'Realtime + Storage', priceKo: '월 19,900원', priceEn: '₩19,900/mo' },
]

export default function DeviceSettings({ devices, updateDevice, addDevice, lang }) {
  const t = (key, ...args) => translate(lang, key, ...args)
  const [edits, setEdits] = useState({})
  const [savedId, setSavedId] = useState(null)
  const [qrDeviceId, setQrDeviceId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDevice, setNewDevice] = useState({ device_id: '', display_name: '', location_label: '', plan: 'both' })
  const [addError, setAddError] = useState('')
  const [planDeviceId, setPlanDeviceId] = useState(null)

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
      setAddError(lang === 'ko' ? '기기 번호를 입력해주세요' : 'Device ID is required')
      return
    }
    if (devices.find((d) => d.device_id === newDevice.device_id.trim())) {
      setAddError(lang === 'ko' ? '이미 등록된 기기 번호입니다' : 'Device ID already exists')
      return
    }
    await addDevice({
      device_id: newDevice.device_id.trim(),
      display_name: newDevice.display_name.trim() || newDevice.device_id.trim(),
      location_label: newDevice.location_label.trim(),
      plan: newDevice.plan,
      chemical_level: 100,
      battery_level: 100,
      status: 'normal',
    })
    setNewDevice({ device_id: '', display_name: '', location_label: '', plan: 'both' })
    setAddError('')
    setShowAddForm(false)
  }

  function getQrUrl(deviceId) {
    return `https://mintimjang33.github.io/crittercatch/?register=${encodeURIComponent(deviceId)}`
  }

  function getPlanLabel(plan) {
    const found = PLAN_OPTIONS.find((p) => p.value === plan)
    if (!found) return '-'
    return lang === 'ko' ? found.labelKo : found.labelEn
  }

  function getPlanPrice(plan) {
    const found = PLAN_OPTIONS.find((p) => p.value === plan)
    if (!found) return ''
    return lang === 'ko' ? found.priceKo : found.priceEn
  }

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
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
          {t('settingsTitle')}
        </p>
        <button
          onClick={() => { setShowAddForm((v) => !v); setAddError('') }}
          style={{
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-secondary)',
            background: showAddForm ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
            color: showAddForm ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 12 }} />
          {lang === 'ko' ? '기기 추가' : 'Add Device'}
        </button>
      </div>

      {/* 기기 추가 폼 */}
      {showAddForm && (
        <div
          style={{
            border: '0.5px solid #5DCAA5',
            borderRadius: 'var(--border-radius-md)',
            padding: 12,
            marginBottom: 14,
            background: '#E1F5EE',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 500, color: '#085041', margin: '0 0 10px' }}>
            {lang === 'ko' ? '새 기기 등록' : 'Register New Device'}
          </p>

          {[
            { field: 'device_id', labelKo: '기기 번호 *', labelEn: 'Device ID *', placeholder: 'roach-kitchen-01' },
            { field: 'display_name', labelKo: '기기 이름', labelEn: 'Device Name', placeholder: lang === 'ko' ? '주방 바퀴벌레 감지기' : 'Kitchen Roach Detector' },
            { field: 'location_label', labelKo: '설치 위치', labelEn: 'Install Location', placeholder: lang === 'ko' ? '주방' : 'Kitchen' },
          ].map(({ field, labelKo, labelEn, placeholder }) => (
            <div key={field} style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#085041', marginBottom: 3 }}>
                {lang === 'ko' ? labelKo : labelEn}
              </label>
              <input
                type="text"
                value={newDevice[field]}
                onChange={(e) => setNewDevice((prev) => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', fontSize: 12 }}
              />
            </div>
          ))}

          {/* 플랜 선택 */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#085041', marginBottom: 6 }}>
              {lang === 'ko' ? '영상 서비스 플랜' : 'Video Service Plan'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PLAN_OPTIONS.map((plan) => (
                <label
                  key={plan.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 'var(--border-radius-md)',
                    border: `0.5px solid ${newDevice.plan === plan.value ? '#1D9E75' : '#9FE1CB'}`,
                    background: newDevice.plan === plan.value ? '#fff' : 'transparent',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="plan"
                      value={plan.value}
                      checked={newDevice.plan === plan.value}
                      onChange={() => setNewDevice((prev) => ({ ...prev, plan: plan.value }))}
                      style={{ accentColor: '#1D9E75' }}
                    />
                    <span style={{ color: '#085041', fontWeight: newDevice.plan === plan.value ? 500 : 400 }}>
                      {lang === 'ko' ? plan.labelKo : plan.labelEn}
                    </span>
                  </div>
                  <span style={{ color: '#0F6E56', fontSize: 11 }}>
                    {lang === 'ko' ? plan.priceKo : plan.priceEn}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {addError && (
            <p style={{ fontSize: 11, color: '#A32D2D', margin: '0 0 8px' }}>{addError}</p>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAddDevice}
              style={{
                fontSize: 12,
                padding: '5px 14px',
                borderRadius: 'var(--border-radius-md)',
                border: 'none',
                background: '#1D9E75',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {lang === 'ko' ? '등록' : 'Register'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddError('') }}
              style={{
                fontSize: 12,
                padding: '5px 14px',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {lang === 'ko' ? '취소' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* 기기 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {devices.map((device) => {
          const hasEdit = !!edits[device.device_id]
          const justSaved = savedId === device.device_id
          const isQrOpen = qrDeviceId === device.device_id
          const isPlanOpen = planDeviceId === device.device_id

          return (
            <div
              key={device.device_id}
              style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: 10,
              }}
            >
              <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>
                {t('deviceIdLabel')}: {device.device_id}
              </p>

              {[
                { field: 'display_name', label: t('deviceNameLabel') },
                { field: 'location_label', label: t('deviceLocationLabel') },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    value={getValue(device, field)}
                    onChange={(e) => handleChange(device.device_id, field, e.target.value)}
                    style={{ width: '100%', fontSize: 12, marginBottom: 8 }}
                  />
                </div>
              ))}

              {/* 플랜 표시 + 변경 */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    {lang === 'ko' ? '영상 서비스' : 'Video Plan'}
                  </label>
                  <button
                    onClick={() => setPlanDeviceId(isPlanOpen ? null : device.device_id)}
                    style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 'var(--border-radius-md)',
                      border: '0.5px solid var(--color-border-secondary)',
                      background: 'transparent',
                      color: 'var(--color-text-tertiary)',
                      cursor: 'pointer',
                    }}
                  >
                    {isPlanOpen ? (lang === 'ko' ? '닫기' : 'Close') : (lang === 'ko' ? '변경' : 'Change')}
                  </button>
                </div>
                {!isPlanOpen ? (
                  <div
                    style={{
                      fontSize: 12,
                      padding: '6px 10px',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--color-background-secondary)',
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{getPlanLabel(device.plan || 'both')}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>
                      {getPlanPrice(device.plan || 'both')}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {PLAN_OPTIONS.map((plan) => {
                      const current = (edits[device.device_id]?.plan ?? device.plan ?? 'both')
                      const selected = current === plan.value
                      return (
                        <label
                          key={plan.value}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: 'var(--border-radius-md)',
                            border: `0.5px solid ${selected ? 'var(--color-text-primary)' : 'var(--color-border-secondary)'}`,
                            background: selected ? 'var(--color-background-secondary)' : 'transparent',
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <input
                              type="radio"
                              name={`plan-${device.device_id}`}
                              value={plan.value}
                              checked={selected}
                              onChange={() => handleChange(device.device_id, 'plan', plan.value)}
                            />
                            <span style={{ color: 'var(--color-text-primary)', fontWeight: selected ? 500 : 400 }}>
                              {lang === 'ko' ? plan.labelKo : plan.labelEn}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                            {lang === 'ko' ? plan.priceKo : plan.priceEn}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 저장 + QR 버튼 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSave(device)}
                  disabled={!hasEdit}
                  style={{
                    fontSize: 12,
                    padding: '5px 14px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background: hasEdit ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
                    color: hasEdit ? 'var(--color-background-primary)' : 'var(--color-text-tertiary)',
                    cursor: hasEdit ? 'pointer' : 'default',
                  }}
                >
                  {t('saveButton')}
                </button>
                <button
                  onClick={() => setQrDeviceId(isQrOpen ? null : device.device_id)}
                  style={{
                    fontSize: 12,
                    padding: '5px 10px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background: isQrOpen ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
                    color: isQrOpen ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <i className="ti ti-qrcode" aria-hidden="true" style={{ fontSize: 13 }} />
                  QR
                </button>
                {justSaved && (
                  <span style={{ fontSize: 11, color: '#3B6D11' }}>{t('savedMessage')}</span>
                )}
              </div>

              {/* QR 코드 패널 */}
              {isQrOpen && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-background-secondary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '0 0 8px' }}>
                    {lang === 'ko'
                      ? '스마트폰으로 QR 코드를 스캔해서 기기를 등록하세요'
                      : 'Scan QR code with your smartphone to register this device'}
                  </p>
                  <div style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 8 }}>
                    <QRCodeSVG
                      value={getQrUrl(device.device_id)}
                      size={140}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '8px 0 0', wordBreak: 'break-all' }}>
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
          {lang === 'ko' ? '등록된 기기가 없습니다' : 'No devices registered'}
        </p>
      )}
    </div>
  )
}

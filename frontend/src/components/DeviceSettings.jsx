import { useState } from 'react'
import { translate } from '../lib/i18n'

export default function DeviceSettings({ devices, updateDevice, lang }) {
  const t = (key, ...args) => translate(lang, key, ...args)
  const [edits, setEdits] = useState({})
  const [savedId, setSavedId] = useState(null)

  function getValue(device, field) {
    const edit = edits[device.device_id]
    if (edit && field in edit) return edit[field]
    return device[field] || ''
  }

  function handleChange(deviceId, field, value) {
    setEdits((prev) => ({
      ...prev,
      [deviceId]: { ...prev[deviceId], [field]: value },
    }))
  }

  async function handleSave(device) {
    const edit = edits[device.device_id]
    if (!edit) return
    await updateDevice(device.device_id, edit)
    setSavedId(device.device_id)
    setTimeout(() => setSavedId(null), 1500)
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
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          margin: '0 0 10px',
          fontWeight: 500,
        }}
      >
        {t('settingsTitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {devices.map((device) => {
          const hasEdit = !!edits[device.device_id]
          const justSaved = savedId === device.device_id
          return (
            <div
              key={device.device_id}
              style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: 10,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: 'var(--color-text-tertiary)',
                  margin: '0 0 8px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t('deviceIdLabel')}: {device.device_id}
              </p>

              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 4,
                }}
              >
                {t('deviceNameLabel')}
              </label>
              <input
                type="text"
                value={getValue(device, 'display_name')}
                onChange={(e) => handleChange(device.device_id, 'display_name', e.target.value)}
                style={{ width: '100%', fontSize: 12, marginBottom: 8 }}
              />

              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 4,
                }}
              >
                {t('deviceLocationLabel')}
              </label>
              <input
                type="text"
                value={getValue(device, 'location_label')}
                onChange={(e) => handleChange(device.device_id, 'location_label', e.target.value)}
                style={{ width: '100%', fontSize: 12, marginBottom: 8 }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleSave(device)}
                  disabled={!hasEdit}
                  style={{
                    fontSize: 12,
                    padding: '5px 14px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background: hasEdit
                      ? 'var(--color-text-primary)'
                      : 'var(--color-background-secondary)',
                    color: hasEdit
                      ? 'var(--color-background-primary)'
                      : 'var(--color-text-tertiary)',
                    cursor: hasEdit ? 'pointer' : 'default',
                  }}
                >
                  {t('saveButton')}
                </button>
                {justSaved && (
                  <span style={{ fontSize: 11, color: '#3B6D11' }}>{t('savedMessage')}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { translate, timeAgo } from '../lib/i18n'

// 베이비캠 탭: 실시간 영상 + 무전기 방식 양방향 오디오(누르고 말하기)
//
// - 실시간 영상: 라즈베리파이에서 mjpg-streamer 등으로 송출하는 MJPEG/HLS 주소를
//   <img>/<video> 태그로 그대로 표시합니다.
// - 양방향 오디오: 버튼을 누르고 있는 동안 getUserMedia로 마이크를 캡처해
//   WebSocket으로 오디오 청크를 전송합니다. 라즈베리파이 쪽에서 이 WebSocket을
//   받아 스피커로 재생하는 서버(예: 간단한 Python 스크립트)가 필요합니다.
export default function BabyCam({ device, babyStatus, updateDevice, lang }) {
  const t = (key, ...args) => translate(lang, key, ...args)
  const ko = lang === 'ko'

  const [streamError, setStreamError] = useState(false)
  const [talking, setTalking] = useState(false)
  const [talkError, setTalkError] = useState('')
  const [editing, setEditing] = useState(false)
  const [streamUrl, setStreamUrl] = useState(device?.stream_url || '')
  const [talkUrl, setTalkUrl] = useState(device?.talk_ws_url || '')
  const [savedMsg, setSavedMsg] = useState(false)

  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    setStreamUrl(device?.stream_url || '')
    setTalkUrl(device?.talk_ws_url || '')
  }, [device?.stream_url, device?.talk_ws_url])

  // 컴포넌트가 사라질 때 마이크/연결 정리
  useEffect(() => {
    return () => stopTalk()
  }, [])

  async function startTalk() {
    if (!device?.talk_ws_url) {
      setTalkError(t('talkUrlMissing'))
      return
    }
    setTalkError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ws = new WebSocket(device.talk_ws_url)
      ws.binaryType = 'arraybuffer'
      wsRef.current = ws

      ws.onopen = () => {
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data)
          }
        }
        recorder.start(250) // 250ms 단위로 오디오 청크 전송
        recorderRef.current = recorder
      }

      ws.onerror = () => {
        setTalkError(t('talkUrlMissing'))
        stopTalk()
      }

      setTalking(true)
    } catch (err) {
      console.error('마이크 접근 실패', err)
      setTalkError(t('micPermissionError'))
      setTalking(false)
    }
  }

  function stopTalk() {
    if (recorderRef.current) {
      try {
        recorderRef.current.stop()
      } catch {
        // 이미 정지된 경우 무시
      }
      recorderRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setTalking(false)
  }

  async function handleSaveSettings() {
    await updateDevice(device.device_id, {
      stream_url: streamUrl.trim(),
      talk_ws_url: talkUrl.trim(),
    })
    setStreamError(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 1500)
    setEditing(false)
  }

  const sleeping = babyStatus?.sleep_status === 'sleeping'
  const lastCryAt = babyStatus?.last_cry_at

  const cardStyle = {
    background: 'var(--color-background-primary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '12px 14px',
    border: '0.5px solid var(--color-border-tertiary)',
    marginBottom: 12,
  }

  if (!device) {
    return (
      <div style={cardStyle}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
          {ko
            ? '등록된 베이비캠 기기가 없습니다. 설정(⚙️)에서 device_id에 "babycam"이 포함된 기기를 추가해주세요.'
            : 'No baby cam device registered. Add a device with "babycam" in its device_id from Settings (⚙️).'}
        </p>
      </div>
    )
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    color: 'var(--color-text-secondary)',
    marginBottom: 4,
  }

  const inputStyle = { width: '100%', fontSize: 12, marginBottom: 8 }

  return (
    <div>
      {/* ── 실시간 영상 ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
            {t('liveStream')}
          </p>
          {device?.stream_url && !streamError && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10,
                padding: '2px 9px',
                borderRadius: 20,
                background: '#EAF3DE',
                color: '#3B6D11',
                fontWeight: 500,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
              {t('streamLive')}
            </span>
          )}
        </div>

        <div
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            borderRadius: 'var(--border-radius-md)',
            background: '#14140f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {device?.stream_url && !streamError ? (
            <img
              src={device.stream_url}
              alt={t('babyCamTitle')}
              onError={() => setStreamError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <p style={{ fontSize: 12, color: '#9b9a93', textAlign: 'center', padding: '0 20px', margin: 0 }}>
              <i className="ti ti-video-off" aria-hidden="true" style={{ fontSize: 22, display: 'block', marginBottom: 6 }} />
              {streamError ? t('streamLoadError') : t('streamNotConfigured')}
            </p>
          )}
        </div>
      </div>

      {/* ── 수면 모니터링 / 울음 감지 ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ ...cardStyle, flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('sleepStatus')}
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', margin: '2px 0 0' }}>
            {sleeping ? `😴 ${t('sleepStatusSleeping')}` : `🙂 ${t('sleepStatusAwake')}`}
          </p>
        </div>
        <div style={{ ...cardStyle, flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('cryDetection')}
          </p>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', margin: '2px 0 0' }}>
            {lastCryAt ? t('lastCryAt')(timeAgo(lang, lastCryAt)) : t('noCryDetected')}
          </p>
        </div>
      </div>

      {/* ── 누르고 말하기 (무전기) ── */}
      <div style={cardStyle}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 10px', fontWeight: 500 }}>
          {t('babyCamTitle')}
        </p>
        <button
          onMouseDown={startTalk}
          onMouseUp={stopTalk}
          onMouseLeave={() => talking && stopTalk()}
          onTouchStart={(e) => { e.preventDefault(); startTalk() }}
          onTouchEnd={(e) => { e.preventDefault(); stopTalk() }}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 'var(--border-radius-md)',
            border: 'none',
            background: talking ? '#1D9E75' : 'var(--color-text-primary)',
            color: 'var(--color-background-primary)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <i className={talking ? 'ti ti-microphone' : 'ti ti-microphone-2'} aria-hidden="true" style={{ fontSize: 18 }} />
          {talking ? t('talkingNow') : t('pressToTalk')}
        </button>
        <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '8px 0 0', lineHeight: 1.5 }}>
          {t('talkReleaseHint')}
        </p>
        {talkError && (
          <p style={{ fontSize: 11, color: '#A32D2D', margin: '6px 0 0' }}>{talkError}</p>
        )}
      </div>

      {/* ── 연결 설정 ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing ? 10 : 0 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
            {t('streamSettingsTitle')}
          </p>
          <button
            onClick={() => setEditing((v) => !v)}
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-secondary)',
              background: editing ? 'var(--color-text-primary)' : 'var(--color-background-secondary)',
              color: editing ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            <i className="ti ti-settings" aria-hidden="true" style={{ fontSize: 12, marginRight: 4 }} />
            {ko ? '편집' : 'Edit'}
          </button>
        </div>

        {editing && (
          <>
            <label style={labelStyle}>{t('streamUrlLabel')}</label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="http://raspberrypi.local:8080/?action=stream"
              style={inputStyle}
            />
            <label style={labelStyle}>{t('talkUrlLabel')}</label>
            <input
              type="text"
              value={talkUrl}
              onChange={(e) => setTalkUrl(e.target.value)}
              placeholder="ws://raspberrypi.local:8765"
              style={inputStyle}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleSaveSettings}
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
                {t('saveButton')}
              </button>
              {savedMsg && <span style={{ fontSize: 11, color: '#3B6D11' }}>{t('savedMessage')}</span>}
            </div>
          </>
        )}

        <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: editing ? '10px 0 0' : '8px 0 0', lineHeight: 1.5 }}>
          {t('babyCamHelp')}
        </p>
      </div>
    </div>
  )
}

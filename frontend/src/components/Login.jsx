import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import { translate } from '../lib/i18n'

// 이메일/비밀번호 기반 로그인 화면.
// Supabase Auth로 로그인하기 전에는 대시보드 데이터를 볼 수 없습니다 (App.jsx에서 게이트).
export default function Login({ lang }) {
  const { signInWithPassword, signUp } = useAuth()
  const t = (key, ...args) => translate(lang, key, ...args)

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const action = mode === 'signin' ? signInWithPassword : signUp
    const { error } = await action(email.trim(), password)

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    if (mode === 'signup') {
      setInfo(t('signupCheckEmail'))
    }
  }

  const inputStyle = {
    width: '100%',
    fontSize: 13,
    padding: '8px 10px',
    marginBottom: 10,
    borderRadius: 'var(--border-radius-md)',
    border: '0.5px solid var(--color-border-secondary)',
    background: 'var(--color-background-primary)',
    color: 'var(--color-text-primary)',
  }

  return (
    <div style={{ maxWidth: 380, margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      <div
        style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 24,
          border: '0.5px solid var(--color-border-tertiary)',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>
          {t('brand')}
        </p>
        <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
          {t('loginTitle')}
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '0 0 16px' }}>
          {t('loginSubtitle')}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {t('emailLabel')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />

          <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {t('passwordLabel')}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '10px 0',
              borderRadius: 'var(--border-radius-md)',
              border: 'none',
              background: 'var(--color-text-primary)',
              color: 'var(--color-background-primary)',
              fontSize: 13,
              fontWeight: 500,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {mode === 'signin' ? t('signInButton') : t('signUpButton')}
          </button>
        </form>

        {error && (
          <p style={{ fontSize: 11, color: '#A32D2D', margin: '10px 0 0' }}>{error}</p>
        )}
        {info && (
          <p style={{ fontSize: 11, color: '#3B6D11', margin: '10px 0 0' }}>{info}</p>
        )}

        <button
          onClick={() => { setMode((m) => (m === 'signin' ? 'signup' : 'signin')); setError(''); setInfo('') }}
          style={{
            display: 'block',
            margin: '14px auto 0',
            fontSize: 11,
            color: 'var(--color-text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {mode === 'signin' ? t('switchToSignup') : t('switchToSignin')}
        </button>
      </div>
    </div>
  )
}

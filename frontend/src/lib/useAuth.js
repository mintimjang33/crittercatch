import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Supabase Auth 세션 관리 훅.
// Supabase가 연결되지 않은 로컬/더미 모드에서는 항상 loading=false, session=null이며
// App.jsx에서 이 경우 로그인 화면 없이 더미 데이터로 동작합니다 (개발용).
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(!!supabase)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signInWithPassword(email, password) {
    if (!supabase) return { error: new Error('Supabase가 연결되지 않았습니다.') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email, password) {
    if (!supabase) return { error: new Error('Supabase가 연결되지 않았습니다.') }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return { session, loading, signInWithPassword, signUp, signOut }
}

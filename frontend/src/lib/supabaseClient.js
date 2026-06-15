import { createClient } from '@supabase/supabase-js'

// .env 파일에 아래 두 값을 채워주세요 (Supabase 프로젝트 Settings > API 에서 확인)
// VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJxxxxxxxx...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요. ' +
    '설정 전까지는 더미 데이터로 동작합니다.'
  )
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

-- ============================================================
-- CritterCatch 마이그레이션 v4
-- migration_v3.sql까지 실행한 프로젝트라면, 이 파일을 SQL Editor에서
-- 추가로 실행하세요 (기존 데이터는 유지됩니다).
--
-- 목적: 지금까지는 anon key만 있으면 누구나 대시보드 데이터를 읽을 수 있었습니다.
-- 이 마이그레이션 이후에는 "로그인한 사용자만" 데이터를 읽을 수 있고,
-- 기기(라즈베리파이)는 그대로 anon key로 데이터를 기록(insert/update)할 수 있습니다.
--
-- 주의: 이 마이그레이션을 실행하면 프론트엔드에 로그인 화면이 필요합니다
-- (frontend/src/components/Login.jsx 포함된 버전 사용).
-- ============================================================

-- 1) detections: 읽기는 로그인 사용자만, 기기의 insert는 그대로 허용
drop policy if exists "Allow public read on detections" on detections;
create policy "Allow authenticated read on detections"
  on detections for select
  using (auth.role() = 'authenticated');

-- 2) device_status: 읽기는 로그인 사용자만, 기기의 insert/update는 그대로 허용
drop policy if exists "Allow public read on device_status" on device_status;
create policy "Allow authenticated read on device_status"
  on device_status for select
  using (auth.role() = 'authenticated');

-- 3) baby_status: 읽기는 로그인 사용자만, 기기의 insert/update는 그대로 허용
drop policy if exists "Allow public read on baby_status" on baby_status;
create policy "Allow authenticated read on baby_status"
  on baby_status for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 로그인 계정 만들기
-- ============================================================
-- 1. 배포된 대시보드 페이지에서 "처음이신가요? 계정 만들기"로 본인 이메일/비밀번호 등록
--    (Supabase 프로젝트의 Authentication > Settings 에서 이메일 확인을 끄면
--     가입 즉시 로그인 가능. 켜둔 경우 확인 메일의 링크를 눌러야 합니다)
-- 2. 본인 계정 생성 후, Authentication > Settings 에서
--    "Allow new users to sign up"을 꺼두면 더 이상 다른 사람이 계정을 만들 수 없습니다.
-- ============================================================

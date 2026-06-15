-- ============================================================
-- CritterCatch 마이그레이션 v2
-- 이미 schema.sql을 실행한 프로젝트라면, 이 파일을 SQL Editor에서
-- 추가로 실행하세요 (기존 데이터는 유지됩니다).
--
-- 추가 내용:
--   1) detections 테이블에 영상 URL 컬럼 추가
--   2) device_status 테이블에 위치/별칭 컬럼 추가 + 수정 권한
--   3) 감지 영상 저장용 Storage 버킷 생성 및 정책
-- ============================================================

-- 1) 감지 영상 URL 컬럼
alter table detections
  add column if not exists video_url text;

-- 2) 기기 설정 컬럼 (대시보드 설정 화면에서 직접 수정)
alter table device_status
  add column if not exists display_name text,
  add column if not exists location_label text;

-- 기존 행에 기본값 채우기 (없으면 device_id를 표시명으로 사용)
update device_status
set display_name = coalesce(display_name, device_id)
where display_name is null;

-- device_status를 대시보드에서 직접 수정(update)할 수 있도록 정책 추가
-- (이미 schema.sql에 "Allow public update on device_status" 정책이 있다면 중복 생성되지 않도록 먼저 삭제)
drop policy if exists "Allow public update on device_status" on device_status;
create policy "Allow public update on device_status"
  on device_status for update
  using (true)
  with check (true);

-- ============================================================
-- 3) 감지 영상 저장용 Storage 버킷
-- ============================================================
-- 버킷 생성 (이미 있으면 무시)
insert into storage.buckets (id, name, public)
values ('detection-videos', 'detection-videos', true)
on conflict (id) do nothing;

-- 누구나 읽기 가능 (영상은 public 버킷이라 URL만 알면 재생 가능)
drop policy if exists "Public read detection videos" on storage.objects;
create policy "Public read detection videos"
  on storage.objects for select
  using (bucket_id = 'detection-videos');

-- 기기(anon key)가 영상을 업로드할 수 있도록 허용
drop policy if exists "Public upload detection videos" on storage.objects;
create policy "Public upload detection videos"
  on storage.objects for insert
  with check (bucket_id = 'detection-videos');

-- ============================================================
-- CritterCatch 마이그레이션 v3
-- migration_v2.sql까지 실행한 프로젝트라면, 이 파일을 SQL Editor에서
-- 추가로 실행하세요 (기존 데이터는 유지됩니다).
--
-- 추가 내용:
--   1) device_status 테이블에 device_type / 베이비캠 연결 주소 컬럼 추가
--   2) baby_status 테이블 생성 (수면 상태 / 울음 감지 / 실내온도)
--   3) baby_status를 Realtime으로 구독할 수 있도록 활성화
-- ============================================================

-- 1) 기기 종류 + 베이비캠 연결 주소
alter table device_status
  add column if not exists device_type text not null default 'pest'
    check (device_type in ('pest', 'babycam')),
  add column if not exists stream_url text,   -- 실시간 영상 주소 (mjpg-streamer 등 MJPEG/HLS)
  add column if not exists talk_ws_url text;  -- 양방향 오디오 WebSocket 주소

-- 2) 베이비캠 상태 테이블 (라즈베리파이가 주기적으로 upsert)
create table if not exists baby_status (
  device_id text primary key references device_status (device_id) on delete cascade,
  sleep_status text not null default 'awake' check (sleep_status in ('sleeping', 'awake')),
  last_cry_at timestamptz,        -- 가장 최근 울음 감지 시각 (없으면 null)
  room_temp numeric,              -- 실내 온도 (°C)
  updated_at timestamptz not null default now()
);

alter table baby_status enable row level security;

create policy "Allow public read on baby_status"
  on baby_status for select
  using (true);

create policy "Allow public upsert on baby_status"
  on baby_status for insert
  with check (true);

create policy "Allow public update on baby_status"
  on baby_status for update
  using (true)
  with check (true);

-- 3) Realtime 구독 활성화
alter publication supabase_realtime add table baby_status;

-- ============================================================
-- 샘플 베이비캠 기기 (필요 없으면 삭제하세요)
-- ============================================================
insert into device_status (device_id, display_name, location_label, device_type, chemical_level, battery_level, status)
values ('babycam-nursery-01', '베이비캠', '아기방 모빌', 'babycam', 0, 95, 'normal')
on conflict (device_id) do update set device_type = 'babycam';

insert into baby_status (device_id, sleep_status, room_temp)
values ('babycam-nursery-01', 'sleeping', 24.5)
on conflict (device_id) do nothing;

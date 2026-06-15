-- ============================================================
-- PESTIQ Supabase 스키마
-- Supabase 프로젝트 생성 후, SQL Editor에서 이 파일 전체를 실행하세요.
-- ============================================================

-- 1. 감지 이벤트 테이블
create table if not exists detections (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id text not null,           -- 예: 'cockroach-kitchen-01', 'mosquito-bedroom-01'
  pest_type text not null check (pest_type in ('roach', 'mosquito', 'fly')),
  location text not null,            -- '주방' | '욕실' | '거실' | '침실' 등
  count int not null default 1,      -- 감지된 마릿수
  video_url text                     -- 감지 당시 녹화 영상 URL (Storage, 선택)
);

create index if not exists idx_detections_created_at on detections (created_at desc);
create index if not exists idx_detections_pest_type on detections (pest_type);

-- 2. 기기 상태 테이블 (배터리, 약품/카트리지 잔량, 설치 위치 등)
create table if not exists device_status (
  device_id text primary key,
  display_name text,                        -- 대시보드에 표시할 기기 별칭 (예: '주방 바퀴벌레 감지기')
  location_label text,                      -- 설치 위치 (예: '주방 싱크대 하단')
  chemical_level int not null default 100,  -- 약품/카트리지 잔량 %
  battery_level int not null default 100,   -- 배터리 잔량 %
  status text not null default 'normal' check (status in ('normal', 'warning', 'error')),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- 프로토타입 단계에서는 익명 키(anon key)로 읽기/쓰기를 모두 허용합니다.
-- 실제 서비스에서는 쓰기 권한을 기기별 서비스 키나 인증된 사용자로 제한하세요.
-- ============================================================

alter table detections enable row level security;
alter table device_status enable row level security;

create policy "Allow public read on detections"
  on detections for select
  using (true);

create policy "Allow public insert on detections"
  on detections for insert
  with check (true);

create policy "Allow public read on device_status"
  on device_status for select
  using (true);

create policy "Allow public upsert on device_status"
  on device_status for insert
  with check (true);

create policy "Allow public update on device_status"
  on device_status for update
  using (true)
  with check (true);

-- ============================================================
-- Storage: 감지 영상 저장용 버킷
-- ============================================================
insert into storage.buckets (id, name, public)
values ('detection-videos', 'detection-videos', true)
on conflict (id) do nothing;

create policy "Public read detection videos"
  on storage.objects for select
  using (bucket_id = 'detection-videos');

create policy "Public upload detection videos"
  on storage.objects for insert
  with check (bucket_id = 'detection-videos');

-- ============================================================
-- Realtime: detections 테이블 변경사항을 프론트엔드에서 구독하기 위해 활성화
-- (Supabase 대시보드 > Database > Replication 에서도 설정 가능)
-- ============================================================
alter publication supabase_realtime add table detections;

-- ============================================================
-- 샘플 데이터 (테스트용, 필요 없으면 삭제하세요)
-- ============================================================
insert into device_status (device_id, display_name, location_label, chemical_level, battery_level, status) values
  ('cockroach-kitchen-01', '바퀴벌레 감지기', '주방 싱크대 하단', 68, 92, 'normal'),
  ('mosquito-bedroom-01', '모기 포획기', '침실 창가', 100, 88, 'normal');

insert into detections (created_at, device_id, pest_type, location, count) values
  (now() - interval '1 day',  'cockroach-kitchen-01', 'roach', '주방', 1),
  (now() - interval '2 day',  'cockroach-kitchen-01', 'roach', '주방', 1),
  (now() - interval '3 day',  'cockroach-kitchen-01', 'roach', '욕실', 1),
  (now() - interval '1 day',  'mosquito-bedroom-01', 'mosquito', '침실', 2),
  (now() - interval '2 day',  'mosquito-bedroom-01', 'mosquito', '침실', 1),
  (now() - interval '3 day',  'mosquito-bedroom-01', 'mosquito', '거실', 2);

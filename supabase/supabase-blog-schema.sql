-- ============================================================
-- CritterCatch 블로그 + 광고 스키마 추가
-- 기존 schema.sql 실행 후 이 파일을 추가로 실행하세요
-- ============================================================

-- 블로그 포스트 테이블
create table if not exists blog_posts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,           -- URL용 고유 키 (예: 'cockroach-prevention-tips')
  summary text,                        -- 목록에 표시할 요약
  content text not null,               -- 본문 (HTML)
  thumbnail_url text,                  -- 썸네일 이미지 URL
  category text not null default 'info' check (category in ('product', 'review', 'info', 'news')),
  tags text[],                         -- 태그 배열
  published boolean not null default false,
  view_count int not null default 0
);

create index if not exists idx_blog_slug on blog_posts (slug);
create index if not exists idx_blog_category on blog_posts (category);
create index if not exists idx_blog_published on blog_posts (published, created_at desc);

-- 광고 설정 테이블
create table if not exists ad_settings (
  id text primary key,                 -- 'header', 'sidebar', 'in-content', 'footer'
  label text not null,
  adsense_code text,                   -- 애드센스 광고 코드
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 기본 광고 슬롯 삽입
insert into ad_settings (id, label, enabled) values
  ('header', '상단 배너 (728×90)', false),
  ('in-content', '본문 중간 광고', false),
  ('sidebar', '사이드바 광고', false),
  ('footer', '하단 배너', false)
on conflict (id) do nothing;

-- RLS
alter table blog_posts enable row level security;
alter table ad_settings enable row level security;

create policy "Public read published posts" on blog_posts for select using (published = true);
create policy "Allow public read ad_settings" on ad_settings for select using (true);

-- 관리자 전용 정책 (service_role key 사용)
create policy "Admin all blog_posts" on blog_posts for all using (auth.role() = 'service_role');
create policy "Admin all ad_settings" on ad_settings for all using (auth.role() = 'service_role');

-- 샘플 포스트
insert into blog_posts (title, slug, summary, content, category, tags, published) values
(
  '바퀴벌레 완전 퇴치 가이드 — AI 감지기로 한 달 만에 없앤 후기',
  'cockroach-eradication-guide',
  '주방에서 바퀴벌레가 계속 나와서 CritterCatch를 설치했습니다. 한 달 후 결과를 공유합니다.',
  '<p>처음 설치했을 때 1주차에 18마리가 감지됐습니다...</p>',
  'review',
  ARRAY['바퀴벌레', '후기', '주방'],
  true
),
(
  '모기가 싫어하는 것 5가지 — UV 트랩이 효과적인 이유',
  'mosquito-uv-trap-guide',
  '모기는 빛을 좋아합니다. UV 파장을 이용한 친환경 포획 방법을 알아보세요.',
  '<p>모기는 특정 파장의 자외선에 강하게 반응합니다...</p>',
  'info',
  ARRAY['모기', 'UV', '친환경'],
  true
);

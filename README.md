# CritterCatch 대시보드

AI 해충 감지기(바퀴벌레/모기/파리)의 감지 이력을 보여주는 React 대시보드입니다.
Supabase를 데이터베이스로 사용하며, 라즈베리파이 기기가 Supabase로 감지 이벤트를
전송하면 대시보드에 실시간으로 반영됩니다.

```
crittercatch/
├─ frontend/        React + Vite 대시보드 (GitHub Pages로 배포)
├─ supabase/        DB 스키마 (schema.sql)
└─ simulator/        라즈베리파이 감지 이벤트 시뮬레이터 (테스트용)
```

Supabase 연결 전에는 더미 데이터로 화면이 동작하므로, 일단 프론트엔드만
배포해서 디자인을 확인할 수도 있습니다.

---

## 1. Supabase 설정

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성 (구글 계정으로 가입 가능)
2. 프로젝트 생성 후 좌측 메뉴 **SQL Editor** 클릭
3. `supabase/schema.sql` 파일 내용을 전체 복사해서 붙여넣고 실행 (Run)
   - `detections` (감지 이벤트), `device_status` (기기 상태) 테이블이 생성됩니다
   - `detection-videos` Storage 버킷도 함께 생성됩니다
   - 샘플 데이터도 함께 들어갑니다
4. 좌측 메뉴 **Project Settings > API** 에서 다음 두 값을 복사해둡니다
   - `Project URL`
   - `anon public` 키 (또는 새 API 키 체계의 `Publishable key`)

**이미 schema.sql을 한 번 실행한 프로젝트라면**, 영상/기기설정 기능을 추가하기 위해
`supabase/migration_v2.sql`을 SQL Editor에서 추가로 실행하세요. 기존 데이터는 유지됩니다.

---

## 2. 프론트엔드 로컬 실행

```bash
cd frontend
npm install
cp .env.example .env   # .env 파일을 만들고 아래 값 채우기
```

`.env` 파일:
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxx...
```

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속. `.env`를 채우지 않으면 더미 데이터로 동작합니다.

---

## 3. GitHub에 올리기

```bash
cd crittercatch
git init
git add .
git commit -m "CritterCatch dashboard initial commit"
git branch -M main
git remote add origin https://github.com/<내깃허브계정>/crittercatch.git
git push -u origin main
```

---

## 4. GitHub Pages로 배포 (자동)

이 레포에는 `.github/workflows/deploy.yml`이 포함되어 있어, `main` 브랜치에 push하면
자동으로 빌드 후 GitHub Pages에 배포됩니다.

**최초 설정 (한 번만)**

1. GitHub 레포 → **Settings > Pages** → Source를 **GitHub Actions**로 변경
2. GitHub 레포 → **Settings > Secrets and variables > Actions** → New repository secret
   - `VITE_SUPABASE_URL` = Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = Supabase anon key
3. `frontend/vite.config.js` 의 `base` 값은 이미 `/crittercatch/`로 설정되어 있습니다.
   (만약 레포 이름을 다르게 만들었다면 그 이름으로 수정하세요)
   ```js
   base: '/crittercatch/',
   ```
4. 위 변경사항을 commit & push하면 Actions 탭에서 빌드/배포가 진행됩니다.
5. 배포 완료 후 `https://<내깃허브계정>.github.io/crittercatch/` 에서 확인 가능합니다.

---

## 5. 라즈베리파이(기기) 연동

기기가 해충을 감지하면 Supabase `detections` 테이블에 행을 추가(insert)하면
대시보드에 실시간으로 반영됩니다 (Realtime 구독 적용됨).

`simulator/simulate_detection.py`는 이 동작을 흉내내는 테스트 스크립트입니다.

```bash
cd simulator
pip install supabase
export SUPABASE_URL=https://xxxxxxxx.supabase.co
export SUPABASE_ANON_KEY=eyJxxxxxxxx...
export DEVICE_ID=cockroach-kitchen-01
export PEST_TYPE=roach
python simulate_detection.py
```

실제 라즈베리파이 펌웨어에서는 AI가 해충을 식별한 직후, 이 스크립트의
`insert_detection()` 부분과 동일한 코드를 호출하면 됩니다.

### 데이터 구조

**detections** (감지 이벤트, 1건 = 1회 감지)
| 컬럼 | 설명 |
|---|---|
| `device_id` | 기기 식별자, 예: `cockroach-kitchen-01` |
| `pest_type` | `roach` / `mosquito` / `fly` |
| `location` | `주방` / `욕실` / `거실` / `침실` 등 |
| `count` | 감지된 마릿수 (기본 1) |
| `created_at` | 감지 시각 (자동 기록) |
| `video_url` | 감지 영상 URL (Supabase Storage, 선택) |

**device_status** (기기 상태, 기기별 1행)
| 컬럼 | 설명 |
|---|---|
| `device_id` | 기기 식별자 (기본키) |
| `display_name` | 대시보드에 표시할 기기 이름 (설정 화면에서 수정 가능) |
| `location_label` | 설치 위치 설명 (설정 화면에서 수정 가능) |
| `chemical_level` | 약품/카트리지 잔량 % |
| `battery_level` | 배터리 잔량 % |
| `status` | `normal` / `warning` / `error` |

---

## 6. 감지 영상 (Supabase Storage)

기기가 모기/바퀴벌레를 감지하고 짧은 영상을 녹화했다면, `detection-videos` Storage
버킷에 업로드한 뒤 그 공개 URL을 `detections.video_url`에 함께 기록하면 대시보드의
"최근 감지 영상" 목록에서 바로 재생할 수 있습니다.

`simulator/simulate_detection.py`에 예시가 포함되어 있습니다:

```bash
export VIDEO_FILE=/path/to/clip.mp4
python simulate_detection.py
```

라즈베리파이 펌웨어에서는 `upload_video()` 함수와 동일한 방식으로:
1. 감지~포획/분사 구간을 짧은 mp4로 녹화
2. `client.storage.from_("detection-videos").upload(path, file)`
3. `get_public_url()`로 URL을 받아 `detections.insert()`에 `video_url`로 포함

영상 파일은 기기별 폴더(`{device_id}/{timestamp}.mp4`)에 저장하는 것을 권장합니다.

---

## 7. 기기 설정 (이름/설치 위치)

대시보드 우측 상단의 ⚙️ 아이콘을 누르면 등록된 기기 목록과 각 기기의
"기기 이름"과 "설치 위치"를 직접 수정할 수 있습니다. 저장하면 `device_status`
테이블의 `display_name`, `location_label` 컬럼이 즉시 업데이트됩니다.

여러 기기를 운영할 때, 기기를 새로 추가하려면 Supabase Table Editor에서
`device_status` 테이블에 새 행을 추가(`device_id`만 필수)하면 대시보드 설정
화면에 자동으로 나타납니다.

---

## 8. 베이비캠 (실시간 영상 + 양방향 오디오)

대시보드의 **베이비 탭**에서 아기방에 설치한 라즈베리파이의 실시간 영상을 보고,
무전기처럼 버튼을 누르고 있는 동안 마이크 소리를 기기 스피커로 전송할 수 있습니다.

**이미 schema.sql + migration_v2.sql까지 실행한 프로젝트라면**, `supabase/migration_v3.sql`을
SQL Editor에서 추가로 실행하세요. 기존 데이터는 유지됩니다.

### 라즈베리파이 측 준비

1. **실시간 영상**: `mjpg-streamer` 등으로 카메라 영상을 MJPEG으로 송출
   (예: `http://<라즈베리파이 IP>:8080/?action=stream`)
2. **양방향 오디오**: 마이크 입력을 받아 스피커로 재생하는 WebSocket 서버 실행
   (예: `ws://<라즈베리파이 IP>:8765`)
3. **수면/울음 감지**: 오디오 분석 결과를 `baby_status` 테이블에 주기적으로 upsert
   - `sleep_status`: `'sleeping'` | `'awake'`
   - `last_cry_at`: 가장 최근 울음 감지 시각
   - `room_temp`: 실내 온도(°C)

### 대시보드 설정

베이비 탭 → "베이비캠 연결 설정"에서 영상 스트림 주소와 오디오 WebSocket 주소를
입력하고 저장하면 `device_status` 테이블의 `stream_url`, `talk_ws_url` 컬럼에
저장됩니다 (베이비캠 기기는 `device_type = 'babycam'`으로 구분됩니다).

> ⚠️ 영상/오디오 주소가 `http://`/`ws://`(비암호화)인 경우, 대시보드가 `https://`로
> 배포되어 있으면 브라우저가 차단할 수 있습니다. 같은 와이파이에서 로컬 접속하거나,
> 라즈베리파이 쪽에 `https://`/`wss://`(TLS)를 구성하는 것을 권장합니다.

---

## 9. 보안 (로그인)

기본 상태에서는 anon key로 누구나 대시보드 데이터를 읽을 수 있습니다. 본인만
대시보드를 볼 수 있게 하려면:

1. `supabase/migration_v4.sql`을 SQL Editor에서 실행 (읽기 권한을 로그인 사용자로 제한)
2. 배포된 대시보드에서 "처음이신가요? 계정 만들기"로 본인 이메일/비밀번호 계정 생성
   - Supabase 프로젝트 → **Authentication > Settings** 에서 "Confirm email"을 꺼두면
     가입 즉시 로그인 가능 (켜두면 확인 메일의 링크를 눌러야 함)
3. 본인 계정 생성 후, 같은 화면에서 **"Allow new users to sign up"** 을 꺼서
   더 이상 다른 사람이 가입할 수 없도록 막기

라즈베리파이(기기)는 로그인 없이 anon key로 그대로 감지 이벤트를 기록할 수 있습니다
(쓰기 정책은 변경하지 않았습니다). 로그인은 "대시보드에서 데이터를 보는 것"만 막습니다.

> 이 마이그레이션을 적용하면 프론트엔드에는 로그인 화면(`Login.jsx`)이 필요합니다.
> 이미 포함된 최신 버전을 사용하면 자동으로 로그인 게이트가 적용됩니다.
> `.env`를 설정하지 않은 로컬 개발 모드에서는 로그인 화면 없이 더미 데이터로 바로 확인할 수 있습니다.

---

## 화면 구성

- **로그인 화면**: Supabase Auth 적용 시(migration_v4.sql 실행 후) 로그인 전에는 데이터가 보이지 않음
- **전체 탭**: 바퀴벌레/모기/파리 요약 카드, 월간 감지 추이, 출몰 위치 비율, 최근 감지 영상
- **개별 탭** (바퀴벌레/모기/파리): 박멸률, 주간 감지 수, 주요 출몰 위치
- **베이비 탭**: 실시간 영상, 수면 상태/울음 감지, 누르고 말하기(양방향 오디오)
- **설정 화면** (⚙️): 기기별 이름/설치 위치 수정
- **하단**: 약품 잔량, 배터리, 기기 상태
- **언어**: 우측 상단 KO/EN 버튼으로 한국어/영어 전환

데이터가 비어있으면 더미 데이터를 보여주고, Supabase에 실제 감지 데이터가
쌓이면 자동으로 실제 데이터 기반 화면으로 전환됩니다.

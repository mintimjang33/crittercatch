// 다국어(한국어/영어) 텍스트 모음
// 화면에 보이는 모든 고정 문구와, DB에 한글로 저장된 위치명/해충종류 라벨의
// 영문 매핑을 함께 관리합니다.

export const LANGS = {
  ko: '한국어',
  en: 'English',
}

const dict = {
  ko: {
    brand: 'CritterCatch · 스마트 해충 퇴치',
    title: '우리집 해충 현황',
    statusNormal: '전체 정상',
    statusAttention: '확인 필요',
    statusNewDetections: '새 감지 있음',
    loading: '불러오는 중...',
    dummyNotice:
      'Supabase가 연결되지 않아 샘플 데이터를 표시하고 있습니다. .env 설정 후 새로고침하면 실시간 데이터로 전환됩니다.',
    tabs: { all: '전체', roach: '바퀴벌레', mosquito: '모기', fly: '파리', baby: '베이비' },
    pestLabels: { roach: '바퀴벌레', mosquito: '모기', fly: '파리' },
    monthlyTrend: '이번달 전체 감지 추이',
    outbreakLocations: '출몰 위치',
    mainOutbreakLocations: '주요 출몰 위치',
    weeklyDetections: '주간 감지 수',
    weekLabel: (n) => `${n}주차`,
    weekShort: (n) => `${n}주`,
    unitCount: (n) => `${n}마리`,
    eradication: (pct) => `박멸 ${pct}%`,
    summaryDown: (count, pct) => `이번주 ${count}마리 감지 → 지난주 대비 ${pct}% 감소`,
    summaryUp: (count) => `이번주 ${count}마리 감지 → 계속 퇴치 중`,
    chemicalLevel: '약품 잔량',
    battery: '배터리',
    deviceStatus: '기기 상태',
    deviceNormal: '정상',
    deviceWarning: '점검 필요',
    locations: { 주방: '주방', 욕실: '욕실', 거실: '거실', 침실: '침실', 기타: '기타' },
    settingsTab: '설정',
    settingsTitle: '기기 설정',
    deviceIdLabel: '기기 번호',
    deviceNameLabel: '기기 이름',
    deviceLocationLabel: '설치 위치',
    saveButton: '저장',
    savedMessage: '저장됨',
    recentDetectionsTitle: '최근 감지 영상',
    noVideo: '영상 없음',
    watchVideo: '영상 보기',
    closeVideo: '닫기',
    videoHelp:
      '기기가 감지 영상을 Supabase Storage(detection-videos 버킷)에 업로드하면 자동으로 여기에 표시됩니다.',
    pestTypeLabel: { roach: '바퀴벌레', mosquito: '모기', fly: '파리' },

    // 베이비캠 / 양방향 오디오
    babyCamTitle: '베이비캠',
    liveStream: '실시간 영상',
    streamLive: '실시간 연결됨',
    streamNotConfigured: '아직 영상 스트림 주소가 등록되지 않았어요.',
    streamLoadError: '영상을 불러올 수 없습니다. 기기 전원/Wi-Fi 또는 주소를 확인해주세요.',
    streamUrlLabel: '영상 스트림 주소 (MJPEG/HLS)',
    talkUrlLabel: '음성 송신 주소 (WebSocket)',
    streamSettingsTitle: '베이비캠 연결 설정',
    pressToTalk: '누르고 말하기',
    talkingNow: '말하는 중...',
    talkReleaseHint: '버튼을 누르고 있는 동안 마이크 소리가 기기 스피커로 전달됩니다.',
    micPermissionError: '마이크 권한을 허용해주세요.',
    talkUrlMissing: '음성 송신 주소를 먼저 등록해주세요.',
    sleepStatus: '수면 상태',
    sleepStatusSleeping: '수면 중',
    sleepStatusAwake: '깨어있음',
    cryDetection: '울음 감지',
    lastCryAt: (time) => `최근 울음 감지: ${time}`,
    noCryDetected: '감지된 울음 없음',
    roomTemp: '실내 온도',
    babyCamHelp:
      '라즈베리파이에서 mjpg-streamer 등으로 영상을 스트리밍하고, 마이크 입력을 받는 WebSocket 오디오 서버를 함께 실행하면 이 화면에서 실시간 영상 확인과 양방향 대화가 가능합니다.',
  },
  en: {
    brand: 'CritterCatch · Smart Pest Control',
    title: 'Home Pest Status',
    statusNormal: 'All Normal',
    statusAttention: 'Needs Attention',
    statusNewDetections: 'New Detections',
    loading: 'Loading...',
    dummyNotice:
      'Supabase is not connected, so sample data is shown. Set up your .env file and refresh to switch to live data.',
    tabs: { all: 'All', roach: 'Roach', mosquito: 'Mosquito', fly: 'Fly', baby: 'Baby' },
    pestLabels: { roach: 'Roach', mosquito: 'Mosquito', fly: 'Fly' },
    monthlyTrend: 'Monthly Detection Trend',
    outbreakLocations: 'Outbreak Locations',
    mainOutbreakLocations: 'Main Outbreak Locations',
    weeklyDetections: 'Weekly Detections',
    weekLabel: (n) => `Week ${n}`,
    weekShort: (n) => `W${n}`,
    unitCount: (n) => `${n}`,
    eradication: (pct) => `${pct}% eradicated`,
    summaryDown: (count, pct) => `${count} detected this week → down ${pct}% from last week`,
    summaryUp: (count) => `${count} detected this week → still being eliminated`,
    chemicalLevel: 'Chemical Level',
    battery: 'Battery',
    deviceStatus: 'Device Status',
    deviceNormal: 'Normal',
    deviceWarning: 'Check Needed',
    locations: { 주방: 'Kitchen', 욕실: 'Bathroom', 거실: 'Living Room', 침실: 'Bedroom', 기타: 'Other' },
    settingsTab: 'Settings',
    settingsTitle: 'Device Settings',
    deviceIdLabel: 'Device ID',
    deviceNameLabel: 'Device Name',
    deviceLocationLabel: 'Install Location',
    saveButton: 'Save',
    savedMessage: 'Saved',
    recentDetectionsTitle: 'Recent Detection Videos',
    noVideo: 'No video',
    watchVideo: 'Watch video',
    closeVideo: 'Close',
    videoHelp:
      'When a device uploads a detection video to the Supabase Storage "detection-videos" bucket, it appears here automatically.',
    pestTypeLabel: { roach: 'Roach', mosquito: 'Mosquito', fly: 'Fly' },

    // Baby cam / two-way audio
    babyCamTitle: 'Baby Cam',
    liveStream: 'Live Stream',
    streamLive: 'Live',
    streamNotConfigured: 'No video stream URL has been set up yet.',
    streamLoadError: 'Unable to load the stream. Check the device power/Wi-Fi or the URL.',
    streamUrlLabel: 'Video Stream URL (MJPEG/HLS)',
    talkUrlLabel: 'Audio Send URL (WebSocket)',
    streamSettingsTitle: 'Baby Cam Connection Settings',
    pressToTalk: 'Press to Talk',
    talkingNow: 'Talking...',
    talkReleaseHint: 'While holding the button, your mic audio is sent to the device speaker.',
    micPermissionError: 'Please allow microphone access.',
    talkUrlMissing: 'Set an audio send URL first.',
    sleepStatus: 'Sleep Status',
    sleepStatusSleeping: 'Sleeping',
    sleepStatusAwake: 'Awake',
    cryDetection: 'Cry Detection',
    lastCryAt: (time) => `Last cry detected: ${time}`,
    noCryDetected: 'No cry detected',
    roomTemp: 'Room Temp',
    babyCamHelp:
      'Run mjpg-streamer (or similar) on the Raspberry Pi for video, plus a WebSocket audio server for the microphone input, to enable live video and two-way talk here.',
  },
}

export function translate(lang, key, ...args) {
  const table = dict[lang] || dict.ko
  const fallback = dict.ko
  const value = table[key] ?? fallback[key]
  if (typeof value === 'function') return value(...args)
  return value
}

// 위치 라벨 번역 (DB에 한글로 저장된 값을 영문으로 매핑, 없으면 원본 그대로)
export function translateLocation(lang, label) {
  const table = dict[lang] || dict.ko
  return table.locations?.[label] || label
}

// 탭/해충 라벨 번역
export function translatePestLabel(lang, key) {
  const table = dict[lang] || dict.ko
  return table.pestLabels?.[key] || key
}

// 상대 시간 표시 (예: "30분 전" / "30 min ago")
export function timeAgo(lang, isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (lang === 'en') {
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

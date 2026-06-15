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
    tabs: { all: '전체', roach: '바퀴벌레', mosquito: '모기', fly: '파리' },
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
    tabs: { all: 'All', roach: 'Roach', mosquito: 'Mosquito', fly: 'Fly' },
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

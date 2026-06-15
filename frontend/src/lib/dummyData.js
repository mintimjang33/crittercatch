// Supabase 연동 전, 또는 데이터가 비어있을 때 보여줄 더미 데이터
// 실제 데이터 구조와 동일한 형태로 작성되어 있어 Supabase 연동 후에도
// 동일한 컴포넌트가 그대로 동작합니다.

export const dummySummary = {
  roach: { count: 3, changePct: -83, trend: 'down' },
  mosquito: { count: 7, changePct: -53, trend: 'down' },
  fly: { count: 2, changePct: -78, trend: 'down' },
}

export const dummyWeeklyAll = [
  { week: '1주', value: 65 },
  { week: '2주', value: 45 },
  { week: '3주', value: 25 },
  { week: '4주', value: 10 },
]

export const dummyLocationsAll = [
  { label: '주방', pct: 38, color: 'red' },
  { label: '욕실', pct: 30, color: 'amber' },
  { label: '거실', pct: 20, color: 'blue' },
  { label: '침실', pct: 12, color: 'green' },
]

export const dummyPestDetail = {
  roach: {
    emoji: '🪳',
    label: '바퀴벌레',
    eradicationPct: 87,
    summaryText: '이번주 3마리 감지 → 지난주 대비 83% 감소',
    weekly: [18, 11, 5, 3],
    locations: [
      { label: '주방', pct: 55, color: 'red' },
      { label: '욕실', pct: 30, color: 'amber' },
      { label: '거실', pct: 15, color: 'blue' },
    ],
    color: 'red',
  },
  mosquito: {
    emoji: '🦟',
    label: '모기',
    eradicationPct: 53,
    summaryText: '이번주 7마리 감지 → 계속 퇴치 중',
    weekly: [15, 12, 9, 7],
    locations: [
      { label: '침실', pct: 48, color: 'amber' },
      { label: '거실', pct: 32, color: 'red' },
      { label: '욕실', pct: 20, color: 'blue' },
    ],
    color: 'amber',
  },
  fly: {
    emoji: '🪰',
    label: '파리',
    eradicationPct: 78,
    summaryText: '이번주 2마리 감지 → 지난주 대비 78% 감소',
    weekly: [9, 6, 3, 2],
    locations: [
      { label: '주방', pct: 65, color: 'red' },
      { label: '거실', pct: 25, color: 'green' },
      { label: '침실', pct: 10, color: 'blue' },
    ],
    color: 'green',
  },
}

export const dummyDeviceStatus = {
  chemicalLevel: 68,
  batteryLevel: 92,
  status: 'normal',
}

// 원본 HTML에서 사용된 색상 팔레트 (라이트 모드 기준 hex)
// 다크모드에서도 무난하게 보이도록 약간 투명도를 적용해 사용합니다.
export const COLORS = {
  red: { bg: '#FCEBEB', text: '#A32D2D', bar: '#F7C1C1' },
  amber: { bg: '#FAEEDA', text: '#854F0B', bar: '#FAC775' },
  blue: { bg: '#E6F1FB', text: '#185FA5', bar: '#B5D4F4' },
  green: { bg: '#EAF3DE', text: '#3B6D11', bar: '#C0DD97' },
  teal: { bg: '#E1F5EE', text: '#0F6E56', bar: '#9FE1CB' },
  purple: { bg: '#EEEDFE', text: '#3C3489', bar: '#CECBF6' },
}

export function colorFor(key) {
  return COLORS[key] || COLORS.blue
}

import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import {
  dummySummary,
  dummyWeeklyAll,
  dummyLocationsAll,
  dummyPestDetail,
  dummyDeviceStatus,
  dummyRecentDetections,
  dummyDevices,
} from './dummyData'

// ============================================================
// 예상 Supabase 테이블 스키마 (supabase/schema.sql 참고)
//
// table: detections
//   id           bigint, primary key, identity
//   created_at   timestamptz, default now()
//   device_id    text        -- 기기 식별자 (예: 'cockroach-kitchen-01')
//   pest_type    text        -- 'roach' | 'mosquito' | 'fly'
//   location     text        -- '주방' | '욕실' | '거실' | '침실' 등
//   count        int         -- 감지된 마릿수 (기본 1)
//
// table: device_status
//   device_id      text, primary key
//   chemical_level int        -- 약품/카트리지 잔량 %
//   battery_level  int        -- 배터리 잔량 %
//   status         text        -- 'normal' | 'warning' | 'error'
//   updated_at     timestamptz
// ============================================================

const PEST_TYPES = ['roach', 'mosquito', 'fly']
const PEST_COLOR = { roach: 'red', mosquito: 'amber', fly: 'green' }

function startOfWeeksAgo(weeksAgo) {
  const d = new Date()
  d.setDate(d.getDate() - weeksAgo * 7)
  return d
}

// raw detection rows -> 주차별 합계 (최근 4주, 1주차가 가장 오래된 주)
function aggregateWeekly(rows) {
  const buckets = [0, 0, 0, 0]
  const now = new Date()
  rows.forEach((r) => {
    const created = new Date(r.created_at)
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24))
    const weekIndex = Math.floor(diffDays / 7) // 0 = 이번주(4주차), 3 = 3주전(1주차)
    if (weekIndex >= 0 && weekIndex < 4) {
      buckets[3 - weekIndex] += r.count ?? 1
    }
  })
  return buckets
}

function aggregateLocations(rows) {
  const totals = {}
  let total = 0
  rows.forEach((r) => {
    const loc = r.location || '기타'
    const c = r.count ?? 1
    totals[loc] = (totals[loc] || 0) + c
    total += c
  })
  const colorCycle = ['red', 'amber', 'blue', 'green', 'purple']
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([label, val], i) => ({
      label,
      pct: total > 0 ? Math.round((val / total) * 100) : 0,
      color: colorCycle[i % colorCycle.length],
    }))
}

export function usePestData() {
  const [loading, setLoading] = useState(true)
  const [usingDummy, setUsingDummy] = useState(!supabase)
  const [summary, setSummary] = useState(dummySummary)
  const [weeklyAll, setWeeklyAll] = useState(dummyWeeklyAll)
  const [locationsAll, setLocationsAll] = useState(dummyLocationsAll)
  const [pestDetail, setPestDetail] = useState(dummyPestDetail)
  const [deviceStatus, setDeviceStatus] = useState(dummyDeviceStatus)
  const [recentDetections, setRecentDetections] = useState(dummyRecentDetections)
  const [devices, setDevices] = useState(dummyDevices)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)

      // 최근 4주 데이터만 조회
      const since = startOfWeeksAgo(4).toISOString()
      const { data: rows, error } = await supabase
        .from('detections')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })

      const { data: statusRows } = await supabase
        .from('device_status')
        .select('*')

      if (cancelled) return

      if (error || !rows) {
        console.error('Supabase fetch error, falling back to dummy data', error)
        setUsingDummy(true)
        setLoading(false)
        return
      }

      // device_status는 데이터가 있으면 항상 최신 상태로 반영 (기기 설정 화면용)
      if (statusRows && statusRows.length > 0) {
        setDevices(statusRows)
      }

      if (rows.length === 0) {
        // 테이블은 연결됐지만 아직 감지 데이터가 없는 경우 -> 더미 감지 데이터 유지
        setUsingDummy(true)
        setLoading(false)
        return
      }

      setUsingDummy(false)

      // 최근 감지 이력 (영상 보기용, 최대 10건)
      setRecentDetections(rows.slice(0, 10))

      // 전체 집계
      setWeeklyAll(
        aggregateWeekly(rows).map((value, i) => ({
          week: `${i + 1}주`,
          value,
        }))
      )
      setLocationsAll(aggregateLocations(rows))

      // 해충별 집계
      const nextSummary = {}
      const nextDetail = {}
      PEST_TYPES.forEach((type) => {
        const typeRows = rows.filter((r) => r.pest_type === type)
        const weekly = aggregateWeekly(typeRows)
        const thisWeek = weekly[3]
        const lastWeek = weekly[2]
        const changePct =
          lastWeek > 0
            ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
            : thisWeek > 0
              ? 100
              : 0
        const maxWeekly = Math.max(...weekly, 1)
        const eradicationPct =
          maxWeekly > 0
            ? Math.max(0, Math.min(100, Math.round((1 - thisWeek / maxWeekly) * 100)))
            : 0

        nextSummary[type] = {
          count: thisWeek,
          changePct,
          trend: changePct <= 0 ? 'down' : 'up',
        }

        nextDetail[type] = {
          key: type,
          eradicationPct,
          thisWeek,
          changePct,
          weekly,
          locations: aggregateLocations(typeRows),
          color: PEST_COLOR[type],
        }
      })
      setSummary(nextSummary)
      setPestDetail(nextDetail)

      // 기기 상태 (여러 기기가 있을 경우 평균값 표시)
      if (statusRows && statusRows.length > 0) {
        const avg = (key) =>
          Math.round(
            statusRows.reduce((sum, s) => sum + (s[key] ?? 0), 0) / statusRows.length
          )
        const anyWarning = statusRows.some((s) => s.status !== 'normal')
        setDeviceStatus({
          chemicalLevel: avg('chemical_level'),
          batteryLevel: avg('battery_level'),
          status: anyWarning ? 'warning' : 'normal',
        })
      }

      setLoading(false)
    }

    load()

    // Realtime: 새 감지 이벤트가 들어오면 자동 새로고침
    const channel = supabase
      .channel('detections-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'detections' },
        () => load()
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])


  // 새 기기 등록
  async function addDevice(deviceData) {
    if (!supabase) {
      setDevices((prev) => [...prev, deviceData])
      return { error: null }
    }
    const { error } = await supabase.from("device_status").insert([deviceData])
    if (!error) setDevices((prev) => [...prev, deviceData])
    return { error }
  }
  // 설정 화면에서 기기 별칭/설치 위치를 수정할 때 호출
  async function updateDevice(deviceId, fields) {
    if (!supabase) {
      // Supabase 미연결 시: 더미 상태만 로컬에서 업데이트
      setDevices((prev) =>
        prev.map((d) => (d.device_id === deviceId ? { ...d, ...fields } : d))
      )
      return { error: null }
    }

    const { error } = await supabase
      .from('device_status')
      .update(fields)
      .eq('device_id', deviceId)

    if (!error) {
      setDevices((prev) =>
        prev.map((d) => (d.device_id === deviceId ? { ...d, ...fields } : d))
      )
    }

    return { error }
  }

  return {
    loading,
    usingDummy,
    summary,
    weeklyAll,
    locationsAll,
    pestDetail,
    deviceStatus,
    recentDetections,
    devices,
    updateDevice,
    addDevice,
  }
}

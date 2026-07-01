// Data-layer MASTERY (seam) — suy động (HS × dạng) từ các lần đo, gộp qua engine PURE src/gami/mastery.js.
// KHÔNG lưu — mọi lần gọi tính lại từ measurements. UI chỉ gọi qua đây.
// Nguồn đo: gami_grades (phase ingame/et) + buoi_danh_gia_dang (đánh giá GV) [+ btvn nếu bật toggle].
import { supabase } from './supabase'
import { masteryOfDang, RESULT_VALUE, MASTERY_CONFIG } from '../gami/mastery.js'
import { khoCuaMon } from './tailieu'

const LIMIT = 10000

export type EvalSrc = 'ingame' | 'et' | 'dg' | 'btvn'
export type DangEval = { value: number; t: string; src: EvalSrc } // value 0|0.5|1 · t = ISO · src = nguồn
export type Mastery = { score: number; n: number; muc: 'dat' | 'can_luyen' | 'yeu'; tin: 'cao' | 'tb' | 'thap' }
export type DangMastery = {
  ma_dang: string
  ten_dang: string
  ten_chuyen_de: string
  mastery: Mastery | null // null = CHƯA ĐO (không có lần đo nào)
  evals: DangEval[] // MỚI → CŨ
}

// Nhãn nguồn cho UI.
export const SRC_LABEL: Record<EvalSrc, string> = { ingame: 'IG', et: 'ET', dg: 'ĐG', btvn: 'BT' }

// Gom các lần đo của 1 HS (trong 1 MÔN) theo dạng → mastery + timeline.
// opts.includeBTVN: gộp cả phase='btvn' (mặc định KHÔNG — BTVN tham khảo, không vào mastery; toggle để Thùy soi).
// opts.days: chỉ lấy đo trong N ngày gần nhất (30/60/90). Bỏ trống = tất cả.
export async function getMasteryHS(
  hocSinhId: string,
  mon: string,
  opts?: { includeBTVN?: boolean; days?: number },
): Promise<DangMastery[]> {
  const K = khoCuaMon(mon) // banDoTbl theo môn → scope dạng đúng môn (bỏ dạng môn khác)
  const phases: EvalSrc[] = opts?.includeBTVN ? ['ingame', 'et', 'btvn'] : ['ingame', 'et']
  const sinceIso = opts?.days ? new Date(Date.now() - opts.days * 86400_000).toISOString() : null // boundary INSTANT (được phép, §windowing)

  // 1) grades của HS (result + graded_at + problem_id) → 2) session_problems (phase, ma_dang). Join ở JS (né filter lồng PostgREST, §2).
  let gq = supabase.from('gami_grades').select('result, graded_at, problem_id').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (sinceIso) gq = gq.gte('graded_at', sinceIso)
  const [{ data: grades }, { data: dgs }] = await Promise.all([
    gq,
    (() => {
      let dq = supabase.from('buoi_danh_gia_dang').select('ma_dang, diem, updated_at').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
      if (sinceIso) dq = dq.gte('updated_at', sinceIso)
      return dq
    })(),
  ])

  const probIds = [...new Set((grades ?? []).map((g: any) => g.problem_id))]
  const probs = probIds.length
    ? (((await supabase.from('gami_session_problems').select('id, phase, ma_dang').in('id', probIds).limit(LIMIT)).data ?? []) as { id: string; phase: string; ma_dang: string | null }[])
    : []
  const probMap = new Map(probs.map((p) => [p.id, p]))

  // Gom measures theo ma_dang.
  const byDang: Record<string, DangEval[]> = {}
  const push = (ma: string | null | undefined, ev: DangEval) => { if (!ma) return; (byDang[ma] ??= []).push(ev) }
  for (const g of (grades ?? []) as any[]) {
    const p = probMap.get(g.problem_id)
    if (!p || !p.ma_dang) continue
    if (!phases.includes(p.phase as EvalSrc)) continue // lọc phase (loại btvn nếu tắt toggle)
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]
    if (val === undefined) continue
    push(p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const d of (dgs ?? []) as any[]) push(d.ma_dang, { value: Number(d.diem), t: d.updated_at, src: 'dg' })

  const maList = Object.keys(byDang)
  if (maList.length === 0) return []

  // Resolve tên dạng + chuyên đề theo MÔN (scope: chỉ dạng thuộc bảng bản đồ của môn này).
  const dangs = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))

  const out: DangMastery[] = []
  for (const ma of maList) {
    const info = dangMap.get(ma)
    if (!info) continue // ma_dang không thuộc môn đang xem → bỏ
    const evals = byDang[ma].sort((a, b) => Date.parse(b.t) - Date.parse(a.t)) // mới → cũ
    out.push({
      ma_dang: ma,
      ten_dang: info.ten_dang,
      ten_chuyen_de: info.ten_chuyen_de,
      mastery: masteryOfDang(evals, MASTERY_CONFIG) as Mastery | null,
      evals,
    })
  }
  // Sort: YẾU trước, rồi MỚI đánh giá lên đầu (như V1: dạng cần chú ý nhất trên cùng).
  const rank = { yeu: 0, can_luyen: 1, dat: 2 } as const
  out.sort((a, b) => {
    const ra = a.mastery ? rank[a.mastery.muc] : 3
    const rb = b.mastery ? rank[b.mastery.muc] : 3
    if (ra !== rb) return ra - rb
    return Date.parse(b.evals[0]?.t ?? '0') - Date.parse(a.evals[0]?.t ?? '0')
  })
  return out
}

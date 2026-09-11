// Vì sao engine dính kênh 4 cho Tuấn Nguyên Nam Phong (8A1) mà ground-truth thô thì không.
// So 2 cách tính CÙNG 1 HS, in từng buổi MT: lọc THÔ (mọi MT) vs lọc ĐÚNG-ENGINE (napLanDo: ma_dang
// phải có, phase et/mt/btvn, môn theo lop của buổi hoặc bù_cho_buoi_id).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'
import { getStatSheetLop } from '../src/lib/danhgia'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const RV: Record<string, number> = { correct: 1, partial: 0.5, wrong: 0 }
const hienTai = cuaSoCua(Date.now()), truoc = cuaSoTruoc(hienTai)
const lopId = '1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3'
async function fetchAll(build: (f: number, t: number) => any) {
  let out: any[] = []
  for (let f = 0; ; f += 1000) { const { data, error } = await build(f, f + 999); if (error) throw error; out = out.concat(data ?? []); if ((data ?? []).length < 1000) break }
  return out
}
const { data: roster } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ho_ten)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc')
const hsIds = (roster ?? []).map((r: any) => r.hoc_sinh_id)
const hsTen = new Map((roster ?? []).map((r: any) => [r.hoc_sinh_id, r.hoc_sinh?.ho_ten]))
const npId = [...hsTen].find(([, t]) => String(t).includes('Nam Phong'))?.[0]
console.log('Nam Phong id:', npId)
const rows = await fetchAll((f, t) => supabase.from('gami_grades').select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase, ma_dang)').in('hoc_sinh_id', hsIds).order('graded_at').order('id').range(f, t))
const mtAll = rows.filter((r) => r.prob?.phase === 'mt')
const buoiIds = [...new Set(mtAll.map((r) => r.buoi_hoc_id))]
const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, lop_id, loai, lop:lop_id(ten_lop, mon)').in('id', buoiIds)
const bInfo = new Map((buois ?? []).map((b: any) => [b.id, b]))

function tinh(filterEngine: boolean) {
  const byBuoi = new Map<string, { t: string; per: Map<string, { s: number; c: number }>; nNull: number }>()
  for (const r of mtAll) {
    if (filterEngine && !r.prob?.ma_dang) continue
    let b = byBuoi.get(r.buoi_hoc_id); if (!b) { b = { t: r.graded_at, per: new Map(), nNull: 0 }; byBuoi.set(r.buoi_hoc_id, b) }
    if (r.graded_at > b.t) b.t = r.graded_at
    if (!r.prob?.ma_dang) b.nNull++
    const v = RV[r.result]; if (v === undefined) continue
    const h = b.per.get(r.hoc_sinh_id) ?? { s: 0, c: 0 }; h.s += v; h.c++; b.per.set(r.hoc_sinh_id, h)
  }
  return [...byBuoi.entries()].map(([id, b]) => { const means = new Map([...b.per].map(([h, x]) => [h, x.s / x.c])); const vals = [...means.values()]; return { id, t: b.t, cs: cuaSoCua(b.t), nNull: b.nNull, tb: vals.reduce((a, c) => a + c, 0) / vals.length, nHS: vals.length, me: means.get(npId!) ?? null } }).sort((a, b) => a.t.localeCompare(b.t))
}
for (const [label, fe] of [['LỌC THÔ (mọi dòng MT)', false], ['LỌC ĐÚNG-ENGINE (bỏ ma_dang null)', true]] as const) {
  console.log(`\n── ${label} ──`)
  for (const b of tinh(fe)) {
    const bi = bInfo.get(b.id)
    const trong = b.cs === hienTai || b.cs === truoc
    console.log(`  ${bi?.ngay} ${bi?.lop?.ten_lop ?? '(bù/không lớp)'} loai=${bi?.loai} cs=${b.cs}${trong ? ' [TRONG 2 cửa sổ]' : ''} nHS=${b.nHS} TB=${b.tb.toFixed(3)} nullMaDang=${b.nNull} · NamPhong=${b.me == null ? '—' : b.me.toFixed(3) + ` (${(100 * b.me / b.tb).toFixed(0)}%)`}`)
  }
}
const sheets = await getStatSheetLop(lopId)
const s = sheets.find((x) => x.hoc_sinh_id === npId)
console.log(`\nEngine stat sheet Nam Phong: coSoLopMT=${s?.coSoLopMT} coSoLopET=${s?.coSoLopET}`)

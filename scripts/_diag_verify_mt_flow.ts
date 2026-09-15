// Verify luồng bổ trợ yếu sau khi Thùy cập nhật MT các lớp (09-09) — kiểm tra MT mới có chảy đúng
// vào kênh 4 (coSoLopMT) và listCandidatesLop hay không. READ-ONLY.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, getStatSheetLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

// 1) MT gần đây nhất được chấm (theo graded_at) — xem Thùy vừa cập nhật lớp nào, ngày nào.
const { data: mtRows } = await supabase.from('gami_grades')
  .select('graded_at, buoi_hoc_id, hoc_sinh_id, prob:problem_id(phase, ma_dang)')
  .order('graded_at', { ascending: false }).limit(500)
const mtRecent = (mtRows ?? []).filter((r: any) => r.prob?.phase === 'mt')
console.log(`\n=== MT gần nhất trong 500 dòng gami_grades mới nhất ===`)
console.log(`Tổng dòng MT: ${mtRecent.length}`)
if (mtRecent.length) {
  const latest = mtRecent[0] as any
  console.log(`MT mới nhất: ${latest.graded_at} · buoi_hoc_id=${latest.buoi_hoc_id}`)
  const buoiIds = [...new Set(mtRecent.slice(0, 100).map((r: any) => r.buoi_hoc_id))]
  const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, lop:lop_id(ten_lop, mon)').in('id', buoiIds as string[])
  console.log(`Các buổi MT gần đây (tối đa 100 dòng gần nhất):`)
  for (const b of (buois ?? []) as any[]) console.log(`  ${b.ngay} · ${b.lop?.ten_lop} · ${b.lop?.mon} · ${b.id}`)
}

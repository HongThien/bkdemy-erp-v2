// Verify SỐ THẬT sau khi filter đúng như DuyetBoTroYeuScreen.tsx (loại candidate CHỈ có thái độ).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0, tongCand = 0, tongDuyet = 0
const t0 = Date.now()
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const cands = await listCandidatesLop(l.id)
  tongCand += cands.length
  const duyet = cands.filter((c) =>
    c.deXuatKienThuc.deXuat >= 1 || c.sheet.levelKienThuc >= 1 || c.kenh.some((k) => k !== 'thai_do'))
  tongDuyet += duyet.length
}
console.log(`\n=== ${lops?.length} lớp Toán · ${tongHS} HS · ${Date.now()-t0}ms ===`)
console.log(`listCandidatesLop (Dashboard, gồm cả thái độ): ${tongCand}/${tongHS} = ${(100*tongCand/tongHS).toFixed(1)}%`)
console.log(`"Duyệt bổ trợ" (loại chỉ-thái-độ): ${tongDuyet}/${tongHS} = ${(100*tongDuyet/tongHS).toFixed(1)}%`)

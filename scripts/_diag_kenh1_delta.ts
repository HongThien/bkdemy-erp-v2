// Kênh 1 với thêm điều kiện: tụt QUA NGƯỠNG bucket VÀ delta (truoc-sau) > 0.1.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const bucket = (score: number) => score >= 0.8 ? 'dat' : score >= 0.5 ? 'can_luyen' : 'yeu'
const RANK: Record<string, number> = { dat: 2, can_luyen: 1, yeu: 0 }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0
const hsQuaNguong = new Set<string>()      // qua ngưỡng, KHÔNG lọc delta (fix recency đã có)
const hsQuaNguongVaDelta = new Set<string>() // qua ngưỡng VÀ delta > 0.1
const vidu: string[] = []

for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const sheets = await getStatSheetLop(l.id)
  for (const s of sheets) {
    for (const cd of s.chuyenDes) {
      if (cd.cham?.pha !== 2) continue
      const bTruoc = bucket(cd.cham.truoc), bSau = bucket(cd.cham.sau)
      if (RANK[bSau] >= RANK[bTruoc]) continue
      hsQuaNguong.add(s.hoc_sinh_id)
      const delta = cd.cham.truoc - cd.cham.sau
      if (delta > 0.1) {
        hsQuaNguongVaDelta.add(s.hoc_sinh_id)
      } else if (vidu.length < 15) {
        vidu.push(`${l.ten_lop} · ${s.ho_ten} · ${cd.ten_chuyen_de}: ${bTruoc}(${cd.cham.truoc.toFixed(2)})→${bSau}(${cd.cham.sau.toFixed(2)}) Δ=${delta.toFixed(2)} — BỊ LOẠI vì delta ≤0.1`)
      }
    }
  }
}
console.log(`\n${tongHS} HS`)
console.log(`Kênh 1 — chỉ qua ngưỡng (không lọc delta): ${hsQuaNguong.size}/${tongHS} = ${(100*hsQuaNguong.size/tongHS).toFixed(1)}%`)
console.log(`Kênh 1 — qua ngưỡng VÀ delta > 0.1: ${hsQuaNguongVaDelta.size}/${tongHS} = ${(100*hsQuaNguongVaDelta.size/tongHS).toFixed(1)}%`)
console.log(`\nCác lần bị loại vì delta ≤ 0.1 (qua ngưỡng nhưng tụt nhẹ):`)
vidu.forEach((v) => console.log('  ' + v))

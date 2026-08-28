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
const bucketOnly = new Set<string>()
const MOCS = [0.0, 0.1, 0.15, 0.2, 0.25, 0.3]
const byDelta: Record<number, Set<string>> = {}
for (const m of MOCS) byDelta[m] = new Set()

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
      bucketOnly.add(s.hoc_sinh_id)
      const delta = cd.cham.truoc - cd.cham.sau
      for (const moc of MOCS) {
        if (delta > moc) byDelta[moc].add(s.hoc_sinh_id)
      }
    }
  }
}
console.log(`\n${tongHS} HS`)
console.log(`Kênh 1 — chỉ qua ngưỡng bucket (delta>0): ${bucketOnly.size}/${tongHS} = ${(100*bucketOnly.size/tongHS).toFixed(1)}%`)
for (const moc of MOCS) {
  const n = byDelta[moc].size
  console.log(`   qua ngưỡng VÀ delta > ${moc} -> ${n}/${tongHS} = ${(100*n/tongHS).toFixed(1)}%`)
}

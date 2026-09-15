// Kênh 1, có ràng buộc RECENCY: mốc "sau" phải là cửa sổ HIỆN TẠI hoặc liền trước (không dùng
// dữ liệu quá cũ làm "đang tụt"). So sánh với bản không ràng buộc.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop } from '../src/lib/danhgia'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const hienTai = cuaSoCua(Date.now())
const lienTruoc = cuaSoTruoc(hienTai)
console.log('Cửa sổ hiện tại:', hienTai, '· liền trước:', lienTruoc)

const bucket = (score: number) => score >= 0.8 ? 'dat' : score >= 0.5 ? 'can_luyen' : 'yeu'
const RANK: Record<string, number> = { dat: 2, can_luyen: 1, yeu: 0 }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0
const hsKhongRangBuoc = new Set<string>(), hsCoRangBuoc = new Set<string>()

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
      hsKhongRangBuoc.add(s.hoc_sinh_id)
      const coDiem = cd.chuoi.filter((p: any) => p.score != null)
      const cuaSoSau = coDiem[coDiem.length - 1]?.cuaSo
      if (cuaSoSau === hienTai || cuaSoSau === lienTruoc) hsCoRangBuoc.add(s.hoc_sinh_id)
    }
  }
}
console.log(`\n${tongHS} HS`)
console.log(`Kênh 1 KHÔNG ràng buộc recency: ${hsKhongRangBuoc.size}/${tongHS} = ${(100*hsKhongRangBuoc.size/tongHS).toFixed(1)}%`)
console.log(`Kênh 1 CÓ ràng buộc (sau = hiện tại hoặc liền trước): ${hsCoRangBuoc.size}/${tongHS} = ${(100*hsCoRangBuoc.size/tongHS).toFixed(1)}%`)

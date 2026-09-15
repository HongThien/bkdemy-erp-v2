// Kiểm tra: kênh 1 (chuyên đề tụt qua ngưỡng, pha 2) đang so 2 cửa sổ NÀO — có phải cửa sổ
// "sau" (gần nhất) đã CŨ (không phải cửa sổ hiện tại) hay không.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop } from '../src/lib/danhgia'
import { cuaSoCua } from '../src/gami/danhgia.js'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const cuaSoHienTai = cuaSoCua(Date.now())
console.log('Cửa sổ HIỆN TẠI (hôm nay):', cuaSoHienTai)

const bucket = (score: number) => score >= 0.8 ? 'dat' : score >= 0.5 ? 'can_luyen' : 'yeu'
const RANK: Record<string, number> = { dat: 2, can_luyen: 1, yeu: 0 }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tong = 0
const demCuaSoSau: Record<string, number> = {}
const vidu: string[] = []

for (const l of (lops ?? []) as any[]) {
  const sheets = await getStatSheetLop(l.id)
  for (const s of sheets) {
    for (const cd of s.chuyenDes) {
      if (cd.cham?.pha !== 2) continue
      const bTruoc = bucket(cd.cham.truoc), bSau = bucket(cd.cham.sau)
      if (RANK[bSau] >= RANK[bTruoc]) continue // không tụt, bỏ qua
      tong++
      // Tìm cửa sổ tương ứng với 2 điểm truoc/sau trong chuỗi (2 mốc non-null cuối).
      const coDiem = cd.chuoi.filter((p: any) => p.score != null)
      const cuaSoSau = coDiem[coDiem.length - 1]?.cuaSo ?? '?'
      demCuaSoSau[cuaSoSau] = (demCuaSoSau[cuaSoSau] ?? 0) + 1
      if (vidu.length < 12) vidu.push(`${l.ten_lop} · ${s.ho_ten} · ${cd.ten_chuyen_de} · cửa sổ SAU=${cuaSoSau} (${bTruoc}→${bSau})`)
    }
  }
}
console.log(`\nTổng số lần chuyên đề tụt qua ngưỡng: ${tong}`)
console.log('Phân bố cửa sổ SAU (gần nhất) của các lần tụt:', JSON.stringify(demCuaSoSau, null, 2))
console.log(`\nBao nhiêu % đang dùng cửa sổ HIỆN TẠI (${cuaSoHienTai}) làm mốc "sau"?`, `${demCuaSoSau[cuaSoHienTai] ?? 0}/${tong} = ${(100*(demCuaSoSau[cuaSoHienTai] ?? 0)/tong).toFixed(1)}%`)
console.log('\n12 ví dụ:')
vidu.forEach((v) => console.log('  ' + v))

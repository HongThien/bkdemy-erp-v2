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
let tongHS = 0
let viaSoTinHieu = 0, viaBaoDong = 0, viaCaseDangMo = 0, viaThaiDoLotQua = 0
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const cands = await listCandidatesLop(l.id)
  const duyet = cands.filter((c) => c.duTinHieuKienThuc)
  for (const c of duyet) {
    const kenh4 = c.kenh.filter((k) => ['trend','pct_yeu','so_lop_et','so_lop_mt'].includes(k)).length
    const baoDong = c.kenh.includes('chuong_do') || c.kenh.includes('tien_quyet')
    const caseDangMo = c.sheet.levelKienThuc > 0 && c.deXuatKienThuc.deXuat !== c.sheet.levelKienThuc
    if (kenh4 >= 2) viaSoTinHieu++
    else if (baoDong) viaBaoDong++
    else if (caseDangMo) viaCaseDangMo++
    else viaThaiDoLotQua++
  }
}
console.log(`\n${tongHS} HS`)
console.log(`Vào vì ≥2/4 kênh: ${viaSoTinHieu}`)
console.log(`Vào vì báo động: ${viaBaoDong}`)
console.log(`Vào vì case ĐANG MỞ cần xử: ${viaCaseDangMo}`)
console.log(`Vào vì thái độ lọt qua (không nên xảy ra, filter đã đổi sang duTinHieuKienThuc): ${viaThaiDoLotQua}`)

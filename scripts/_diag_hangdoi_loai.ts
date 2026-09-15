// Đo thật (read-only) luật hàng đợi Duyệt bổ trợ 09-09: loại HS đã có cờ (levelKienThuc>0) + đã chốt trong cửa sổ này.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, cuaSoHienTai } from '../src/lib/danhgia'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const mon = process.argv[2] ?? 'Toán'
const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('trang_thai', 'dang_hoc').eq('mon', mon).order('ten_lop').limit(500)
let tong = 0, coCo = 0, daChot = 0, conLai = 0
const per: string[] = []
for (const l of (lops ?? []) as any[]) {
  const cs = (await listCandidatesLop(l.id).catch(() => [])).filter((c) => c.duTinHieuKienThuc)
  const a = cs.filter((c) => c.sheet.levelKienThuc > 0)
  const b = cs.filter((c) => c.sheet.levelKienThuc === 0 && c.daDuyetKienThucAt)
  const r = cs.filter((c) => c.sheet.levelKienThuc === 0 && !c.daDuyetKienThucAt)
  tong += cs.length; coCo += a.length; daChot += b.length; conLai += r.length
  if (a.length || b.length) per.push(`${l.ten_lop}: ${cs.length} tín hiệu → loại ${a.length} có cờ + ${b.length} đã chốt L0 kỳ này → còn ${r.length}`)
}
console.log(`Môn ${mon} · cửa sổ ${cuaSoHienTai()} · ${(lops ?? []).length} lớp`)
console.log(`Đủ tín hiệu: ${tong} · loại vì ĐÃ CÓ CỜ: ${coCo} · loại vì đã chốt L0 kỳ này: ${daChot} · CÒN TRONG HÀNG ĐỢI: ${conLai}`)
for (const p of per) console.log('  ' + p)

// Read-only: in lý do engine đề xuất 1 HS (argv: tên lớp, tên HS)
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, cuaSoHienTai } from '../src/lib/danhgia'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const [tenLop, tenHS] = [process.argv[2] ?? '7K1', process.argv[3] ?? 'Đỗ Ngọc Tuấn']
const { data: lops } = await supabase.from('lop').select('id, ten_lop, mon').eq('ten_lop', tenLop).eq('trang_thai', 'dang_hoc')
for (const l of (lops ?? []) as any[]) {
  const cs = await listCandidatesLop(l.id)
  const c = cs.find((x) => x.ho_ten === tenHS)
  console.log(`\n== ${l.ten_lop} · ${l.mon} · cửa sổ ${cuaSoHienTai()} ==`)
  if (!c) { console.log('không phải candidate'); continue }
  console.log('kenh:', c.kenh, '| uuTien:', c.uuTien, '| duTinHieu:', c.duTinHieuKienThuc, '| level:', c.sheet.levelKienThuc, '| daDuyet:', c.daDuyetKienThucAt)
  for (const l of c.lyDo) console.log('  -', l)
  const ht = cuaSoHienTai(), tr = cuaSoTruoc(ht)
  const gd = c.sheet.dangs.filter((d: any) => { const w = cuaSoCua(d.cuoiCungAt); return w === ht || w === tr })
  console.log(`dạng đo gần đây (2 cửa sổ): ${gd.length} · yếu: ${gd.filter((d: any) => d.muc === 'yeu').length}`)
  for (const d of gd) console.log(`   ${d.ma_dang} ${d.muc.padEnd(9)} score=${d.score?.toFixed?.(2) ?? d.score} n=${d.n ?? d.soLan ?? '?'} cuối=${String(d.cuoiCungAt).slice(0, 10)} ${d.ten_dang ?? ''}`)
  console.log('đề xuất máy:', JSON.stringify(c.deXuatKienThuc.lyDo), 'diện:', c.deXuatKienThuc.bangChung?.dien)
}

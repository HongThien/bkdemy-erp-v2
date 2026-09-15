import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const { data: cb } = await supabase.from('canh_bao_yeu').select('id, hoc_sinh_id, ma_dang, nguon, ghi_chu, created_at, buoi:buoi_hoc_id(ngay, lop:lop_id(id, ten_lop, mon))').order('created_at', { ascending: false }).limit(1000)
const rows = (cb ?? []) as any[]
const byNguon: Record<string, number> = {}; for (const r of rows) byNguon[r.nguon] = (byNguon[r.nguon] ?? 0) + 1
const since30 = Date.now() - 30 * 86400_000
const recent = rows.filter((r) => Date.parse(r.created_at) >= since30)
const byNguon30: Record<string, number> = {}; for (const r of recent) byNguon30[r.nguon] = (byNguon30[r.nguon] ?? 0) + 1
console.log(`canh_bao_yeu TỔNG ${rows.length} dòng · theo nguon: ${JSON.stringify(byNguon)}`)
console.log(`30 ngày qua: ${recent.length} dòng · theo nguon: ${JSON.stringify(byNguon30)}`)
console.log(`Mới nhất: ${rows[0]?.created_at?.slice(0, 16)} · cũ nhất trong 30 ngày: ${recent.at(-1)?.created_at?.slice(0, 10)}`)
console.log('\n10 dòng mới nhất:')
for (const r of rows.slice(0, 10)) console.log(`  ${r.created_at.slice(0, 10)} ${String(r.nguon).padEnd(8)} ${r.buoi?.lop?.ten_lop ?? '?'} buổi ${r.buoi?.ngay} · dạng ${r.ma_dang} · ${(r.ghi_chu ?? '').slice(0, 40)}`)
// End-to-end: HS có báo động trong 2 cửa sổ gần nhất → có ra kênh chuong_do ở listCandidatesLop không?
const hienTai = cuaSoCua(Date.now()), truoc = cuaSoTruoc(hienTai)
const tgt = rows.filter((r) => { const w = cuaSoCua(r.created_at); return (w === hienTai || w === truoc) && r.buoi?.lop?.id })
const lopIds = [...new Set(tgt.map((r) => r.buoi.lop.id))]
console.log(`\nHS có báo động trong {${truoc},${hienTai}}: ${new Set(tgt.map((r) => r.hoc_sinh_id)).size} HS / ${lopIds.length} lớp → chạy listCandidatesLop thật:`)
let ok = 0, miss: string[] = []
for (const lopId of lopIds) {
  const cands = await listCandidatesLop(lopId)
  for (const r of tgt.filter((x) => x.buoi.lop.id === lopId)) {
    const c = cands.find((x) => x.hoc_sinh_id === r.hoc_sinh_id)
    if (c?.kenh.includes('chuong_do') && c.duTinHieuKienThuc) ok++; else miss.push(`${r.buoi.lop.ten_lop}/${r.hoc_sinh_id.slice(0, 8)} nguon=${r.nguon} → ${c ? 'kenh=' + c.kenh.join('+') : 'KHÔNG trong candidate'}`)
  }
}
console.log(`  → vào đúng kênh ③ + đủ điều kiện Duyệt bổ trợ: ${ok}/${tgt.length}`)
for (const m of miss) console.log('  ⚠ ' + m)

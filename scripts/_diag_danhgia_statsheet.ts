// Chạy THẬT getStatSheetLop trên 1 lớp có nhiều data — verify Pha 2 end-to-end.
// Chạy: npx vite-node scripts/_chk_statsheet.ts
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error: eAuth } = await supabase.auth.signInWithPassword({ email, password: pass })
if (eAuth) { console.error('❌ login:', eAuth.message); process.exit(1) }

// Lớp Toán đông data nhất.
const { data: lops } = await supabase.from('lop').select('id, ten_lop, mon').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(100)
let best: any = null
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!best || (count ?? 0) > best.n) best = { ...l, n: count ?? 0 }
}
console.log(`Lớp: ${best.ten_lop} (${best.n} HS)`)

const t0 = Date.now()
const sheet = await getStatSheetLop(best.id)
console.log(`getStatSheetLop: ${sheet.length} HS · ${Date.now() - t0}ms\n`)

const dem: Record<number, number> = {}
for (const s of sheet) dem[s.deXuatKienThuc.deXuat] = (dem[s.deXuatKienThuc.deXuat] ?? 0) + 1
console.log('Đề xuất level kiến thức:', JSON.stringify(dem))
console.log('Đề xuất level thái độ  :', JSON.stringify(sheet.reduce((a: any, s) => { a[s.deXuatThaiDo.deXuat] = (a[s.deXuatThaiDo.deXuat] ?? 0) + 1; return a }, {})))

const ai = sheet.find((s) => s.deXuatKienThuc.deXuat >= 1) ?? sheet[0]
console.log(`\n── STAT SHEET mẫu: ${ai.ho_ten} ──`)
console.log(`level hiện tại: KT=${ai.levelKienThuc} TĐ=${ai.levelThaiDo}`)
console.log(`đề xuất KT → L${ai.deXuatKienThuc.deXuat} · lý do: ${ai.deXuatKienThuc.lyDo.join(' | ')}`)
console.log(`   diện bổ trợ (${ai.deXuatKienThuc.bangChung.dien.length}): ${ai.deXuatKienThuc.bangChung.dien.slice(0, 6).join(', ')}`)
console.log(`   yếu thiếu lần đo (${ai.deXuatKienThuc.bangChung.yeuThieuDo.length}) · cần luyện (${ai.deXuatKienThuc.bangChung.canLuyen.length}) · BTVN che (${ai.deXuatKienThuc.bangChung.btvnChe.length})`)
console.log(`đề xuất TĐ → L${ai.deXuatThaiDo.deXuat} · ${ai.deXuatThaiDo.lyDo.join(' | ')} (${ai.thaiDo.length} buổi có chấm)`)
console.log(`\n5 dạng yếu nhất:`)
for (const d of ai.dangs.slice(0, 5)) {
  console.log(`   ${d.score.toFixed(2)} (n=${d.n}, ET+MT=${d.scoreEtMt?.toFixed(2) ?? '—'}) ${d.muc.padEnd(10)}${d.trongDien?'[DIỆN]':'      '}${d.daMo?' (đã mở đợt)':''} ${d.ten_dang.slice(0, 42)}`)
}
console.log(`\nChuyên đề (${ai.chuyenDes.length}):`)
for (const c of ai.chuyenDes.slice(0, 5)) {
  const ch = c.chuoi.map((p) => `${p.cuaSo.slice(5)}:${p.score == null ? '—' : p.score.toFixed(2)}${p.itLanDo ? '⚠' : ''}`).join(' ')
  const cham = c.cham ? (c.cham.pha === 1 ? `pha1 rank ${c.cham.rank}/${c.cham.siSo}` : `pha2 ${c.cham.truoc.toFixed(2)}→${c.cham.sau.toFixed(2)} ${c.cham.huong}`) : 'chưa chấm'
  console.log(`   ${c.ten_chuyen_de.slice(0, 30).padEnd(30)} ${ch}  [${cham}]`)
}
await supabase.auth.signOut()

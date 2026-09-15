// Truy vết TẠI SAO 1 HS cụ thể lọt vào danh sách "Duyệt bổ trợ" — in ra đủ số + lý do.
// Chạy: npx vite-node scripts/_diag_one_student.ts "<tên HS>" [mon]
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, getStatSheetLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const ten = process.argv[2] ?? 'Nguyễn Hải Minh Châu'
const mon = process.argv[3] ?? 'Toán'

const { data: hs } = await supabase.from('hoc_sinh').select('id, ho_ten').ilike('ho_ten', `%${ten}%`)
if (!hs?.length) { console.error('Không tìm thấy HS tên', ten); process.exit(1) }
console.log(`Tìm thấy ${hs.length} HS khớp "${ten}":`, hs.map((h: any) => h.ho_ten).join(' | '))

for (const h of hs as any[]) {
  const { data: hlop } = await supabase.from('hoc_sinh_lop').select('lop_id, lop:lop_id(id, ten_lop, mon)').eq('hoc_sinh_id', h.id).eq('trang_thai', 'dang_hoc')
  const lops = (hlop ?? []).map((r: any) => r.lop).filter((l: any) => l?.mon === mon)
  if (!lops.length) { console.log(`\n▸ ${h.ho_ten} (${h.id}) — không có lớp môn ${mon} đang học`); continue }
  for (const l of lops as any[]) {
    console.log(`\n════ ${h.ho_ten} · lớp ${l.ten_lop} (${l.id}) · môn ${mon} ════`)
    const cands = await listCandidatesLop(l.id)
    const c = cands.find((x) => x.hoc_sinh_id === h.id)
    if (!c) {
      console.log('  → KHÔNG có trong danh sách candidate của lớp này (bị lọc ở listCandidatesLop).')
      const sheets = await getStatSheetLop(l.id)
      const s = sheets.find((x) => x.hoc_sinh_id === h.id)
      if (s) {
        console.log(`  stat sheet thô: levelKT=${s.levelKienThuc} deXuatKT=${JSON.stringify(s.deXuatKienThuc.deXuat)} lyDo=${JSON.stringify(s.deXuatKienThuc.lyDo)}`)
        console.log(`  coChuongDo=${s.coChuongDo} coLoTienQuyet=${s.coLoTienQuyet} coSoLopKem=${s.coSoLopKem}`)
        console.log(`  deXuatThaiDo=${JSON.stringify(s.deXuatThaiDo)}`)
        console.log(`  dangs trong diện: ${JSON.stringify(s.deXuatKienThuc.bangChung.dien)}`)
      }
      continue
    }
    console.log(`  uuTien=${c.uuTien}  trongDigest=${c.trongDigest}`)
    console.log(`  kenh: [${c.kenh.join(', ')}]`)
    console.log(`  level KT: ${c.sheet.levelKienThuc} → đề xuất ${c.deXuatKienThuc.deXuat}`)
    console.log(`  level TĐ: ${c.sheet.levelThaiDo} → đề xuất ${c.deXuatThaiDo.deXuat}`)
    console.log(`  lyDo:`)
    for (const ld of c.lyDo) console.log(`    · ${ld}`)
    console.log(`  coSoLopKem=${c.sheet.coSoLopKem}  coChuongDo=${c.sheet.coChuongDo}  coLoTienQuyet=${c.sheet.coLoTienQuyet}`)
    console.log(`  dạng trong diện: ${JSON.stringify(c.deXuatKienThuc.bangChung.dien)}`)
    console.log(`  dạng yếu-thiếu-đo (chưa gọi bổ trợ): ${JSON.stringify(c.deXuatKienThuc.bangChung.yeuThieuDo)}`)
    console.log(`  soLopKem (8 bài gần nhất, gộp ET+MT+BTVN): ${JSON.stringify(c.sheet.soLopKem.map((b: any) => ({ diemHS: +b.diemHS.toFixed(2), tbLop: +b.tbLop.toFixed(2), t: b.t })))}`)
    console.log(`  thái độ (buổi gần nhất trước): ${JSON.stringify(c.sheet.thaiDo.slice(0, 8))}`)
    // Kiểm điều kiện lọt-vào ở DuyetBoTroYeuScreen.tsx (chỉ giữ candidate có tín hiệu KIẾN THỨC):
    const qualifiesDuyetBoTro = c.deXuatKienThuc.deXuat >= 1 || c.sheet.levelKienThuc >= 1 || c.kenh.some((k) => k !== 'thai_do')
    console.log(`  → có xuất hiện ở màn "Duyệt bổ trợ"? ${qualifiesDuyetBoTro}`)
  }
}
await supabase.auth.signOut()

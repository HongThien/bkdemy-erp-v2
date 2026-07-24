// Xem CHÍNH XÁC Claude nhận được gì — lấy payload thật đã lưu trong job.
// Chạy: node scripts/_diag_xem_payload.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const raw = readFileSync('.env.local', 'utf8')
const env = (k) => { const l = raw.split(/\r?\n/).find((x) => x.trim().startsWith(k + '=')); return l ? l.slice(l.indexOf('=') + 1).trim() : null }
const svc = createClient(env('VITE_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE'))

const { data } = await svc.from('danhgia_ai_job').select('stat_sheet, model_chon').order('created_at', { ascending: false }).limit(1)
const s = data?.[0]?.stat_sheet
if (!s) { console.log('Chưa có job nào.'); process.exit(0) }

const chuoi = JSON.stringify(s, null, 1)
console.log('╔══ TOÀN BỘ GÓI GỬI ĐI ═══════════════════════════════════════════')
console.log(`║ lớp ${s.ten_lop} · kỳ ${s.cua_so} · sĩ số ${s.si_so_ca_lop}, gửi ${s.hoc_sinh.length} em`)
console.log(`║ ${chuoi.length.toLocaleString('vi-VN')} ký tự ≈ ${Math.round(chuoi.length / 3.2).toLocaleString('vi-VN')} token`)
console.log(`║ ghi chú kèm theo: "${s.ghi_chu}"`)
console.log('╚═════════════════════════════════════════════════════════════════\n')

// Chọn em có nhiều dữ liệu nhất để xem cho rõ
const em = [...s.hoc_sinh].sort((a, b) => (b.dang?.length ?? 0) - (a.dang?.length ?? 0))[0]
console.log('╔══ MỘT EM TRONG GÓI — ĐÂY LÀ TOÀN BỘ THỨ CLAUDE BIẾT VỀ EM ĐÓ ══\n')
console.log(JSON.stringify(em, null, 1))
console.log('\n╚═════════════════════════════════════════════════════════════════\n')

console.log('── CÁC EM CÒN LẠI (rút gọn) ──')
for (const h of s.hoc_sinh) {
  const dienBT = (h.dang ?? []).filter((d) => d.trong_dien_bo_tro).length
  const tut = (h.chuyen_de ?? []).reduce((a, c) => a + (c.dang_tut_hang?.length ?? 0), 0)
  const td = (h.thai_do_cac_buoi ?? []).filter((t) => t.thai_do !== 'nghiem_tuc').length
  console.log(`   ${String(h.ho_ten).padEnd(22)} ${String(h.dang?.length ?? 0).padStart(2)} dạng · ${dienBT} trong diện · ${String(h.chuyen_de?.length ?? 0).padStart(2)} chuyên đề · ${tut} dạng tụt · ${td} buổi thái độ dưới chuẩn${h.chuong_do ? ' · CHUÔNG ĐỎ' : ''}${h.lo_tien_quyet ? ' · LỖ NỀN' : ''}`)
}

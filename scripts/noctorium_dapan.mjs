// ============================================================================
// ⛔ ĐO THỰC TẾ 24/09: SAI ~29% (4/14 mẫu ngẫu nhiên) — KHÔNG CHẠY Ở CHẾ ĐỘ GHI. Giữ file lại làm tài liệu
// (đường đã thử + lý do thất bại), KHÔNG xoá, KHÔNG cho chạy production tiếp cho tới khi có cách khác.
//
// noctorium_dapan.mjs — thử rút đáp án TRẮC NGHIỆM còn thiếu bằng QUY TẮC (0 token, so chuỗi). Ý tưởng: nhiều
// phương án cùng xuất hiện trong lời giải ⇒ ưu tiên phương án khớp GẦN CUỐI đoạn văn nhất; 1 phương án là
// CHUỖI CON của phương án khác (vd √3 ⊂ 2√3) ⇒ bỏ chuỗi con.
//
// TẠI SAO SAI: (1) câu kết luận đôi khi NHẮC LẠI đề bài gốc sau khi đã nêu đáp số ("...là nguyên hàm của hàm
// số y=10^x") — cụm nhắc lại đó lại trùng 1 phương án nhiễu, đứng SAU đáp số thật ⇒ "ưu tiên gần cuối" chọn
// nhầm. (2) xoá dấu ngoặc `{}` làm 2 số DÍNH LIỀN thành chuỗi giả (`\dfrac{7}{4}` → "dfrac74" chứa "74" —
// đúng bằng 1 phương án số khác 74, hoàn toàn không liên quan) ⇒ quy tắc "chuỗi con" tưởng nhầm là trùng.
// (3) đáp số thật đôi khi CHỈ 1 chữ số (bị luật ≥2 ký tự loại bỏ để tránh nhiễu) trong khi 1 bước trung gian
// (số dưới dấu căn) lại dài ≥2 ký tự và được chọn nhầm. Bài học: so KHỚP CHUỖI không thay được ĐỌC HIỂU —
// việc này cần biết câu hỏi đang hỏi ĐẠI LƯỢNG NÀO, không suy được từ vị trí/độ dài chuỗi text.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import pg from 'pg'

const chuan = (s) => String(s ?? '').replace(/\\left|\\right|\\text\{[^}]*\}|\\,|\\;|\\ /g, '').replace(/[\s.$]+/g, '').replace(/\{|\}/g, '').toLowerCase()

function candidatesIn(cd, luaChon) {
  const all = luaChon.map((o, i) => ({ i, k: chuan(o.replace(/\.$/, '')) })).filter((x) => x.k && cd.includes(x.k))
  return all.filter((x) => !all.some((y) => y !== x && y.k.length > x.k.length && y.k.includes(x.k)))
}
export function rutDapAnTN(luaChon, loiGiai) {
  const giai = String(loiGiai ?? '').split('\n\n').filter(Boolean)
  if (!giai.length) return null
  const duoi3 = giai.slice(-3).join(' ')
  const m = duoi3.match(/(?:Chọn|chọn|Đáp án|đáp án)\s*(?:đáp án\s*)?\(?([A-D])\)?\b/)
  if (m) return m[1]
  const vay = chuan(giai.slice().reverse().find((l) => /Vậy|Do đó|Suy ra/.test(l)) ?? '')
  const duoi = chuan(duoi3)
  // Pass 1 — trong câu "Vậy…": cho phép đáp án NGẮN (1 ký tự số) nếu chỉ 1 phương án khớp trong đúng câu này.
  if (vay) { const cands = candidatesIn(vay, luaChon); if (cands.length === 1) return 'ABCD'[cands[0].i] }
  // Pass 2 — 3 đoạn cuối: đáp án phải dài ≥2 ký tự (tránh khớp nhiễu 1 chữ số rải rác); nhiều ứng viên ⇒ chọn
  // ứng viên xuất hiện GẦN CUỐI nhất, chỉ tin khi cách ứng viên thứ nhì ≥3 ký tự vị trí (đủ xa, không dính liền).
  for (const cd of [vay, duoi]) {
    if (!cd) continue
    const cands = candidatesIn(cd, luaChon).filter((x) => x.k.length >= 2)
    if (!cands.length) continue
    if (cands.length === 1) return 'ABCD'[cands[0].i]
    const withPos = cands.map((x) => ({ ...x, pos: cd.lastIndexOf(x.k) })).sort((a, b) => b.pos - a.pos)
    if (withPos[0].pos - withPos[1].pos >= 3) return 'ABCD'[withPos[0].i]
  }
  return null
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const DRY = process.argv.includes('--dry')
  const env = {}
  for (const f of ['.env']) if (existsSync(f)) for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL })
  await c.connect()
  const tk = { xet: 0, dien: 0, khong_chac: 0 }
  for (const table of ['dai_cau_hoi', 'hgt_cau_hoi']) {
    const { rows } = await c.query(
      `select ma_cau, lua_chon, loi_giai from ${table} where loai_cau='trac_nghiem' and dap_an is null and loi_giai is not null and lua_chon is not null and xoa_at is null`)
    for (const r of rows) {
      tk.xet++
      const lc = Array.isArray(r.lua_chon) ? r.lua_chon : []
      if (lc.length !== 4) continue
      const dap = rutDapAnTN(lc, r.loi_giai)
      if (!dap) { tk.khong_chac++; continue }
      tk.dien++
      if (!DRY) await c.query(`update ${table} set dap_an=$2 where ma_cau=$1`, [r.ma_cau, dap])
    }
  }
  console.log(JSON.stringify(tk, null, 1), DRY ? '(DRY — chưa ghi)' : '(đã ghi)')
  await c.end()
}

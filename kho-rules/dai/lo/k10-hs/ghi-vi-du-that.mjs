// Thay VÍ DỤ BỊA bằng CÂU THẬT trong Kho đề thi cho dạng chủ đề K10 Hàm số (NCD00234) — Thùy 05/11.
// Nguồn: ra/vt-cd1..4.json (mã câu do agent chọn) → nội dung lấy NGUYÊN VĂN từ dai_cau_hoi (đề, phương án, hình, lời giải, đáp án).
// Format đúng spec-format-noidung.md: `##VD` trần, đề dòng kế, hình `![](url)`, `Bài giải:` riêng dòng. Không để AI viết lại chữ nào.
// Chạy: node kho-rules/dai/lo/k10-hs/ghi-vi-du-that.mjs [--ghi]   (không --ghi = thử ROLLBACK, in 2 mẫu)
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const dang = [1, 2, 3, 4].flatMap((i) => JSON.parse(fs.readFileSync(new URL(`./ra/vt-cd${i}.json`, import.meta.url), 'utf8')).dang)
// Cây trong DB đã bị Thùy/phiên khác đổi tên dạng (05/11) — khớp theo tên HIỆN TẠI, KHÔNG đụng cấu trúc, chỉ ghi vi_du
const ALIAS = {
  'TXĐ có tham số m': 'Tập xác định có tham số m',
  'Điểm thuộc đồ thị, tham số để đồ thị qua điểm': 'Điểm thuộc đồ thị',
  'Xét đơn điệu theo định nghĩa / hàm bậc nhất': 'Xét tính đồng biến, nghịch biến khi cho công thức hàm số',
  'Nhận dạng đồ thị parabol': 'Chọn công thức parabol theo đặc điểm đồ thị',
  'Xác định công thức từ điều kiện': 'Xác hệ số của hàm số bậc 2',
  'm để tam thức / BPT nghiệm đúng ∀x, vô nghiệm, có nghiệm': 'm để tam thức / BPT nghiệm đúng với mọi x, vô nghiệm, có nghiệm',
}
for (const d of dang) d.dang = ALIAS[d.dang] || d.dang
dang.push({ nhom: '', dang: 'Nhận biết hàm số bậc hai', vi_du: ['T1100000008914'] })

const gon = (s) => (s || '').replace(/\r/g, '').replace(/\n[ \t]*\n+/g, '\n').trim()
function vd(q) {
  const L = ['##VD', gon(q.noi_dung)]
  if (q.anh_de) L.push(`![](${q.anh_de})`)
  if (Array.isArray(q.lua_chon) && q.lua_chon.length) q.lua_chon.forEach((t, i) => L.push(`${'ABCD'[i]}. ${String(t).trim()}`))
  L.push('Bài giải:')
  if (q.anh_dap_an) L.push(`![](${q.anh_dap_an})`)
  L.push(gon(q.loi_giai).replace(/^\s*(Bài giải|Lời giải|Giải)\s*[.:]\s*/i, ''))
  const da = (q.dap_an || '').trim()
  if (da) L.push(`Đáp án: ${da}`)
  return L.join('\n')
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const cd = (await c.query(`select id from dai_bdm_chu_de where khoi='10' and ten='Hàm số, đồ thị và ứng dụng'`)).rows
  if (cd.length !== 1) throw new Error('chủ đề không duy nhất')
  const ds = (await c.query(`select d.id, d.ten, n.ten nhom from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id=$1`, [cd[0].id])).rows
  const maTat = [...new Set(dang.flatMap((d) => d.vi_du))]
  const q = new Map((await c.query(`select ma_cau, noi_dung, lua_chon, dap_an, loi_giai, anh_de, anh_dap_an, menh_de, nguon from dai_cau_hoi where ma_cau = any($1)`, [maTat])).rows.map((r) => [r.ma_cau, r]))
  const dung = new Set(); let mau = ''
  for (const d of dang) {
    const m = ds.filter((x) => x.ten === d.dang)
    if (m.length !== 1) { console.log('BỎ QUA (dạng không còn trong cây): ' + d.dang); continue }
    if (dung.has(m[0].id)) throw new Error('trùng dạng ' + d.dang); dung.add(m[0].id)
    const khoi = d.vi_du.map((ma) => {
      const r = q.get(ma); if (!r) throw new Error('không có câu ' + ma)
      if (r.menh_de) throw new Error('câu Đ/S ' + ma); if (!r.loi_giai) throw new Error('thiếu lời giải ' + ma)
      return vd(r)
    })
    const text = khoi.join('\n\n')
    if (!mau) mau = text
    await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1`, [m[0].id, text])
  }
  const thieu = ds.filter((x) => !dung.has(x.id))
  console.log(`${dang.length}/${ds.length} dạng cập nhật. Không có ví dụ thật (giữ nguyên): ${thieu.map((x) => x.ten).join(' | ') || '—'}`)
  console.log('--- MẪU ---\n' + mau.slice(0, 1200))
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('Thử xong — ROLLBACK') }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()

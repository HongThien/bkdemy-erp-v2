// Chọn VÍ DỤ THẬT (câu có thật trong Kho đề thi K10, KHÔNG bịa) cho 31 dạng chủ đề K10 Hàm số — Thùy 05/11.
// Nguồn: gán kiểu D1..D6.md (ma_cau | mã kiểu) + dethi/erp-*.json (đề, đáp án, lời giải) + dai_cau_hoi.anh_de (hình).
// Chạy: node kho-rules/dai/lo/k10-hs/chon-vi-du-that.mjs  → in số câu thật mỗi dạng + ghi ra/vi-du-that.json (ứng viên đã chọn). KHÔNG ghi DB.
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const W = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k10-ham-so/'

// mã kiểu → tên dạng (khớp ghi-ban-do.mjs); null = không có dạng tương ứng
const MAP = {
  H01: 'TXĐ của hàm cho bằng công thức', H02: 'TXĐ có tham số m', H03: 'Tính giá trị / hàm nhiều công thức',
  H04: 'Điểm thuộc đồ thị, tham số để đồ thị qua điểm', H05: 'Đọc đồ thị / bảng biến thiên', H08: 'Đọc đồ thị / bảng biến thiên',
  H06: 'Xét đơn điệu theo định nghĩa / hàm bậc nhất', H07: 'Hàm cho bằng bảng/công thức khúc trong tình huống',
  Q01: 'Đỉnh, trục đối xứng, giao với trục', Q02: 'Bảng biến thiên, khoảng đồng biến – nghịch biến', Q03: 'Nhận dạng đồ thị parabol',
  Q05: 'Đọc dấu a, b, c từ đồ thị', Q10: 'Vẽ đồ thị, tịnh tiến', Q04: 'Xác định công thức từ điều kiện', Q06: 'GTLN/GTNN trên ℝ hoặc trên đoạn',
  Q07: 'Parabol cắt đường thẳng, số nghiệm f(x)=m', Q08: 'm để hàm bậc hai thoả điều kiện', Q09: 'Bài toán thực tế hàm bậc hai',
  T01: 'Xét dấu tam thức bậc hai', T02: 'Giải BPT bậc hai', T03: 'BPT tích / thương (nâng cao)', T07: 'Tập nghiệm – số nghiệm nguyên – hệ BPT bậc hai',
  T04: 'm để tam thức / BPT nghiệm đúng ∀x, vô nghiệm, có nghiệm', T05: 'm để PT bậc hai có nghiệm thoả điều kiện', T06: 'BPT bậc hai trong thực tế',
  P01: '(P01)', P02: 'PT chứa căn khác (nâng cao)', P04: 'PT chứa dấu giá trị tuyệt đối / trùng phương (nâng cao)',
  P05: 'Thực tế / hình học dẫn đến PT căn', P06: 'm để PT chứa căn có nghiệm / nghiệm duy nhất / vô nghiệm',
}
const CAN_HINH = new Set(['Đọc đồ thị / bảng biến thiên', 'Nhận dạng đồ thị parabol', 'Đọc dấu a, b, c từ đồ thị'])

const ky = new Map() // ma → {codes, note}
for (let i = 1; i <= 6; i++) for (const l of fs.readFileSync(W + `ra/D${i}.md`, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*(T\d+)\s*\|\s*([A-Z]\d{2}|X\d\d)(?:\+([A-Z]\d{2}|X\d\d))?\s*\|\s*(.*)$/)
  if (m) ky.set(m[1], { a: m[2], b: m[3] || null, note: m[4] })
}
const cau = new Map()
for (let i = 1; i <= 6; i++) for (const x of JSON.parse(fs.readFileSync(W + `dethi/erp-${i}.json`, 'utf8'))) cau.set(x.ma, x)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const anh = new Map((await c.query(`select ma_cau, anh_de from dai_cau_hoi where ma_cau = any($1)`, [[...cau.keys()]])).rows.map((r) => [r.ma_cau, r.anh_de]))
await c.end()

function tenDang(ma, x) {
  const k = ky.get(ma); if (!k || !MAP[k.a]) return null
  if (k.a === 'P01') { const s = (x.de_bai || '') + ''; return /\\sqrt\{[^{}]*\}\s*=\s*\\sqrt/.test(s) ? '√f = √g' : '√f = g' }
  return MAP[k.a]
}
const nhom = {}
for (const [ma, x] of cau) {
  const d = tenDang(ma, x); if (!d) continue
  ;(nhom[d] ||= []).push({ ma, don: !ky.get(ma).b, x })
}
const out = {}
console.log('dạng | tổng câu thật | đủ điều kiện làm ví dụ')
for (const [d, ds] of Object.entries(nhom).sort()) {
  const ok = ds.filter(({ x, ma }) => x.lg && x.lg.length >= 40 && x.lg.length <= 1400 && x.de_bai && x.de_bai.length <= 520 && !x.menh_de && x.da !== undefined
    && (CAN_HINH.has(d) ? !!anh.get(ma) : (!x.hinh || !!anh.get(ma))))
  const pri = [...ok].sort((p, q) => (q.don - p.don) || (p.x.lg.length - q.x.lg.length))
  // lấy 2 câu: ưu tiên mã kiểu đơn, lời giải ngắn, khác đề nhau
  const pick = []; const de = new Set()
  for (const p of pri) { if (pick.length >= 2) break; if (de.has(p.x.de) && pri.length > 3) continue; pick.push(p); de.add(p.x.de) }
  out[d] = { tong: ds.length, du: ok.length, pick: pick.map(({ ma, x }) => ({ ma, loai: x.loai, de: x.de, de_bai: x.de_bai, lc: x.lc, da: x.da, lg: x.lg, anh: anh.get(ma) || null })) }
  console.log(`${d} | ${ds.length} | ${ok.length}`)
}
fs.writeFileSync(new URL('./ra/vi-du-that.json', import.meta.url), JSON.stringify(out, null, 2))

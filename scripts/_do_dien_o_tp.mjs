// ĐO KHẢ THI "trắc nghiệm từng phần" (Điền Ô, spec-dien-o.md Phase 2) trên HÀNG ĐỢI dạng ở spec-mcq-tung-phan.md §1.
// Khác _do_dien_o.mjs (09/09, pool 1, tách theo DÒNG): ở đây tách theo `=` TRONG TỪNG ĐOẠN `$…$` (CEO §0.4), nối chuỗi
// qua nhiều dòng theo nhãn (A = … / A = …), và in LÝ DO không đọc được (token lạ nào) để biết cần mở rộng gì trước khi
// viết mcq-dien.mjs. Bộ đọc dùng chung với mcq-dien.mjs: scripts/lib/dien-buoc.mjs. Chỉ đọc DB, không ghi.
//   node scripts/_do_dien_o_tp.mjs [--dang T106020304,T107010205] [--out chi_tiet.json] [--in ma_cau]
// Kết quả 12/09 (15 dạng, 630 câu): chỉ T106020304 (90% câu có ô, 3.8 ô/câu) + T107010205 (92%, 4.5 ô/câu) hợp khuôn
// "ô Giá trị 100% máy"; 13 dạng còn lại vướng ký hiệu (… / ⇒ / ∈ / ⋮ / ≥) — cần bộ đọc riêng theo dạng.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { tachChuoi, timO, val } from './lib/dien-buoc.mjs'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const url = (env.match(/^\s*DATABASE_URL_RO\s*=\s*(.+?)\s*$/m) || env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m))[1].replace(/^["']|["']$/g, '')

const HANG_DOI = ['T106030401', 'T106020601', 'T106030102', 'T106030403', 'T106020304', 'T107010205', '077022220401', '0770222204220402',
  'T107010501', 'T107010502', 'T107010503', 'T107010504', 'T107010505', 'T107010506', 'T107010507', 'T107010508']
const dangs = opt('--dang') ? opt('--dang').split(',') : HANG_DOI

const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
const { rows } = await c.query(`select q.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an, q.loi_giai from dai_cau_hoi q left join dai_ban_do b on b.ma_dang = q.dang_chinh
  where q.xoa_at is null and q.da_duyet and q.loi_giai is not null and q.lua_chon is null and q.menh_de is null and q.dang_chinh = any($1)
  and ($2::text is null or q.ma_cau = $2) order by q.dang_chinh, q.ma_cau`, [dangs, opt('--in') ?? null])
await c.end()

const tk = {}
const chiTiet = []
for (const q of rows) {
  const t = tk[q.dang_chinh] ??= { ten: q.ten_dang, cau: 0, doan: 0, doan_doc: 0, cau_doc_het: 0, cau_co_o: 0, o: 0, o_dap_so: 0, cau_nhat_quan: 0, cau_lech: 0, ly_do: {} }
  t.cau++
  const { chuoi } = tachChuoi(q.loi_giai)
  let docHet = true, nO = 0, nODs = 0, nhatQuan = true, coChuoiSo = false
  for (const ch of chuoi) {
    for (const m of ch.manh) {
      t.doan++
      if (m.tree) t.doan_doc++
      else { docHet = false; if (m.ly_do) t.ly_do[m.ly_do] = (t.ly_do[m.ly_do] ?? 0) + 1 }
    }
    if (ch.khong_dau_bang) continue
    const os = timO(ch); nO += os.length; nODs += os.filter((x) => x.la_dap_so).length
    ch.o = os
    if (!ch.tim_x) { const vals = ch.manh.map((m) => (m.tree ? val(m.tree) : null)).filter(Boolean); if (vals.length >= 2) { coChuoiSo = true; if (!vals.every((v) => v === vals[0])) nhatQuan = false } }
  }
  if (docHet && chuoi.length) t.cau_doc_het++
  if (nO) t.cau_co_o++
  t.o += nO; t.o_dap_so += nODs
  if (coChuoiSo) { if (nhatQuan) t.cau_nhat_quan++; else t.cau_lech++ }
  chiTiet.push({ ma_cau: q.ma_cau, dang: q.dang_chinh, dap_an: q.dap_an, doc_het: docHet, n_o: nO, nhat_quan: coChuoiSo ? nhatQuan : null,
    chuoi: chuoi.map((ch) => ({ nhan: ch.nhan, tim_x: ch.tim_x, manh: ch.manh.map((m) => ({ raw: m.raw, ok: !!m.tree, v: m.tree ? val(m.tree) : null, ly_do: m.ly_do })), o: (ch.o ?? []).map(({ k, v, la_dap_so }) => ({ k, v, la_dap_so })) })) })
}
const pct = (a, b) => (b ? Math.round((100 * a) / b) + '%' : '-')
console.log('dạng | tên | câu | đoạn đọc được | câu đọc HẾT | câu có ô | ô/câu-có-ô | ô là đáp số | nhất quán / lệch | lý do không đọc (top)')
for (const [d, t] of Object.entries(tk)) {
  const ly = Object.entries(t.ly_do).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k}:${v}`).join(' ')
  console.log(`${d} | ${t.ten.slice(0, 38)} | ${t.cau} | ${pct(t.doan_doc, t.doan)} | ${pct(t.cau_doc_het, t.cau)} | ${pct(t.cau_co_o, t.cau)} (${t.cau_co_o}) | ${(t.o / Math.max(1, t.cau_co_o)).toFixed(1)} | ${t.o_dap_so} | ${t.cau_nhat_quan}/${t.cau_lech} | ${ly}`)
}
const f = opt('--out'); if (f) { writeFileSync(f, JSON.stringify(chiTiet, null, 1), 'utf8'); console.log('→', f) }
if (opt('--in')) console.log(JSON.stringify(chiTiet, null, 1))

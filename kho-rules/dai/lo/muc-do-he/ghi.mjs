// Ghi độ khó + hệ cho dạng bài bản đồ mới Toán còn TRỐNG (Thùy 11/11: "M đề xuất độ khó đi. duyệt luôn. sau này nếu cần t sẽ sửa hậu kiểm").
// Nguồn độ khó: (1) dạng cũ đối ứng (dai_ban_do.muc_do, làm tròn TB) · (2) Claude đề xuất (de-xuat.tsv).
// Hệ suy từ độ khó theo mục tiêu điểm (S 9,5+ · A 9+ · B 8+ · C 7+; chỉ A trở lên học nâng cao) — ma trận đề 4 mức nhận thức:
//   mức 1–2 (nhận biết, thông hiểu ≈ 7 điểm) → C · 3 (vận dụng) → B · 4 (nâng cao) → A · 5 (HSG/chuyên) → S.
// CHỈ điền ô đang NULL (dạng đã có giữ nguyên). 1 transaction, kiểm lại sau ghi. Nhật ký ghi-nhat-ky.json (giá trị cũ = NULL) để hoàn tác.
// Dùng: node --env-file=.env kho-rules/dai/lo/muc-do-he/ghi.mjs [--ghi]
import pg from 'pg'; import fs from 'fs'
const D = 'kho-rules/dai/lo/muc-do-he/'
const ghi = process.argv.includes('--ghi')
const ds = JSON.parse(fs.readFileSync(D + 'ds.json', 'utf8'))
const dx = Object.fromEntries(fs.readFileSync(D + 'de-xuat.tsv', 'utf8').trim().split(/\r?\n/).map((l) => l.split('\t')).map(([id, m]) => [id, +m]))
const HE = { 1: 'C', 2: 'C', 3: 'B', 4: 'A', 5: 'S' }
const thieu = ds.filter((d) => d.muc_do == null && d.muc_cu == null && !dx[d.id]).map((d) => d.id)
const thua = Object.keys(dx).filter((id) => !ds.some((d) => d.id === id && d.muc_do == null && d.muc_cu == null))
if (thieu.length || thua.length) { console.error('Đề xuất lệch danh sách — thiếu:', thieu, 'thừa:', thua); process.exit(1) }
if (Object.values(dx).some((m) => !(m >= 1 && m <= 5))) { console.error('Mức ngoài 1–5'); process.exit(1) }
const viec = ds.map((d) => {
  const muc = d.muc_do ?? d.muc_cu ?? dx[d.id]
  return { ...d, muc_moi: d.muc_do == null ? muc : null, nguon_muc: d.muc_do != null ? 'có sẵn' : d.muc_cu != null ? 'bản đồ cũ' : 'Claude', he_moi: d.bac_toi_thieu == null ? HE[muc] : null, muc }
})
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query('begin')
try {
  let nM = 0, nH = 0
  for (const v of viec) {
    if (v.muc_moi != null) nM += (await c.query(`update dai_bdm_dang_bai set muc_do = $2 where id = $1 and muc_do is null`, [v.id, v.muc_moi])).rowCount
    if (v.he_moi != null) nH += (await c.query(`update dai_bdm_dang_bai set bac_toi_thieu = $2 where id = $1 and bac_toi_thieu is null`, [v.id, v.he_moi])).rowCount
  }
  const k = (await c.query(`select count(*) filter (where muc_do is null) muc_trong, count(*) filter (where bac_toi_thieu is null) he_trong from dai_bdm_dang_bai`)).rows[0]
  console.log('ghi mức:', nM, '| ghi hệ:', nH, '| sau ghi còn trống — mức:', k.muc_trong, 'hệ:', k.he_trong)
  if (+k.muc_trong || +k.he_trong) throw new Error('Còn ô trống sau ghi — huỷ')
  await c.query(ghi ? 'commit' : 'rollback')
  console.log(ghi ? '✔ ĐÃ GHI' : '(chạy thử — ROLLBACK; thêm --ghi để ghi)')
  if (ghi) fs.writeFileSync(D + 'ghi-nhat-ky.json', JSON.stringify(viec.filter((v) => v.muc_moi != null || v.he_moi != null).map((v) => ({ id: v.id, muc_do: v.muc_moi, bac_toi_thieu: v.he_moi, nguon_muc: v.nguon_muc })), null, 1))
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ:', e.message); process.exitCode = 1 }
await c.end()
// HTML hậu kiểm: theo khối › chủ đề › nhóm; tô màu ô vừa điền
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[x])
const khoi = [...new Set(viec.map((v) => v.khoi))]
let h = `<!doctype html><meta charset="utf-8"><title>Độ khó + hệ bản đồ mới Toán</title><style>body{font:14px system-ui;margin:20px;max-width:1100px}table{border-collapse:collapse;width:100%;margin-bottom:18px}td,th{border:1px solid #ddd;padding:4px 6px;text-align:left;vertical-align:top}th{background:#f3f4f6}.m{font-weight:700;text-align:center}.moi{background:#fef3c7}.cu{background:#e0f2fe}h2{margin-top:28px}.nho{color:#6b7280;font-size:12px}</style>
<h1>Độ khó + hệ — dạng bài bản đồ mới Toán (điền ${viec.filter((v) => v.muc_moi != null || v.he_moi != null).length} dạng còn trống)</h1>
<p>Hệ suy từ độ khó: mức 1–2 → C+ · 3 → B+ · 4 → A+ · 5 → S. <span class="moi">vàng</span> = Claude đề xuất · <span class="cu">xanh</span> = lấy từ bản đồ cũ. Sửa trên Bản đồ mới (bấm chip ⚡).</p>`
for (const kh of khoi) {
  const vs = viec.filter((v) => v.khoi === kh && (v.muc_moi != null || v.he_moi != null))
  if (!vs.length) continue
  h += `<h2>Khối ${esc(kh)} <span class="nho">(${vs.length} dạng)</span></h2><table><tr><th>Chủ đề › Nhóm</th><th>Dạng bài</th><th>Độ khó</th><th>Hệ</th></tr>`
  for (const v of vs) h += `<tr><td class="nho">${esc(v.chu_de)} › ${esc(v.nhom)}</td><td>${esc(v.ten)}<div class="nho">${esc(v.mo_ta)}</div></td><td class="m ${v.muc_moi == null ? '' : v.nguon_muc === 'Claude' ? 'moi' : 'cu'}">${v.muc}${v.muc_moi == null ? ' <span class="nho">(có sẵn)</span>' : ''}</td><td class="m">${esc(v.he_moi ?? v.bac_toi_thieu)}${(v.he_moi ?? v.bac_toi_thieu) === 'S' ? '' : '+'}${v.he_moi == null ? ' <span class="nho">(có sẵn)</span>' : ''}</td></tr>`
  h += `</table>`
}
fs.writeFileSync(D + 'hau-kiem.html', h)

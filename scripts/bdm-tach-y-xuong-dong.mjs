// Lý thuyết / ví dụ bản đồ mới: câu nhiều ý (a) b) c)…) phải MỖI Ý MỘT DÒNG (Thùy 08/11: "khi bài có nhiều ý thì câu hỏi phải xuống dòng").
//   node scripts/bdm-tach-y-xuong-dong.mjs [--html <ra.html>] [--ghi]     (mặc định: chỉ quét + báo, không ghi)
// Quét dai_bdm_dang_bai (vi_du, ly_thuyet, mo_ta) · dai_bdm_nhom (ly_thuyet, mo_ta) · khtn_bdm_* tương ứng (nếu có).
// Một dòng có ≥ 2 nhãn ý LIÊN TIẾP a) b) … (ngoài công thức $…$) ⇒ xuống dòng trước MỖI nhãn (một \n — dòng trống sẽ cắt khung ##VD,
// spec-format-noidung.md). Chỉ thêm xuống dòng + bỏ khoảng trắng thừa quanh chỗ cắt: KHÔNG đổi chữ nào khác. Bản cũ lưu
// scripts/bien_ban/tach-y-<thời điểm>.json để khôi phục. Ghi trong 1 transaction, bump updated_at (trigger touch).
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const HTML = args.includes('--html') ? args[args.indexOf('--html') + 1] : null

// tách chuỗi thành đoạn ngoài/trong công thức: $$…$$ trước, rồi $…$
const doan = (s) => s.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*\$)/g)
const NHAN = /(^|[\s:;.,!?])([a-h])\)(?=\s)/g

// trả dòng đã tách, hoặc null nếu không cần tách
function tachDong(dong) {
  const ph = doan(dong)
  // tìm nhãn ngoài công thức, nhớ vị trí trong chuỗi gốc
  const nhan = []
  let off = 0
  ph.forEach((p, i) => {
    if (i % 2 === 0) { let m; NHAN.lastIndex = 0; while ((m = NHAN.exec(p))) nhan.push({ chu: m[2], vt: off + m.index + m[1].length }) }
    off += p.length
  })
  if (nhan.length < 2) return null
  // chuỗi nhãn liên tiếp bắt đầu từ 'a'
  const i0 = nhan.findIndex((n) => n.chu === 'a')
  if (i0 < 0) return null
  const day = [nhan[i0]]
  for (let i = i0 + 1; i < nhan.length; i++) if (nhan[i].chu.charCodeAt(0) === day[day.length - 1].chu.charCodeAt(0) + 1) day.push(nhan[i])
  if (day.length < 2) return null
  // CHỈ tách kiểu ĐỀ BÀI: "…: a) … b) …" hoặc dòng mở đầu bằng "a)". KHÔNG tách khi nhãn chỉ được NHẮC TỚI trong câu kết luận
  // ("Vậy a) và d) đúng; b) và c) sai", "hàm số ở câu a) …; ở câu b) …", "loại a) và c)") — soát 08/11 thấy 46 dòng như vậy.
  // Đề thật cũng có dạng "Cho … . a) Tìm …; b) …" và "Tính a) …; b) …" (8 dòng, soát lần 2) ⇒ không đòi dấu ":" trước a).
  const giuCho = ph.map((p, i) => (i % 2 ? '§' : p)).join('')   // công thức thay bằng § để "và" giữa 2 công thức không bị bắt nhầm
  if (/^\s*(vậy|kết luận|do đó|suy ra|nên|ta có)\b/i.test(giuCho)) return null
  if (/(câu|ý|ở|phần|từ|và|loại|của|vậy)\s+[a-h]\)/i.test(giuCho) || /[a-h]\)\s+(và\b|,|đúng|sai)/i.test(giuCho)) return null
  let ra = '', tu = 0
  for (const n of day) {
    if (n.vt === 0) continue
    ra += dong.slice(tu, n.vt).replace(/\s+$/, '') + '\n'
    tu = n.vt
  }
  ra += dong.slice(tu)
  return ra === dong ? null : ra
}
function sua(text) {
  if (!text) return null
  const dongs = text.split('\n')
  let doi = false
  const ra = dongs.map((d) => { const t = tachDong(d); if (t != null) { doi = true; return t } return d })
  return doi ? ra.join('\n') : null
}

const BANG = [
  ['dai_bdm_dang_bai', ['vi_du', 'ly_thuyet', 'mo_ta']],
  ['dai_bdm_nhom', ['ly_thuyet', 'mo_ta']],
  ['khtn_bdm_dang_bai', ['vi_du', 'ly_thuyet', 'mo_ta']],
  ['khtn_bdm_nhom', ['ly_thuyet', 'mo_ta']],
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const coBang = new Set((await c.query(`select table_name from information_schema.tables where table_schema = 'public'`)).rows.map((r) => r.table_name))
const doi = []
for (const [bang, cots] of BANG) {
  if (!coBang.has(bang)) continue
  const coCot = new Set((await c.query(`select column_name from information_schema.columns where table_name = $1`, [bang])).rows.map((r) => r.column_name))
  const cs = cots.filter((x) => coCot.has(x))
  const rows = (await c.query(`select id, ten, ${cs.join(', ')} from ${bang}`)).rows
  for (const r of rows) for (const col of cs) { const m = sua(r[col]); if (m != null) doi.push({ bang, id: r.id, ten: r.ten, cot: col, cu: r[col], moi: m }) }
}
const dem = {}
for (const d of doi) { const k = `${d.bang}.${d.cot}`; dem[k] = (dem[k] || 0) + 1 }
console.log('cần tách:', doi.length, dem)
for (const d of doi.slice(0, 4)) {
  const a = d.cu.split('\n').find((x) => tachDong(x)); console.log(`— ${d.id} ${d.cot}:\n   CŨ: ${a?.slice(0, 160)}\n   MỚI:\n     ${tachDong(a)?.split('\n').join('\n     ').slice(0, 300)}`)
}
if (HTML) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  fs.writeFileSync(HTML, `<!doctype html><meta charset="utf-8"><title>Tách ý xuống dòng</title><style>body{font:14px system-ui;margin:16px;max-width:1100px}table{border-collapse:collapse;width:100%}td{border:1px solid #ddd;vertical-align:top;padding:6px;white-space:pre-wrap;font-size:13px}th{background:#f3f3f3;padding:6px}</style>
<h2>Lý thuyết / ví dụ bản đồ mới — tách ý xuống dòng (${doi.length} ô)</h2><table><tr><th>Mục</th><th>Cũ</th><th>Mới</th></tr>${doi.map((d) => `<tr><td>${esc(d.bang)}<br>${esc(d.id)} · ${esc(d.cot)}<br><b>${esc(d.ten)}</b></td><td>${esc(d.cu)}</td><td>${esc(d.moi)}</td></tr>`).join('')}</table>`)
  console.log('→', HTML)
}
if (GHI && doi.length) {
  const bb = `scripts/bien_ban/tach-y-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  fs.mkdirSync('scripts/bien_ban', { recursive: true }); fs.writeFileSync(bb, JSON.stringify(doi.map(({ bang, id, cot, cu }) => ({ bang, id, cot, cu })), null, 1))
  try {
    await c.query('begin')
    let n = 0
    for (const d of doi) n += (await c.query(`update ${d.bang} set ${d.cot} = $2 where id = $1 and ${d.cot} = $3`, [d.id, d.moi, d.cu])).rowCount
    if (n !== doi.length) throw new Error(`ghi ${n}/${doi.length} — có ô vừa bị sửa, ROLLBACK`)
    await c.query('commit'); console.log(`✔ ĐÃ GHI ${n} ô · bản cũ: ${bb}`)
  } catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
}
await c.end()

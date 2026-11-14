// ============================================================================
// ban-do-4t-dien-lo.mjs — ĐIỀN mô tả · lý thuyết · ví dụ cho các dạng bài bản đồ mới 4T còn trống (Thùy 14/11 "Làm bước 1":
// bản đồ 4T 92/104 dạng thiếu tài liệu ⇒ cổng B3 chặn phân dạng 1.223 câu sách đang ở dạng chờ).
// Nội dung = nháp do Sonnet soạn theo lô chủ đề (brief: bám sách "Toán arc 4 quyển 1", khuôn ban-do-4t-tbc-dien.mjs đã duyệt),
// Opus soát, máy kiểm. Đầu vào: <thư mục lô>/{A..F}/dang.json + out.json.
//
//   node scripts/kho/ban-do-4t-dien-lo.mjs <thư mục lô>          (XEM: kiểm + rollback + dựng HTML reports/ban-do-4t-ly-thuyet-vi-du.html)
//   node scripts/kho/ban-do-4t-dien-lo.mjs <thư mục lô> --ghi    (COMMIT — chỉ khi Thùy / trưởng khối nói "ghi")
//
// CHỈ ĐIỀN Ô TRỐNG (đọc lại DB trong cùng transaction): ô đã có chữ thì giữ nguyên, không đè. Máy kiểm chặn cả lượt nếu:
// thẻ lạ (chỉ ##TC ##PP ##CY ##VD ##NX) · công thức KaTeX hỏng · ví dụ thiếu "Hướng dẫn giải"/"Đáp số" · chữ cấm lớp 4 (ước, bội, số âm).
// ============================================================================
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import katex from 'katex'
import { katexCss, mathHtml, esc } from '../lib/html-tu-chua.mjs'

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = process.argv[2]
const GHI = process.argv.includes('--ghi')
if (!DIR || !existsSync(DIR)) { console.error('Dùng: node scripts/kho/ban-do-4t-dien-lo.mjs <thư mục lô> [--ghi]'); process.exit(2) }
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))

// ── gom lô ───────────────────────────────────────────────────────────────────────────────────────
const LO = readdirSync(DIR).filter((f) => existsSync(join(DIR, f, 'dang.json')) && existsSync(join(DIR, f, 'out.json'))).sort()
const dang = [], nhom = new Map(), loi = []
for (const lo of LO) {
  const vao = JSON.parse(readFileSync(join(DIR, lo, 'dang.json'), 'utf8'))
  const ra = JSON.parse(readFileSync(join(DIR, lo, 'out.json'), 'utf8'))
  const theo = new Map((ra.dang ?? []).map((d) => [d.id, d]))
  for (const v of vao) {
    const r = theo.get(v.id)
    if (!r) { loi.push(`${lo}: thiếu dạng ${v.id}`); continue }
    dang.push({ ...v, lo, ra: r })
  }
  for (const n of ra.nhom ?? []) if (n?.nhom_id && n.ly_thuyet) nhom.set(n.nhom_id, { ...n, lo })
}

// ── máy kiểm ─────────────────────────────────────────────────────────────────────────────────────
const THE = new Set(['TC', 'PP', 'CY', 'VD', 'NX'])
function kiem(ten, s, laVd = false) {
  if (!s) return
  for (const l of s.split('\n')) { const m = l.match(/^##(\S+)/); if (m && !THE.has(m[1])) loi.push(`${ten}: thẻ lạ ##${m[1]}`) }
  for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true }) } catch (e) { loi.push(`${ten}: KaTeX hỏng "${m[1].slice(0, 40)}" (${e.message.slice(0, 60)})`) } }
  if (((s.match(/\$/g) ?? []).length) % 2) loi.push(`${ten}: số dấu $ lẻ`)
  // \b của JS không hiểu chữ có dấu ("được" chứa "ước") ⇒ ranh giới bằng \p{L}
  const uoc = s.match(/(?<![\p{L}])(ước|bội)(?![\p{L}])(?! lượng)/iu); if (uoc) loi.push(`${ten}: dùng "${uoc[1]}" (lớp 6)`)
  // số âm: dấu trừ đứng ngay sau "=", "(" hoặc đầu công thức mà theo sau là chữ số (dấu $-$ đứng một mình là phép trừ trong lời)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) if (/(=|\()\s*-\s*\d/.test(m[1])) loi.push(`${ten}: số âm "${m[1].slice(0, 30)}"`)
  if (laVd) {
    if (!/^##VD/.test(s)) loi.push(`${ten}: ví dụ không mở bằng ##VD`)
    if (!/\*\*Hướng dẫn giải:\*\*/.test(s)) loi.push(`${ten}: ví dụ thiếu "**Hướng dẫn giải:**"`)
    // bài tính giá trị biểu thức kết thúc bằng phép tính (như "Bài làm" của sách); bài lời văn / tìm số phải có Đáp số hoặc câu kết "Vậy …"
    const cuoi = s.trim().split(/\n/).pop()
    if (!/Đáp số|Vậy/.test(s) && !/^([a-z]\)\s*)?\$.*=.*\$$/.test(cuoi.trim())) loi.push(`${ten}: ví dụ thiếu "Đáp số" / câu kết`)
  }
}
for (const d of dang) {
  for (const k of ['mo_ta', 'ly_thuyet', 'vi_du']) if (d.ra[k] && !d.thieu.includes(k)) d.ra[k] = null // ô đã có chữ: không bao giờ viết
  kiem(`${d.id} mô tả`, d.ra.mo_ta); kiem(`${d.id} lý thuyết`, d.ra.ly_thuyet); kiem(`${d.id} ví dụ`, d.ra.vi_du, true)
  if (d.ra.mo_ta && /^##/m.test(d.ra.mo_ta)) loi.push(`${d.id}: mô tả không được có thẻ`)
}
for (const [id, n] of nhom) kiem(`${id} lý thuyết nhóm`, n.ly_thuyet)

// ── DB ───────────────────────────────────────────────────────────────────────────────────────────
const db = new pg.Client({ connectionString: GHI ? (process.env.DATABASE_URL_RW ?? env.DATABASE_URL) : (env.DATABASE_URL_RO ?? env.DATABASE_URL), ssl: { rejectUnauthorized: false } })
await db.connect()
const q = async (s, p) => (await db.query(s, p)).rows
const bao = []
try {
  await db.query('begin')
  const trong = (s) => !(s && String(s).replace(/<[^>]+>/g, '').trim())
  for (const [id, n] of nhom) {
    const cu = (await q(`select n.ten, n.ly_thuyet, cd.khoi from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = $1`, [id]))[0]
    if (!cu || cu.khoi !== '4T') { loi.push(`nhóm ${id} không thuộc bản đồ 4T`); continue }
    n.ten = cu.ten
    n.trang_thai = trong(cu.ly_thuyet) ? 'điền' : 'GIỮ (đã có chữ)'
    if (GHI && trong(cu.ly_thuyet)) await db.query(`update dai_bdm_nhom set ly_thuyet = $2 where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, n.ly_thuyet])
  }
  for (const d of dang) {
    const cu = (await q(`select d.mo_ta, d.ly_thuyet, d.vi_du, cd.khoi from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = $1`, [d.id]))[0]
    if (!cu || cu.khoi !== '4T') { loi.push(`dạng ${d.id} không thuộc bản đồ 4T`); continue }
    const lam = {}
    for (const k of ['mo_ta', 'ly_thuyet', 'vi_du']) lam[k] = d.ra[k] ? (trong(cu[k]) ? 'điền' : 'GIỮ') : '—'
    if (GHI) for (const k of ['mo_ta', 'ly_thuyet', 'vi_du']) if (lam[k] === 'điền')
      await db.query(`update dai_bdm_dang_bai set ${k} = $2 where id = $1 and coalesce(btrim(${k}), '') = ''`, [d.id, d.ra[k]])
    bao.push({ id: d.id, ten: d.ten.slice(0, 45), lo: d.lo, ...lam, vd: d.ra.nguon_vd ?? '' })
  }
  if (loi.length) { console.error(`✘ máy kiểm: ${loi.length} lỗi`); for (const l of loi) console.error('   ', l) }
  console.table(bao)
  console.log(`dạng ${dang.length} · nhóm có lý thuyết mới ${nhom.size} · lỗi ${loi.length}`)
  if (GHI && loi.length) throw new Error('còn lỗi máy kiểm — KHÔNG ghi')
  await db.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '■ ĐÃ GHI' : '□ XEM (rollback, không ghi gì)')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('✘', e.message); process.exitCode = 1 } finally { await db.end() }

// ── HTML xem trước ───────────────────────────────────────────────────────────────────────────────
const NHAN = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp giải', CY: 'Chú ý', VD: 'Ví dụ', NX: 'Nhận xét' }
const dongMath = (x) => mathHtml(x).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
const khoi = (s) => !s ? '' : s.split(/\n{2,}/).map((b) => {
  const l = b.split('\n'), m = l[0].match(/^##(TC|PP|CY|VD|NX)\s*(.*)$/)
  if (!m) return `<p>${l.map(dongMath).join('<br>')}</p>`
  return `<div class="k ${m[1]}"><div class="tag">${NHAN[m[1]]}${m[2] ? ' — ' + esc(m[2]) : ''}</div>${m[1] === 'PP' ? '<ol>' + l.slice(1).map((x) => `<li>${dongMath(x)}</li>`).join('') + '</ol>' : l.slice(1).map((x) => `<div>${dongMath(x)}</div>`).join('')}</div>`
}).join('')
const vd = (s) => {
  if (!s) return ''
  const [de, ...giai] = s.replace(/^##VD[^\n]*\n/, '').split(/\n(?=\*\*Hướng dẫn giải:\*\*)/)
  return `<div class="k VD"><div class="tag">Ví dụ</div>${de.split('\n').map((x) => `<div>${dongMath(x)}</div>`).join('')}</div><div class="giai">${giai.join('\n').split(/\n+/).map((x) => `<div>${dongMath(x)}</div>`).join('')}</div>`
}
const coSan = (s) => s ? `<details><summary>đang có trên bản đồ</summary><div class="cs">${esc(s).slice(0, 1500)}</div></details>` : ''
let html = '', cdTr = '', nhTr = ''
for (const d of dang) {
  if (d.chu_de !== cdTr) { html += `<h2>Chủ đề ${esc(d.chu_de)}</h2>`; cdTr = d.chu_de }
  if (d.nhom_id !== nhTr) {
    nhTr = d.nhom_id
    const n = nhom.get(d.nhom_id)
    html += `<h3 class="nh">${esc(d.chuyen_de)} › Nhóm ${esc(d.nhom)} <small>${d.nhom_id}</small></h3>` + (n ? `<div class="nlt"><span class="moi">Lý thuyết nhóm — MỚI</span>${khoi(n.ly_thuyet)}</div>` : coSan(d.co_san.nhom_ly_thuyet))
  }
  const r = d.ra, nv = r.nguon_vd ?? ''
  html += `<section id="${d.id}"><h4>${esc(d.ten)} <small>${d.id}</small>${nv ? ` <span class="nguon ${nv.startsWith('sach') ? 's' : 'm'}">${esc(nv)}</span>` : ''}</h4>
${r.ghi_chu ? `<div class="gc">⚑ ${dongMath(r.ghi_chu)}</div>` : ''}
<div class="o"><b>Mô tả</b>${r.mo_ta ? `<span class="moi">MỚI</span><div>${dongMath(r.mo_ta)}</div>` : (d.co_san.mo_ta ? `<div class="cu">${dongMath(d.co_san.mo_ta)}</div>` : '<div class="cu">—</div>')}</div>
<div class="o"><b>Lý thuyết dạng</b>${r.ly_thuyet ? `<span class="moi">MỚI</span>${khoi(r.ly_thuyet)}` : (d.co_san.ly_thuyet ? coSan(d.co_san.ly_thuyet) : '<div class="cu">(dùng lý thuyết nhóm)</div>')}</div>
<div class="o"><b>Ví dụ</b>${r.vi_du ? `<span class="moi">MỚI</span>${vd(r.vi_du)}` : coSan(d.co_san.vi_du) || '<div class="cu">—</div>'}</div></section>`
}
const soS = dang.filter((d) => /^sach/.test(d.ra.nguon_vd ?? '')).length, soM = dang.filter((d) => d.ra.nguon_vd === 'mo_phong').length
const tep = join(GOC, 'reports', 'ban-do-4t-ly-thuyet-vi-du.html')
writeFileSync(tep, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bản đồ 4T — duyệt lý thuyết</title><style>${katexCss()}
:root{--bg:#fafafb;--c:#fff;--tx:#1f2937;--mu:#6b7280;--ln:#e5e7eb;--gc:#fff7e6}@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--c:#181b24;--tx:#e5e7eb;--mu:#9ca3af;--ln:#2a2f3a;--gc:#2b2414}}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 system-ui,"Segoe UI",sans-serif;padding:16px}main{max-width:900px;margin:0 auto}h1{font-size:21px}h2{font-size:19px;margin-top:38px;border-top:3px solid var(--ln);padding-top:14px}h3.nh{font-size:16px;margin:26px 0 6px;color:#7c5cbf}h4{font-size:16px;margin:4px 0 6px}small{color:var(--mu);font-weight:400}
section{background:var(--c);border:1px solid var(--ln);border-radius:12px;padding:10px 14px 12px;margin:12px 0}.o{margin:10px 0;padding-top:6px;border-top:1px dashed var(--ln)}.o>b{font-size:13px;color:var(--mu);margin-right:6px}.moi{font-size:11px;background:#2563eb;color:#fff;border-radius:999px;padding:0 8px}.cu{color:var(--mu)}
.nlt{background:var(--c);border:1px solid var(--ln);border-radius:12px;padding:8px 14px}.gc{background:var(--gc);border-left:4px solid #e08a2e;padding:6px 10px;border-radius:6px;font-size:14px}
.k{border:2px solid #7c5cbf;border-radius:12px;padding:10px 12px 6px;margin:14px 0 8px;position:relative}.k .tag{position:absolute;top:-12px;left:12px;background:#7c5cbf;color:#fff;font-size:12px;font-weight:600;padding:1px 10px;border-radius:999px}
.k.TC{border-color:#2D9CDB}.k.TC .tag{background:#2D9CDB}.k.PP{border-color:#6b7280}.k.PP .tag{background:#6b7280}.k.CY{border-color:#e08a2e}.k.CY .tag{background:#e08a2e}.k.VD{border-color:#b23a72}.k.VD .tag{background:#b23a72}
ol{margin:4px 0 4px 18px;padding:0}.giai{padding:4px 8px}.giai div{margin:4px 0}.nguon{font-size:11px;padding:1px 8px;border-radius:999px;color:#fff;margin-left:6px;vertical-align:2px}.nguon.s{background:#059669}.nguon.m{background:#d97706}
details{margin:6px 0}summary{cursor:pointer;color:var(--mu);font-size:13px}.cs{white-space:pre-wrap;font-size:13px;color:var(--mu)}.toc a{margin-right:8px}
@media(max-width:600px){body{padding:12px}}</style></head><body><main><h1>Bản đồ 4T — mô tả · lý thuyết · ví dụ (NHÁP chờ duyệt)</h1>
<p>${dang.length} dạng bài · ${nhom.size} nhóm có lý thuyết nhóm mới · ví dụ: <span class="nguon s">sách</span> ${soS} · <span class="nguon m">mô phỏng</span> ${soM}. Chỉ điền ô đang TRỐNG; chữ Thùy đã viết giữ nguyên (bấm "đang có trên bản đồ" để xem).
Dấu ⚑ = chỗ người soạn ghi chú cần Thùy xác nhận. Chưa ghi gì vào DB — nói <b>"ghi"</b> thì mới ghi.</p>
<p>5 dạng tên "Cụm 1 / Cụm 2 : 2 chữ số / CỤm 3" (NDB00652–00656, Dấu hiệu chia hết) KHÔNG soạn: không đoán được nghĩa — Thùy đặt tên/mô tả hoặc xoá.</p>${html}</main></body></html>`)
console.log('→', tep)

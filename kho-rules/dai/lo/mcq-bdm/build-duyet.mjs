// Trang DUYỆT form trắc nghiệm sinh cho DẠNG BÀI BẢN ĐỒ MỚI (NDB, K6–12) — 24/10. CHỈ ĐỌC DB.
//   node kho-rules/dai/lo/mcq-bdm/build-duyet.mjs [ra.html]      (chạy từ gốc repo, dùng .env)
// Nguồn: mọi *.kq.json trong thư mục này (mã câu đã ghi) + trạng thái THẬT trong DB (form hiệu lực, dạng NDB, khối)
// + ghi-chu.json (dạng chưa sinh được và lý do, câu kho nghi sai, câu hỏi cho Thùy).
// Nhóm theo bản đồ mới: khối → chủ đề → dạng bài (NDB), xếp theo thứ tự bản đồ (thu_tu_*) — 26/10.
import pg from 'pg'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
const out = process.argv[2] || join(dir, 'duyet-20261024.html')
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const files = readdirSync(dir).filter((f) => f.endsWith('.kq.json')).sort()
const lo = new Map() // ma_cau → tên file lô
for (const f of files) for (const x of JSON.parse(readFileSync(join(dir, f), 'utf8'))) if (!x.bo) lo.set(x.ma_cau, f.replace('.kq.json', ''))
const ghiChu = JSON.parse(readFileSync(join(dir, 'ghi-chu.json'), 'utf8'))

const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL }); await c.connect()
const rule = Object.fromEntries((await c.query('select ma, ten from dai_mcq_rule union all select ma, ten from hgt_mcq_rule')).rows.map((r) => [r.ma, r.ten]))
const { rows } = await c.query(`
  select f.ma_cau, f.lua_chon, f.dap_an, f.da_duyet, f.ai_model, q.noi_dung, q.dap_an dap_an_kho, q.loi_giai, q.anh_de,
         b.ma_dang, b.khoi, b.ten_dang, b.ma_chu_de, b.ten_chu_de, b.ten_nhom, q.kho_goc
  from bdm_cau_form_tn f join bdm_cau_hoi q on q.ma_cau = f.ma_cau and q.dang_chinh like 'NDB%'
  join bdm_ban_do b on b.ma_dang = q.dang_chinh
  where f.xoa_at is null and f.ma_cau = any($1) order by b.khoi::int, b.thu_tu_chu_de nulls last, b.thu_tu_chuyen_de nulls last, b.thu_tu_nhom nulls last, b.thu_tu_dang nulls last, b.ma_dang, f.ma_cau limit 5000`, [[...lo.keys()]])
// Dạng NDB K6–12 có câu, 0 MCQ đạt chuẩn, nhưng ĐÃ có form chờ duyệt từ trước (không do lô này) — để Thùy duyệt
await c.query(`do $$ begin execute 'create temp table tc as select c.ma_cau, c.dang_chinh, (' || _kho_dk_mcq_sql('bdm_cau_hoi') || ') la_mcq from bdm_cau_hoi c where c.xoa_at is null and c.dang_chinh like ''NDB%'''; end $$`)
const cho = (await c.query(`
  select b.khoi, b.ma_dang, b.ten_dang, count(distinct t.ma_cau)::int n_cau,
         count(distinct f.ma_cau) filter (where not f.da_duyet and not (f.ma_cau = any($1)))::int n_cho_cu,
         count(distinct f.ma_cau) filter (where not f.da_duyet and f.ma_cau = any($1))::int n_cho_moi
  from tc t join bdm_ban_do b on b.ma_dang = t.dang_chinh
  left join bdm_cau_form_tn f on f.ma_cau = t.ma_cau and f.xoa_at is null
  where b.xoa_at is null and b.khoi in ('6','7','8','9','10','11','12')
  group by 1, 2, 3 having count(*) filter (where t.la_mcq) = 0 and count(distinct f.ma_cau) filter (where not f.da_duyet and not (f.ma_cau = any($1))) > 0
  order by b.khoi::int, b.ma_dang limit 500`, [[...lo.keys()]])).rows
await c.end()

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fixTex = (s) => { s = String(s ?? ''); return (s.match(/(?<!\\)\$/g) || []).length % 2 ? s + '$' : s }
const tx = (s) => esc(fixTex(s)).replace(/\n/g, '<br>')
const pa = (lc) => `<ol class="pa">${(lc || []).map((l, i) => `<li class="${l.dung ? 'dung' : ''}"><b>${'ABCD'[i]}.</b> ${tx(l.text)}${l.dung ? ' <span class="tag ok">ĐÚNG</span>' : ` <span class="tag">${esc(l.rule)} · ${esc(rule[l.rule] ?? '')}</span><div class="ds">↳ ${tx(l.duong_sai)}</div>`}</li>`).join('')}</ol>`

// khối → chủ đề → dạng bài (Map giữ thứ tự bản đồ của câu SQL)
const theoKhoi = new Map()
for (const r of rows) {
  if (!theoKhoi.has(r.khoi)) theoKhoi.set(r.khoi, new Map())
  const cds = theoKhoi.get(r.khoi); if (!cds.has(r.ma_chu_de)) cds.set(r.ma_chu_de, { ten: r.ten_chu_de, dang: new Map() })
  const ds = cds.get(r.ma_chu_de).dang; if (!ds.has(r.ma_dang)) ds.set(r.ma_dang, []); ds.get(r.ma_dang).push(r)
}
const demDang = (cds) => [...cds.values()].reduce((a, cd) => a + cd.dang.size, 0)
const demForm = (cds) => [...cds.values()].reduce((a, cd) => a + [...cd.dang.values()].reduce((x, y) => x + y.length, 0), 0)
let toc = '', body = ''
for (const [k, cds] of theoKhoi) {
  toc += `<a href="#k${k}">Khối ${k} <b>${demDang(cds)} dạng · ${demForm(cds)} form</b></a>`
  body += `<h2 id="k${k}">Khối ${k} — ${cds.size} chủ đề, ${demDang(cds)} dạng bài, ${demForm(cds)} form</h2>`
  for (const [, cd] of cds) {
    body += `<h3 class="cd">${esc(cd.ten)} <small>${cd.dang.size} dạng bài</small></h3>`
    for (const [ma, xs] of cd.dang) {
      body += `<h4 class="dang">${ma} — ${esc(xs[0].ten_dang)} <small>${esc(xs[0].ten_nhom ?? '')} · ${xs.length} form${xs[0].kho_goc === 'hgt' ? ' · HGT' : ''}</small></h4>`
      for (const x of xs) body += `<section class="cau">
<div class="h"><b>${x.ma_cau}</b> <span class="tag">${esc(lo.get(x.ma_cau))}</span> <span class="tag">${esc(x.ai_model)}</span> ${x.da_duyet ? '<span class="tag ok">đã duyệt</span>' : '<span class="tag warn">chờ duyệt</span>'}</div>
<div class="de">${tx(x.noi_dung)}</div>${x.anh_de ? `<img src="${esc(x.anh_de)}" alt="hình đề" loading="lazy">` : ''}
<div class="kho">Đáp số kho: <b>${tx(x.dap_an_kho)}</b> · đáp án đúng: <b>${x.dap_an}</b></div>
${pa(x.lua_chon)}
${x.loi_giai ? `<details><summary>Lời giải kho</summary><div class="lg">${tx(x.loi_giai)}</div></details>` : ''}
</section>`
    }
  }
}
const bang = (tieuDe, id, cot, ds) => !ds?.length ? '' : `<h2 id="${id}">${tieuDe} <small>(${ds.length})</small></h2><table><tr>${cot.map((c) => `<th>${c[0]}</th>`).join('')}</tr>${ds.map((d) => `<tr>${cot.map((c) => `<td>${tx(d[c[1]])}</td>`).join('')}</tr>`).join('')}</table>`
const choHtml = bang('Dạng 0 MCQ đã có form CHỜ DUYỆT từ trước (không sinh thêm — chỉ cần Thùy duyệt trên app)', 'cho', [['Khối', 'khoi'], ['Dạng bài', 'ma_dang'], ['Tên', 'ten_dang'], ['Câu', 'n_cau'], ['Form chờ duyệt', 'n_cho_cu']], cho)
const hoiHtml = bang('Câu hỏi cần Thùy quyết', 'hoi', [['Khối', 'khoi'], ['Dạng bài', 'ma_dang'], ['Tên', 'ten_dang'], ['Câu', 'n'], ['Vì sao chưa sinh', 'ly_do'], ['Phương án đề xuất', 'de_xuat']], ghiChu.hoi)
const loiHtml = bang('Câu kho nghi SAI / hỏng — KHÔNG sinh form (cần sửa câu gốc)', 'loi', [['Mã câu', 'ma_cau'], ['Dạng bài', 'ma_dang'], ['Vấn đề', 'van_de']], ghiChu.loi_kho)
const conHtml = bang('Dạng còn 0 MCQ vì câu CHƯA vào kho chuẩn / không có đáp án', 'con', [['Khối', 'khoi'], ['Số dạng', 'n_dang'], ['Câu', 'n_cau'], ['Lý do', 'ly_do']], ghiChu.con_lai)
const tong = rows.length, tongDang = [...theoKhoi.values()].reduce((a, cds) => a + demDang(cds), 0)
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt MCQ bản đồ mới</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#fff;--fg:#1a1a1a;--mu:#666;--bd:#ddd;--ok:#e7f6ea;--okb:#2e7d32;--tag:#f1f1f4;--warn:#b26a00}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#16171a;--fg:#e8e8ea;--mu:#9a9aa2;--bd:#33343a;--ok:#1d3323;--okb:#7bd389;--tag:#2a2b31;--warn:#f0a940}}
body{background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,Segoe UI,Arial;max-width:1000px;margin:20px auto;padding:0 16px}
h1{font-size:21px}h2{font-size:18px;margin-top:34px;border-bottom:2px solid var(--bd);padding-bottom:4px}h3.cd{font-size:16px;margin:26px 0 4px}h4.dang{font-size:15px;margin:18px 0 4px}
.meta{color:var(--mu);font-size:13px}small{color:var(--mu);font-weight:normal}
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.toc a{border:1px solid var(--bd);border-radius:8px;padding:3px 8px;text-decoration:none;color:inherit;font-size:13px}
.cau{border:1px solid var(--bd);border-radius:10px;padding:10px 14px;margin:10px 0}.de{margin:6px 0}.kho{margin:6px 0;font-size:14px}
.cau img{max-width:100%;max-height:260px;display:block;margin:6px 0;background:#fff}
.pa{margin:0;padding-left:20px}.pa li{padding:3px 6px;border-radius:5px;margin:2px 0}.pa li.dung{background:var(--ok)}
.ds{font-size:12.5px;color:var(--mu)}
.tag{display:inline-block;background:var(--tag);border-radius:6px;padding:0 6px;font-size:12px;color:var(--mu)}.tag.ok{color:var(--okb);font-weight:600}.tag.warn{color:var(--warn)}
details{margin-top:6px;font-size:13px}.lg{color:var(--mu)}
table{border-collapse:collapse;width:100%;font-size:13px;margin:6px 0 18px}td,th{border:1px solid var(--bd);padding:4px 6px;vertical-align:top;text-align:left}
</style></head><body>
<h1>Duyệt câu trắc nghiệm (MCQ) — dạng bài bản đồ mới K6–12</h1>
<p class="meta">Sinh ngày 24/10 cho các dạng bài NDB đang có câu nhưng <b>0 câu MCQ đạt chuẩn</b> (bổ trợ chỉ dùng MCQ). ${tong} form · ${tongDang} dạng bài. Mọi form <b>chưa duyệt</b> (<code>da_duyet = false</code>) — duyệt trên app (tab Trắc nghiệm AI) như mọi form; câu gốc không đổi.
Mỗi phương án sai ghi mã lỗi + đường sai. Model: <code>claude-opus-5-5</code> = Claude soạn tay từng câu · <code>may-…</code> = máy sinh nhiễu từ đáp số (khuôn đã dùng cho bài toán thực tế từ 14/09). Tất cả đã qua cổng kiểm máy (<code>mcq-sinh.mjs --verify</code>: 4 phương án khác giá trị, đáp án đúng = đáp số kho, rule tồn tại).</p>
<div class="toc">${toc}<a href="#cho">Chờ duyệt sẵn <b>${cho.length}</b></a><a href="#hoi">Cần Thùy quyết <b>${ghiChu.hoi?.length ?? 0}</b></a><a href="#loi">Câu kho nghi sai <b>${ghiChu.loi_kho?.length ?? 0}</b></a><a href="#con">Còn lại</a></div>
${body}${choHtml}${hoiHtml}${loiHtml}${conHtml}
</body></html>`
writeFileSync(out, html)
console.log('→', out, Math.round(html.length / 1024) + ' KB ·', tong, 'form ·', tongDang, 'dạng · chờ sẵn', cho.length, 'dạng')

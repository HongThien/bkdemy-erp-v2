// soat-nghi-tieu-hoc-html.mjs — trang HTML so cũ/mới 92 câu kho tiểu học đã soát lại (Thùy 05/11), luật "duyệt = có HTML".
//   node scripts/kho/soat-nghi-tieu-hoc-html.mjs <thư mục có cau.json + ket-*.json> <ra.html>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [dir, ra] = process.argv.slice(2)
const goc = new Map(JSON.parse(readFileSync(join(dir, 'cau.json'), 'utf8')).map((x) => [x.ma_cau, x]))
const ket = readdirSync(dir).filter((f) => /^ket-\w+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const txt = (s) => esc(s).replace(/\n/g, '<br>')
const lc = (a) => (a ? `<ol type="A">${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : '')
const NHAN = { kho_dung: ['Kho đúng', 'ok'], kho_sai: ['Kho sai — đã sửa đáp án/lời giải', 'sai'], de_hong: ['Đề hỏng — đã sửa đề', 'hong'] }
const thu = ['3', '4', '4T', '5', '5T']
ket.sort((a, b) => thu.indexOf(goc.get(a.ma_cau).khoi) - thu.indexOf(goc.get(b.ma_cau).khoi) || a.ma_cau.localeCompare(b.ma_cau))
const dem = Object.fromEntries(Object.keys(NHAN).map((k) => [k, ket.filter((x) => x.ket_luan === k).length]))

const the = ket.map((k) => {
  const g = goc.get(k.ma_cau), [nhan, cls] = NHAN[k.ket_luan]
  const doiDe = k.noi_dung_moi || k.lua_chon_moi
  return `<section class="cau ${cls}"><div class="tit"><b>${k.ma_cau}</b> · khối ${g.khoi} · ${esc(g.ten_dang)} <span class="tag ${cls}">${nhan}</span></div>
<div class="ly">${txt(k.ly_do)}</div>
<div class="cot"><div><h4>Đề${doiDe ? ' cũ' : ''}</h4><div class="o">${txt(g.noi_dung)}${lc(g.lua_chon)}</div></div>
${doiDe ? `<div><h4>Đề mới</h4><div class="o moi">${txt(k.noi_dung_moi ?? g.noi_dung)}${lc(k.lua_chon_moi ?? g.lua_chon)}</div></div>` : ''}</div>
<div class="cot"><div><h4>Đáp án kho cũ</h4><div class="o">${txt(g.dap_an) || '—'}</div></div><div><h4>Đáp án sau soát</h4><div class="o moi">${txt(k.dap_an_moi ?? g.dap_an) || '—'}</div></div></div>
<details><summary>Lời giải ${k.loi_giai_moi ? 'mới' : '(giữ nguyên)'}</summary><div class="o">${txt(k.loi_giai_moi ?? g.loi_giai)}</div>${k.loi_giai_moi ? `<h4>Lời giải cũ</h4><div class="o cu">${txt(g.loi_giai)}</div>` : ''}</details></section>`
}).join('\n')

writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Soát câu nghi tiểu học</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1b;--mut:#6b6b66;--line:#e3e2dc;--ok:#1f7a4d;--sai:#b4570f;--hong:#a3263a}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#17171a;--card:#212125;--ink:#ececea;--mut:#a3a39d;--line:#34343a}}
body{background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,sans-serif;margin:0;padding:16px}
main{max-width:1000px;margin:auto}h1{font-size:22px;margin:0 0 4px}.sub{color:var(--mut);margin-bottom:16px}
.cau{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--line);border-radius:8px;padding:12px 14px;margin:10px 0}
.cau.ok{border-left-color:var(--ok)}.cau.sai{border-left-color:var(--sai)}.cau.hong{border-left-color:var(--hong)}
.tag{font-size:12px;padding:1px 8px;border-radius:10px;margin-left:6px;color:#fff}.tag.ok{background:var(--ok)}.tag.sai{background:var(--sai)}.tag.hong{background:var(--hong)}
.ly{color:var(--mut);font-size:13.5px;margin:4px 0 8px}.cot{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
h4{margin:6px 0 3px;font-size:12.5px;color:var(--mut);text-transform:uppercase;letter-spacing:.03em}.o{border:1px solid var(--line);border-radius:6px;padding:6px 9px}
.o.moi{border-color:var(--ok)}.o.cu{opacity:.7}.o ol{margin:4px 0 0;padding-left:22px}summary{cursor:pointer;color:var(--mut);margin-top:8px}
</style></head><body><main>
<h1>Soát lại câu tiểu học bị máy nghi đáp số</h1>
<div class="sub">${ket.length} câu khối 3 · 4 · 4T · 5 · 5T (05/11). Opus giải mù lại từng câu, đối chiếu với lượt kiểm máy trước đó. Kho đúng ${dem.kho_dung} · kho sai ${dem.kho_sai} · đề hỏng (sửa tối thiểu) ${dem.de_hong}. Tất cả đã ghi vào kho và bật duyệt; câu nào Thùy thấy chưa ổn thì báo mã câu.</div>
${the}
</main></body></html>`)
console.log(`✔ ${ra} · ${ket.length} câu`, dem)

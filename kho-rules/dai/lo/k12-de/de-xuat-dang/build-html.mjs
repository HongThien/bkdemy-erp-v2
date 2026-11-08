// build-html.mjs — dựng DE-XUAT-DANG-K12.html: các DẠNG BÀI MỚI đề xuất thêm cho bản đồ K12 (Nguyên hàm–Tích phân · Oxyz · Hàm số/Vectơ/Xác suất/Số đặc trưng).
//   node kho-rules/dai/lo/k12-de/de-xuat-dang/build-html.mjs
// Chỉ ĐỀ XUẤT để Thùy xem — KHÔNG ghi gì vào DB. Công thức render bằng KaTeX (CDN).
import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k12-de/de-xuat-dang/'
const rd = (f) => JSON.parse(fs.readFileSync(D + f, 'utf8'))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const deCau = new Map()
for (const f of ['thieu-nhtp.json', 'thieu-dai_khac.json', 'thieu-oxyz.json']) for (const x of rd(f)) deCau.set(x.ma_cau, x)

const NHOM = [
  { khoa: 'nhtp', ten: 'Nguyên hàm – Tích phân', file: 'de-xuat-nhtp.json', ghi: 'Đặt vào chủ đề NCD00095' },
  { khoa: 'oxyz', ten: 'Phương pháp toạ độ trong không gian (Oxyz)', file: 'de-xuat-oxyz.json', ghi: 'Đặt vào chủ đề NCD00099 (nhánh hình giải tích)' },
  { khoa: 'khac', ten: 'Hàm số · Vectơ · Xác suất có điều kiện · Số đặc trưng', file: 'de-xuat-dai_khac.json', ghi: 'Đặt vào chủ đề tương ứng' },
]

// Hiển thị khối nội dung có thẻ ##TC/##PP/##CY/##VD
const TEN_THE = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp giải', CY: 'Chú ý', VD: 'Ví dụ', DN: 'Định nghĩa', DL: 'Định lý', NX: 'Nhận xét' }
function khoi(txt) {
  if (!txt) return '<p class="trong">(chưa có)</p>'
  const out = []
  const parts = String(txt).split(/\n\s*\n(?=##)|^(?=##)/m).filter((p) => p.trim())
  for (const p of parts) {
    const m = p.match(/^##(\w+)[ \t]*([^\n]*)\n?([\s\S]*)$/)
    if (!m) { out.push(`<div class="kh"><div class="nd">${nd(p)}</div></div>`); continue }
    const [, the, tieude, thanh] = m
    const nhan = TEN_THE[the] || the
    const cls = the.toLowerCase()
    out.push(`<div class="kh ${cls}"><div class="nhan">${esc(nhan)}${tieude.trim() ? ' — ' + esc(tieude.trim()) : ''}</div><div class="nd">${nd(thanh)}</div></div>`)
  }
  return out.join('')
}
function nd(s) {
  return esc(s.trim()).split('\n').map((l) => {
    const t = l.trim()
    if (/^Bài giải:?$/.test(t)) return '<div class="bg">Bài giải:</div>'
    return `<div class="dong">${l}</div>`
  }).join('')
}

let tongDang = 0, tongCau = 0
const mucLuc = [], thanh = []
for (const g of NHOM) {
  const j = rd(g.file)
  const ds = j.dang_moi
  tongDang += ds.length; tongCau += ds.reduce((s, d) => s + d.ma_cau.length, 0)
  const lyDoKhong = {}
  for (const x of j.khong_xep_duoc) { const k = (x.ly_do.match(/^(THIẾU HÌNH|Thiếu hình|Thiếu dữ kiện|THIẾU DỮ KIỆN|Đề lỗi|ĐỀ LỖI|KHÔNG THUỘC|Không thuộc|Hình học|Lớp 1\d|HGT|Mũ|Logarit|Đúng\/Sai)/i) || [''])[0] || 'khác'; lyDoKhong[k] = (lyDoKhong[k] || 0) + 1 }
  mucLuc.push(`<li><a href="#g-${g.khoa}">${esc(g.ten)}</a> — <b>${ds.length}</b> dạng mới (${ds.reduce((s, d) => s + d.ma_cau.length, 0)} câu)</li>`)
  const cards = ds.map((d, i) => {
    const id = `${g.khoa}-${i + 1}`
    const cau = (d.cau_tieu_bieu || d.ma_cau.slice(0, 3)).slice(0, 3).map((m) => {
      const c = deCau.get(m)
      return `<div class="cau"><span class="mc">${esc(m)}</span> <span class="de">${esc((c?.de || '(không có đề)').replace(/\s+/g, ' '))}</span>${c?.dap_an ? `<span class="da"> → ${esc(c.dap_an)}</span>` : ''}</div>`
    }).join('')
    return `<section class="card" id="${id}">
<header><label class="chon"><input type="checkbox" data-id="${id}" data-ten="${esc(d.ten)}"> Duyệt</label>
<h3>${esc((d.chuong ? '[' + d.chuong + '] ' : '') + d.ten)}</h3></header>
<div class="meta"><span>📍 ${esc(d.nhom_dat)}</span><span>⬇ đặt sau <b>${esc(d.dat_sau || '—')}</b></span><span>mức ${esc(d.muc_do ?? '—')}</span><span class="so">${d.ma_cau.length} câu</span></div>
<h4>Mô tả</h4><p>${esc(d.mo_ta)}</p>
<h4>Vì sao chưa có chỗ</h4><p>${esc(d.dang_gan_nhat || '—')}</p>
<details><summary>Lý thuyết (nháp)</summary>${khoi(d.ly_thuyet)}</details>
<details open><summary>Ví dụ (đã kiểm số bằng máy)</summary>${khoi(d.vi_du)}</details>
<details><summary>Câu tiêu biểu trong kho (${d.ma_cau.length} câu sẽ vào dạng này)</summary>${cau}</details>
</section>`
  }).join('\n')
  thanh.push(`<h2 id="g-${g.khoa}">${esc(g.ten)} <small>${ds.length} dạng · ${esc(g.ghi)}</small></h2>
<p class="phu">Ngoài ra: <b>${j.khop_dang_co.length}</b> câu thật ra khớp dạng ĐÃ CÓ (sẽ xếp lại, không cần dạng mới) · <b>${j.khong_xep_duoc.length}</b> câu không xếp được (${Object.entries(lyDoKhong).map(([k, v]) => `${esc(k)} ${v}`).join(' · ') || '—'}).</p>
${cards}`)
}

const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề xuất dạng bài mới K12</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<style>
:root{--bg:#f6f7fb;--card:#fff;--ink:#1d2433;--mut:#667085;--line:#e3e7ef;--pri:#4c6fff;--ok:#12a150}
@media (prefers-color-scheme:dark){:root{--bg:#12151c;--card:#1b2030;--ink:#e8ebf3;--mut:#9aa3b8;--line:#2b3247;--pri:#8aa0ff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}
.wrap{max-width:980px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{font-size:19px;margin:34px 0 4px;border-bottom:2px solid var(--pri);padding-bottom:4px}h2 small{font-size:12px;color:var(--mut);font-weight:400}
h3{font-size:16px;margin:0;flex:1}h4{font-size:13px;margin:12px 0 2px;color:var(--pri);text-transform:uppercase;letter-spacing:.03em}
.phu{color:var(--mut);margin:4px 0 12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:12px 0}
.card header{display:flex;gap:12px;align-items:flex-start}
.chon{white-space:nowrap;font-size:13px;color:var(--ok);font-weight:600;padding-top:2px}
.meta{display:flex;flex-wrap:wrap;gap:6px 14px;color:var(--mut);font-size:12.5px;margin:6px 0}
.meta .so{margin-left:auto;background:var(--pri);color:#fff;border-radius:99px;padding:0 10px;font-weight:600}
details{margin-top:8px;border-top:1px dashed var(--line);padding-top:6px}summary{cursor:pointer;font-weight:600;font-size:13.5px}
.kh{border-left:4px solid #888;background:rgba(127,127,127,.07);border-radius:6px;margin:8px 0;padding:6px 10px}
.kh.tc{border-color:#2d9cdb}.kh.pp{border-color:#8c8c8c}.kh.cy{border-color:#f2994a}.kh.vd{border-color:#b23a72}
.nhan{font-weight:700;font-size:13px;margin-bottom:2px}.tc .nhan{color:#2d9cdb}.cy .nhan{color:#f2994a}.vd .nhan{color:#b23a72}
.bg{text-align:center;text-decoration:underline;font-weight:700;margin:6px 0 2px}
.dong{margin:1px 0;overflow-x:auto}
.cau{font-size:13px;margin:6px 0;padding:6px 8px;background:rgba(127,127,127,.07);border-radius:6px}.mc{color:var(--mut);font-family:monospace;font-size:11.5px}.da{color:var(--ok);font-weight:600}
.trong{color:var(--mut)}
#bar{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:8px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
button{background:var(--pri);color:#fff;border:0;border-radius:8px;padding:6px 12px;font-weight:600;cursor:pointer}
@media (max-width:640px){.wrap{padding:10px}.card{padding:12px}}
</style></head><body>
<div id="bar"><b>Đề xuất dạng bài mới K12</b><span id="dem">Đã chọn duyệt: 0 / ${tongDang}</span><button id="copy">Sao chép danh sách đã chọn</button><span id="kq" style="color:var(--ok)"></span></div>
<div class="wrap">
<h1>${tongDang} dạng bài mới đề xuất cho bản đồ K12 <small style="font-size:13px;color:var(--mut)">(${tongCau} câu đang "thiếu dạng" sẽ vào)</small></h1>
<p class="phu">Đây chỉ là ĐỀ XUẤT — chưa ghi gì vào bản đồ. Tick <b>Duyệt</b> ở dạng nào chị đồng ý thêm, bấm "Sao chép danh sách" rồi dán lại cho em; em sẽ ghi dạng + điền lý thuyết/ví dụ + xếp các câu vào đó. Dạng nào chưa chắc thì để trống, hoặc nhắn sửa tên/chỗ đặt.</p>
<ul>${mucLuc.join('')}</ul>
${thanh.join('\n')}
</div>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>
<script>
window.addEventListener('load',function(){
  if(window.renderMathInElement)renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});
  var cb=[].slice.call(document.querySelectorAll('input[data-id]')),dem=document.getElementById('dem');
  var KEY='dexuat-dang-k12';var luu={};try{luu=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  cb.forEach(function(c){c.checked=!!luu[c.dataset.id];c.addEventListener('change',function(){luu[c.dataset.id]=c.checked;try{localStorage.setItem(KEY,JSON.stringify(luu))}catch(e){}cap()})});
  function cap(){dem.textContent='Đã chọn duyệt: '+cb.filter(function(c){return c.checked}).length+' / '+cb.length}cap();
  document.getElementById('copy').onclick=function(){var t=cb.filter(function(c){return c.checked}).map(function(c){return c.dataset.id+' · '+c.dataset.ten}).join('\\n');
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){document.getElementById('kq').textContent='Đã sao chép '+t.split('\\n').filter(Boolean).length+' dạng'},function(){prompt('Sao chép thủ công:',t)})};
});
</script></body></html>`
fs.writeFileSync(D + 'DE-XUAT-DANG-K12.html', html)
console.log('đã dựng', tongDang, 'dạng ·', tongCau, 'câu ·', (html.length / 1024).toFixed(0) + 'KB')

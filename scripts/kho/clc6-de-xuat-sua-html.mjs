// clc6-de-xuat-sua-html.mjs — dựng trang HTML "CLC → 5T: câu cần SỬA (không bỏ câu nào)" cho Thùy đọc/duyệt. Chỉ ĐỌC (repo + thumbnail), không ghi DB.
//   node scripts/kho/clc6-de-xuat-sua-html.mjs  → docs/de-xuat-sua-clc-5T.html     (thumbnail: %TEMP%/s5/thumb/*.png đã thu nhỏ trước)
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const D = 'kho-rules/dai/lo/clc6/', HD = 'kho-rules/dai/hinh-de/'
const de = JSON.parse(readFileSync(D + 'de-da-sua.json', 'utf8'))
const Q = new Map(); for (const x of de) for (const q of x.cau) Q.set(q.ma_nguon, { ...q, de: x.ma })
const man = JSON.parse(readFileSync(HD + 'CLC6.json', 'utf8')); delete man.ghi_chu
const E = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const T = (s) => E(s).replace(/\n/g, '<br>')
const thumb = (tep) => { const p = process.env.TEMP + '/s5/thumb/' + tep; return existsSync(p) ? 'data:image/png;base64,' + readFileSync(p).toString('base64') : null }
const sel = (id, opts = [['gat', 'Duyệt đề xuất'], ['sua', 'Sửa lại (ghi chú)'], ['hoi', 'Cần hỏi thêm']]) => `<select data-id="${id}"><option value="">—</option>${opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select> <input type="text" data-note="${id}" placeholder="ghi chú" size="16">`
const choose = (id, opts) => `<select data-id="${id}"><option value="">— chọn —</option>${opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select> <input type="text" data-note="${id}" placeholder="ghi chú" size="16">`

// ---------------------------------------------------------------- §1 câu chưa vào kho được
const S1 = [
  { id: 'A1', ma: 'LTV 2024 · 19 và 20', hien: 'Đề trống: chỉ có dòng "Đang cập nhật đề" (Word, PDF, và cả trang đề trên mạng cũng ghi vậy). Không có đáp số sách.',
    de_xuat: 'Cần có đề gốc. Em không tự bịa đề rồi gắn tên đề thật.',
    ch: [['gui', 'Thùy gửi đề gốc (ảnh hoặc chữ) — em nhập'], ['thay', 'Em soạn 2 câu THAY THẾ cùng mức câu cuối đề, nhãn "đề thay thế — đề gốc chưa có"'], ['cho', 'Giữ chỗ: chưa tạo câu, đề LTV 2024 chờ đủ 20 câu']] },
  { id: 'A2', ma: 'NTT 2019 · 1', hien: 'Đề chỉ có một dòng: "Là 1 bài về giao thông có hình vẽ. Câu hỏi là Nam gặp biểu tượng nào?" (đề do học sinh nhớ lại). PDF không có hình, không có dữ kiện; đáp án sách chỉ ghi "siêu thị".',
    de_xuat: 'Dựng lại thành câu tự chứa đủ dữ kiện kèm HÌNH VẼ LẠI (sơ đồ đường đi, các biểu tượng: trường học, siêu thị, bệnh viện…), sao cho đáp án là "siêu thị"; ghi rõ "dựng lại theo trí nhớ — không phải đề gốc". Hình em vẽ bằng máy (SVG) rồi trình Thùy xem trước khi ghi.',
    ch: [['dung', 'Em dựng lại câu + vẽ hình, trình Thùy xem'], ['gui', 'Thùy/giáo viên còn bản gốc — gửi em nhập'], ['giu', 'Giữ câu chữ hiện có, gắn "thiếu hình — chờ"']] },
  { id: 'A3', ma: 'TX 2023 · 1', hien: 'Trắc nghiệm chỉ có 3 phương án trong đề gốc (A. 321,89 · B. 931,28 · C. 321,98); cổng nhập đòi đủ 4. Đáp án đúng: A (321,89 có chữ số 9 ở hàng phần trăm).',
    de_xuat: 'Thêm phương án D. 193,28 (số 9 ở hàng chục — phương án sai, không trùng đáp án). Đáp án vẫn A. Ghi chú: "thêm D, đề gốc 3 phương án".',
    ch: [['d', 'Thêm D. 193,28'], ['dien', 'Giữ 3 phương án, đổi thành câu điền đáp án (A/B/C)'], ['khac', 'Phương án D khác (ghi chú)']] },
  { id: 'A4', ma: 'ARC 2022-CB · 25', hien: 'Trắc nghiệm 3 phương án trong PDF (A. 15 · B. 35 · C. 25). Bản Word có thêm D. 23. Đáp án đúng C: 2032022 có tổng chữ số 11, dư 2 khi chia 3; cần cộng số dư 1 ⇒ 25.',
    de_xuat: 'Lấy D. 23 từ bản Word (23 chia 3 dư 2 nên sai) — có nguồn, không tự bịa. Đáp án vẫn C.',
    ch: [['d', 'Thêm D. 23 (theo Word)'], ['dien', 'Giữ 3 phương án, đổi thành câu điền đáp án'], ['khac', 'Phương án D khác (ghi chú)']] },
]

// ---------------------------------------------------------------- §2 đề đã sửa theo suy luận / nguồn thứ ba
const S2 = ['ARC 2020-NC · 4', 'NTT-MH1 · P1.1', 'NTT 2025 · 15', 'NN 2024-TT4 · P2.1', 'NTT 2020 · P1.4', 'NTT 2020 · P2.2']

// ---------------------------------------------------------------- §3 đề mâu thuẫn, chưa sửa
const S3 = [
  { id: 'C1', ma: 'LTV 2024 · 2', van_de: 'Đề in hai phiên bản: "…nhỏ nhất chia hết cho 5 và 7" và "(Đề khác: …có hai chữ số…)". Nguyên văn (không giới hạn) đáp số là 0; sách đáp 35.', hien: 'Đang ghi: 35.',
    ch: [['hai', 'Sửa đề: "số tự nhiên nhỏ nhất CÓ HAI CHỮ SỐ chia hết cho 5 và 7", bỏ dòng ngoặc → 35'], ['khac0', 'Sửa đề: "số tự nhiên khác 0 nhỏ nhất…" → 35'], ['giu', 'Giữ nguyên văn → đáp số 0']] },
  { id: 'C2', ma: 'NTL 2024 · P2.2', van_de: 'Đề chữ: AM = 2/3 AD; hình vẽ: M gần A (≈1/3 cạnh); lời giải sách: AM = 2/5 AD (ra 20 cm², 5/2, 5/2). Ba nguồn không khớp.', hien: 'Đang ghi theo chữ đề: 100/3 cm²; 3/2; 3/2 (số lẻ).',
    ch: [['sach', 'Sửa đề thành AM = 2/5 AD theo sách (20 cm²; 5/2; 5/2) + vẽ lại hình M ở 2/5'], ['chu', 'Giữ AM = 2/3 AD + vẽ lại hình M ở 2/3 (đáp 100/3; 3/2; 3/2)'], ['khac', 'Khác (ghi chú)']] },
  { id: 'C3', ma: 'AMS 2020 · 8', van_de: 'Đề: "Tính đến năm 2021, tuổi = tổng các chữ số năm sinh" (năm sinh 1996, tuổi 2021 = 25) nhưng hỏi "năm nay" — sách tính 24 (năm 2020).', hien: 'Đang ghi: 24 tuổi (năm nay = 2020).',
    ch: [['n2020', 'Sửa câu hỏi: "Hỏi vào năm 2020 cầu thủ đó bao nhiêu tuổi?" → 24'], ['n2021', 'Sửa: "Hỏi năm 2021 …" → 25'], ['khac', 'Khác (ghi chú)']] },
  { id: 'C4', ma: 'NTT 2020 · P1.9', van_de: 'Đề không nói rõ mua nguyên hộp hay tính theo lượng dùng. Mua nguyên hộp ⇒ 515 000 đồng; theo lượng dùng ⇒ 423 900 đồng; sách ghi 423 000 (lệch cả hai).', hien: 'Đang ghi: 515 000 đồng (mua nguyên hộp).',
    ch: [['hop', 'Thêm vào đề "(chỉ mua nguyên hộp)" → 515 000'], ['dung', 'Thêm vào đề "(tính theo lượng dùng)" → 423 900'], ['khac', 'Khác (ghi chú)']] },
  { id: 'C5', ma: 'NS-HB1 · P2.1', van_de: 'Ý b: 75% thể tích = 1683 lít; vòi 560 lít/giờ ⇒ 3 3/560 giờ (không tròn). Sách ghi 3 giờ. Nếu vòi 561 lít/giờ thì đúng 3 giờ.', hien: 'Đang ghi: a) 2,244 m³; b) 3 3/560 giờ.',
    ch: [['s561', 'Sửa số liệu 560 → 561 lít/giờ → đáp 3 giờ'], ['giu', 'Giữ 560, đáp 3 3/560 giờ (khoảng 3 giờ)'], ['khac', 'Khác (ghi chú)']] },
]

// ---------------------------------------------------------------- §4 đáp số sách sai (đã dùng số tự tính)
const sec5 = readFileSync(D + 'kiem-bao-cao.md', 'utf8').split(/\r?\n/)
const i5 = sec5.findIndex((l) => /^## 5\./.test(l)), i6 = sec5.findIndex((l, j) => j > i5 && /^## 6\./.test(l))
const daDe = new Set(['LTV 2024 · 2', 'NTL 2024 · P2.2', 'AMS 2020 · 8', 'NTT 2020 · P1.9', 'NS-HB1 · P2.1', 'ARC 2020-NC · 4', 'NTT-MH1 · P1.1'])
const S4 = sec5.slice(i5 + 1, i6).map((l) => l.match(/^- \*\*(.+?)\*\* — sách: (.*?) · tính: (.*?) — (.*)$/)).filter(Boolean).filter((m) => !daDe.has(m[1]))
  .map((m) => ({ ma: m[1], sach: m[2], tinh: m[3], ly: m[4].slice(0, 330) }))

// ---------------------------------------------------------------- §5 hình
const FIXED = new Set(['TX 2021 · 7', 'TX 2021 · 8', 'ARC 2022-CB · 38', 'ARC 2022-CB · 39', 'NTT 2018 · 6', 'NTT 2018 · 7', 'NTT-MH1 · P1.7', 'NTT-MH1 · P1.8', 'TX 2025 · 15', 'TX 2025 · 16'])
const hinh = Object.entries(man).map(([ma, v]) => {
  const b = readFileSync(HD + v.tep), w = b.readUInt32BE(16), h = b.readUInt32BE(20)
  return { ma, tep: v.tep, w, h, nho: w < 240 || h < 140, bu: /pdf/i.test(JSON.stringify(Q.get(ma)?.hinh_bu ?? '')) || (Q.get(ma)?.hinh_bu ?? []).length > 0, q: Q.get(ma) }
})
const nNho = hinh.filter((x) => x.nho).length

const row = (cells) => '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>'
let h = ''
h += `<h2>1. Câu chưa vào kho được — phải GIỮ và SỬA (${S1.length} mục, 5 câu)</h2><p class="mut small">Hai nguyên nhân: đề nguồn trống / thiếu hình, và trắc nghiệm gốc chỉ có 3 phương án. Không câu nào bị bỏ; mỗi mục chọn cách sửa.</p><table><tr><th>#</th><th>Câu</th><th>Hiện trạng</th><th>Đề xuất của em</th><th>Chọn</th></tr>`
for (const s of S1) h += row([s.id, `<b>${E(s.ma)}</b>`, E(s.hien), E(s.de_xuat), choose(s.id, s.ch)])
h += '</table>'
h += `<h2>2. Đề ĐÃ sửa theo suy luận / nguồn thứ ba — Thùy đọc lại (${S2.length} câu)</h2><p class="mut small">Các sửa theo PDF (20 câu, có bằng chứng rõ) em không liệt kê ở đây. 6 câu dưới đây bằng chứng yếu hơn (suy từ lời giải sách hoặc từ nguồn khác), nên cần Thùy xác nhận.</p><table><tr><th>Câu</th><th>Đề gốc (Word)</th><th>Đề đã sửa</th><th>Lý do</th><th>Quyết định</th></tr>`
for (const ma of S2) { const q = Q.get(ma); h += row([`<b>${E(ma)}</b>`, `<span class="m">${T(q.noi_dung_goc)}</span>`, `<span class="m">${T(q.noi_dung)}</span>`, E(q.ghi_chu_duyet), sel('B-' + ma, [['gat', 'Đúng, giữ bản sửa'], ['sua', 'Sửa lại (ghi chú)'], ['goc', 'Trả về đề gốc']])]) }
h += '</table>'
h += `<h2>3. Đề mâu thuẫn với hình / lời giải sách — chưa sửa, cần Thùy chọn (${S3.length} câu)</h2><table><tr><th>#</th><th>Câu</th><th>Vấn đề</th><th>Hiện ghi</th><th>Chọn cách sửa</th></tr>`
for (const s of S3) h += row([s.id, `<b>${E(s.ma)}</b><div class="m mut">${T(Q.get(s.ma)?.noi_dung?.slice(0, 300))}</div>`, E(s.van_de), E(s.hien), choose(s.id, s.ch)])
h += '</table>'
h += `<h2>4. Đáp số sách sai — đã dùng số tự tính (${S4.length} câu), chỉ cần đọc lướt</h2><p class="mut small">Không phải sửa đề. Em đã ghi đáp số theo phép tính kiểm bằng máy, không theo dòng "Đáp số" in sai của sách. Thùy không đồng ý câu nào thì đánh dấu.</p><table><tr><th>Câu</th><th>Sách ghi</th><th>Em ghi</th><th>Lý do</th><th>Đồng ý?</th></tr>`
for (const s of S4) h += row([`<b>${E(s.ma)}</b>`, E(s.sach), E(s.tinh), `<span class="small">${E(s.ly)}</span>`, sel('D-' + s.ma, [['gat', 'Đồng ý'], ['khong', 'Không — sửa lại (ghi chú)']])])
h += '</table>'
h += `<h2>5. Hình đề — 83 hình lấy nguyên từ file Word (đánh dấu câu nào cần VẼ LẠI)</h2><p class="mut small">Em lấy nguyên ảnh gốc, không vẽ lại. <b>${nNho} hình nhỏ/mờ</b> (viền cam) — đề xuất vẽ lại bằng máy cho nét. Hình viền xanh: câu mà Word gắn nhầm hình nên em đã gắn lại cho đúng câu. Hình viền tím: hình bù từ PDF. Chọn "Vẽ lại" ở câu nào hình chưa đạt.</p><div class="gal">`
for (const x of hinh.sort((a, b) => a.ma.localeCompare(b.ma, 'vi', { numeric: true }))) {
  const cls = x.nho ? 'nho' : FIXED.has(x.ma) ? 'fix' : x.bu ? 'bu' : ''
  const t = thumb(x.tep)
  h += `<div class="g ${cls}"><b>${E(x.ma)}</b> <span class="mut small">${x.w}×${x.h}${x.nho ? ' · nhỏ' : ''}${FIXED.has(x.ma) ? ' · gắn lại' : ''}${x.bu ? ' · bù từ PDF' : ''}</span><div class="im">${t ? `<img src="${t}" alt="${E(x.ma)}">` : '(không có thumbnail)'}</div><div class="m small">${E((x.q?.noi_dung ?? '').replace(/\n/g, ' ').slice(0, 150))}</div>${sel('H-' + x.ma, [['ok', 'Hình đạt'], ['ve', 'Vẽ lại'], ['hoi', 'Cần hỏi']])}</div>`
}
h += '</div>'

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CLC → 5T: câu cần sửa (không bỏ câu nào)</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<style>
:root{--bg:#f7f8fa;--card:#fff;--ink:#1c2430;--mut:#5d6b7c;--line:#dfe4ea;--acc:#1f7a4d}
@media (prefers-color-scheme:dark){:root{--bg:#12161b;--card:#1a2027;--ink:#e6ebf1;--mut:#94a1b2;--line:#2b3440;--acc:#5fd09a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:1200px;margin:0 auto;padding:20px 16px 90px}h1{font-size:22px;margin:0 0 4px}h2{font-size:18px;margin:34px 0 8px;border-bottom:2px solid var(--acc);padding-bottom:4px}
.sub{color:var(--mut);margin:0 0 14px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:10px 0}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:14px;margin:6px 0}th,td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}th{background:var(--bg)}
.mut{color:var(--mut)}.small{font-size:13px}.m{font-size:13.5px}
select,input[type=text]{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 6px;max-width:100%}
button{font:inherit;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}
#bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:8px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.g{background:var(--card);border:2px solid var(--line);border-radius:8px;padding:8px}
.g.nho{border-color:#e08a1e}.g.fix{border-color:#3b7ddd}.g.bu{border-color:#8a52c9}.im{background:#fff;border:1px solid var(--line);border-radius:6px;margin:6px 0;display:flex;justify-content:center;padding:4px}.im img{max-width:100%;height:auto}
</style></head><body><main>
<h1>CLC → 5T: câu cần SỬA (không bỏ câu nào)</h1>
<p class="sub">21/11/2026 · Thùy chốt: đề thi không được bỏ, chỉ được sửa; hình vẽ lại nếu cần. <b>Chưa ghi gì vào DB.</b> File Word đã có: 58/58 đề đủ hình, 81 câu mới ở 42 đề đang chờ ghi. Trang này gom mọi chỗ cần Thùy quyết trước khi ghi.</p>
<div class="card"><b>Tóm tắt.</b> (1) 5 câu chưa nhập được vì đề trống hoặc trắc nghiệm thiếu phương án — mục 1. (2) 6 câu đề đã sửa bằng chứng yếu — mục 2. (3) 5 câu đề mâu thuẫn với hình hoặc lời giải — mục 3. (4) ${S4.length} câu sách in sai đáp số, em đã dùng số tự tính — mục 4. (5) 83 hình lấy từ Word, ${nNho} hình nhỏ/mờ đề xuất vẽ lại — mục 5. Duyệt xong bấm "Sao chép quyết định" rồi dán cho em; em sửa đề, vẽ lại hình rồi mới ghi.</div>
${h}
<div id="bar"><button id="cp">Sao chép quyết định</button><span id="msg" class="mut small">Lựa chọn lưu trong trình duyệt.</span></div>
<script>
const K='clc-sua-21-11';let st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
document.querySelectorAll('select[data-id]').forEach(s=>{s.value=(st[s.dataset.id]||{}).v||'';s.onchange=()=>{(st[s.dataset.id]??={}).v=s.value;sv()}});
document.querySelectorAll('input[data-note]').forEach(i=>{i.value=(st[i.dataset.note]||{}).n||'';i.oninput=()=>{(st[i.dataset.note]??={}).n=i.value;sv()}});
function sv(){try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}
document.getElementById('cp').onclick=()=>{const L=Object.entries(st).filter(([k,v])=>(v.v||v.n)).map(([k,v])=>k+': '+(v.v||'—')+(v.n?' — '+v.n:''));const t='CLC→5T quyết định:\\n'+(L.join('\\n')||'(chưa chọn)');navigator.clipboard.writeText(t).then(()=>{document.getElementById('msg').textContent='Đã sao chép '+L.length+' dòng.'}).catch(()=>{document.getElementById('msg').textContent=t})};
</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
</main></body></html>`
writeFileSync('docs/de-xuat-sua-clc-5T.html', html)
console.log({ s1: S1.length, s2: S2.length, s3: S3.length, s4: S4.length, hinh: hinh.length, nho: nNho, kb: Math.round(html.length / 1024) })

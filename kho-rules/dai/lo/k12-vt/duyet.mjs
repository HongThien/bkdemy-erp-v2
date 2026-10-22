// duyet.mjs — dựng trang HTML để Thùy review bản đồ đề xuất K12 chương Vectơ (copy từ k12-hs): cây 4 tầng + mô tả + độ khó + nguồn + lý thuyết nhóm + lý thuyết dạng + ví dụ.
//   node kho-rules/dai/lo/k12-vt/duyet.mjs     → kho-rules/dai/k12-vecto-ban-do-moi-duyet.html
// Đọc: cau-truc.mjs (cây + mô tả) · ra/J*.txt (bản đã soát) · mục "GHI CHÚ CHO CEO" cuối tệp soạn + "Cần CEO xem" của biên bản soát (J*.soat.md).
// Hiển thị theo luật render của app (src/lib/lythuyetBlocks.ts): đoạn ##TC / ##PP (mỗi dòng một bước) / ##CY / ##VD (đề trong khung, "Bài giải:" ngoài khung).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { CAY, CHU_DE, THONG_KE } from './cau-truc.mjs'
import { docTep } from './kiem.mjs'
import { TEN_KHO } from './phan-loai-dang.mjs'
import { veHinh } from './ve.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const katex = createRequire(join(DIR, '../../../../package.json'))('katex')
const RA = join(DIR, 'ra')
const tepRa = existsSync(RA) ? readdirSync(RA).filter((f) => /^[JN]\d+\.txt$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))) : []
const moi = {}
for (const f of tepRa) for (const k of docTep(readFileSync(join(RA, f), 'utf8'))) moi[(k.la_nhom ? 'N ' : '') + k.id] = { ...k, tep: f }

const theKho = (k) => `<span class="the kho k${k}" title="Độ khó đề xuất (muc_do 1–5): ${esc(TEN_KHO[k])}">độ khó ${k}/5</span>`
const theNguon = (ng, v1) => `<span class="the ng ${ng.loai}" title="Nguồn quyết định tạo dạng này">${ng.loai === 'chi_sach' ? 'chỉ có ở sách' : ng.loai === 'chua' ? (v1 ? 'chưa đối chiếu nguồn' : 'dạng mới — chưa có nguồn') : ng.loai === 'chi_de_thi' ? 'chỉ có ở đề thi' : 'sách + đề thi'}${ng.loai === 'chua' ? '' : ' · ' + esc(ng.chu)}</span>`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(t)}</code>` } }
const dong = (s) => esc(s)
  .replace(/\$\$([^$]+)\$\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
  .replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const hinhDong = (x) => {
  const m = x.match(/^\[\[HINH (.*)\]\]\s*$/)
  if (!m) return null
  try { const sp = JSON.parse(m[1]); return `<figure class="hinh">${veHinh(sp)}<figcaption>${sp.loai === 'bbt' ? (sp.hang === 'dau' ? 'Bảng xét dấu' : 'Bảng biến thiên') : 'Đồ thị'}</figcaption></figure>` } catch (e) { return `<p class="loi">Hình lỗi: ${esc(e.message)}</p>` }
}
const dongTrongKhung = (x) => hinhDong(x) ?? `<div>${dong(x)}</div>`
const NHAN = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp', CY: 'Chú ý', DN: 'Định nghĩa', DL: 'Định lý', NX: 'Nhận xét' }
function noiDung(text) {
  let soVd = 0
  return (text || '').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean).map((d) => {
    const m = d.match(/^##(TC|PP|CY|DN|DL|ĐN|ĐL|NX|VD|BT)[ \t]*([^\n]*)\n?([\s\S]*)$/)
    if (!m) {
      if (/^(\*\*)?(Bài giải|Lời giải|Giải)\s*[:.]?(\*\*)?\s*(\n|$)/.test(d)) return `<div class="giai"><div class="nhan-giai">Bài giải:</div>${d.split('\n').slice(1).map(dongTrongKhung).join('')}</div>`
      return `<p>${d.split('\n').map(dong).join('<br>')}</p>`
    }
    const [, k, td, than] = m
    if (k === 'VD') { soVd++; return `<div class="khung vd"><span class="tag">Ví dụ ${soVd}</span>${than.split('\n').map(dongTrongKhung).join('')}</div>` }
    if (k === 'PP') return `<div class="khung pp"><span class="tag">${esc(td || NHAN.PP)}</span><ol>${than.split('\n').filter((x) => x.trim()).map((x) => `<li>${dong(x.replace(/^(\*\*)?\s*Bước\s*\d+\s*[:.]?\s*(\*\*)?\s*|^[-–]\s+/i, ''))}</li>`).join('')}</ol></div>`
    const lop = { TC: 'tc', CY: 'cy', DN: 'dn', ĐN: 'dn', DL: 'dl', ĐL: 'dl', NX: 'nx', BT: 'tc' }[k]
    return `<div class="khung ${lop}"><span class="tag">${esc(td || NHAN[k] || k)}</span>${than.split('\n').map((x) => `<div>${dong(x.replace(/^[-•]\s+/, '• '))}</div>`).join('')}</div>`
  }).join('')
}

// điểm cần xem: mục cuối tệp soạn + biên bản soát
const canXem = []
for (const f of tepRa) {
  const t = readFileSync(join(RA, f), 'utf8').replace(/\r\n/g, '\n')
  const i = t.search(/^## GHI CHÚ CHO CEO/m)
  if (i >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soạn`, text: t.slice(i).split('\n').slice(1).join('\n').trim() })
  const bb = join(RA, /^Nd/.test(f) ? 'N.soat.md' : f.replace('.txt', '.soat.md'))
  if (existsSync(bb) && !(/^N[23]/.test(f))) { const s = readFileSync(bb, 'utf8').replace(/\r\n/g, '\n'); const j = s.search(/^## Cần CEO xem/m); if (j >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soát`, text: s.slice(j).split('\n').slice(1).join('\n').replace(/\n## [\s\S]*$/, '').trim() }) }
}
const lienKet = (s) => dong(s).replace(/\b(H\d(?:\.\d+){1,2})\b/g, (m) => `<a href="#${m}">${m}</a>`)
const xem = canXem.filter((x) => x.text && !/^Không\.?$/i.test(x.text)).map((x) => `<section class="ghi"><h3>${esc(x.nguon)}</h3>${x.text.split('\n').filter((l) => l.trim()).map((l) => `<p>${lienKet(l.replace(/^[-*]\s*/, ''))}</p>`).join('')}</section>`).join('')

// thân theo cây
const tk = THONG_KE()
let html = '', soLtNhom = 0, soLtDang = 0, soVd = 0, soHinh = 0, thieu = 0
const toc = []
CAY.forEach((cd, ci) => {
  html += `<h2 id="${cd.id}">Phần ${ci + 1} · ${esc(cd.ten)} <span class="ma">${cd.id}</span></h2><p class="mota-nhom">${dong(cd.mo_ta)}</p>`
  const sub = []
  for (const n of cd.nhom) {
    const mn = moi['N ' + (n.cu ?? n.id)]
    if (mn?.lt) soLtNhom++
    sub.push(`<li><a href="#${n.id}">${esc(n.ten)}</a></li>`)
    html += `<section class="nhom-khoi" id="${n.id}"><h3 class="nhom">Nhóm bài · ${esc(n.ten)} <span class="ma">${n.id}</span> <span class="the ${n.bb ? 'bb' : 'nc'}">${n.bb ? 'bắt buộc' : 'nâng cao'}</span></h3>
<p class="mota-nhom">${dong(n.mo_ta)}</p>
<div class="phan"><div class="phan-t">Lý thuyết nhóm ${mn?.lt ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(mn?.lt ?? '')}</div>`
    for (const d of n.dang) {
      const [id, ten, mo, hinh, v1, kho, ng] = d
      const m = moi[v1]
      if (m?.lt) soLtDang++
      if (m?.vd) { soVd += (m.vd.match(/^##VD/gm) || []).length; soHinh += (m.vd.match(/\[\[HINH/g) || []).length }
      if (!m?.vd) thieu++
      html += `<article class="dang" id="${id}"><header><h4>${esc(ten)}</h4><span class="ma">${id}</span>${theKho(kho)}${theNguon(ng, v1)}${hinh !== 'khong' ? `<span class="the hinh-th">cần hình: ${hinh === '3d' ? 'hình khối 3D (chưa vẽ)' : hinh === 'bbt' ? 'bảng biến thiên' : hinh === 'dothi' ? 'đồ thị' : 'bảng + đồ thị'}</span>` : ''}</header>
<div class="mota"><span class="nhan">Mô tả nhận biết</span> ${dong(mo)}</div>
<div class="phan"><div class="phan-t">Lý thuyết dạng ${m?.lt ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(m?.lt ?? '')}</div>
<div class="phan"><div class="phan-t">Ví dụ ${m?.vd ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(m?.vd ?? '')}</div></article>`
    }
    html += '</section>'
  }
  toc.push(`<li><a href="#${cd.id}"><strong>${esc(cd.ten)}</strong></a><ul>${sub.join('')}</ul></li>`)
})

const cauTruc = `<table class="ct"><thead><tr><th>Chuyên đề</th><th>Nhóm bài</th><th>Dạng bài</th><th>Độ khó</th><th>Nguồn</th></tr></thead><tbody>${CAY.map((cd) => cd.nhom.map((n, i) => `<tr>${i === 0 ? `<td rowspan="${cd.nhom.length}"><a href="#${cd.id}">${esc(cd.ten)}</a></td>` : ''}<td><a href="#${n.id}">${esc(n.ten)}</a> ${n.bb ? '' : '<span class="the nc">nâng cao</span>'}</td><td>${n.dang.map((d) => `<a href="#${d[0]}">${esc(d[1])}</a>`).join('<br>')}</td><td class="cot-so">${n.dang.map((d) => d[5]).join('<br>')}</td><td class="cot-ng">${n.dang.map((d) => d[6].loai === 'chi_sach' ? 'sách' : d[6].loai === 'ca_hai' ? 'sách + đề thi' : d[6].loai === 'chi_de_thi' ? 'đề thi' : '?').join('<br>')}</td></tr>`).join('')).join('')}</tbody></table>`

const CAU_HOI = [
  ["Cách tôi hiểu chương và dựng cây — chị xem đúng chưa","Chương = **\"Vectơ và hệ trục toạ độ trong không gian\"** (cả 3 bài sách: Vectơ trong không gian · Toạ độ của vectơ · Biểu thức toạ độ các phép toán). 3 chuyên đề đúng 3 bài, trùng 3 chuyên đề của bản đồ cũ và của khung bạn đã có trong DB. Bên trong theo logic bạn dùng ở chương Hàm số: **nhóm cơ bản trước, bài khó ở nhóm riêng (đồng phẳng, tích có hướng, cực trị/tâm tỉ cự đánh dấu nâng cao), thực tế tách nhóm**, dạng = một bài toán đặc trưng. Nếu chị chỉ muốn phần \"Vectơ\" (Bài 1) thì bỏ P2, P3."],
  ["Dạng của bài 1 đi theo HÌNH (hộp · lăng trụ · chóp)","Trong DB chị đã tạo 6 dạng: Tổng hiệu → Hình hộp / Lăng trụ / Hình chóp; Tích vô hướng → độc lập / trên hình; Tính góc → độc lập. Tôi giữ đúng tinh thần đó: P1.2.1–P1.2.3 (hộp, lăng trụ, chóp–tứ diện), P1.4.1–P1.4.2 (độc lập, trên hình). Các nhóm còn lại tôi tự đặt (sách chỉ chia 4–6 dạng thô)."],
  ["Độ khó (muc_do 1–5) là ĐỀ XUẤT; nguồn tạo dạng tính thế nào","Độ khó chấm theo kiểu bài + nhận xét mức NB/TH/VD/VDC của 3 hồ sơ; chưa đo bằng câu thật (chưa gán câu vào dạng mới). **Nguồn:** T Từ Tâm · N NBV · P PNL · Đ đề thi (ERP). Một trạm kiểm lại 27 dạng so với bản sơ bộ. Lưu ý: nhóm cũ T112070301 (184 câu, đều từ đề thi) là \"túi\" gồm hình chiếu, đối xứng, i-j-k, gắn hệ trục ⇒ tôi tính **Đ theo NỘI DUNG câu**, không theo tên nhóm cũ (nếu theo tên thì P2.1.x không có Đ). Chị chấp nhận cách này không? Các dạng Đ \"yếu\" (1–3 câu) đánh dấu trong báo cáo `ho-so/bao-cao-kiem-nguon.md`."],
  ["3 dạng tôi thêm sau khi kiểm độ phủ (mỗi dạng ≥10 câu sách) — giữ không?","P1.2.7 Cùng phương, thẳng hàng và tìm tỉ số trên hình khối · P1.4.6 Chứng minh vuông góc và tính góc giữa hai đường thẳng bằng tích vô hướng · P3.2.5 Tìm điểm thoả đẳng thức vectơ. Còn 3 kiểu nhỏ hơn tôi CHƯA thêm, chờ chị: chân đường cao / chân phân giác trong · hình thang, hình vuông cho diện tích tìm đỉnh · tâm ngoại tiếp, nội tiếp, trực tâm bằng toạ độ (gần kiến thức lớp 10, ngoài chương)."],
  ["Ranh giới các dạng chồng nhau","P3.6.1 (M tự do: tâm tỉ cự, Σk·MA² nhỏ nhất) và P3.6.2 (M bị ràng buộc trên mặt phẳng toạ độ/trục) — đã viết rõ ranh trong lý thuyết. P3.2.5 (tìm điểm từ đẳng thức vectơ) chồng một phần với P3.6.1 (cùng ΣkMA=0): P3.2.5 chỉ tìm điểm, P3.6.1 mới đi tiếp tới cực trị. P3.6.3 ví dụ 2 thực chất là quỹ tích mặt cầu (không gọi tên mặt cầu) — có cần thay không?"],
  ["Hai dạng \"chỉ có ở sách\" nên cân nhắc","P1.2.4 Chứng minh đẳng thức vectơ (sách 13+ câu, đề thi không ra dạng chứng minh) · P1.5.2 Công của lực (đề thi không có câu công). Giữ hay gộp/bỏ? Nhóm P1.3 (đồng phẳng), P3.5 (tích có hướng), P3.6 (cực trị) nguồn dạy rất ít — lý thuyết nhóm do trạm soạn tự viết, đã soát độc lập."],
  ["Hình 3D chưa có","Bài 1 gần như toàn câu cần hình hộp/lăng trụ/chóp; máy vẽ hiện chỉ vẽ đồ thị/bảng biến thiên. Các ví dụ đều **mô tả hình bằng lời** (đủ dữ kiện để tự dựng hình), chưa có hình. Cần module vẽ hình khối có tên đỉnh + hệ trục Oxyz nếu chị muốn hình trong ví dụ."],
  ["Lỗi nguồn đã gặp (không chép vào bản đồ)","Từ Tâm: B1 C18 hỏng (cả 4 phương án đúng), VD2.2 \"hình bình hành ⇔ AB=2DC\" sai, VD5.3 sai hệ số m. NBV: E8 #20 ghi 25 (đúng 15), #21 ghi 1,33 (đúng 6), Đề 2 Phần I Câu 3 đáp án in A (đúng C), 9 câu E8 #11–19 mất công thức (ảnh WMF). PNL: 3 lời giải sai (B1D2·P1·C5, P3·C2, P3·C4), Đề 01 Phần III Câu 4 hỏng ký tự, bản chữ B2D2 mất hình. Bài lực của PNL nhân cos60° hai lần (đúng 428,75 J)."],
  ["Khi chị chốt mới ghi DB","Như chương Hàm số: bản này chưa ghi DB. Khi chị chốt tôi ghi cây + lý thuyết + ví dụ + độ khó + nguồn vào DB (cần thêm cột độ khó và nguồn ở dạng bài), rồi gán lại câu theo bản đồ mới; 6 dạng chị đã tạo sẽ được đối chiếu để không trùng."],
]

const page = `<title>K12 Vectơ — bản đồ mới 4 tầng (đề xuất)</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--tc:#2D9CDB;--pp:#6b7280;--cy:#d97706;--vd:#b23a72;--dn:#c89b52;--dl:#7c5cbf;--nx:#0f9d8a;--nen-mota:#f3f4f6;--moi:#047857;--nen-moi:#ecfdf5;--thieu:#b45309;--bb:#1d4ed8;--nc:#9333ea;--lk:#2563eb}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;--bb:#93c5fd;--nc:#d8b4fe;--lk:#93c5fd;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;--bb:#93c5fd;--nc:#d8b4fe;--lk:#93c5fd;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
a{color:var(--lk)}
.bo{display:grid;grid-template-columns:260px minmax(0,1fr);gap:0;max-width:1240px;margin:0 auto}
aside{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto;padding:16px 12px 40px 16px;font-size:13px;border-right:1px solid var(--vien)}
aside ul{list-style:none;margin:2px 0 8px;padding-left:12px}aside li{margin:2px 0}aside a{color:var(--chu);text-decoration:none}aside a:hover{text-decoration:underline}
main{padding:20px 16px 80px;min-width:0}
@media (max-width:900px){.bo{display:block}aside{position:static;max-height:none;border-right:0;border-bottom:1px solid var(--vien)}}
h1{font-size:22px;margin:6px 0;text-wrap:balance}h2{font-size:19px;margin:44px 0 6px;padding-bottom:4px;border-bottom:2px solid var(--vien);text-wrap:balance}
h3.nhom{font-size:16px;margin:26px 0 4px}.mota-nhom{color:var(--mo);margin:0 0 8px;max-width:75ch}
p{margin:0 0 6px}.dan{color:var(--mo);max-width:75ch}.ma{color:var(--mo);font:12px ui-monospace,Consolas,monospace;font-weight:400}
.the{font-size:12px;border-radius:999px;padding:1px 9px;font-weight:500;border:1px solid currentColor;margin-left:6px;white-space:nowrap}.the.bb{color:var(--bb)}.the.nc{color:var(--nc)}.the.hinh-th{color:var(--mo)}
a:focus-visible,summary:focus-visible{outline:2px solid var(--tc);outline-offset:2px}
.ghi{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:10px 14px;margin:10px 0}.ghi h3{font-size:14px;margin:0 0 6px;color:var(--mo)}
.dang{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:12px 0;display:flex;flex-direction:column;gap:10px}
.dang header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.dang h4{font-size:15.5px;margin:0}
.mota{background:var(--nen-mota);border-radius:8px;padding:8px 10px}.nhan{color:var(--mo);font-size:13px;margin-right:6px}
.phan{margin-top:2px}.phan-t{font-weight:600;margin-bottom:6px;display:flex;gap:8px;align-items:center}
.nhom-khoi>.phan{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px}
.thieu{font-weight:500;font-size:12.5px;border:1px solid var(--thieu);color:var(--thieu);border-radius:6px;padding:1px 8px}
.khung{position:relative;border:1.5px solid var(--k);border-radius:10px;padding:18px 14px 10px;margin:14px 0 8px}.khung>div{max-width:100%;overflow-x:auto}
.khung .tag{position:absolute;top:-11px;left:12px;background:var(--the);color:var(--k);font-size:13px;font-weight:600;padding:0 6px}
.tc{--k:var(--tc)}.pp{--k:var(--pp)}.cy{--k:var(--cy)}.vd{--k:var(--vd)}.dn{--k:var(--dn)}.dl{--k:var(--dl)}.nx{--k:var(--nx)}
.pp ol{margin:0;padding-left:22px}.pp li{margin:2px 0}
.giai{overflow-x:auto;margin:0 0 6px}.nhan-giai{text-align:center;font-weight:700;text-decoration:underline;margin:4px 0}
figure.hinh{margin:8px 0;display:flex;flex-direction:column;align-items:flex-start;gap:2px;overflow-x:auto;color:var(--chu)}figure.hinh figcaption{font-size:12px;color:var(--mo)}
.loi{color:#dc2626;font-weight:600}
table.ct{border-collapse:collapse;width:100%;font-size:13.5px;background:var(--the)}table.ct th,table.ct td{border:1px solid var(--vien);padding:6px 9px;vertical-align:top;text-align:left}table.ct th{background:var(--nen-mota)}
details.cauhoi{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:8px 14px;margin:8px 0}details.cauhoi summary{cursor:pointer;font-weight:600}
math{font-size:1.06em}
.the.kho{color:var(--mo)}.the.kho.k1,.the.kho.k2{color:#047857}.the.kho.k4,.the.kho.k5{color:#b45309}.the.ng.chi_sach{color:#7c5cbf}.the.ng.ca_hai{color:#0f9d8a}.the.ng.chua{color:var(--thieu)}
td.cot-so{text-align:center;white-space:nowrap}td.cot-ng{white-space:nowrap;font-size:12.5px}
</style>
<div class="bo">
<aside><strong>Mục lục</strong><ul><li><a href="#tong-quan">Tổng quan cây 4 tầng</a></li><li><a href="#quyet">Cần chị quyết</a></li><li><a href="#xem">Điểm cần xem khi soạn</a></li>${toc.join('')}</ul></aside>
<main>
<h1>K12 · Vectơ và hệ trục toạ độ trong không gian — bản đồ mới 4 tầng (đề xuất)</h1>
<p class="dan">Chủ đề <strong>${esc(CHU_DE.ten)}</strong> (<span class="ma">${CHU_DE.id}</span>) · ${tk.chuyen_de} chuyên đề (= 3 bài của sách) · ${tk.nhom} nhóm bài · ${tk.dang} dạng bài. Mỗi nhóm có lý thuyết chung; mỗi dạng có mô tả nhận biết, <strong>độ khó (1–5)</strong>, <strong>nguồn tạo dạng</strong>, lý thuyết riêng và ví dụ có lời giải.</p>
<p class="dan">Cơ sở: 3 tác giả (Từ Tâm, NBV, PNL) + đề thi K12 trên ERP (bản đồ cũ T1120701–T1120703: 922 câu trong kho). Trang này chỉ để review — <strong>chưa ghi vào DB</strong>. Mã P… là mã tạm; khi chị chốt mới sinh mã NNB/NDB. Hình 3D (hình hộp, chóp, lăng trụ…) chưa vẽ: ví dụ mô tả hình bằng lời.</p>
<h2 id="tong-quan">Tổng quan cây 4 tầng</h2>
${cauTruc}
<h2 id="quyet">Cần chị quyết</h2>
${CAU_HOI.map(([t, m]) => `<details class="cauhoi" open><summary>${esc(t)}</summary><p>${dong(m)}</p></details>`).join('')}
<h2 id="xem">Điểm cần xem khi soạn</h2>
${xem || '<p class="dan">Không có.</p>'}
${html}
</main></div>
`
const ra = join(DIR, '..', '..', 'k12-vecto-ban-do-moi-duyet.html')
writeFileSync(ra, page)
console.log(`${tk.dang} dạng · lý thuyết nhóm ${soLtNhom}/${tk.nhom} · lý thuyết dạng ${soLtDang} · ví dụ ${soVd} · hình ${soHinh} · chưa soạn ${thieu} · ${(page.length / 1024).toFixed(0)} KB → ${ra}`)

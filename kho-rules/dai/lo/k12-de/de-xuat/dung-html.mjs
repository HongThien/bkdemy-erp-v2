// dung-html.mjs — dựng HTML duyệt bản đồ K12 từ ĐỀ THI (bước 2). node dung-html.mjs <rows.json> <ra.html>
import fs from 'node:fs'
import { htmlQuyet, cssQuyet } from '../../quyet.mjs'
const [rowsF, ra] = process.argv.slice(2)
const rows = JSON.parse(fs.readFileSync(rowsF, 'utf8'))
const D = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), 'utf8'))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const TEN = { HS: 'Hàm số', VT: 'Vectơ và hệ trục toạ độ', XS: 'Xác suất có điều kiện', SDT: 'Số đặc trưng mẫu ghép nhóm', NHTP: 'Nguyên hàm – Tích phân', PPTD: 'PP toạ độ trong không gian' }
const MOI = { HS: 'làm lại', VT: 'làm lại', XS: 'làm lại', SDT: 'làm lại', NHTP: 'giữ nguyên — chỉ bổ sung', PPTD: 'giữ nguyên — chỉ bổ sung' }
const nonDS = (c) => rows.filter((r) => r.ch === c && r.loai !== 'dung_sai')
const dsN = (c) => rows.filter((r) => r.ch === c && r.loai === 'dung_sai').length
const kiemTra = []

// ---- đếm câu theo dạng mới ----
function demHSVT(c, j) {
  const R = nonDS(c), cnt = {}, muc = {}
  const mapMa = {}, mapMo = {}
  for (const cd of j.chuyen_de) for (const n of cd.nhom) for (const d of n.dang) { for (const t of d.tu || []) mapMa[t] = d.id; for (const m of d.moi || []) mapMo[m] = d.id }
  let chua = 0
  for (const r of R) {
    const moi = /^(NEW|\?)$/.test(r.dang)
    const id = moi ? mapMo[r.mo] : mapMa[r.dang]
    if (!id) { chua++; continue }
    cnt[id] = (cnt[id] || 0) + 1; muc[id] = (muc[id] || 0) + (+r.muc || 0)
  }
  return { cnt, muc, chua }
}
function demTSV(c, f) {
  const cnt = {}, muc = {}, m = Object.fromEntries(nonDS(c).map((r) => [r.id, +r.muc || 0]))
  let n = 0
  for (const l of fs.readFileSync(new URL(f, import.meta.url), 'utf8').split('\n').filter(Boolean)) { const [id, d] = l.split('\t'); cnt[d] = (cnt[d] || 0) + 1; muc[d] = (muc[d] || 0) + (m[id] || 0); n++ }
  return { cnt, muc, chua: nonDS(c).length - n }
}
const css = `
:root{--nen:#fbfaf7;--the:#fff;--vien:#e3dfd4;--chu:#25221b;--mo:#6c6657;--tc:#2f5d8c;--moi:#b0582a;--nen-mota:#f3efe4;--xanh:#2f7d4f;color-scheme:light}
@media(prefers-color-scheme:dark){:root{--nen:#1a1915;--the:#23221d;--vien:#3a382f;--chu:#ece8dc;--mo:#a8a290;--tc:#7fb0e0;--moi:#e8956a;--nen-mota:#2b2a23;--xanh:#78c598;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.55 system-ui,'Segoe UI',sans-serif}
main{max-width:1060px;margin:0 auto;padding:20px 20px 80px}h1{font-size:25px;margin:6px 0}h2{font-size:21px;margin:34px 0 6px;border-bottom:2px solid var(--vien);padding-bottom:4px}
h3{font-size:16.5px;margin:18px 0 4px}p{margin:6px 0}.mo{color:var(--mo)}nav{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}nav a{padding:3px 12px;border:1px solid var(--vien);border-radius:999px;color:var(--tc);text-decoration:none;background:var(--the)}
table{border-collapse:collapse;width:100%;background:var(--the)}th,td{border:1px solid var(--vien);padding:5px 9px;text-align:left;vertical-align:top;font-size:14px}th{background:var(--nen-mota)}td.n{text-align:right;white-space:nowrap}
.bang{overflow-x:auto}details{margin:6px 0}summary{cursor:pointer;font-weight:600;padding:5px 0}summary .so{color:var(--mo);font-weight:400;margin-left:8px;font-size:13.5px}
.cd{border:1px solid var(--vien);border-radius:12px;padding:6px 14px;margin:10px 0;background:var(--the)}.nhom{margin-left:14px;border-left:3px solid var(--vien);padding-left:12px}
.dang{display:grid;grid-template-columns:62px 1fr 64px;gap:8px;padding:6px 0;border-top:1px dashed var(--vien)}.dang .id{color:var(--mo);font-size:12.5px}.dang .t{font-weight:600}.dang .m{color:var(--mo);font-size:13.5px}
.dang .c{text-align:right;font-weight:700}.dang .c small{display:block;color:var(--mo);font-weight:400;font-size:11.5px}.tag{font-size:11.5px;border:1px solid var(--vien);border-radius:999px;padding:0 7px;margin-left:6px;color:var(--mo);font-weight:400}.tag.hiem{color:var(--moi);border-color:var(--moi)}.tag.moi{color:var(--xanh);border-color:var(--xanh)}
.bar{height:5px;background:var(--tc);border-radius:3px;margin-top:3px;opacity:.55}.luu{border-left:4px solid var(--moi);background:var(--nen-mota);padding:8px 12px;border-radius:0 8px 8px 0;margin:10px 0}
@media(max-width:640px){.dang{grid-template-columns:1fr}.dang .c{text-align:left}}
${cssQuyet}`
function cayHTML(j, dem) {
  let h = ''
  for (const cd of j.chuyen_de) {
    const tongCd = cd.nhom.flatMap((n) => n.dang).reduce((s, d) => s + (dem.cnt[d.id] || 0), 0)
    h += `<details class="cd" open><summary>${esc(cd.id)} · ${esc(cd.ten)}<span class="so">${tongCd} câu</span></summary>${cd.mo_ta ? `<p class="mo">${esc(cd.mo_ta)}</p>` : ''}`
    for (const n of cd.nhom) {
      const tn = n.dang.reduce((s, d) => s + (dem.cnt[d.id] || 0), 0)
      h += `<div class="nhom"><h3>${esc(n.id)} · ${esc(n.ten)}<span class="so mo" style="font-weight:400;font-size:13.5px"> — ${tn} câu</span></h3>`
      for (const d of n.dang) {
        const k = dem.cnt[d.id] || 0, mt = k ? (dem.muc[d.id] / k).toFixed(1) : '–'
        const laMoi = !(d.tu || []).some((t) => /^(P|NHOM)/.test(t))
        h += `<div class="dang"><div class="id">${esc(d.id)}</div><div><div class="t">${esc(d.ten)}${d.hiem ? '<span class="tag hiem">hiếm</span>' : ''}${laMoi ? '<span class="tag moi">dạng mới</span>' : ''}</div><div class="m">${esc(d.mo_ta)}</div>${(d.tu || []).length ? `<div class="m" style="font-size:12px">kế thừa: ${esc(d.tu.join(', '))}</div>` : ''}</div><div class="c">${k}<small>mức ${mt}</small><div class="bar" style="width:${Math.min(100, Math.round(k / 2))}%"></div></div></div>`
      }
      h += '</div>'
    }
    h += '</details>'
  }
  return h
}
function bangThem(j) {
  let h = '<h3>Dạng ĐỀ XUẤT THÊM (không đụng dạng đã có)</h3><div class="bang"><table><tr><th>Mã</th><th>Vào nhóm</th><th>Dạng đề xuất</th><th>Số câu</th></tr>'
  for (const d of j.them) h += `<tr><td>${esc(d.id)}</td><td>${esc(d.nhom)}</td><td><b>${esc(d.ten)}</b>${d.hiem ? '<span class="tag hiem">hiếm</span>' : ''}<br><span class="mo">${esc(d.mo_ta)}</span></td><td class="n">${d.so_cau}</td></tr>`
  h += '</table></div>'
  if (j.dang_cu_khong_xuat_hien?.length) h += `<h3>Dạng đã có mà đề thi gần như không hỏi (chỉ báo cáo, KHÔNG xoá)</h3><div class="bang"><table><tr><th>Mã</th><th>Dạng</th><th>Số câu</th></tr>${j.dang_cu_khong_xuat_hien.map((d) => `<tr><td>${esc(d.ma)}</td><td>${esc(d.ten)}</td><td class="n">${d.so_cau}</td></tr>`).join('')}</table></div>`
  const nn = j.nghi_gan_nham || []
  h += `<h3>Câu nghi bị gắn nhầm</h3><p class="mo">${nn.length} câu người đọc đặt “không khớp”, nhưng nội dung khớp dạng đã có. Không chuyển gì; chỉ để chị biết.</p>`
  if (j.bo_moi?.length) h += `<details><summary>Kiểu câu quá lẻ — không lập dạng (${j.bo_moi.length})</summary><ul>${j.bo_moi.map((b) => `<li>${esc(b.mo_ta)} <span class="mo">— ${esc(b.ly_do)}</span></li>`).join('')}</ul></details>`
  return h
}
const tomtat = [], phan = [], hoi = []
const LUU = {
  HS: 'Ba dạng mới tách ra từ mã cũ chung (cực trị theo m ~11 câu, thuế phụ thu ~5 câu, chi phí theo vận tốc ~8 câu) nên số câu ở đó chưa chính xác — sẽ gắn lại từng câu sau khi chị chốt cây. Hai câu T112010102173 và T1120000004463 là câu Hàm số bị gắn nhầm sang chương khác, sẽ chuyển về đúng chương khi chốt.',
  VT: 'Nhóm “lực” (72 câu) đang chung một mã cũ; khi tách theo cách giải (hợp lực / lực căng dây) số câu từng dạng sẽ gắn lại từng câu sau khi chị chốt. Dạng thực tế bằng toạ độ giáp ranh với PP toạ độ — xem câu hỏi VT-H1 (một ý trong đó viết theo trí nhớ, chưa kiểm với sách).',
  XS: 'Chương chưa từng có tầng dạng: đã đọc toàn bộ 313 câu và xếp từng câu vào dạng mới. Có vài cặp câu gần trùng nguyên văn (cùng câu ở nhiều đề), số câu chưa khử trùng hẳn.',
  SDT: 'Chương chưa từng có tầng dạng: đã đọc toàn bộ 381 câu. Có nhiều câu trùng nguyên văn (một bảng số liệu lặp hàng chục lần), nên “số câu” lớn hơn số bài khác nhau thật.',
}
for (const c of ['HS', 'VT', 'XS', 'SDT']) {
  const j = D(c + '.json')
  const dem = c === 'HS' || c === 'VT' ? demHSVT(c, j) : demTSV(c, c + '-cau.tsv')
  const nd = j.chuyen_de.flatMap((x) => x.nhom.flatMap((n) => n.dang)).length, nn = j.chuyen_de.reduce((s, x) => s + x.nhom.length, 0)
  const gan = Object.values(dem.cnt).reduce((a, b) => a + b, 0)
  if (dem.chua) kiemTra.push(`${c}: ${dem.chua} câu chưa vào dạng nào`)
  tomtat.push([c, TEN[c], MOI[c], nonDS(c).length, dsN(c), j.chuyen_de.length, nn, nd, gan])
  const gop = (j.gop || []).length ? `<details><summary>Dạng thực đơn đã gộp (${j.gop.length})</summary><ul>${j.gop.map((g) => `<li>${esc(g.ma)} → ${esc(g.vao)} <span class="mo">— ${esc(g.ly_do)}</span></li>`).join('')}</ul></details>` : ''
  const bo = (j.bo_moi || []).length ? `<details><summary>Câu không xếp vào dạng (${j.bo_moi.length} kiểu)</summary><ul>${j.bo_moi.map((b) => `<li>${esc(b.mo_ta)} <span class="mo">— ${esc(b.ly_do)}</span></li>`).join('')}</ul></details>` : ''
  phan.push(`<h2 id="${c}">${esc(TEN[c])} (${c}) <span class="tag">${MOI[c]}</span></h2><p class="mo">${nonDS(c).length} câu vào kho dạng · ${dsN(c)} câu Đúng–Sai vào kho Đ/S của chủ đề (không phân dạng)</p><div class="luu">${esc(LUU[c])}</div>${cayHTML(j, dem)}${gop}${bo}`)
  for (const q of j.cau_hoi || []) hoi.push({ ...q, ma: c + '-' + q.ma })
}
for (const c of ['NHTP', 'PPTD']) {
  const j = D(c + '.json')
  tomtat.push([c, TEN[c], MOI[c], nonDS(c).length, dsN(c), '—', '—', '+' + j.them.length + ' dạng', j.them.reduce((s, d) => s + d.so_cau, 0)])
  phan.push(`<h2 id="${c}">${esc(TEN[c])} (${c}) <span class="tag">${MOI[c]}</span></h2><p class="mo">${nonDS(c).length} câu vào kho dạng · ${dsN(c)} câu Đúng–Sai vào kho Đ/S của chủ đề. Các dạng chị đã làm GIỮ NGUYÊN.</p>${bangThem(j)}`)
  for (const q of j.cau_hoi || []) hoi.push({ ...q, ma: c + '-' + q.ma })
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bản đồ K12 từ đề thi — đề xuất dạng</title><style>${css}</style></head><body><main>
<h1>Bản đồ K12 — đề xuất dạng bám ĐỀ THI</h1>
<p class="mo">Bước 2 của quy trình chị chốt 03/11. Nguồn: ${rows.length.toLocaleString('vi')} câu đề K12 (giữa kì · cuối kì · thi thử TN · khảo sát · đề cương) trên ERP, đã khử trùng theo mã câu. Chưa ghi gì vào DB.</p>
<p><b>Đúng–Sai:</b> không phân dạng; mọi câu Đ/S vào kho Đ/S của chủ đề (bảng <code>dai_bdm_kho_ds</code>). Các con số dưới đây chỉ tính câu trắc nghiệm / trả lời ngắn / tự luận.</p>
<nav>${['HS', 'VT', 'XS', 'SDT', 'NHTP', 'PPTD'].map((c) => `<a href="#${c}">${esc(TEN[c])}</a>`).join('')}<a href="#hoi">Câu cần chị chọn (${hoi.length})</a></nav>
<div class="bang"><table><tr><th>Chương</th><th>Cách làm</th><th>Câu vào dạng</th><th>Câu Đ/S</th><th>Chuyên đề</th><th>Nhóm</th><th>Dạng</th><th>Câu đã xếp</th></tr>
${tomtat.map((t) => `<tr><td><a href="#${t[0]}">${esc(t[1])}</a></td><td>${esc(t[2])}</td><td class="n">${t[3]}</td><td class="n">${t[4]}</td><td class="n">${t[5]}</td><td class="n">${t[6]}</td><td class="n">${t[7]}</td><td class="n">${t[8]}</td></tr>`).join('')}</table></div>
<h2 id="hoi">Câu cần chị chọn (${hoi.length})</h2><p class="mo">Bấm chọn từng câu rồi “Sao chép trả lời” dán lại cho em. Phương án có nhãn “đề xuất” là phương án em nghiêng về; chọn khác cũng được.</p>
${htmlQuyet(hoi, 'k12-de-dang-0311')}
${phan.join('\n')}
</main></body></html>`
fs.writeFileSync(ra, html)
console.log('đã ghi', ra, Math.round(html.length / 1024) + 'KB', '· câu hỏi', hoi.length, '· cảnh báo:', kiemTra.join('; ') || 'không')
tomtat.forEach((t) => console.log(t.join(' | ')))

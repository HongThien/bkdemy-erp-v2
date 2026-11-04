// Dựng HTML duyệt 11 dạng K11 thiếu mô tả/lý thuyết/ví dụ (đề xuất — CHƯA ghi bản đồ).
//   node kho-rules/dai/lo/k11/bo-sung-dang/build-html.mjs  ⇒ duyet-bo-sung-dang.html cùng thư mục
import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const ids = ['NDB01631', 'NDB01618', 'NDB01633', 'NDB01632', 'NDB01634', 'NDB01598', 'NDB01352', 'NDB01616', 'NDB01597', 'NDB01353', 'NDB01354']
const kiem = [...JSON.parse(fs.readFileSync(path.join(dir, '_kiem-1.json'), 'utf8')), ...JSON.parse(fs.readFileSync(path.join(dir, '_kiem-2.json'), 'utf8'))]
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const TEN = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp', CY: 'Chú ý', DN: 'Định nghĩa', DL: 'Định lý', NX: 'Nhận xét', VD: 'Ví dụ' }
// tách theo ##XX; mỗi khối: nhãn + nội dung (xuống dòng giữ nguyên)
function khoi(text) {
  const out = []
  let cur = null
  for (const dong of String(text ?? '').split('\n')) {
    const m = dong.match(/^##(\S+)\s*(.*)$/)
    if (m) { cur = { tag: m[1], tieuDe: m[2], dong: [] }; out.push(cur) } else if (cur) cur.dong.push(dong)
    else if (dong.trim()) { cur = { tag: '', tieuDe: '', dong: [dong] }; out.push(cur) }
  }
  return out
}
const html = (k) => k.map((b) => `<div class="kh t-${esc(b.tag)}"><div class="nh">${esc(TEN[b.tag] ?? b.tag)}${b.tieuDe ? ' — ' + esc(b.tieuDe) : ''}</div><div class="nd">${esc(b.dong.join('\n').trim()).replace(/\n/g, '<br>')}</div></div>`).join('')
const nhan = { dung: ['ok', 'giải mù: ĐÚNG'], sai: ['bad', 'giải mù: SAI'], thieu_du_kien: ['bad', 'thiếu dữ kiện'], nghi_ngo: ['warn', 'giải mù: NGHI NGỜ'] }
const CO = {
  NDB01353: ['VD2: 243° > 180° là tứ giác lõm — nên đổi số để mọi góc < 180°?', 'VD3: dùng định lí sin/cosin lớp 10 — giữ hay đổi sang cách thuần lớp 11 (tích thành tổng ra cos(A−C)=1)?', 'Câu thật T111060302047 (đang gán dạng này) ghi "tứ giác lồi" mà góc lớn nhất 192° > 180°: đáp số 192° đúng, chỉ sai chữ "lồi".'],
  NDB01632: ['Chưa có câu K11 thật nào ở dạng này; ví dụ chưa có hình (đề tả đồ thị bằng toạ độ điểm đặc biệt).'],
  NDB01633: ['Ranh giới cần Thùy xác nhận với dạng chu kì (câu sóng biển/đánh đu nhiều ý có thể chồng sang).'],
  NDB01618: ['Ranh giới với NDB00954 / NDB00952 khi gặp biểu thức trung gian.'],
  NDB01631: ['VD ISS: tự thêm bán kính Trái Đất 6400 km (câu thật T1110000001172 có thể không cho) — đối chiếu đề thật.'],
  NDB01354: ['Chưa có ví dụ cho bài ngược (tìm đầu mút/tần số chưa biết) và bài so sánh hai mẫu — chưa có nguồn để kiểm.', 'Chỉ đọc sách Từ Tâm; PNL chưa mở.'],
}
let tong = 0, dung = 0
const phan = ids.map((id) => {
  const j = JSON.parse(fs.readFileSync(path.join(dir, id + '.json'), 'utf8'))
  const ks = kiem.filter((x) => x.id === id)
  tong += ks.length; dung += ks.filter((x) => x.ket_luan === 'dung').length
  const vd = khoi(j.vi_du)
  const vdHtml = vd.map((b, i) => {
    const k = ks.find((x) => x.vd_so === i + 1)
    const [cls, tx] = nhan[k?.ket_luan] ?? ['warn', 'chưa kiểm']
    return html([b]).replace('<div class="nh">', `<div class="nh"><span class="bd ${cls}">${tx}</span> `) + (k && k.ket_luan !== 'dung' ? `<div class="gc">Ghi chú kiểm: ${esc(k.ghi_chu)}</div>` : '')
  }).join('')
  const nguon = (j.nguon ?? []).map((n) => `<li>${esc(typeof n === 'string' ? n : [n.sach, n.bai ?? n.tep, n.ghi_chu].filter(Boolean).join(' — '))}</li>`).join('')
  const co = (CO[id] ?? []).map((c) => `<li>${esc(c)}</li>`).join('')
  return `<section id="${id}"><h2>${id} · ${esc(j.ten)}</h2>
<div class="blk"><b>Mô tả đề xuất</b><p>${esc(j.mo_ta).replace(/\n/g, '<br>')}</p></div>
<div class="blk"><b>Lý thuyết đề xuất</b>${html(khoi(j.ly_thuyet))}</div>
<div class="blk"><b>Ví dụ đề xuất</b>${vdHtml}</div>
${co ? `<div class="blk co"><b>Cần Thùy quyết</b><ul>${co}</ul></div>` : ''}
<details><summary>Nguồn &amp; ghi chú của người soạn</summary><ul>${nguon}</ul><p>${esc(j.ghi_chu)}</p></details></section>`
}).join('\n')

const doc = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt bổ sung 11 dạng K11</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f6f7f9;--card:#fff;--tx:#1b1f24;--mu:#5a6572;--bd:#dde1e6}
@media(prefers-color-scheme:dark){:root{--bg:#14171a;--card:#1c2025;--tx:#e6e9ed;--mu:#9aa5b1;--bd:#2d333b}}
body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.6 system-ui,sans-serif}
main{max-width:900px;margin:0 auto;padding:16px}
h1{font-size:20px}h2{font-size:17px;margin:0 0 8px}
section{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px;margin:14px 0}
.blk{margin:10px 0}.blk>b{display:block;color:var(--mu);font-size:13px;margin-bottom:4px}
.kh{border-left:4px solid #4c6fff;background:rgba(76,111,255,.07);border-radius:6px;padding:6px 10px;margin:6px 0}
.t-TC{border-color:#2D9CDB}.t-PP{border-color:#888}.t-CY{border-color:#e08a2c}.t-DN{border-color:#c89b52}.t-DL{border-color:#7c5cbf}.t-VD{border-color:#b23a72}
.nh{font-weight:600;font-size:13px}.nd{margin-top:2px}
.bd{display:inline-block;font-size:11px;border-radius:9px;padding:0 7px;margin-right:6px;color:#fff}
.ok{background:#2e9e5b}.warn{background:#e08a2c}.bad{background:#d64545}
.gc{font-size:13px;color:#e08a2c;margin:2px 0 6px 14px}
.co{background:rgba(224,138,44,.1);border-radius:8px;padding:8px 12px}.co ul{margin:4px 0 0 18px;padding:0}
details{color:var(--mu);font-size:13px}.top{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:12px}
</style></head><body><main>
<h1>Duyệt bổ sung mô tả · lý thuyết · ví dụ cho 11 dạng K11</h1>
<div class="top"><b>Đây là ĐỀ XUẤT — chưa ghi vào bản đồ.</b> Nguồn: PNL, Từ Tâm, NBV (công thức trong .docx bị mất nên ví dụ tự soạn lại). ${tong} ví dụ đã được giải mù lại bởi agent thứ hai: <b>${dung}/${tong} đúng</b>, còn lại nghi ngờ (nêu cạnh từng ví dụ). Thùy xem xong nói "ghi" (hoặc nêu dạng nào sửa/bỏ) thì mới ghi vào dai_bdm_dang_bai.</div>
${phan}
</main></body></html>`
fs.writeFileSync(path.join(dir, 'duyet-bo-sung-dang.html'), doc)
console.log(`ok · ${ids.length} dạng · ${dung}/${tong} ví dụ đúng`)

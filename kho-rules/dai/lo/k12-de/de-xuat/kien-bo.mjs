// kien-bo.mjs — trang HTML cho Thùy quyết: câu "con kiến bò trên thang đang trượt" đặt ở dạng nào. node kien-bo.mjs <thư mục k12de> <ra.html>
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { htmlQuyet, cssQuyet } from '../../quyet.mjs'
const katex = createRequire(import.meta.url)('C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/node_modules/katex')
const [K, ra] = process.argv.slice(2)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(t)}</code>` } }
const md = (s) => s.split('\n').filter((l) => l.trim()).map((l) => '<p>' + esc(l).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'))).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') + '</p>').join('')

const cau = {}
for (let i = 1; i <= 102; i++) for (const l of fs.readFileSync(`${K}/lo-${String(i).padStart(3, '0')}.jsonl`, 'utf8').split('\n').filter(Boolean)) { const o = JSON.parse(l); cau[o.id] = o }
const hs = JSON.parse(fs.readFileSync(new URL('HS.json', import.meta.url), 'utf8'))
const dang = Object.fromEntries(hs.chuyen_de.flatMap((c) => c.nhom.flatMap((n) => n.dang)).map((d) => [d.id, d]))
const txt = fs.readFileSync(new URL('noi-dung/HS.txt', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const vd = txt.split(/^##VD\n/m).find((b) => b.includes('một con kiến đậu ở'))
if (!vd) throw new Error('không thấy ví dụ kiến')
const [de, giai] = vd.split(/\n\s*\nBài giải:\n/)
const tsv = fs.readFileSync(new URL('HS-cau.tsv', import.meta.url), 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'))
const cua = (id) => tsv.filter((x) => x[1] === id).map((x) => x[0])
const khac = cua('C4.6.3').filter((id) => id !== 'T1120000002959').slice(0, 4)
const thuc = cau.T1120000002959
const the = (d) => `<div class="dang"><b>${d.id} · ${esc(d.ten)}</b><br><span class="mo">${esc(d.mo_ta)}</span><br><span class="mo">Hiện có ${cua(d.id).length} câu đề thi.</span></div>`

const q = [{
  ma: 'KIEN', tieu_de: 'Câu "con kiến bò trên thang đang trượt" đặt ở dạng nào?',
  mo_ta: 'Bài này tìm độ cao LỚN NHẤT của con kiến theo thời gian: lập hàm h(t) rồi tìm max — không phải kiểu "đạo hàm hai vế để tìm tốc độ liên quan". Đề thi có 1 câu đúng kiểu này (<b>T1120000002959</b>, đáp 0,3), bảng cũ đang xếp vào C4.6.3.',
  chon: [
    ['Chuyển sang C4.3.2 (đề xuất)', 'Dạng "Quãng đường, khoảng cách ngắn nhất hoặc dài nhất" (lập hàm theo vị trí/thời gian/góc rồi max–min): câu đề thi và ví dụ kiến đều vào đây; C4.6.3 chỉ còn thang trượt/bể nước tìm TỐC ĐỘ. Em sửa tên C4.3.2 cho rộng hơn: "Max–min của đại lượng hình học theo vị trí, thời gian, góc".', true],
    ['Giữ ở C4.6.3', 'Đổi mô tả C4.6.3 thành "hai đại lượng liên hệ qua hình học/chuyển động: tìm tốc độ liên quan hoặc max–min theo thời gian". Dạng có thêm 1 kiểu, đo lẫn hai kỹ năng.', false],
    ['Bỏ ví dụ kiến', 'Đề thi chỉ có đúng 1 câu kiểu này. Bỏ ví dụ khỏi bản đồ; câu đề thật vào dạng gần nhất hoặc "chưa phân dạng".', false],
  ],
}]
const css = `:root{--nen:#fbfaf7;--the:#fff;--vien:#e3dfd4;--chu:#25221b;--mo:#6c6657;--tc:#2f5d8c;--moi:#b0582a;--nen-mota:#f3efe4;color-scheme:light}
@media(prefers-color-scheme:dark){:root{--nen:#1a1915;--the:#23221d;--vien:#3a382f;--chu:#ece8dc;--mo:#a8a290;--tc:#7fb0e0;--moi:#e8956a;--nen-mota:#2b2a23;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.6 system-ui,'Segoe UI',sans-serif}main{max-width:860px;margin:0 auto;padding:20px}
h1{font-size:24px}h2{font-size:18px;margin:26px 0 6px;border-bottom:2px solid var(--vien);padding-bottom:4px}.mo{color:var(--mo)}.hop{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:6px 16px;margin:10px 0}
.dang{background:var(--nen-mota);border-radius:10px;padding:8px 12px;margin:8px 0}p{margin:6px 0}math{font-size:1.05em}.nhan{font-size:12px;color:var(--moi);font-weight:600}
${cssQuyet}`
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Câu kiến bò — chọn dạng</title><style>${css}</style></head><body><main>
<h1>Câu "con kiến bò trên thang đang trượt" — đặt ở dạng nào?</h1>
<h2>1. Câu đề thi thật (duy nhất 1 câu)</h2>
<div class="hop"><div class="nhan">${thuc.id} · ${thuc.loai_cau} · đáp án ${esc(thuc.dap_an)}</div>${md(thuc.noi_dung)}</div>
<h2>2. Ví dụ em đã viết cho bản đồ (cùng kiểu)</h2>
<div class="hop"><div class="nhan">ĐỀ</div>${md(de)}<div class="nhan">BÀI GIẢI</div>${md(giai.replace(/\n##VD[\s\S]*$/, ''))}</div>
<h2>3. Hai dạng có thể đặt vào</h2>
${the(dang['C4.6.3'])}${the(dang['C4.3.2'])}
<p class="mo">Các câu đề thi khác đang ở C4.6.3 (để chị thấy dạng này thường hỏi gì):</p>
<div class="hop">${khac.map((id) => `<div class="nhan">${id}</div>` + md(cau[id].noi_dung.slice(0, 380) + (cau[id].noi_dung.length > 380 ? '…' : ''))).join('')}</div>
<h2>4. Chị chọn</h2>
${htmlQuyet(q, 'kien-bo-0311')}
</main></body></html>`
fs.writeFileSync(ra, html)
console.log('đã ghi', ra, Math.round(html.length / 1024) + 'KB', '· C4.6.3:', cua('C4.6.3').length, 'câu · C4.3.2:', cua('C4.3.2').length, 'câu')

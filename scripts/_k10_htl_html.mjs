// Trang duyệt: chuyên đề Hệ thức lượng K10 — kết quả duyệt lại 19/10.  node scripts/_k10_htl_html.mjs
import fs from 'node:fs'
import { GAN, DEXUAT, KHONGKHOP } from '../kho-rules/dai/lo/k10-htl/quyet-dinh.mjs'

const D = 'kho-rules/dai/lo/k10-htl/'
const cau = new Map(JSON.parse(fs.readFileSync(D + 'cau.json', 'utf8')).map((q) => [q.ma_cau, q]))
const dang = Object.fromEntries(JSON.parse(fs.readFileSync(D + 'dang.json', 'utf8')).map((d) => [d.dang_id, d]))
const gop = new Map(JSON.parse(fs.readFileSync(D + 'gop.json', 'utf8')).map((r) => [r.ma_cau, r]))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const md = (s) => esc(s).replace(/\n{2,}/g, '<br>').replace(/\n/g, '<br>')
const tenD = (id) => (dang[id] ? `${id.replace('NDB', '')} · ${dang[id].dang}` : id)

function the(q, { dich, ghiChu, cu }) {
  const g = gop.get(q.ma_cau)
  const lc = q.lua_chon ? `<ol type="A" class="lc">${q.lua_chon.map((x) => `<li>${md(x)}</li>`).join('')}</ol>` : ''
  const hinh = q.anh_de ? `<img src="${q.anh_de}" alt="hình đề" loading="lazy">` : ''
  const hg = q.anh_dap_an ? `<img src="${q.anh_dap_an}" alt="hình lời giải" loading="lazy">` : ''
  const nhan = g ? `<span class="v">trạm 1: ${g.a?.dang_id?.replace('NDB', '') ?? '—'} (${g.a?.chac ?? ''}) · trạm 2: ${g.b?.dang_id?.replace('NDB', '') ?? '—'} (${g.b?.chac ?? ''})</span>` : ''
  return `<article class="cau"><header><b>${q.ma_cau}</b> <span class="loai">${q.loai_cau}</span>${q.da_duyet ? '<span class="dd">đã duyệt lời giải</span>' : ''}</header>
<p class="de">${md(q.noi_dung)}</p>${hinh}${lc}
<p class="dap"><b>Đáp án:</b> ${esc(q.dap_an ?? '—')}</p>
<details><summary>Lời giải</summary><div class="lg">${md(q.loi_giai ?? '(chưa có)')}${hg}</div></details>
<p class="qd"><b>→ ${esc(dich)}</b>${cu ? ` <span class="cu">(đề xuất cũ: ${esc(cu)})</span>` : ''}<br><span class="gc">${esc(ghiChu)}</span><br>${nhan}</p></article>`
}

const gan = {}
for (const [m, d, gc] of GAN) (gan[d] ||= []).push([m, gc])
const parts = []
parts.push(`<section id="gan"><h2>① Đã gán (chắc) — ${GAN.length} câu</h2><p class="dan">Hai trạm gán mù đồng ý, Claude đối chiếu lại đề + lời giải từng câu. Ghi <code>dai_bdm_gan_cau</code> với nguồn <b>ai</b> ⇒ vào mẫu kiểm 10% của học thuật.</p>`)
for (const d of Object.keys(gan).sort()) {
  parts.push(`<h3>${esc(tenD(d))} <span class="n">${gan[d].length} câu</span></h3><p class="mt">${esc(dang[d]?.mo_ta ?? '')}</p>`)
  for (const [m, gc] of gan[d]) { const q = cau.get(m); parts.push(the(q, { dich: tenD(d), ghiChu: gc, cu: gop.get(m)?.dx ? tenD(gop.get(m).dx) : '' })) }
}
parts.push('</section>')
parts.push(`<section id="vua"><h2>② Vẫn chưa chắc — đã cập nhật đề xuất mới — ${DEXUAT.length} câu</h2><p class="dan">Học thuật chốt ở màn Duyệt. Lý do đã ghi vào đề xuất (tiền tố <code>[duyệt lại 19/10]</code>).</p>`)
for (const [m, d, ly] of DEXUAT) parts.push(the(cau.get(m), { dich: tenD(d), ghiChu: ly, cu: gop.get(m)?.dx ? tenD(gop.get(m).dx) : '' }))
parts.push('</section>')
parts.push(`<section id="kk"><h2>③ Không khớp dạng nào — ${Object.keys(KHONGKHOP).length} câu</h2><p class="dan">Bài đo đạc thực tế chỉ dùng <b>tan</b> trong tam giác vuông (hoặc toạ độ). Hiện nằm ở đề xuất cũ "771" nhưng không dùng định lí sin. Mình <b>chưa chuyển</b> — chờ Thùy quyết: đưa sang "thiếu dạng" hay thêm một dạng mới cho nhóm bài này.</p>`)
for (const [m, ly] of Object.entries(KHONGKHOP)) parts.push(the(cau.get(m), { dich: 'Không dạng nào của chuyên đề', ghiChu: ly, cu: gop.get(m)?.dx ? tenD(gop.get(m).dx) : '' }))
parts.push('</section>')

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>K10 Hệ thức lượng — duyệt lại 19/10</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--tc:#2D9CDB;--xanh:#047857;--cam:#d97706}
@media (prefers-color-scheme:dark){:root{--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155}}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
main{max-width:900px;margin:0 auto;padding:20px 16px 60px}h1{font-size:22px}h2{font-size:19px;margin:36px 0 6px;border-bottom:2px solid var(--vien);padding-bottom:4px}h3{font-size:16px;margin:24px 0 2px}.n{color:var(--mo);font-weight:400;font-size:13px}
.dan,.mt{color:var(--mo);max-width:72ch;margin:4px 0 8px}.cau{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 14px;margin:10px 0}
.cau header{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:13px;color:var(--mo)}.cau header b{color:var(--chu);font-family:ui-monospace,Consolas,monospace}.loai,.dd{border:1px solid var(--vien);border-radius:6px;padding:0 6px}.dd{color:var(--xanh)}
.de{margin:6px 0}.cau img{max-width:100%;height:auto;display:block;margin:6px 0;background:#fff;border-radius:6px}.lc{margin:4px 0 4px 20px;padding:0}.dap{margin:4px 0}.lg{overflow-x:auto;padding:6px 0}
.qd{background:color-mix(in srgb,var(--tc) 10%,transparent);border-radius:8px;padding:8px 10px;margin:8px 0 0}.gc{color:var(--mo)}.cu,.v{color:var(--mo);font-size:12.5px}
nav a{margin-right:12px}code{background:var(--vien);padding:0 4px;border-radius:4px}table{border-collapse:collapse}td,th{border:1px solid var(--vien);padding:4px 10px;text-align:left}
</style></head><body><main>
<h1>Chuyên đề Hệ thức lượng trong tam giác (K10) — duyệt lại 19/10</h1>
<p class="dan">Theo yêu cầu của Thùy: dạng mới (<b>01034</b> bán kính ngoại tiếp · <b>01035</b> dùng diện tích tìm yếu tố khác) và dạng cũ đã sửa mô tả (<b>00773</b> thực tế diện tích tam giác, đa giác). Phạm vi: câu "chưa chắc dạng" (đề xuất) và "chưa có dạng" (thiếu dạng).</p>
<nav><a href="#gan">① Đã gán</a><a href="#vua">② Chưa chắc</a><a href="#kk">③ Không khớp</a></nav>
${parts.join('\n')}
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>
<script>document.addEventListener('DOMContentLoaded',()=>renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false}))</script>
</main></body></html>`
fs.writeFileSync('kho-rules/dai/k10-htl-duyet-lai.html', html)
console.log('→ kho-rules/dai/k10-htl-duyet-lai.html', Math.round(html.length / 1024), 'KB')

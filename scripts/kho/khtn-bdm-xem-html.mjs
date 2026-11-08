// Trang hậu kiểm đợt điền + phân bản đồ mới KHTN (Thùy 03/11). Chỉ đọc DB.
//   node scripts/kho/khtn-bdm-xem-html.mjs <thư mục bdm-0311> <tệp ra .html>
// Tab 1 Bản đồ: cây khối › chủ đề › nhóm › dạng (mô tả · lý thuyết · ví dụ), dạng tạo mới đánh dấu.
// Tab 2 Mẫu cao: ~10% câu mức cao đã ghi (lấy đều theo dạng) — đề, đáp án, dạng được gán + mô tả dạng.
// Tab 3 Vừa / trống: câu chưa ghi, kèm dạng trạm đề xuất và lý do.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const [GOC, RA] = process.argv.slice(2)
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin read only')
const q = async (s, a) => (await c.query(s, a)).rows
const moi = new Set(fs.readdirSync(path.join(GOC, 'lo')).filter(f => f.endsWith('.tao-id.json'))
  .flatMap(f => Object.keys(JSON.parse(fs.readFileSync(path.join(GOC, 'lo', f), 'utf8')))))
const kq = [path.join(GOC, 'phan/dot1/ket-qua.json'), path.join(GOC, 'phan/ket-qua.json')].filter(f => fs.existsSync(f))
  .flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')))
const kqBy = new Map(); for (const r of kq) kqBy.set(r.ma_cau, r)  // đợt sau đè đợt trước
const cay = await q(`select cd.khoi, cd.thu_tu cd_tt, cd.ten chu_de, o.thu_tu o_tt, ch.ten chuyen_de, n.id nhom_id, n.thu_tu n_tt, n.ten nhom, n.ly_thuyet nhom_lt,
    d.id, d.thu_tu, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du, (select count(*) from khtn_bdm_gan_cau g where g.dang_bai_id=d.id) so_cau
  from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id=n.chu_de_id join khtn_bdm_chuyen_de ch on ch.id=n.chuyen_de_id
  join khtn_bdm_o o on o.chu_de_id=n.chu_de_id and o.chuyen_de_id=n.chuyen_de_id left join khtn_bdm_dang_bai d on d.nhom_id=n.id
  order by cd.khoi, cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`)
const caoMa = [...kqBy.values()].filter(r => r.chac === 'cao')
const theoDang = {}; for (const r of caoMa) (theoDang[r.dang_bai_id] ??= []).push(r.ma_cau)
const mau = Object.values(theoDang).flatMap(ms => ms.filter((_, i) => i % 10 === 0))  // ≈10%, dạng nào cũng có ≥1
const chuaGhi = [...kqBy.values()].filter(r => r.chac !== 'cao' && r.chac !== 'da_co').map(r => r.ma_cau)
const cau = Object.fromEntries((await q(`select ma_cau, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, anh_de from khtn_cau_hoi where ma_cau = any($1)`, [[...mau, ...chuaGhi]])).map(r => [r.ma_cau, r]))
const dangInfo = Object.fromEntries(cay.filter(r => r.id).map(r => [r.id, r]))
await c.query('rollback'); await c.end()

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const txt = s => `<div class="t">${esc(s)}</div>`
const cauHtml = (m, r) => { const x = cau[m]; if (!x) return ''
  const lc = Array.isArray(x.lua_chon) ? x.lua_chon.map((o, i) => `<div>${'ABCD'[i]}. ${esc(o)}</div>`).join('') : ''
  return `<div class="cau"><div class="ma">${m} · ${x.loai_cau}${x.anh_de ? ` · <a href="${esc(x.anh_de)}" target="_blank">ảnh đề</a>` : ''}</div>${txt(x.noi_dung)}${lc}
    <div class="da">Đáp án: ${esc(x.dap_an)}</div><details><summary>Lời giải</summary>${txt(x.loi_giai)}</details>
    ${r ? `<div class="gan ${r.chac ?? 'trong'}"><b>${r.chac === 'cao' ? 'ĐÃ GHI' : r.chac === 'vua' ? 'VỪA (chưa ghi)' : 'TRỐNG'}</b> → ${esc(r.ten_dang ?? '—')} ${r.dang_bai_id ?? ''}<br><i>${esc(r.ly_do)}</i></div>` : ''}</div>` }

let bd = '', khoiCu, cdCu, nhCu
for (const r of cay) {
  if (r.khoi !== khoiCu) { bd += `<h2 id="k${r.khoi}">KHTN ${r.khoi}</h2>`; khoiCu = r.khoi; cdCu = null }
  if (r.chu_de !== cdCu) { bd += `<h3>${r.cd_tt}. ${esc(r.chu_de)}</h3>`; cdCu = r.chu_de; nhCu = null }
  if (r.nhom_id !== nhCu) { bd += `<h4>${esc(r.nhom)} <small>${r.nhom_id}</small></h4>${r.nhom_lt ? `<details><summary>Lý thuyết nhóm</summary>${txt(r.nhom_lt)}</details>` : '<div class="thieu">Nhóm chưa có lý thuyết</div>'}`; nhCu = r.nhom_id
    if (!r.id) bd += '<div class="thieu">Nhóm chưa có dạng bài (không có câu nào trong kho)</div>' }
  if (!r.id) continue
  bd += `<details class="dang${moi.has(r.id) ? ' moi' : ''}"><summary>${moi.has(r.id) ? '<span class="tag">MỚI</span> ' : ''}${r.thu_tu}. ${esc(r.ten)} <small>${r.id} · ${r.so_cau} câu</small></summary>
    <div class="o"><b>Mô tả</b>${txt(r.mo_ta)}</div><div class="o"><b>Lý thuyết</b>${txt(r.ly_thuyet)}</div><div class="o"><b>Ví dụ</b>${r.vi_du ? txt(r.vi_du) : '<div class="thieu">trống</div>'}</div></details>`
}
const mauHtml = mau.map(m => cauHtml(m, kqBy.get(m)) + (() => { const d = dangInfo[kqBy.get(m).dang_bai_id]; return d ? `<details class="md"><summary>Mô tả dạng</summary>${txt(d.mo_ta)}</details>` : '' })()).join('')
const chuaHtml = chuaGhi.map(m => cauHtml(m, kqBy.get(m))).join('')
const tk = { dang: cay.filter(r => r.id).length, moi: moi.size, cao: caoMa.length, vua: [...kqBy.values()].filter(r => r.chac === 'vua').length, trong: [...kqBy.values()].filter(r => !r.chac).length }

fs.writeFileSync(RA, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bản đồ KHTN 03/11</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>body{font:15px/1.55 system-ui,sans-serif;margin:0 auto;max-width:1000px;padding:0 16px 60px;background:#fafafa;color:#222}
nav{position:sticky;top:0;background:#fafafa;padding:10px 0;border-bottom:1px solid #ddd;z-index:2}nav button{margin-right:6px;padding:6px 12px;border:1px solid #aaa;border-radius:6px;background:#fff;cursor:pointer}
nav button.on{background:#2D9CDB;color:#fff;border-color:#2D9CDB}.tab{display:none}.tab.on{display:block}
.t{white-space:pre-wrap}h2{margin-top:28px}h4{margin:18px 0 4px}small{color:#888;font-weight:400}
details.dang{background:#fff;border:1px solid #e3e3e3;border-radius:8px;margin:6px 0;padding:6px 10px}details.moi{border-color:#7c5cbf}
.tag{background:#7c5cbf;color:#fff;font-size:11px;padding:1px 6px;border-radius:8px}.o{margin:8px 0;padding:8px;background:#f6f8fb;border-radius:6px}
.thieu{color:#c0392b;font-size:13px}.cau{background:#fff;border:1px solid #e3e3e3;border-radius:8px;margin:10px 0;padding:10px}.ma{color:#888;font-size:12px}
.da{margin-top:6px;font-weight:600}.gan{margin-top:8px;padding:6px 8px;border-radius:6px;background:#eef7ee}.gan.vua{background:#fff6e5}.gan.trong{background:#fdecec}
.md{font-size:13px;margin:-6px 0 14px 10px}</style></head><body>
<h1>Bản đồ KHTN — điền + phân câu (03/11)</h1>
<p>${tk.dang} dạng bài (${tk.moi} dạng mới tạo) · đã ghi ${tk.cao} câu mức cao · ${tk.vua} câu mức vừa và ${tk.trong} câu trống chưa ghi.</p>
<nav><button class="on" data-t="bd">Bản đồ</button><button data-t="mau">Mẫu câu đã ghi (${mau.length})</button><button data-t="chua">Vừa / trống (${chuaGhi.length})</button>
 · <a href="#k7">K7</a> <a href="#k8">K8</a> <a href="#k9">K9</a></nav>
<div id="bd" class="tab on">${bd}</div><div id="mau" class="tab">${mauHtml}</div><div id="chua" class="tab">${chuaHtml}</div>
<script>document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button,.tab').forEach(e=>e.classList.remove('on'));b.classList.add('on');document.getElementById(b.dataset.t).classList.add('on')})</script>
</body></html>`)
console.log('ghi', RA, tk, 'mẫu', mau.length, 'KB', Math.round(fs.statSync(RA).size / 1024))

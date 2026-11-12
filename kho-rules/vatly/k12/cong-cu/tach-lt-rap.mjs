// Tách lý thuyết NHÓM → chung (nhóm) + riêng (dạng). Thùy 12/11. Bước 2: ráp NGUYÊN VĂN theo bảng xếp của trạm.
//   Vào: ../tach-lt/khoi.json (xuất từ DB) + ../tach-lt/xep-*.json (bảng xếp K → "N" | [LDB…])
//   Ra : ../tach-lt/rap.json + ../de-xuat-tach-ly-thuyet.html (đề xuất)
//   --ghi: 1 transaction — nhóm: ghi lại ly_thuyet = các khối "N" CHỈ KHI ô nhóm trên DB còn đúng như lúc xuất (người chưa sửa);
//          dạng: ghi ly_thuyet CHỈ KHI ô dạng đang trống. Đối chiếu lại sau khi ghi, lệch ⇒ ROLLBACK.
// Chạy (gốc repo): node kho-rules/vatly/k12/cong-cu/tach-lt-rap.mjs [--ghi]
import fs from 'node:fs'
import path from 'node:path'
const GHI = process.argv.includes('--ghi')
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const T = path.join(DIR, '..', 'tach-lt')
const nhom = JSON.parse(fs.readFileSync(path.join(T, 'khoi.json'), 'utf8'))
const xep = {}, tron = [], dangTrong = []
for (const f of fs.readdirSync(T).filter(f => /^xep-.*\.json$/.test(f))) {
  const j = JSON.parse(fs.readFileSync(path.join(T, f), 'utf8')); Object.assign(xep, j.xep); tron.push(...(j.tron || [])); dangTrong.push(...(j.dang_trong || []))
}
const loi = [], outN = {}, outD = {}, nguonD = {}
for (const n of nhom) {
  if (!n.khoi.length) continue
  const x = xep[n.id]; if (!x) { loi.push(`${n.id}: chưa có bảng xếp`); continue }
  const maDang = new Set(n.dang.map(d => d.id)); const N = []
  n.khoi.forEach((k, i) => {
    const v = x['K' + i]; if (v === undefined) return loi.push(`${n.id} K${i}: chưa xếp`)
    if (v === 'N') N.push(k)
    else if (Array.isArray(v) && v.length && v.every(id => maDang.has(id))) v.forEach(id => { (outD[id] ||= []).push(k); (nguonD[id] ||= []).push('K' + i) })
    else loi.push(`${n.id} K${i}: giá trị lạ ${JSON.stringify(v)}`)
  })
  Object.keys(x).forEach(k => { if (!/^K\d+$/.test(k) || +k.slice(1) >= n.khoi.length) loi.push(`${n.id}: khoá thừa ${k}`) })
  outN[n.id] = N.join('\n\n')
}
// không mất chữ: mọi khối có mặt ở nhóm hoặc ít nhất 1 dạng
for (const n of nhom) n.khoi.forEach(k => { if (!outN[n.id]?.includes(k) && !Object.values(outD).some(a => a.includes(k))) loi.push(`${n.id}: mất khối «${k.slice(0, 40)}»`) })
const rap = { nhom: outN, dang: Object.fromEntries(Object.entries(outD).map(([id, a]) => [id, a.join('\n\n')])), tron, dang_trong: dangTrong }
fs.writeFileSync(path.join(T, 'rap.json'), JSON.stringify(rap, null, 1))
const tongDang = nhom.reduce((a, n) => a + n.dang.length, 0)
console.log(`khối: ${nhom.reduce((a, n) => a + n.khoi.length, 0)} · ở nhóm: ${Object.values(outN).reduce((a, s) => a + (s ? s.split(/\n\n(?=##)/).length : 0), 0)} · dạng có LT riêng: ${Object.keys(outD).length}/${tongDang} · nhóm còn LT chung: ${Object.values(outN).filter(Boolean).length} · lỗi: ${loi.length}`)
if (loi.length) { console.error(loi.join('\n')); process.exit(1) }

// ── HTML đề xuất
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const khoi = s => esc(s).replace(/^##(ĐN|ĐL|TC|CY|PP|NX)([^\n]*)/gm, (m, k, t) => `<span class="the the-${k}">${k}</span><b>${t}</b>`)
let body = '', cdHt = ''
for (const n of nhom) {
  if (n.cd !== cdHt) { cdHt = n.cd; body += `<h2 class="cd">${esc(n.cd)}</h2>` }
  body += `<section><h3><span class="ma">${n.id}</span>${esc(n.duong.split(' › ').slice(1).join(' › '))}</h3>
  <div class="o chung"><div class="nhan">Lý thuyết chung (nhóm)</div>${outN[n.id] ? `<div class="pre">${khoi(outN[n.id])}</div>` : `<p class="trong">— không còn khối chung —</p>`}</div>`
  for (const d of n.dang) body += `<div class="o rieng"><div class="nhan">Dạng <span class="ma">${d.id}</span>${esc(d.ten)}</div>${outD[d.id] ? `<div class="pre">${khoi(outD[d.id].join('\n\n'))}</div>` : `<p class="trong">— trống (sách không có kiến thức riêng) —</p>`}</div>`
  body += `</section>`
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tách lý thuyết Vật lý 12</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#6b6b70;--line:#e3e3e0;--chung:#2f5bd3;--rieng:#1f7a4d;--cam:#b35c00}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--card:#1d1d20;--ink:#ececee;--mute:#9a9aa2;--line:#2f2f34;--chung:#8fb0ff;--rieng:#6fd4a0;--cam:#ffb466}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 system-ui,"Segoe UI",sans-serif}main{max-width:980px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:23px;margin:0 0 4px}.sub{color:var(--mute)}h2.cd{margin:28px 0 4px;font-size:20px}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:12px 0}h3{font-size:16px;margin:0 0 8px}
.ma{font:12px Consolas,monospace;color:var(--mute);margin-right:6px}.o{border-left:3px solid var(--line);padding:2px 0 2px 12px;margin:10px 0}
.o.chung{border-color:var(--chung)}.o.rieng{border-color:var(--rieng)}.nhan{font-size:12px;font-weight:700;color:var(--mute)}
.o.chung .nhan{color:var(--chung)}.o.rieng .nhan{color:var(--rieng)}.pre{white-space:pre-wrap;margin:4px 0}.trong{color:var(--cam);font-style:italic;margin:4px 0}
.the{display:inline-block;font:700 11px Consolas,monospace;padding:0 5px;border-radius:4px;margin-right:6px;background:#e8eefc;color:#2f5bd3}.the-CY{background:#fff0e0;color:#b35c00}.the-PP{background:#e3f5ea;color:#1f7a4d}
.kq{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}ul{margin:6px 0}
</style></head><body><main>
<h1>Tách lý thuyết — nhóm (chung) · dạng (riêng) — Vật lý 12</h1>
<p class="sub">Thùy 12/11: "nhóm là lý thuyết chung, từng dạng là lý thuyết riêng". Chia lại NGUYÊN VĂN các khối đã ghi ở nhóm (không thêm, không sửa chữ). Khối dùng cho vài dạng được chép vào từng dạng. ĐỀ XUẤT — chưa ghi DB.</p>
<div class="kq">Dạng có lý thuyết riêng: <b>${Object.keys(outD).length}/${tongDang}</b> · nhóm còn lý thuyết chung: <b>${Object.values(outN).filter(Boolean).length}</b></div>
${tron.length ? `<section><h3>Khối trộn chung–riêng (xếp theo phần chính)</h3><ul>${tron.map(t => `<li>${t.nhom} ${t.khoi}: ${esc(t.ghi || '')}</li>`).join('')}</ul></section>` : ''}
${dangTrong.length ? `<section><h3>Dạng không có lý thuyết riêng</h3><ul>${dangTrong.map(t => `<li>${t.dang}: ${esc(t.ly_do || '')}</li>`).join('')}</ul></section>` : ''}
${body}</main></body></html>`
fs.writeFileSync(path.join(DIR, '..', 'de-xuat-tach-ly-thuyet.html'), html)
if (!GHI) { console.log('(đề xuất — chưa ghi; thêm --ghi để ghi)'); process.exit(0) }

// ── GHI
const { default: pg } = await import('pg')
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const dem = { nhom: 0, dang: 0, bo_qua: [] }
  for (const n of nhom) {
    if (!n.khoi.length) continue
    const [r] = await q('select ly_thuyet from vatly_bdm_nhom where id = $1', [n.id])
    if (r.ly_thuyet.trim() !== n.khoi.join('\n\n')) { dem.bo_qua.push(n.id + ' (nhóm đã bị sửa sau lúc xuất)'); continue }
    await q('update vatly_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1', [n.id, outN[n.id]]); dem.nhom++
    for (const d of n.dang) {
      if (!outD[d.id]) continue
      const [rd] = await q('select ly_thuyet from vatly_bdm_dang_bai where id = $1', [d.id])
      if (rd.ly_thuyet.trim()) { dem.bo_qua.push(d.id + ' (dạng đã có LT)'); continue }
      await q('update vatly_bdm_dang_bai set ly_thuyet = $2, updated_at = now() where id = $1', [d.id, rap.dang[d.id]]); dem.dang++
    }
  }
  let lech = 0
  for (const n of nhom) { if (!n.khoi.length || dem.bo_qua.some(b => b.startsWith(n.id))) continue
    if ((await q('select ly_thuyet from vatly_bdm_nhom where id=$1', [n.id]))[0].ly_thuyet !== outN[n.id]) lech++
    for (const d of n.dang) if (outD[d.id] && !dem.bo_qua.some(b => b.startsWith(d.id)) && (await q('select ly_thuyet from vatly_bdm_dang_bai where id=$1', [d.id]))[0].ly_thuyet !== rap.dang[d.id]) lech++ }
  console.log('đã ghi:', dem)
  if (lech) throw new Error(`lệch ${lech} ô — ROLLBACK`)
  await c.query('commit'); console.log('✔ ĐÃ GHI')
} catch (e) { await c.query('rollback'); console.error('✖', e.message); process.exitCode = 1 }
await c.end()

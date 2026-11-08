// html-truoc-sau-bt.mjs — trang duyệt: ảnh CŨ (đang trong DB) cạnh hình MỚI máy vẽ + đề + số liệu kiểm (diện tích tính từ vùng tô so với đáp số lời giải).
//   node scripts/kho/html-truoc-sau-bt.mjs <spec.mjs> <EXPORT> <ra.html>
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import pg from 'pg'
import { bien } from './cau-hinh.mjs'
import { veHinh } from './hinh-luong-giac.mjs'
import { bienDich } from './hinh-giai-tich.mjs'
const [tep, ten, ra] = process.argv.slice(2)
const ds = (await import(pathToFileURL(resolve(tep)).href))[ten]
const c = new pg.Client({ connectionString: bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } }); await c.connect()
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
const tinh = (mt, V = false) => { const fs = (mt.ham ?? []).map((h) => bienDich(h.f)); const g = (k) => typeof k === 'number' ? () => k : fs[+String(k).slice(1)]; let S = 0
  for (const t of mt.to ?? []) { const a = g(t.tren ?? 'h0'), b = g(t.duoi ?? 0), N = 20000, h = (t.den - t.tu) / N; for (let i = 0; i < N; i++) { const x = t.tu + (i + .5) * h; S += (V ? Math.PI * Math.abs(a(x) ** 2 - b(x) ** 2) : Math.abs(a(x) - b(x))) * h } } return S }
const o = []; let loi = 0
for (const d of ds) {
  const { rows } = await c.query('select ma_cau, noi_dung, dap_an, anh_de, loai_cau from dai_cau_hoi where ma_cau = any($1)', [d.cau])
  let kiem = ''
  const { svg } = veHinh(d.mt)
  if (d.S !== undefined || d.V !== undefined) { const dung = d.V ?? d.S, v = tinh(d.mt, d.V !== undefined), ok = Math.abs(v - dung) < (d.tol ?? 1e-3); if (!ok) loi++; kiem = `<b style="color:${ok ? '#047857' : '#b91c1c'}">${ok ? '✓' : '✗'} ${d.V !== undefined ? 'thể tích khối quay π∫(…) (máy tính)' : 'diện tích vùng tô (máy tính)'} = ${v.toFixed(4)} · đáp số = ${dung.toFixed(4)}</b>` }
  for (const r of rows) o.push(`<section><h3>${r.ma_cau} · ${r.loai_cau} · ĐA ${esc(r.dap_an)} · <span style="color:#555">${esc(d.ten)}</span></h3><p>${esc(r.noi_dung)}</p><p>${kiem}</p><div class="r"><figure><figcaption>HÌNH CŨ</figcaption><img src="${r.anh_de}"></figure><figure><figcaption>HÌNH MỚI (máy vẽ)</figcaption><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></figure></div></section>`)
}
await c.end()
writeFileSync(ra, `<!doctype html><meta charset=utf-8><title>NDB00777 — hình bài tập trước/sau</title><style>body{font:15px sans-serif;max-width:1100px;margin:20px auto;padding:0 12px}section{border:1px solid #ddd;border-radius:8px;padding:8px 14px;margin:14px 0}.r{display:flex;gap:16px;align-items:flex-start}figure{margin:0;flex:1}figcaption{font-weight:700;background:#eef;padding:2px 6px}img{max-width:100%;max-height:340px;border:1px solid #eee}h3{margin:6px 0}</style><h2>Dạng NDB00777 — vẽ lại hình bài tập: ${o.length} câu (CHƯA ghi DB)</h2><p>Chỉ vẽ lại câu có hình cũ yếu và hàm số xác định hoàn toàn từ đề/lời giải. Duyệt: nếu hình mới đúng và đẹp hơn thì cho ghi vào <code>anh_de</code>.</p>${o.join('')}`)
console.log('→', ra, o.length, 'câu', loi ? `· ${loi} hình LỆCH số liệu` : '· số liệu khớp hết')

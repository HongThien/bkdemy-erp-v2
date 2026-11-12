// Ráp hình minh hoạ vào lý thuyết Vật lý 12 — Thùy 12/11 ("theo đề xuất": Tập 1 cắt sách · Tập 2 vẽ lại · ảnh thật Wikimedia).
//   Vào: ../hinh-lt/viec.json + ../hinh-lt/lam-*.json (manifest trạm) + ../hinh-lt/anh/*
//   Ra : ../de-xuat-hinh-ly-thuyet.html (xem trước, ảnh nhúng đường dẫn tương đối)
//   --ghi: upload ảnh lên bucket kho-anh (vatly_lt/<tháng>/<mã>-<uuid>.<đuôi>) rồi chèn đoạn `![chú thích](url)` NGAY SAU khối lý thuyết
//          ở đúng ô (nhóm / từng dạng) — 1 transaction DB; ô không còn chứa nguyên văn khối (người đã sửa) ⇒ bỏ qua ô đó, báo.
//          Ô đã có ảnh đó rồi (chạy lại) ⇒ bỏ qua. Biên bản URL ghi vào ../hinh-lt/da-ghi.json.
// Chạy (gốc repo): node kho-rules/vatly/k12/cong-cu/hinh-lt-rap.mjs [--ghi]
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
const GHI = process.argv.includes('--ghi')
const K12 = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..')
const H = path.join(K12, 'hinh-lt')
const viec = JSON.parse(fs.readFileSync(path.join(H, 'viec.json'), 'utf8'))
const lam = {}
for (const f of fs.readdirSync(H).filter(f => /^lam-.*\.json$/.test(f))) for (const x of JSON.parse(fs.readFileSync(path.join(H, f), 'utf8'))) (lam[x.ma] ||= []).push({ ...x, tram: f.slice(4, -5) })
const loi = []
for (const [ma, xs] of Object.entries(lam)) for (const x of xs) if (x.file && !fs.existsSync(path.join(H, 'anh', x.file))) loi.push(`${ma}: thiếu file ${x.file}`)
const xong = viec.filter(v => (lam[v.ma] || []).some(x => x.file)), bo = viec.filter(v => (lam[v.ma] || []).some(x => x.bo) && !(lam[v.ma] || []).some(x => x.file)), chua = viec.filter(v => !lam[v.ma])
const soAnh = Object.values(lam).flat().filter(x => x.file).length
console.log(`khối: ${viec.length} · có hình: ${xong.length} (${soAnh} ảnh) · bỏ: ${bo.length} · chưa có manifest: ${chua.length} · lỗi: ${loi.length}`)
if (loi.length) { console.error(loi.join('\n')); process.exit(1) }

// ── HTML xem trước
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const khoi = s => esc(s).replace(/^##(ĐN|ĐL|TC|CY|PP|NX)([^\n]*)/gm, (m, k, t) => `<span class="the">${k}</span><b>${t}</b>`)
const TEN_CACH = { 1: 'cắt sách', 2: 'ảnh mạng', 3: 'vẽ lại' }
const PHAN = { p1: 'Vật lí nhiệt + Khí lí tưởng', p2: 'Từ trường', p3: 'Vật lí hạt nhân' }
let body = '', ph = ''
for (const v of viec) {
  if (v.phan !== ph) { ph = v.phan; body += `<h2>${PHAN[ph]}</h2>` }
  const xs = lam[v.ma] || []
  body += `<section><div class="dau"><span class="ma">${v.ma} · ${v.nhom} ${v.k} → ${v.noi.join(', ')}</span><span class="cach c${v.cach}">${TEN_CACH[v.cach]}</span></div>
  <h3>${esc(v.tieu_de)}</h3><div class="hai"><div class="pre">${khoi(v.noi_dung)}</div><div class="anh">${xs.length ? xs.map(x => x.file
    ? `<figure><img src="hinh-lt/anh/${esc(x.file)}" loading="lazy"><figcaption>${esc(x.chu_thich)}<br><small>${esc(x.nguon)}${x.ghi ? ' · ⚠ ' + esc(x.ghi) : ''}</small></figcaption></figure>`
    : `<p class="bo">Bỏ: ${esc(x.bo)}</p>`).join('') : '<p class="bo">— chưa làm —</p>'}</div></div></section>`
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hình lý thuyết Vật lý 12</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#6b6b70;--line:#e3e3e0;--c1:#2f5bd3;--c2:#b35c00;--c3:#1f7a4d}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--card:#1d1d20;--ink:#ececee;--mute:#9a9aa2;--line:#2f2f34;--c1:#8fb0ff;--c2:#ffb466;--c3:#6fd4a0}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:23px;margin:0 0 4px}.sub{color:var(--mute)}h2{margin:28px 0 6px}section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:12px 0}
h3{font-size:16px;margin:4px 0 8px}.dau{display:flex;justify-content:space-between;gap:8px}.ma{font:12px Consolas,monospace;color:var(--mute)}
.cach{font-size:12px;font-weight:700;padding:1px 8px;border-radius:999px;border:1px solid}.c1{color:var(--c1)}.c2{color:var(--c2)}.c3{color:var(--c3)}
.hai{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media (max-width:760px){.hai{grid-template-columns:1fr}}
.pre{white-space:pre-wrap;font-size:14px}.the{display:inline-block;font:700 11px Consolas,monospace;padding:0 5px;border-radius:4px;margin-right:6px;background:#e8eefc;color:#2f5bd3}
figure{margin:0 0 12px}img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:8px;background:#fff}figcaption{font-size:13px;color:var(--mute)}.bo{color:var(--c2);font-style:italic}
.kq{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}
</style></head><body><main>
<h1>Hình minh hoạ lý thuyết — Vật lý 12</h1>
<p class="sub">Thùy 12/11 chọn "theo đề xuất": Tập 1 cắt hình sách (hình nét) · Từ trường + Hạt nhân vẽ lại bằng code · ảnh thật lấy Wikimedia Commons (giấy phép tự do, ghi nguồn). Hình sẽ chèn NGAY SAU khối lý thuyết tương ứng. ĐỀ XUẤT — chưa ghi DB.</p>
<div class="kq">Khối cần hình: <b>${viec.length}</b> · đã có hình: <b>${xong.length}</b> (${soAnh} ảnh) · bỏ: <b>${bo.length}</b>${chua.length ? ` · chưa làm: <b>${chua.length}</b>` : ''}</div>
${body}</main></body></html>`
fs.writeFileSync(path.join(K12, 'de-xuat-hinh-ly-thuyet.html'), html)
if (!GHI) { console.log('(xem trước — chưa ghi; thêm --ghi để upload + chèn)'); process.exit(0) }

// ── GHI
const { default: pg } = await import('pg')
const { createClient } = await import('@supabase/supabase-js')
process.loadEnvFile('.env')
const envL = {}; for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { if (!l.includes('=') || l.trim().startsWith('#')) continue; const i = l.indexOf('='); envL[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') }
const sb = createClient(envL.VITE_SUPABASE_URL, envL.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
const KIEU = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const bb = path.join(H, 'da-ghi.json'); const daGhi = fs.existsSync(bb) ? JSON.parse(fs.readFileSync(bb, 'utf8')) : {}
const thang = new Date().toISOString().slice(0, 7)
for (const v of xong) for (const x of lam[v.ma].filter(x => x.file)) {
  if (daGhi[x.file]) continue
  const duoi = path.extname(x.file).toLowerCase(); const p = `vatly_lt/${thang}/${x.file.replace(/\.[^.]+$/, '')}-${randomUUID()}${duoi}`
  const { error } = await sb.storage.from('kho-anh').upload(p, fs.readFileSync(path.join(H, 'anh', x.file)), { contentType: KIEU[duoi], upsert: false })
  if (error) { console.error('✖ upload', x.file, error.message); fs.writeFileSync(bb, JSON.stringify(daGhi, null, 1)); process.exit(4) }
  daGhi[x.file] = sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl
}
fs.writeFileSync(bb, JSON.stringify(daGhi, null, 1)); console.log('đã upload/ có sẵn:', Object.keys(daGhi).length, 'ảnh')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const dem = { o: 0, anh: 0, bo_qua: [] }
  for (const v of xong) {
    const anh = lam[v.ma].filter(x => x.file).map(x => `![${(x.chu_thich || '').replace(/[\[\]\n]/g, ' ')}](${daGhi[x.file]})`).join('\n\n')
    for (const noi of v.noi) {
      const [bang, id] = noi === 'nhom' ? ['vatly_bdm_nhom', v.nhom] : ['vatly_bdm_dang_bai', noi]
      const [r] = await q(`select ly_thuyet from ${bang} where id = $1`, [id])
      if (!r || !r.ly_thuyet.includes(v.noi_dung)) { dem.bo_qua.push(`${v.ma}→${id} (khối không còn nguyên văn)`); continue }
      if (lam[v.ma].some(x => x.file && r.ly_thuyet.includes(daGhi[x.file]))) { dem.bo_qua.push(`${v.ma}→${id} (đã có ảnh)`); continue }
      const moi = r.ly_thuyet.replace(v.noi_dung, v.noi_dung + '\n\n' + anh)
      await q(`update ${bang} set ly_thuyet = $2, updated_at = now() where id = $1`, [id, moi]); dem.o++; dem.anh += lam[v.ma].filter(x => x.file).length
    }
  }
  console.log('đã chèn:', dem)
  await c.query('commit'); console.log('✔ ĐÃ GHI')
} catch (e) { await c.query('rollback'); console.error('✖', e.message); process.exitCode = 1 }
await c.end()

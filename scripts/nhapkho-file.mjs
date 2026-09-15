// NHẬP KHO TỪ FILE (spec: CEO 08/09 "đưa file để m đọc, phân loại, giải, t duyệt rồi m đẩy vào kho").
//   node scripts/nhapkho-file.mjs --in scripts/mcq-lo/tinh-docx-lop7.json --xem out.html     → HTML để CEO duyệt (đáp số máy tính)
//   node scripts/nhapkho-file.mjs --in ... --ghi [--nguoi <nhan_su uuid>]                       → INSERT dai_cau_hoi (da_duyet=false)
// JSON: { cau: [{ stt, dang, loai, nd, da? (đáp số tay khi máy không tính được: căn, GTTĐ, mũ chứa x), trung? (số câu trùng → bỏ) }] }
// Đáp số: máy tính bằng mcq-auto.tinh() (Rat, không đoán); máy không tính được thì lấy `da` tay; cả hai có mà LỆCH → báo, không ghi.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { tinh, texOfValue } from './mcq-auto.mjs'
import { parseHuuTi } from './lib/huuti.mjs'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const inp = JSON.parse(readFileSync(opt('--in'), 'utf8'))
const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 }); await c.connect()
const dangs = Object.fromEntries((await c.query(`select ma_dang, ten_dang, ten_chuyen_de from dai_ban_do`)).rows.map((r) => [r.ma_dang, r]))

const rows = []
for (const q of inp.cau) {
  if (q.trung) { rows.push({ ...q, bo: `trùng câu ${q.trung}` }); continue }
  const d = dangs[q.dang]; if (!d) { rows.push({ ...q, bo: `dạng ${q.dang} không có trong kho` }); continue }
  const may = tinh(q.nd)
  const tay = q.da ? parseHuuTi(q.da) : null
  let dap_an = null, nguon = '', loi = null
  if (may.ok && tay?.ok && may.canon !== tay.canon) loi = `máy ${may.canon} ≠ tay ${tay.canon}`
  else if (may.ok) { dap_an = texOfValue(may.value); nguon = tay?.ok ? 'máy = tay' : 'máy' }
  else if (tay?.ok) { dap_an = q.da; nguon = 'tay (máy: ' + may.ly_do + ')' }
  else loi = `không có đáp số (máy: ${may.ly_do})`
  if (!loi && !q.lg) loi = 'thiếu lời giải chi tiết (CEO: vào kho là phải có)'
  if (!loi && q.lg && !q.lg.includes('\\')) loi = 'lời giải mất dấu \\ (LaTeX hỏng)'
  rows.push({ ...q, ten_dang: d.ten_dang, chuyen_de: d.ten_chuyen_de, dap_an, nguon, loi })
}
const ok = rows.filter((r) => !r.bo && !r.loi)
console.log(`${rows.length} câu · nhập được ${ok.length} · bỏ ${rows.filter((r) => r.bo).length} · lỗi ${rows.filter((r) => r.loi).length}`)
for (const r of rows.filter((r) => r.loi)) console.log('  LỖI', r.stt, r.loi)

if (opt('--xem')) {
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Nhập kho từ file — ${rows.length} câu</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>body{font:15px/1.5 system-ui;max-width:960px;margin:24px auto;padding:0 16px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #e5e5e5;padding:8px 6px;vertical-align:top;text-align:left}th{font-size:12px;color:#666}.m{font-size:12px;color:#888}.bo{color:#a33}.lo{background:#fff3f3}.dang{font-size:12px}.dang b{display:block;color:#357}</style></head><body>
<h1>Nhập kho từ file — ${rows.length} câu</h1><p class="m">${esc(inp.nguon)}</p>
<table><tr><th>#</th><th>Mục</th><th>Đề (Claude đọc)</th><th>Dạng đề xuất</th><th>Đáp số</th><th>Lời giải (Claude)</th></tr>
${rows.map((r) => `<tr class="${r.loi ? 'lo' : ''}"><td>${r.stt}</td><td class="m">${esc(r.muc)}</td><td>${r.bo ? `<span class="bo">${esc(r.bo)}</span>` : esc(r.nd)}</td><td class="dang">${r.bo ? '' : `<b>${esc(r.dang)}</b>${esc(r.ten_dang)}<br><span class="m">${esc(r.chuyen_de)}</span>`}</td><td>${r.loi ? `<span class="bo">${esc(r.loi)}</span>` : `${esc(r.dap_an)}<br><span class="m">${esc(r.nguon)}</span>`}</td><td class="lg">${r.lg ? esc(r.lg).split('\n').map((l) => `<div>${l}</div>`).join('') : ''}</td></tr>`).join('\n')}
</table></body></html>`
  writeFileSync(opt('--xem'), html, 'utf8'); console.log('→', opt('--xem'))
}
if (args.includes('--ghi')) {
  let n = 0
  for (const r of ok) {
    await c.query('begin')
    try {
      // Đề = nguồn 'le' (người đưa file); lời giải = AI (Claude Code) → nguon_giai 'ai', giai_method 'claude_code', da_duyet=false
      // để tự hiện ở tab "Lời giải mới từ Claude" (spec-giai-bai-ai.md §4).
      await c.query(`insert into dai_cau_hoi (dang_chinh, loai_cau, noi_dung, dap_an, loi_giai, nguon, nguon_giai, giai_method, ai_model, ai_de_xuat_at, da_duyet)
                     values ($1,$2,$3,$4,$5,'le','ai','claude_code','claude-fable-5-1',now(),false)`, [r.dang, r.loai ?? 'tu_luan', r.nd, r.dap_an, r.lg])
      await c.query('commit'); n++
    } catch (e) { await c.query('rollback'); console.error('✖', r.stt, e.message) }
  }
  console.log(`Đã ghi ${n} câu vào dai_cau_hoi (da_duyet=false, chưa có lời giải → hàng "Chưa có lời giải").`)
}
await c.end()

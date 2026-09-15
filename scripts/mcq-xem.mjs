// Xuất form MCQ (dai_cau_form_tn) ra 1 trang HTML tĩnh để người KIỂM nhanh trước khi có tab duyệt (M2).
//   node scripts/mcq-xem.mjs [--dang T107010401] [--all] --out mcq.html     (mặc định: chỉ form chưa duyệt)
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const dang = opt('--dang'), out = opt('--out', 'mcq.html'), all = args.includes('--all')
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()
const { rows } = await c.query(`
  select f.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an as dap_an_kho, q.loi_giai, f.lua_chon, f.dap_an, f.key_gia_tri, f.da_duyet, f.ai_model
  from dai_cau_form_tn f join dai_cau_hoi q on q.ma_cau = f.ma_cau join dai_ban_do b on b.ma_dang = q.dang_chinh
  where f.xoa_at is null and ($1::text is null or q.dang_chinh = $1) and ($2::boolean or not f.da_duyet)
  order by q.dang_chinh, f.ma_cau`, [dang ?? null, all])
const rules = Object.fromEntries((await c.query('select ma, ten from dai_mcq_rule')).rows.map((r) => [r.ma, r.ten]))
await c.end()
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Đề trong kho có câu mở $ mà không đóng → nối thêm $ để KaTeX render được.
const fixTex = (s) => { const n = (String(s ?? '').match(/\$/g) || []).length; return n % 2 ? s + '$' : s }
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>MCQ form — ${rows.length} câu</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
body{font:15px/1.5 system-ui,Segoe UI,Arial;max-width:900px;margin:24px auto;padding:0 16px;color:#1a1a1a}
h1{font-size:20px}.meta{color:#666;font-size:13px}
.cau{border:1px solid #ddd;border-radius:10px;padding:14px 16px;margin:14px 0}
.cau h3{margin:0 0 6px;font-size:14px;color:#555}.de{font-size:16px;margin:6px 0 10px}
.pa{display:grid;grid-template-columns:28px 1fr;gap:4px 8px;align-items:start;padding:5px 8px;border-radius:6px;margin:3px 0}
.pa.dung{background:#e8f7ec}.pa .chu{font-weight:700}.pa .sai{color:#a33;font-size:13px}.pa .rule{color:#666;font-size:12px}
.lg{margin-top:8px;font-size:13px;color:#444;border-top:1px dashed #ddd;padding-top:6px}
details summary{cursor:pointer;color:#357}
</style></head><body>
<h1>Form trắc nghiệm AI — ${rows.length} câu ${dang ? `dạng ${dang}` : 'mọi dạng'} ${all ? '' : '(chưa duyệt)'}</h1>
<p class="meta">Nguồn: bảng dai_cau_form_tn. Xanh = phương án đúng. Dưới mỗi phương án sai là rule + đường sai (chỉ staff thấy, HS không thấy).</p>
${rows.map((r, i) => `<div class="cau"><h3>${i + 1}. ${r.ma_cau} · ${esc(r.ten_dang)} · đáp số kho: <code>${esc(r.dap_an_kho)}</code> → ${esc(r.key_gia_tri)} · đúng: <b>${r.dap_an}</b>${r.da_duyet ? ' · ✅ đã duyệt' : ''}</h3>
<div class="de">${esc(fixTex(r.noi_dung))}</div>
${r.lua_chon.map((o, j) => `<div class="pa${o.dung ? ' dung' : ''}"><span class="chu">${'ABCD'[j]}.</span><span>${esc(o.text)}${o.dung ? '' : `<div class="sai">${esc(o.duong_sai)}</div><div class="rule">${o.rule} · ${esc(rules[o.rule] ?? '')}</div>`}</span></div>`).join('')}
${r.loi_giai ? `<div class="lg"><details><summary>Lời giải trong kho</summary>${esc(fixTex(r.loi_giai))}</details></div>` : ''}
</div>`).join('\n')}
</body></html>`
writeFileSync(out, html, 'utf8')
console.log(`→ ${out}  (${rows.length} câu)`)

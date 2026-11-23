// Gán MODEL thật cho các lượt phiên Claude cũ trong sổ ai_luot_dung (Thùy 23/11 — bộ đếm token).
// Bot cũ không lưu model; nhật ký Claude Code trên máy chạy bot (~/.claude/projects/<repo>/<phien_id>.jsonl) có model từng câu trả lời.
// Lượt = khoảng [lúc người gửi tin cuối trước lượt, lúc lượt xong]; chọn model viết ra nhiều token nhất trong khoảng.
// Chỉ ghi dòng còn model NULL; không có nhật ký (phiên chạy ở máy khác) ⇒ để NULL (dashboard tính theo model mặc định, đánh dấu ước tính).
// Chạy: node scripts/ai/gan-model-phien.mjs [--ghi]   (không --ghi = chỉ xem)
process.loadEnvFile('.env')
import pg from 'pg'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const GHI = process.argv.includes('--ghi')
const thuMuc = path.join(os.homedir(), '.claude', 'projects', process.cwd().replace(/[:\\/]/g, '-'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const ds = (await c.query(`select a.id, a.phien_id::text phien, a.at, t.created_at
  from ai_luot_dung a join claude_phien_tin t on t.id = a.nguon_id::bigint where a.kenh = 'phien' and a.model is null`)).rows
const theoPhien = {}
for (const r of ds) (theoPhien[r.phien] ??= []).push(r)
let gan = 0, khongNk = 0, khongThay = 0
const dem = {}
for (const [phien, luot] of Object.entries(theoPhien)) {
  const f = path.join(thuMuc, phien + '.jsonl')
  if (!fs.existsSync(f)) { khongNk += luot.length; continue }
  const tl = []
  for (const dong of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!dong.includes('"model"')) continue
    try { const j = JSON.parse(dong); const m = j.message?.model; if (j.type === 'assistant' && m && j.timestamp) tl.push({ t: Date.parse(j.timestamp), m, ra: j.message.usage?.output_tokens ?? 1 }) } catch {}
  }
  for (const r of luot) {
    const tu = new Date(r.created_at).getTime() - 2 * 3600e3, den = new Date(r.at).getTime() + 10e3
    const tong = {}
    for (const x of tl) if (x.t >= tu && x.t <= den) tong[x.m] = (tong[x.m] ?? 0) + x.ra
    const m = Object.entries(tong).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (!m) { khongThay++; continue }
    dem[m] = (dem[m] ?? 0) + 1; gan++
    if (GHI) await c.query(`update ai_luot_dung set model = $2 where id = $1 and model is null`, [r.id, m])
  }
}
console.log(`${GHI ? 'ĐÃ GHI' : 'XEM'}: gán ${gan} lượt`, dem, `· phiên không có nhật ký trên máy này: ${khongNk} lượt · có nhật ký mà không khớp giờ: ${khongThay}`)
await c.end()

// ghi-db.mjs — GHI lý thuyết (nhóm) + ví dụ (dạng bài) bản đồ mới K6 từ out-1..8.json vào DB. Mặc định chạy thử (ROLLBACK).
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-db.mjs <thư mục goi+out> [--ghi]
// KHÔNG ghi đè nội dung CEO đã có: chỉ ghi nhóm có ly_thuyet RỖNG và dạng có vi_du RỖNG (điều kiện `where … is null/''` trong CÙNG câu UPDATE ⇒
// nếu giữa lúc đọc và lúc ghi CEO vừa gõ thì dòng đó bị bỏ qua, in cảnh báo). Dạng đã có ví dụ ⇒ nối thêm ví dụ MỚI vào cuối (nếu out có).
// Trigger của bản đồ mới tự ghi dai_bdm_log (actor + cũ/mới).
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')

const dir = process.argv[2]
const GHI = process.argv.includes('--ghi')
if (!dir) { console.error('Dùng: node …/ghi-db.mjs <thư mục chứa goi/ và out/> [--ghi]'); process.exit(2) }
const outs = readdirSync(join(dir, 'out')).filter((f) => /^out-\d+\.json$/.test(f)).sort()
if (!outs.length) { console.error('Không có out-N.json'); process.exit(2) }

const viDu = {}, lyThuyet = {}
for (const f of outs) {
  const o = JSON.parse(readFileSync(join(dir, 'out', f), 'utf8'))
  for (const [k, v] of Object.entries(o.vi_du ?? {})) { if (viDu[k]) throw new Error(`${k} xuất hiện ở 2 gói`); viDu[k] = String(v).trim() }
  for (const [k, v] of Object.entries(o.ly_thuyet ?? {})) { if (lyThuyet[k]) throw new Error(`${k} xuất hiện ở 2 gói`); lyThuyet[k] = String(v).trim() }
}
console.log(`đọc ${outs.length} gói: ${Object.keys(viDu).length} ví dụ · ${Object.keys(lyThuyet).length} lý thuyết`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
let nVi = 0, nViNoi = 0, nLt = 0, boQua = []
try {
  await c.query('begin')
  for (const [id, nd] of Object.entries(lyThuyet)) {
    const r = await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, nd])
    if (r.rowCount === 1) nLt++; else boQua.push(`LT ${id} (đã có chữ / không tồn tại)`)
  }
  for (const [id, nd] of Object.entries(viDu)) {
    const { rows: [cur] } = await c.query(`select vi_du from dai_bdm_dang_bai where id = $1`, [id])
    if (!cur) { boQua.push(`VD ${id} (không tồn tại)`); continue }
    const co = (cur.vi_du ?? '').trim()
    if (!co) {
      const r = await c.query(`update dai_bdm_dang_bai set vi_du = $2, updated_at = now() where id = $1 and coalesce(btrim(vi_du), '') = ''`, [id, nd])
      if (r.rowCount === 1) nVi++; else boQua.push(`VD ${id} (vừa có chữ)`)
    } else {
      // đã có ví dụ: chỉ nối khối ##VD MỚI (khác nguyên văn) vào cuối, không đụng phần cũ
      const moi = nd.split(/\n[ \t]*\n(?=##VD)/).filter((b) => b.trim() && !co.includes(b.trim().slice(0, 60)))
      if (!moi.length) continue
      const r = await c.query(`update dai_bdm_dang_bai set vi_du = vi_du || E'\\n\\n' || $2, updated_at = now() where id = $1 and vi_du = $3`, [id, moi.join('\n\n'), cur.vi_du])
      if (r.rowCount === 1) nViNoi++; else boQua.push(`VD ${id} (đổi giữa chừng)`)
    }
  }
  console.log(`\n${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}: lý thuyết ${nLt} nhóm · ví dụ mới ${nVi} dạng · ví dụ nối thêm ${nViNoi} dạng · bỏ qua ${boQua.length}`)
  for (const b of boQua) console.log('   ·', b)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }

// ghi-db-ld.mjs — GHI lý thuyết CẤP DẠNG BÀI (out-ld/out-N.json › ly_thuyet_dang) vào dai_bdm_dang_bai.ly_thuyet. Mặc định chạy thử (ROLLBACK).
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-db-ld.mjs <thư mục ban-do-moi-k6> [--ghi]
// Chỉ ghi dạng có ly_thuyet RỖNG (điều kiện trong CÙNG câu UPDATE ⇒ không đè nếu CEO vừa gõ). Trigger bản đồ mới tự ghi dai_bdm_log.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')

const dir = process.argv[2]
const GHI = process.argv.includes('--ghi')
if (!dir) { console.error('Dùng: node …/ghi-db-ld.mjs <thư mục ban-do-moi-k6> [--ghi]'); process.exit(2) }
const od = join(dir, 'out-ld')
const outs = readdirSync(od).filter((f) => /^out-\d+\.json$/.test(f)).sort()
const lt = {}
for (const f of outs) {
  const o = JSON.parse(readFileSync(join(od, f), 'utf8'))
  for (const [k, v] of Object.entries(o.ly_thuyet_dang ?? {})) { if (lt[k]) throw new Error(`${k} xuất hiện ở 2 gói`); lt[k] = String(v).trim() }
}
console.log(`đọc ${outs.length} gói: ${Object.keys(lt).length} lý thuyết dạng`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
let n = 0; const boQua = []
try {
  await c.query('begin')
  for (const [id, nd] of Object.entries(lt)) {
    const r = await c.query(`update dai_bdm_dang_bai set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, nd])
    if (r.rowCount === 1) n++; else boQua.push(id)
  }
  console.log(`\n${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}: lý thuyết dạng ${n} · bỏ qua ${boQua.length}${boQua.length ? ' (đã có chữ / không tồn tại): ' + boQua.join(', ') : ''}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }

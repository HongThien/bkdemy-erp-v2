// Chạy thử Ô HỎI Phòng Trưởng bộ môn (api/_phong_hoi_core.mjs) trên DB THẬT, đóng vai 1 người theo tên,
// mọi thứ trong transaction ROLLBACK (không ghi gì). Gọi model thật ⇒ tốn tiền vài trăm đồng/câu.
//   node scripts/phong-hoi-thu.mjs "Phạm Anh Ngọc" "Tháng này lương TA KHTN bao nhiêu?" [--mig <file.sql>]
// --mig: nạp tạm 1 migration chưa áp trong cùng transaction (kiểm trước khi áp).
// Key: như Vercel (TROLY_PROVIDER, DEEPSEEK_API_KEY / ANTHROPIC_API_KEY), thiếu thì lấy VITE_DEEPSEEK_KEY / VITE_ANTHROPIC_API_KEY ở .env.local.
// ⚠ Không thấy RLS (role ghi sở hữu bảng) — các hàm ô hỏi đều security definer nên kết quả khớp app.
import pg from 'pg'
import fs from 'fs'
import { hoiPhong } from '../api/_phong_hoi_core.mjs'

const docEnv = (f) => fs.existsSync(f) ? Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/)
  .filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')])) : {}
const e1 = docEnv('.env'), e2 = docEnv('.env.local')
const args = process.argv.slice(2)
const iMig = args.indexOf('--mig'); const mig = iMig >= 0 ? args.splice(iMig, 2)[1] : null
const [ten, cauHoi] = args
if (!ten || !cauHoi) { console.error('Cách dùng: node scripts/phong-hoi-thu.mjs "<họ tên>" "<câu hỏi>" [--mig file.sql]'); process.exit(1) }

const env = { ...process.env, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? e2.VITE_ANTHROPIC_API_KEY, DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ?? e2.VITE_DEEPSEEK_KEY }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? e1.DATABASE_URL_RO ?? e1.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  if (mig) await c.query(fs.readFileSync(mig, 'utf8'))
  const { rows: [u] } = await c.query(`select tk.id from tai_khoan tk join nhan_su n on n.id = tk.nhan_su_id where n.ho_ten = $1 limit 1`, [ten])
  if (!u) throw new Error(`Không thấy tài khoản của "${ten}"`)
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: u.id, role: 'authenticated' })])
  const goiRpc = async (fn, a) => {
    const keys = Object.keys(a)
    const sql = `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}${k === 'p_tham_so' ? '::jsonb' : ''}`).join(', ')}) as kq`
    await c.query('savepoint s')
    try { const { rows: [r] } = await c.query(sql, keys.map((k) => (k === 'p_tham_so' ? JSON.stringify(a[k]) : a[k]))); await c.query('release savepoint s'); return r.kq }
    catch (e) { await c.query('rollback to savepoint s'); throw e }
  }
  const t0 = Date.now()
  const ket = await hoiPhong({ goiRpc, cauHoi, homNay: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }), env })
  console.log(`— ${ket.model} · ${((Date.now() - t0) / 1000).toFixed(1)}s · vào ${ket.usage.input_tokens} · ra ${ket.usage.output_tokens}`)
  console.log('— Các bước:', JSON.stringify(ket.buoc))
  console.log('\n' + ket.traLoi)
} finally { await c.query('rollback'); await c.end() }

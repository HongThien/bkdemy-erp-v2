// Dùng chung cho máy chấm BTVN chế độ hàng đợi (mig 202611072132, skill .claude/skills/cham-btvn-hang-doi).
// Đọc cấu hình từ file env (mặc định .env ở thư mục đang đứng; đổi bằng --env <đường dẫn>):
//   DATABASE_URL_RW (biến môi trường) hoặc DATABASE_URL (role GHI) · VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pg = require('pg')

export const RULE_VERSION = 'v0.1-2026-11-07'
export const MODEL = 'claude-code-hang-doi-sonnet-5-5' // CEO 08/11: chấm bằng Sonnet 5.5

export function docEnv() {
  const i = process.argv.indexOf('--env')
  const path = i >= 0 ? process.argv[i + 1] : '.env'
  let txt = ''
  try { txt = readFileSync(path, 'utf8') } catch { throw new Error(`Không đọc được file env: ${path} (truyền --env <đường dẫn>)`) }
  const key = (k) => {
    const m = txt.match(new RegExp(`^${k}=(.*)$`, 'm'))
    return m ? m[1].trim() : undefined
  }
  const env = {
    db: process.env.DATABASE_URL_RW ?? key('DATABASE_URL'),
    url: key('VITE_SUPABASE_URL'),
    service: key('SUPABASE_SERVICE_ROLE'),
  }
  if (!env.db) throw new Error('Thiếu DATABASE_URL (role ghi) trong file env.')
  return env
}

export async function ketNoi(env) {
  const c = new pg.Client({ connectionString: env.db, ssl: { rejectUnauthorized: false } })
  await c.connect()
  return c
}

// Chạy fn trong transaction mang JWT giả của người gửi yêu cầu ⇒ la_thanh_vien()/jwt_uid() như app thật,
// lần chấm ghi nhận đúng TA đã gửi.
export async function voiNguoi(c, uid, fn) {
  await c.query('begin')
  try {
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
    const r = await fn()
    await c.query('commit')
    return r
  } catch (e) { await c.query('rollback'); throw e }
}

export const tenThuMuc = (j) =>
  `${String(j.ngay instanceof Date ? j.ngay.toISOString().slice(0, 10) : j.ngay).slice(0, 10)}_${j.ten_lop}_${j.ho_ten}`.replace(/[\\/:*?"<>|]/g, '_') +
  `__${j.buoi_hoc_id.slice(0, 8)}_${j.hoc_sinh_id.slice(0, 8)}`

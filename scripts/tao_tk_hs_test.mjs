// ============================================================================
// tao_tk_hs_test.mjs — tạo TÀI KHOẢN ĐĂNG NHẬP cho các em trạng thái 'test' (mig 202610031034_hoc_sinh_test, Thùy 03/10).
// Y hệt nút "Cấp tài khoản HS" trên ERP (lib/nhansu.ts provisionTaiKhoanHS): signUp bằng khoá công khai (Confirm email đã tắt),
// email <mã>@hs.bkdemy.local, mật khẩu = mã HS (quy ước cũ); nối tai_khoan bằng role ghi DB. Idempotent: em đã có tài khoản thì bỏ qua.
// Chạy: node scripts/tao_tk_hs_test.mjs <đường dẫn .env.local có VITE_SUPABASE_URL + VITE_SUPABASE_KEY>
// ============================================================================
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
process.loadEnvFile('.env')
process.loadEnvFile(process.argv[2] ?? '.env.local')
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })

const ds = (await db.query(`select h.id, h.ma_hs, h.ho_ten from hoc_sinh h
  where h.trang_thai = 'test' and not exists (select 1 from tai_khoan tk where tk.hoc_sinh_id = h.id) order by h.ma_hs`)).rows
let tao = 0
for (const h of ds) {
  const email = `${h.ma_hs.toLowerCase()}@hs.bkdemy.local`
  const { data, error } = await sb.auth.signUp({ email, password: h.ma_hs, options: { data: { ho_ten: h.ho_ten, ma_hs: h.ma_hs, role: 'hoc_sinh' } } })
  if (error) { console.error('✗', h.ma_hs, error.message); continue }
  const uid = data.user?.id
  if (!uid) { console.error('✗', h.ma_hs, 'không lấy được id tài khoản'); continue }
  await db.query(`insert into tai_khoan (id, hoc_sinh_id, email) values ($1, $2, $3) on conflict (id) do update set hoc_sinh_id = excluded.hoc_sinh_id, email = excluded.email`, [uid, h.id, email])
  tao++
  console.log('✓', h.ma_hs)
}
const tong = (await db.query(`select count(*)::int n from hoc_sinh h join tai_khoan tk on tk.hoc_sinh_id = h.id where h.trang_thai = 'test'`)).rows[0].n
console.log(`Tạo mới ${tao} · em test đã có tài khoản: ${tong}`)
await db.end()

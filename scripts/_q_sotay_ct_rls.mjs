// Kiểm điều kiện policy màn ERP Sổ tay + trigger dưới danh tính giả (JWT claims) — ROLLBACK, không để lại gì.
// claude_build không SET ROLE authenticated được ⇒ đánh giá thẳng biểu thức policy thay vì để RLS chạy.
import pg from 'pg'; process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p = []) => (await c.query(s, p)).rows
const [ad] = await q(`select tk.id uid, n.ho_ten from tai_khoan tk join nhan_su n on n.id = tk.nhan_su_id where n.la_admin_he_thong limit 1`)
const [hs] = await q(`select tk.id uid from tai_khoan tk where tk.hoc_sinh_id is not null limit 1`)
const nhap = (uid) => q(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' }), uid])
const pol = async () => (await q(`select co_chuc_nang('sotay') doc, co_quyen_ghi('sotay') ghi, current_nhan_su_id() is not null la_ns`))[0]
await c.query('begin')
try {
  await nhap(ad.uid); console.log('admin', ad.ho_ten, await pol())
  const [d] = await q(`update sotay_cong_thuc set trang_thai='da_duyet' where ma='CT12-XS-04' returning trang_thai, xet_boi is not null co_nguoi_xet`)
  console.log('  duyệt XS-04 ⇒', d, '· nhật ký:', (await q(`select hanh_dong||(case when actor is null then '(máy)' else '(người)' end) h from sotay_ct_lich_su where ma_the='CT12-XS-04' order by id`)).map((r) => r.h).join(', '))
  await nhap(hs.uid); console.log('học sinh', await pol())
  console.log('  HS tìm "bayes" qua RPC ⇒', (await q(`select hs_sotay_tim_ct('bayes','Toán','12',20) r`))[0].r.map((x) => x.ma))
  console.log('quyền bảng của authenticated:', (await q(`select string_agg(privilege_type, ',' order by privilege_type) p from information_schema.role_table_grants where grantee='authenticated' and table_name='sotay_cong_thuc'`))[0].p,
    '· anon:', (await q(`select count(*)::int n from information_schema.role_table_grants where grantee='anon' and table_name like 'sotay_c%'`))[0].n)
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end() }

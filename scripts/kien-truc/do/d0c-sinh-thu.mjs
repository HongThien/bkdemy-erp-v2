// Sinh d0c.sql (cong danh tinh: chi qua tai_khoan + nhan su dang lam) va CHAY THU trong transaction roi ROLLBACK.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex');
const lay = async n => { const r = (await c.query(`select p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p where p.pronamespace='public'::regnamespace and p.proname=$1`, [n])).rows; if (r.length !== 1) throw new Error(n + ': ' + r.length + ' ban'); return r[0]; };
const out = [];
const thay = async (n, fnMoi) => { const f = await lay(n); const moi = fnMoi(f.src); if (moi === f.src) throw new Error(n + ': khong doi duoc than'); if (f.def.split(f.src).length !== 2) throw new Error(n + ': than khong duy nhat trong def'); out.push({ n, sig: f.sig, md5: md5(f.src), sql: f.def.replace(f.src, moi) }); };
const RE_ME = /coalesce\(\s*\(select nhan_su_id from tai_khoan where id = public\.jwt_uid\(\)\),\s*\(select id from nhan_su where email is not null\s+and lower\(email\) = public\.jwt_email\(\) and public\.jwt_email\(\) <> ''\)\s*\)/g;
const doiMe = src => { const m = src.match(RE_ME); if (!m || m.length !== 1) throw new Error('khong thay dung 1 khoi coalesce: ' + (m ? m.length : 0)); return src.replace(RE_ME, 'public.current_nhan_su_id()'); };
await thay('current_nhan_su_id', () => `\n  -- [dot 0c 13/11] NGUON DUY NHAT cua "toi la nhan su nao": tai khoan da noi + nhan su dang lam. Bo nhanh khop email.\n  select tk.nhan_su_id from public.tai_khoan tk join public.nhan_su ns on ns.id = tk.nhan_su_id\n   where tk.id = public.jwt_uid() and ns.trang_thai = 'dang_lam'\n`);
await thay('la_thanh_vien', () => `\n  -- [dot 0c 13/11] nhan su = tai khoan da noi + dang lam (bo nhanh khop email; nhan su nghi het quyen)\n  select public.current_nhan_su_id() is not null\n`);
await thay('chi_me_id', () => `\n  -- [dot 0c 13/11]\n  select public.current_nhan_su_id()\n`);
for (const n of ['co_chuc_nang', 'co_quyen_ghi', 'my_quyen']) await thay(n, doiMe);
const sql = `-- ĐỢT 0c-1 (13/11/2026) — CỔNG NHÂN SỰ: chỉ qua tài khoản đã nối + nhân sự đang làm. Chỉ đổi định nghĩa 6 hàm cổng, không đổi dữ liệu.
-- Trước: la_thanh_vien / co_quyen_ghi / co_chuc_nang / chi_me_id / my_quyen khớp thêm theo EMAIL trong token (không cần dòng tai_khoan) và không lọc trạng thái
--   ⇒ (1) đăng ký tài khoản bằng email của một nhân sự chưa có tài khoản là thành nhân sự; (2) nhân sự đã nghỉ vẫn đọc/ghi như cũ.
-- Sau: một nguồn duy nhất current_nhan_su_id() = tai_khoan(uid) nối nhan_su đang làm; 5 hàm kia dựa vào nó (spec-kien-truc.md K15).
set local lock_timeout = '5s';

do $g$
begin
${out.map(g => `  if (select md5(p.prosrc) from pg_proc p where p.oid = '${g.sig}'::regprocedure) is distinct from '${g.md5}' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', '${g.n}'; end if;`).join('\n')}
end
$g$;

${out.map(g => g.sql.trim() + ';').join('\n\n')}

-- Tự nối tài khoản theo email: không client nào gọi; để mở thì người lạ đăng ký bằng email nhân sự rồi tự nối được.
revoke execute on function public.self_link_account() from public, anon, authenticated;
`;
fs.writeFileSync(S + '/d0c.sql', sql);
console.log('da ghi d0c.sql', sql.split('\n').length, 'dong; ham doi:', out.map(o => o.sig).join(', '));

// ---- chay thu
const thu = async (ten, q, p) => { await c.query('savepoint s'); let v; try { v = JSON.stringify((await c.query(q, p)).rows[0]); } catch (e) { v = 'LỖI [' + e.code + '] ' + e.message.slice(0, 80); } await c.query('rollback to savepoint s'); return v; };
const claims = o => c.query(`select set_config('request.jwt.claims', $1, true)`, [o ? JSON.stringify(o) : '']);
try {
  await c.query('begin');
  const dl = (await c.query(`select t.id, lower(n.email) email from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai='dang_lam' limit 1`)).rows[0];
  const adm = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai='dang_lam' and n.la_admin_he_thong limit 1`)).rows[0];
  const ng = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai<>'dang_lam' limit 1`)).rows[0];
  const hs = (await c.query(`select t.id from tai_khoan t where t.hoc_sinh_id is not null limit 1`)).rows[0];
  const chuaTk = (await c.query(`select lower(n.email) email from nhan_su n where coalesce(n.email,'')<>'' and n.trang_thai='dang_lam' and not exists (select 1 from tai_khoan t where t.nhan_su_id=n.id) limit 1`)).rows[0];
  const Q = `select public.la_thanh_vien() tv, public.current_nhan_su_id() is not null ns, public.chi_me_id() is not null me, public.co_quyen_ghi('bdkt') ghi, public.co_chuc_nang('bdkt') cn, left((select row_to_json(q)::text from public.my_quyen() q), 46) mq`;
  const ca = [['nhan su dang lam', { role: 'authenticated', sub: dl.id, email: dl.email }], ['admin he thong', adm && { role: 'authenticated', sub: adm.id }], ['nhan su DA NGHI', { role: 'authenticated', sub: ng.id }], ['hoc sinh', { role: 'authenticated', sub: hs.id }], ['nguoi la, token mang EMAIL cua nhan su chua co tai khoan', { role: 'authenticated', sub: '00000000-0000-4000-8000-000000000001', email: chuaTk?.email }]];
  const chay = async nhan => { console.log('\n' + nhan); for (const [ten, cl] of ca) { if (!cl) continue; await claims(cl); console.log('  ' + ten.padEnd(58), await thu(ten, Q)); } };
  await chay('TRUOC:');
  await claims(null);
  await c.query(sql);
  await chay('SAU:');
  await claims({ role: 'authenticated', sub: '00000000-0000-4000-8000-000000000001', email: chuaTk?.email });
  console.log('\nself_link_account authenticated goi duoc?', (await c.query(`select has_function_privilege('authenticated','public.self_link_account()','execute') x`)).rows[0].x);
} catch (e) { console.log('!!! LOI:', e.code, e.message); }
finally { await c.query('rollback'); const k = await c.query(`select prosrc ~ 'jwt_email' con_email from pg_proc where proname='la_thanh_vien' and pronamespace='public'::regnamespace`); console.log('DA ROLLBACK. la_thanh_vien van con nhanh email (phai true):', k.rows[0].con_email); await c.end(); }

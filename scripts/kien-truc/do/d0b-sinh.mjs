// Sinh migration dot 0b tu trang thai DB hien tai. Chi DOC DB; ghi .sql vao scratchpad.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex');
const VIEWS = ['qlht_v_so_du_xu', 'qlht_v_ton_qua', 'v_hinh_chua_giai', 'v_giaibai_nhan', 'v_giaibai_bai', 'v_giaibai_hoan_thien', 'hinh_hoc_ban_do', 'bdm_ban_do', 'bdm_cau_dang', 'bdm_cau_hoi', 'bdm_cau_form_tn', 'bdm_cau_menh_de', 'bdm_dang_ly_thuyet', 'bdm_ban_do_toan', 'bdm_ban_do_hgt', 'tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_o_v', 'tl_bdm_nhom_v', 'tl_bdm_dang_bai_v'];
const TBL = ['dai_cau_menh_de', 'hgt_cau_menh_de', 'toan_de_thi', 'toan_de_thi_cau', 'nhap_kho_log'];
// 1) moi bang goc cua view phai co policy cho nhan su doc (neu khong, bat invoker la nhan su mat du lieu)
const deps = async v => (await c.query(`select distinct d.refobjid::regclass::text dep, c2.relkind k, c2.relrowsecurity rls, pg_get_userbyid(c2.relowner) own from pg_rewrite rw join pg_depend d on d.objid=rw.oid and d.classid='pg_rewrite'::regclass and d.refclassid='pg_class'::regclass join pg_class c2 on c2.oid=d.refobjid where rw.ev_class=$1::regclass and d.refobjid<>$1::regclass`, ['public.' + v])).rows;
const okNs = async t => (await c.query(`select count(*)::int n from pg_policies where schemaname='public' and tablename=$1 and cmd in ('SELECT','ALL') and roles::text ~ 'authenticated|public' and (coalesce(qual,'true')='true' or qual ~ 'la_thanh_vien')`, [t])).rows[0].n > 0;
const loai = [];
for (const v of VIEWS) { for (const d of await deps(v)) { if (d.k === 'v') { if (!VIEWS.includes(d.dep)) loai.push(v + ': phu thuoc view ngoai danh sach ' + d.dep); continue; } if (d.own !== 'claude_build') loai.push(v + ': bang ' + d.dep + ' owner ' + d.own); if (d.rls && !(await okNs(d.dep))) loai.push(v + ': bang ' + d.dep + ' KHONG co policy doc cho nhan su'); } }
console.log('view co van de:', loai.length ? '\n  ' + loai.join('\n  ') : 'khong');
if (loai.length) throw new Error('dung: co view chua an toan de bat security_invoker');
// 2) policy mo tren 5 bang
const pol = (await c.query(`select tablename, policyname, cmd, roles::text r, coalesce(qual,'') q, coalesce(with_check,'') wc from pg_policies where schemaname='public' and tablename = any($1) and roles::text ~ 'authenticated|public'`, [TBL])).rows;
for (const p of pol) console.log('policy hien co:', p.tablename, p.policyname, p.cmd, p.r, JSON.stringify(p.q), JSON.stringify(p.wc));
const mo = pol.filter(p => (p.q === 'true' || p.q === '') && (p.wc === 'true' || p.wc === ''));
// 3) ham
const OK = `(coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien())`;
const CONG = `\n  -- [dot 0b 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)\n  if not ${OK} then\n    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';\n  end if;\n`;
const gate = [];
for (const n of ['fn_viec_chup_phu_trach', 'fn_ts_dk_form']) {
  const rs = (await c.query(`select p.proname, l.lanname lang, p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace and p.proname=$1`, [n])).rows;
  if (rs.length !== 1) throw new Error(n + ': ' + rs.length + ' ban'); const f = rs[0];
  if (f.lang !== 'plpgsql') throw new Error(n + ' khong phai plpgsql'); if (f.src.includes('[dot 0')) throw new Error(n + ' da co cong');
  const m = /\bbegin\b/i.exec(f.src); const truoc = f.src.slice(0, m.index);
  if (/\b(end|if|loop|update|insert|delete)\b/i.test(truoc.replace(/'[^']*'/g, '').replace(/--[^\n]*/g, ''))) throw new Error(n + ': truoc begin co lenh la: ' + truoc.slice(-120));
  if (f.def.split(f.src).length !== 2) throw new Error(n + ': than khong xuat hien dung 1 lan');
  gate.push({ n, sig: f.sig, md5: md5(f.src), sql: f.def.replace(f.src, f.src.slice(0, m.index + m[0].length) + CONG + f.src.slice(m.index + m[0].length)) });
  console.log('cong:', f.sig, '| truoc begin:', JSON.stringify(truoc.replace(/\s+/g, ' ').slice(0, 90)));
}
const dong = (await c.query(`select p.oid::regprocedure::text sig, p.proname from pg_proc p where p.pronamespace='public'::regnamespace and p.proname in ('_qlcl_dong_bang_tuan','fn_btyeu_dem','_khoi_quan_ly','increment_qaa_hit') order by 2`)).rows;
// nguoi goi cua 4 ham nay phai deu la security definer (hoac khong ai goi)
const allFn = (await c.query(`select proname, prosecdef, prosrc from pg_proc where pronamespace='public'::regnamespace`)).rows;
for (const d of dong) { const bad = allFn.filter(f => f.proname !== d.proname && !f.prosecdef && new RegExp('(^|[^a-z0-9_])' + d.proname + '\\s*\\(').test(f.prosrc)); if (bad.length) throw new Error(d.proname + ' con nguoi goi INVOKER: ' + bad.map(b => b.proname).join(',')); }
await c.end();
console.log('ham dong voi client:', dong.map(d => d.sig).join(' ; '));

const sql = `-- ĐỢT 0b (13/11/2026) — bịt lỗ quyền với TÀI KHOẢN ĐÃ ĐĂNG NHẬP không phải nhân sự (học sinh). Chỉ đổi QUYỀN, không đổi dữ liệu.
-- Spec: spec-kien-truc.md §7, §10. Tiếp theo mig 202611131750 (đợt 0a).
-- Đã dò trước khi viết: app HS (từ src/main-hs.tsx, mức export) không đọc trực tiếp và không gọi hàm invoker nào chạm các view/bảng dưới đây;
-- không trigger invoker, policy, default nào chạy các view này dưới quyền người dùng. Nhân sự đọc/ghi như cũ (policy la_thanh_vien của bảng gốc).

set local lock_timeout = '5s';

-- ───────── A. 20 view: từ "chạy bằng quyền chủ view (bỏ qua RLS)" sang "chạy bằng quyền người gọi" ─────────
-- Trước: mọi tài khoản đăng nhập đọc (và với 2 view cập nhật được: GHI) kho câu + đáp án, bản đồ, số dư xu… qua view.
-- Sau: RLS của bảng gốc áp cho người gọi. Hàm security definer dùng các view này không đổi (chạy bằng chủ hàm).
${VIEWS.map(v => `alter view public.${v} set (security_invoker = on);`).join('\n')}

-- ───────── B. 5 bảng đang cho MỌI tài khoản đăng nhập đọc + ghi (policy using(true)) ─────────
${mo.map(p => `drop policy if exists ${p.policyname} on public.${p.tablename};`).join('\n')}
${TBL.map(t => `drop policy if exists ${t}_member_all on public.${t};
create policy ${t}_member_all on public.${t} for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));`).join('\n')}

-- ───────── C. Hàm ─────────
-- 4 hàm security definer không kiểm người gọi, không client nào gọi, người gọi trong DB đều là security definer ⇒ đóng hẳn với người dùng API.
${dong.map(d => `revoke execute on function ${d.sig} from public, anon, authenticated;`).join('\n')}

-- 2 hàm nhân sự gọi từ client: thêm cổng.
do $d0g$
begin
${gate.map(g => `  if (select md5(p.prosrc) from pg_proc p where p.oid = '${g.sig}'::regprocedure) is distinct from '${g.md5}' then
    raise exception 'dot 0b: % da doi tu luc sinh migration — sinh lai', '${g.n}';
  end if;`).join('\n')}
end
$d0g$;

${gate.map(g => g.sql.trim() + ';').join('\n\n')}

-- ───────── KIỂM CUỐI ─────────
do $d0k$
declare n int;
begin
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'v'
     and c.relname = any (array[${VIEWS.map(v => `'${v}'`).join(',')}])
     and coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name = 'security_invoker'), 'off') not in ('on', 'true');
  if n > 0 then raise exception 'dot 0b: con % view chua security_invoker', n; end if;
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = any (array[${TBL.map(t => `'${t}'`).join(',')}])
     and roles::text ~ 'authenticated|public' and coalesce(qual, 'true') = 'true';
  if n > 0 then raise exception 'dot 0b: con % policy mo tren 5 bang', n; end if;
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = any (array[${TBL.map(t => `'${t}'`).join(',')}]) and policyname like '%_member_all';
  if n <> ${TBL.length} then raise exception 'dot 0b: thieu policy member_all (% / ${TBL.length})', n; end if;
end
$d0k$;
`;
fs.writeFileSync(S + '/d0b.sql', sql);
console.log('da ghi d0b.sql', sql.split('\n').length, 'dong; policy mo se go:', mo.map(p => p.tablename + '.' + p.policyname).join(', '));

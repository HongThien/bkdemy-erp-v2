// Sinh migration dot 0a tu trang thai DB hien tai. Chi DOC DB; ghi file .sql vao scratchpad.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const md5 = s => crypto.createHash('md5').update(s, 'utf8').digest('hex');
const OK = `(coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien())`;
const CONG_PLPGSQL = `\n  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)\n  if not ${OK} then\n    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';\n  end if;\n`;
const gate = [];
const lay = async n => (await c.query(`select p.oid, p.proname, l.lanname lang, p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace and p.proname=$1`, [n])).rows;
for (const n of ['fn_dai_chuyen_dang', 'fn_dai_chuyen_chuyen_de', 'fn_dai_gop_cau_dang', 'fn_ca_test_phan_cong_lai']) {
  const rs = await lay(n); if (rs.length !== 1) throw new Error(n + ': ' + rs.length + ' ban');
  const f = rs[0]; if (f.lang !== 'plpgsql') throw new Error(n + ' khong phai plpgsql');
  const m = /\bbegin\b/i.exec(f.src); if (!m) throw new Error(n + ': khong thay begin');
  const truoc = f.src.slice(0, m.index); if (/\b(end|if|loop|select|update|insert)\b/i.test(truoc.replace(/'[^']*'/g, ''))) throw new Error(n + ': truoc begin co lenh la: ' + truoc.slice(-80));
  if (f.src.includes('[dot 0a')) throw new Error(n + ' da co cong');
  const moi = f.src.slice(0, m.index + m[0].length) + CONG_PLPGSQL + f.src.slice(m.index + m[0].length);
  if (f.def.split(f.src).length !== 2) throw new Error(n + ': than ham khong xuat hien dung 1 lan trong def');
  gate.push({ n, sig: f.sig, md5: md5(f.src), sql: f.def.replace(f.src, moi) });
  console.log('cong plpgsql:', f.sig, '| truoc begin:', JSON.stringify(truoc.replace(/\s+/g, ' ').slice(0, 60)) + '…');
}
for (const n of ['fn_btyeu_ca_sap_toi', 'fn_lich_truc_cua_hs']) {
  const rs = await lay(n); if (rs.length !== 1) throw new Error(n + ': ' + rs.length + ' ban');
  const f = rs[0]; if (f.lang !== 'sql') throw new Error(n + ' khong phai sql');
  const than = f.src.trim().replace(/;\s*$/, '');
  if (than.replace(/'[^']*'/g, '').includes(';')) throw new Error(n + ': than co nhieu lenh');
  if (!/^(with|select)\b/i.test(than)) throw new Error(n + ': than khong bat dau bang with/select');
  const moi = `\n  -- [dot 0a 13/11] cong: nguoi goi qua API phai la nhan su\n  select case when ${OK} then (\n${than}\n  ) end\n`;
  if (f.def.split(f.src).length !== 2) throw new Error(n + ': than ham khong xuat hien dung 1 lan trong def');
  gate.push({ n, sig: f.sig, md5: md5(f.src), sql: f.def.replace(f.src, moi) });
  console.log('cong sql:', f.sig, '| dau:', JSON.stringify(than.slice(0, 50)), '| cuoi:', JSON.stringify(than.slice(-70)));
}
const views = (await c.query(`select c.relname from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v' and pg_get_userbyid(c.relowner)=current_user and (has_table_privilege('anon',c.oid,'select') or has_table_privilege('anon',c.oid,'insert') or has_table_privilege('anon',c.oid,'update') or has_table_privilege('anon',c.oid,'delete')) order by 1`)).rows.map(r => r.relname);
const sigRetest = (await c.query(`select p.oid::regprocedure::text sig from pg_proc p where p.pronamespace='public'::regnamespace and p.proname in ('fn_btyeu_retest_ghi','_btyeu_bu_retest') order by 1`)).rows.map(r => r.sig);
await c.end();
console.log('view thu quyen anon:', views.length, '| ham retest:', sigRetest.join(' ; '));

const pol = (t, extra = '') => `alter table public.${t} enable row level security;
revoke all on public.${t} from anon;
drop policy if exists claude_ro_select on public.${t};
create policy claude_ro_select on public.${t} for select to claude_ro using (true);
${extra}`;
const memberAll = t => `drop policy if exists ${t}_member_all on public.${t};
create policy ${t}_member_all on public.${t} for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
`;
const sql = `-- ĐỢT 0a (13/11/2026) — bịt lỗ quyền đang hở với người CHƯA đăng nhập. Chỉ đổi QUYỀN, không đổi dữ liệu.
-- Spec: spec-kien-truc.md §7, §10 (đợt 0). Bằng chứng: reports/audit-scale-13-11.md §4.
-- Nguyên tắc: quyền của authenticated / service_role / claude_ro / fdw_bkdemy_web / ph_nop / web_lead_writer GIỮ NGUYÊN
-- (có kiểm tự động bên dưới, lệch là rollback). Chỉ anon/PUBLIC bị thu.

set local lock_timeout = '5s';

-- ───────────────────────── A. 8 bảng chưa bật RLS ─────────────────────────
${pol('bao_cao_ph', memberAll('bao_cao_ph') + `drop policy if exists bao_cao_ph_fdw_select on public.bao_cao_ph;
create policy bao_cao_ph_fdw_select on public.bao_cao_ph for select to fdw_bkdemy_web using (true);  -- app phụ huynh đọc qua FDW
`)}
${pol('bao_cao_ph_preset', memberAll('bao_cao_ph_preset'))}
${pol('bo_tro_duoi', memberAll('bo_tro_duoi'))}
${pol('hinh_linkgen_jobs', memberAll('hinh_linkgen_jobs'))}
${pol('phan_cong_ca', memberAll('phan_cong_ca'))}
${pol('kho_cau_log', `drop policy if exists kho_cau_log_member_select on public.kho_cau_log;
create policy kho_cau_log_member_select on public.kho_cau_log for select to authenticated using ((select public.la_thanh_vien()));  -- ghi: chỉ trigger log_kho_cau (security definer)
`)}
${pol('_migrations', 'revoke all on public._migrations from authenticated;\n')}
${pol('_tt_mapping', 'revoke all on public._tt_mapping from authenticated;\n')}

-- ───────────────────────── B. Hàm: thu EXECUTE của PUBLIC/anon ─────────────────────────
-- GIỮ cho anon: (1) hàm đã grant TƯỜNG MINH cho anon (bot có p_secret, game khách fn_dtv_*/fn_game_bxh*/fn_xep_chu_*);
-- (2) hàm dùng trong policy / default / check / view / index (anon gặp policy vẫn phải gọi được để nhận "false");
-- (3) hàm mà các hàm invoker ở (1)(2) gọi tới. Hàm trigger không đụng (không gọi được qua API).
create temp table _d0_truoc on commit drop as
  select r.rolname, p.oid as fn
  from pg_proc p cross join (select rolname, oid from pg_roles where rolname in ('authenticated','service_role','claude_ro','fdw_bkdemy_web','ph_nop','web_lead_writer','postgres')) r
  where p.pronamespace = 'public'::regnamespace and has_function_privilege(r.oid, p.oid, 'execute');

do $d0$
declare
  v_dung text; r record; n_thu int := 0; n_lech int;
  v_giu_them text[] := array['_kho_ngay_bat', 'fn_hinh_tt_node', 'fn_traogiai_slot_max', 'fn_hl_gia_thiet_phan'];
begin
  select string_agg(s, ' ') into v_dung from (
    select coalesce(qual, '') || ' ' || coalesce(with_check, '') as s from pg_policies
    union all select pg_get_expr(adbin, adrelid) from pg_attrdef
    union all select pg_get_constraintdef(oid) from pg_constraint where contype = 'c'
    union all select pg_get_viewdef(oid) from pg_class where relkind in ('v', 'm') and relnamespace = 'public'::regnamespace
    union all select pg_get_indexdef(indexrelid) from pg_index where indexprs is not null or indpred is not null
  ) x;
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and pg_get_userbyid(p.proowner) = current_user
      and p.prokind in ('f', 'p')
      and p.prorettype <> 'trigger'::regtype
      and has_function_privilege('anon', p.oid, 'execute')
      and coalesce(p.proacl::text, '') !~ '(^|[{,])anon='
      and p.proname <> all (v_giu_them)
      and v_dung !~ ('(^|[^a-z0-9_])' || p.proname || '[[:space:]]*[(]')
  loop
    execute format('revoke execute on routine %s from public, anon', r.sig);
    execute format('grant execute on routine %s to authenticated, service_role, claude_ro, fdw_bkdemy_web, ph_nop, web_lead_writer', r.sig);
    n_thu := n_thu + 1;
  end loop;
  raise notice 'dot 0a: da thu quyen anon/PUBLIC tren % ham', n_thu;
  if n_thu < 300 then raise exception 'dot 0a: chi thu duoc % ham (ky vong ~437) — dung lai', n_thu; end if;

  -- KIỂM: các role khác không mất hàm nào
  select count(*) into n_lech from _d0_truoc t join pg_roles ro on ro.rolname = t.rolname
   where not has_function_privilege(ro.oid, t.fn, 'execute');
  if n_lech > 0 then raise exception 'dot 0a: % cap (role, ham) BI MAT quyen — rollback', n_lech; end if;
end
$d0$;

-- 2 hàm retest không ai gọi từ client; chỉ trigger/hàm security definer gọi ⇒ đóng hẳn với người dùng API
${sigRetest.map(s => `revoke execute on function ${s} from public, anon, authenticated;`).join('\n')}

-- ───────────────────────── C. View: anon không còn quyền gì ─────────────────────────
revoke all on ${views.map(v => 'public.' + v).join(',\n  ')}
  from anon;

-- ───────────────────────── D. Cổng cho 6 hàm security definer chưa kiểm người gọi ─────────────────────────
-- Chặn người dùng API (anon/authenticated) không phải nhân sự. Tác vụ nền, service role, role DB trực tiếp không bị chặn.
do $d0g$
begin
${gate.map(g => `  if (select md5(p.prosrc) from pg_proc p where p.oid = '${g.sig}'::regprocedure) is distinct from '${g.md5}' then
    raise exception 'dot 0a: % da doi tu luc sinh migration — sinh lai', '${g.n}';
  end if;`).join('\n')}
end
$d0g$;

${gate.map(g => g.sql.trim() + ';').join('\n\n')}

-- ───────────────────────── E. Mặc định ĐÓNG cho đối tượng mới của role ghi ─────────────────────────
-- Hàm mới: PUBLIC/anon không tự có EXECUTE; authenticated + service_role + claude_ro có sẵn. Cần cho anon ⇒ grant tường minh.
alter default privileges for role claude_build revoke execute on functions from public;
alter default privileges for role claude_build in schema public grant execute on functions to authenticated, service_role, claude_ro;
-- Bảng mới: anon không tự có quyền (8 bảng hở ở trên sinh ra từ mặc định cũ + quên bật RLS).
alter default privileges for role claude_build in schema public revoke all on tables from anon;

-- ───────────────────────── KIỂM CUỐI ─────────────────────────
do $d0k$
declare n int;
begin
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r' and not c.relrowsecurity
     and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca');
  if n > 0 then raise exception 'dot 0a: con % bang chua bat RLS', n; end if;
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
     and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca')
     and (has_table_privilege('anon', c.oid, 'select') or has_table_privilege('anon', c.oid, 'insert') or has_table_privilege('anon', c.oid, 'update') or has_table_privilege('anon', c.oid, 'delete'));
  if n > 0 then raise exception 'dot 0a: anon con quyen tren % bang', n; end if;
  select count(*) into n from pg_proc p where p.pronamespace = 'public'::regnamespace
     and p.proname in ('fn_dai_chuyen_dang','fn_dai_chuyen_chuyen_de','fn_dai_gop_cau_dang','fn_btyeu_ca_sap_toi','fn_lich_truc_cua_hs','fn_btyeu_retest_ghi','_btyeu_bu_retest','_kho_snapshot_cau','fn_ca_test_phan_cong_lai')
     and has_function_privilege('anon', p.oid, 'execute');
  if n > 0 then raise exception 'dot 0a: anon con goi duoc % ham trong nhom nguy hiem', n; end if;
end
$d0k$;
`;
fs.writeFileSync(S + '/d0a.sql', sql);
console.log('da ghi', S + '/d0a.sql', sql.length, 'ky tu,', sql.split('\n').length, 'dong');

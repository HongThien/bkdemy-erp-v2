import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const q = async (t, s) => { try { const r = await c.query(s); console.log('\n## ' + t + ' (' + r.rows.length + ')'); for (const x of r.rows) console.log(Object.values(x).join(' | ')); return r.rows; } catch (e) { console.log('\n## ' + t + ' LOI: ' + e.message); return []; } };
await q('gio VN', `select to_char(now() at time zone 'Asia/Ho_Chi_Minh','HH24:MI DD/MM')`);
await q('anon thuc te goi gi (pss)', `select s.calls, left(regexp_replace(s.query,'\\s+',' ','g'),230) from public._audit_pss() s join pg_roles r on r.oid=s.userid where r.rolname='anon' order by s.calls desc`);
await q('role dang nhap duoc / thanh vien', `select r.rolname, r.rolcanlogin, r.rolsuper, r.rolbypassrls, (select string_agg(m.rolname,',') from pg_auth_members am join pg_roles m on m.oid=am.roleid where am.member=r.oid) thuoc from pg_roles r where r.rolname !~ '^pg_' order by 1`);
await q('ham public: so ham moi role EXECUTE duoc', `select r.rolname, count(*) filter (where has_function_privilege(r.oid, p.oid, 'execute')) n from pg_roles r cross join pg_proc p where p.pronamespace='public'::regnamespace and r.rolname in ('anon','authenticated','service_role','postgres','fdw_bkdemy_web','ph_nop','claude_ro','claude_build','authenticator','supabase_auth_admin','supabase_storage_admin','pgbouncer','dashboard_user') group by 1 order by 1`);
await q('ACL dang: null / co =X (PUBLIC) / khac', `select case when proacl is null then 'null(PUBLIC mac dinh)' when proacl::text ~ '(^|[{,])=X' then 'PUBLIC tuong minh' else 'khong PUBLIC' end k, pg_get_userbyid(proowner) own, count(*), count(*) filter (where proacl::text ~ 'anon=') anon_tuong_minh from pg_proc where pronamespace='public'::regnamespace group by 1,2 order by 1,2`);
await q('8 bang: owner, quyen cac role', `select c.relname, pg_get_userbyid(c.relowner) own, s.n_live_tup, (select string_agg(distinct grantee||':'||privilege_type, ' ') from information_schema.role_table_grants g where g.table_schema='public' and g.table_name=c.relname and grantee in ('fdw_bkdemy_web','ph_nop','service_role','claude_ro')) khac from pg_class c left join pg_stat_user_tables s on s.relid=c.oid where c.relnamespace='public'::regnamespace and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca')`);
await q('default privileges', `select pg_get_userbyid(defaclrole) r, defaclnamespace::regnamespace ns, defaclobjtype t, defaclacl::text from pg_default_acl`);
await q('ham dung trong policy/default/check/view (anon can giu EXECUTE)', `
  with src as (
    select coalesce(qual,'')||' '||coalesce(with_check,'') s from pg_policies
    union all select pg_get_expr(adbin,adrelid) from pg_attrdef
    union all select pg_get_constraintdef(oid) from pg_constraint where contype='c'
    union all select pg_get_viewdef(oid) from pg_class where relkind='v' and relnamespace='public'::regnamespace
  )
  select count(distinct p.proname) n, string_agg(distinct p.proname, ', ') from pg_proc p where p.pronamespace='public'::regnamespace and exists (select 1 from src where src.s ~ ('(^|[^a-z0-9_])'||p.proname||'\\('))`);
await q('view: owner + quyen anon/auth/fdw', `select c.relname, pg_get_userbyid(c.relowner) own, has_table_privilege('anon',c.oid,'select') a_s, has_table_privilege('anon',c.oid,'insert') a_i, has_table_privilege('fdw_bkdemy_web',c.oid,'select') fdw_s from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v' and has_table_privilege('anon',c.oid,'select') order by 1`);
await q('bang (r) anon co quyen SELECT: dem / co quyen GHI: dem', `select count(*) filter (where has_table_privilege('anon',oid,'select')) sel, count(*) filter (where has_table_privilege('anon',oid,'insert')) ins, count(*) from pg_class where relnamespace='public'::regnamespace and relkind='r'`);
await c.end();

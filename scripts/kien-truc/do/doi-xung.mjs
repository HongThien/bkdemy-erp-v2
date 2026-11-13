import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const q = async (t, s) => { try { const r = await c.query(s); console.log('\n## ' + t + ' (' + r.rows.length + ')'); for (const x of r.rows) console.log(Object.values(x).join(' | ')); return r.rows; } catch (e) { console.log('\n## ' + t + ' LOI: ' + e.message); return []; } };
const NH = ['dai', 'hgt', 'khtn', 'hinh', 'vatly', 'hoahoc'];
// bang: hau to chung giua cac nhanh
await q('hau to bang theo nhanh: co mat o nhung nhanh nao', `
  with t as (select split_part(relname,'_',1) nh, substr(relname, length(split_part(relname,'_',1))+2) hau from pg_class where relnamespace='public'::regnamespace and relkind='r' and split_part(relname,'_',1) = any('{${NH.join(',')}}'))
  select n_nhanh, count(*) so_hau_to, string_agg(hau || '[' || ds || ']', ', ' order by hau) from (select hau, count(*) n_nhanh, string_agg(nh, '+' order by nh) ds from t group by hau) x group by n_nhanh order by n_nhanh desc`);
// ham: than ham co ten bang cua nhanh; ham co nhan ban theo nhanh
await q('ham nhan ban theo nhanh (cung hau to, khac tien to nhanh)', `
  with f as (select proname, (regexp_match(proname, '^(_?fn_|_)?(dai|hgt|khtn|hinh|vatly|hoahoc)_(.*)$')) m from pg_proc where pronamespace='public'::regnamespace)
  select n, count(*) so_ho, string_agg(hau, ', ' order by hau) from (select coalesce(m[1],'')||'*_'||m[3] hau, count(distinct m[2]) n from f where m is not null group by 1) x group by n order by n desc`);
await q('ham dung dynamic SQL (format/execute) — dispatch theo mon', `select count(*) filter (where prosrc ~* 'execute\\s+format') dyn, count(*) filter (where prosrc ~* 'execute\\s+format' and prosrc ~ '_kho_|cautbl|_mon_bang|_nhanh') dyn_kho, count(*) from pg_proc where pronamespace='public'::regnamespace`);
await q('ham registry mon->bang (ten goi y)', `select proname, pg_get_function_arguments(oid) from pg_proc where pronamespace='public'::regnamespace and proname ~ '(registry|_mon_bang|_kho_bang|_nhanh_bang|_bang_cua|_kho_nhanh|_kho_tbl|cautbl)' limit 30`);
await q('ham co case/if cung theo ten nhanh trong than', `select count(*) filter (where prosrc ~ '''dai''' and prosrc ~ '''hgt''') dai_hgt, count(*) filter (where prosrc ~ 'dai_cau_hoi' and prosrc !~ 'hgt_cau_hoi' and prosrc !~ 'khtn_cau_hoi') chi_dai_cau_hoi, count(*) filter (where prosrc ~ 'dai_cau_hoi' and prosrc ~ 'hgt_cau_hoi' and prosrc ~ 'khtn_cau_hoi') ca_3_bang, count(*) filter (where prosrc ~ 'dai_cau_hoi' and prosrc ~ 'hgt_cau_hoi' and prosrc ~ 'khtn_cau_hoi' and prosrc !~ 'vatly_cau_hoi') ca_3_thieu_vatly from pg_proc where pronamespace='public'::regnamespace`);
await q('view', `select count(*) from pg_views where schemaname='public'`);
await q('bang co cot mon vs khong (bang hoc tap lon)', `select count(*) filter (where exists (select 1 from information_schema.columns c where c.table_schema='public' and c.table_name=t.relname and c.column_name='mon')) co_mon, count(*) tong from pg_class t where relnamespace='public'::regnamespace and relkind='r'`);
await q('trigger nhieu nhat tren 1 bang', `select c.relname, count(*) from pg_trigger t join pg_class c on c.oid=t.tgrelid where not tgisinternal and c.relnamespace='public'::regnamespace group by 1 order by 2 desc limit 12`);
await q('kich thuoc than ham lon nhat', `select proname, length(prosrc) from pg_proc where pronamespace='public'::regnamespace order by 2 desc limit 12`);
await q('tong ky tu than ham', `select pg_size_pretty(sum(length(prosrc))::bigint), round(avg(length(prosrc))) from pg_proc where pronamespace='public'::regnamespace`);
await c.end();

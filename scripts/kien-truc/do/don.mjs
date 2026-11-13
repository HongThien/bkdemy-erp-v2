// Sinh migration DON: xoa 25 bang chung kho_<ho> RONG (khong con phan nao) + 4 index *_khoa_trung_idx dung sai bieu thuc. Thuy gat 13/11 "cai gi thua xoa di".
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const cha = (await c.query(`select p.relname, (select count(*) from pg_inherits i where i.inhparent = p.oid)::int con from pg_class p where p.relkind = 'p' and p.relnamespace = 'public'::regnamespace and p.relname like 'kho\\_%' order by 1`)).rows;
const out = [];
for (const x of cha) { const n = (await c.query(`select count(*)::int n from public.${x.relname}`)).rows[0].n;
  const dep = (await c.query(`select (select count(*) from pg_proc where pronamespace='public'::regnamespace and prosrc ~ $1)::int ham, (select count(*) from pg_class v where v.relkind='v' and v.relnamespace='public'::regnamespace and pg_get_viewdef(v.oid) ~ $1)::int vw, (select count(*) from pg_constraint where confrelid = $2::regclass)::int fk`, ['(^|[^a-z0-9_])' + x.relname + '([^a-z0-9_]|$)', 'public.' + x.relname])).rows[0];
  out.push({ ...x, n, ...dep }); }
for (const o of out) console.log((o.con === 0 && o.n === 0 && o.ham === 0 && o.vw === 0 && o.fk === 0 ? '✔' : '✗') + ' ' + o.relname.padEnd(28), 'phần', o.con, '| dòng', o.n, '| hàm nhắc', o.ham, '| view', o.vw, '| fk đến', o.fk);
const idx = (await c.query(`select s.indexrelname ten, s.idx_scan, pg_size_pretty(pg_relation_size(s.indexrelid)) sz, pg_get_indexdef(s.indexrelid) ~ $1 sai from pg_stat_user_indexes s where s.indexrelname in ('dai_cau_hoi_khoa_trung_idx','hgt_cau_hoi_khoa_trung_idx','khtn_cau_hoi_khoa_trung_idx','hinh_hoc_cau_hoi_khoa_trung_idx')`, [`'s\\+'`])).rows;
for (const i of idx) console.log((i.sai ? '✔' : '✗') + ' index ' + i.ten.padEnd(34), 'lượt dùng', i.idx_scan, '|', i.sz, '| biểu thức sai (s+):', i.sai);
await c.end();
const xoa = out.filter(o => o.con === 0 && o.n === 0 && o.ham === 0 && o.vw === 0 && o.fk === 0);
const ix = idx.filter(i => i.sai);
const sql = `-- DỌN (13/11/2026) — Thùy gật "cái gì thừa xoá đi".
-- (1) ${xoa.length} bảng chung kho_<họ> RỖNG: dựng tối 13/11 để gộp bằng partition, đã tách hết phần ở mig 202611132053, không hàm / view / khoá ngoại nào còn nhắc.
--     KHÔNG đụng kho_cau_dang (bảng tra đang chạy), kho_cau_log, kho_cau_khuon_log.
-- (2) ${ix.length} index *_khoa_trung_idx dựng sai biểu thức ('s+' thay vì '\\s+', mig 202611112136) — chưa từng được dùng; bản đúng *_khoa_trung2_idx đã có (mig 202611131843).
set local lock_timeout = '5s';
do $k$
declare r record; n bigint;
begin
  for r in select unnest(array[${xoa.map(o => `'${o.relname}'`).join(', ')}]) t loop
    if exists (select 1 from pg_inherits i where i.inhparent = ('public.' || r.t)::regclass) then raise exception 'dọn: % còn phần — dừng', r.t; end if;
    execute format('select count(*) from public.%I', r.t) into n;
    if n > 0 then raise exception 'dọn: % còn % dòng — dừng', r.t, n; end if;
  end loop;
end
$k$;
${xoa.map(o => `drop table public.${o.relname};`).join('\n')}

${ix.map(i => `drop index if exists public.${i.ten};`).join('\n')}
`;
fs.writeFileSync(S + '/don.sql', sql);
console.log('\nsẽ xoá:', xoa.length, 'bảng rỗng +', ix.length, 'index. KHÔNG xoá:', out.filter(o => !xoa.includes(o)).map(o => o.relname).join(', ') || '—');

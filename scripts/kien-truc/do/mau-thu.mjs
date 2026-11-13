// HO MAU bdm_cau_thieu_dang: bien 5 bang theo nhanh thanh 5 PHAN cua 1 bang chung (LIST partition theo cot kho). Chay thu trong transaction roi ROLLBACK.
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const NH = ['dai', 'hgt', 'khtn', 'vatly', 'hoahoc']; const HO = 'bdm_cau_thieu_dang'; const CHA = 'kho_' + HO;
const sql = `-- GỘP THEO KHUÔN — họ mẫu ${HO} (spec-kien-truc.md, quyết định "riêng theo khuôn, chung trong cùng khuôn" — Thùy 13/11)
-- Cách làm: KHÔNG chép dữ liệu, KHÔNG đổi tên. Mỗi bảng theo nhánh thêm cột \`kho\` (hằng) rồi GẮN làm một PHẦN của bảng chung ${CHA}.
-- Tên cũ vẫn là bảng thật ⇒ hàm, trigger, policy, khoá ngoại, script đang dùng tên cũ chạy y như trước. Bảng chung là cửa đọc/ghi xuyên nhánh, thay cho view UNION.
-- Hoàn tác: alter table ${CHA} detach partition <bảng>; rồi drop column kho.
set local lock_timeout = '5s';
${NH.map(n => `alter table public.${n}_${HO} add column kho text not null default '${n}' constraint ${n}_${HO}_kho_chk check (kho = '${n}');`).join('\n')}

create table public.${CHA} (
  ma_cau    text        not null,
  ly_do     text        not null,
  nguon     text        not null default 'ai',
  actor     uuid        default public.jwt_uid(),
  at        timestamptz not null default now(),
  chu_de_id text,
  kho       text        not null
) partition by list (kho);
comment on table public.${CHA} is 'Bảng CHUNG của khuôn dạng–câu (mọi nhánh). Mỗi nhánh là một phần: <nhánh>_${HO}. Thêm/sửa cột Ở ĐÂY — tự áp cho mọi nhánh.';
${NH.map(n => `alter table public.${CHA} attach partition public.${n}_${HO} for values in ('${n}');`).join('\n')}

alter table public.${CHA} enable row level security;
revoke all on public.${CHA} from anon;
create policy ${CHA}_member_all on public.${CHA} for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.${CHA} for select to claude_ro using (true);
`;
fs.writeFileSync(S + '/mau.sql', sql);
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const thu = async (ten, f) => { await c.query('savepoint s'); let v; try { v = await f(); } catch (e) { v = 'LỖI [' + e.code + '] ' + e.message.slice(0, 110); } await c.query('rollback to savepoint s'); console.log('  ' + ten.padEnd(52), typeof v === 'string' ? v : JSON.stringify(v)); };
const anh = async () => { const o = {}; for (const n of NH) { const t = n + '_' + HO; o[n] = await one(`select count(*)::int n, md5(coalesce(string_agg(ma_cau||'|'||ly_do||'|'||nguon||'|'||coalesce(actor::text,'')||'|'||at::text||'|'||coalesce(chu_de_id,''), ',' order by ma_cau, at),'')) h from public.${t}`); o[n].trg = (await one(`select count(*)::int n from pg_trigger where tgrelid=$1::regclass and not tgisinternal`, ['public.' + t])).n; o[n].con = (await one(`select count(*)::int n from pg_constraint where conrelid=$1::regclass and contype in ('f','p','u')`, ['public.' + t])).n; o[n].pol = (await one(`select count(*)::int n from pg_policies where schemaname='public' and tablename=$1`, [t])).n; o[n].idx = (await one(`select count(*)::int n from pg_indexes where schemaname='public' and tablename=$1`, [t])).n; } return o; };
const t0 = Date.now();
try {
  await c.query('begin');
  const truoc = await anh();
  // ham nao ghi vao ho nay va ghi kieu gi
  const fs_ = (await c.query(`select proname, prosrc from pg_proc where pronamespace='public'::regnamespace and prosrc ~ '(dai|hgt|khtn|vatly|hoahoc)_${HO}'`)).rows;
  const kieu = {}; for (const f of fs_) for (const m of f.prosrc.matchAll(new RegExp(`(insert into|update|delete from|from|join)\\s+(?:public\\.)?(?:dai|hgt|khtn|vatly|hoahoc)_${HO}\\s*(\\(|select|values|as|[a-z]|$)?`, 'gi'))) { const k = m[1].toLowerCase() + (m[1].toLowerCase() === 'insert into' ? (m[2] === '(' ? ' (có danh sách cột)' : ' KHÔNG danh sách cột') : ''); kieu[k] = (kieu[k] || 0) + 1; }
  console.log('hàm nhắc họ này:', fs_.length, '| kiểu dùng (tên tĩnh):', JSON.stringify(kieu), '| dùng %rowtype/setof:', fs_.filter(f => new RegExp(`_${HO}(%rowtype| *\\))`, 'i').test(f.prosrc)).length);
  await c.query(sql);
  console.log('áp xong trong', Date.now() - t0, 'ms');
  const sau = await anh();
  console.log('\nSO KHỚP TỪNG NHÁNH (số dòng · vân tay nội dung · trigger · ràng buộc khoá · policy · index):');
  for (const n of NH) console.log('  ' + n.padEnd(7), truoc[n].n + '→' + sau[n].n, truoc[n].h === sau[n].h ? 'nội dung KHỚP' : 'NỘI DUNG LỆCH', '| trg ' + truoc[n].trg + '→' + sau[n].trg, '| khoá ' + truoc[n].con + '→' + sau[n].con, '| pol ' + truoc[n].pol + '→' + sau[n].pol, '| idx ' + truoc[n].idx + '→' + sau[n].idx);
  const tong = await one(`select count(*)::int n, string_agg(distinct kho, ',' order by kho) kho from public.${CHA}`); console.log('bảng chung:', JSON.stringify(tong), '| tổng các nhánh:', NH.reduce((a, n) => a + sau[n].n, 0));
  console.log('\nTHỬ GHI/ĐỌC:');
  const ma = (await one(`select c.ma_cau from dai_cau_hoi c where not exists (select 1 from dai_${HO} t where t.ma_cau = c.ma_cau) and c.xoa_at is null limit 1`)).ma_cau;
  const cu = (await one(`select ma_cau from dai_${HO} limit 1`)).ma_cau;
  await thu('thêm qua TÊN CŨ (không nêu kho)', async () => { await c.query(`insert into dai_${HO} (ma_cau, ly_do) values ($1, 'thu')`, [ma]); return await one(`select kho, nguon from public.${CHA} where ma_cau = $1`, [ma]); });
  await thu('upsert qua tên cũ (on conflict khoá chính)', async () => { const pk = (await one(`select pg_get_constraintdef(oid) d from pg_constraint where conrelid='public.dai_${HO}'::regclass and contype='p'`)).d; const cols = pk.match(/\(([^)]+)\)/)[1]; await c.query(`insert into dai_${HO} (ma_cau, ly_do, chu_de_id) select ma_cau, 'sua', chu_de_id from dai_${HO} where ma_cau = $1 limit 1 on conflict (${cols}) do update set ly_do = excluded.ly_do`, [cu]); return { khoa_chinh: cols, ...(await one(`select ly_do from dai_${HO} where ma_cau=$1 limit 1`, [cu])) }; });
  await thu('thêm qua BẢNG CHUNG với kho=hgt', async () => { const m2 = (await one(`select c.ma_cau from hgt_cau_hoi c where not exists (select 1 from hgt_${HO} t where t.ma_cau = c.ma_cau) limit 1`)).ma_cau; await c.query(`insert into public.${CHA} (ma_cau, ly_do, kho) values ($1, 'thu', 'hgt')`, [m2]); return await one(`select count(*)::int trong_hgt from hgt_${HO} where ma_cau=$1`, [m2]); });
  await thu('thêm qua bảng chung, mã câu SAI nhánh (khoá ngoại phải chặn)', async () => { await c.query(`insert into public.${CHA} (ma_cau, ly_do, kho) values ($1, 'thu', 'khtn')`, [ma]); return 'KHÔNG bị chặn'; });
  await thu('thêm qua tên cũ nhưng ép kho sai', async () => { await c.query(`insert into dai_${HO} (ma_cau, ly_do, kho) values ($1, 'thu', 'hgt')`, [ma]); return 'KHÔNG bị chặn'; });
  await thu('xoá qua tên cũ', async () => { const r = await c.query(`delete from dai_${HO} where ma_cau = $1`, [cu]); return { xoa: r.rowCount }; });
  await thu('đọc bảng chung 1 nhánh — có cắt phần không', async () => { const p = (await c.query(`explain select * from public.${CHA} where kho = 'hgt'`)).rows.map(r => r['QUERY PLAN']).join(' '); return { chi_quet: (p.match(/on ([a-z_]+)/g) || []).join(',') }; });
  await thu('thêm cột ở bảng chung ⇒ mọi nhánh có', async () => { await c.query(`alter table public.${CHA} add column ghi_chu_thu text`); return await one(`select count(*)::int so_nhanh_co_cot from information_schema.columns where table_schema='public' and column_name='ghi_chu_thu' and table_name like '%_${HO}'`); });
  await thu('thêm cột riêng ở MỘT nhánh (phải bị cấm)', async () => { await c.query(`alter table public.dai_${HO} add column rieng_thu text`); return 'KHÔNG bị cấm'; });
  await thu('hoàn tác: tách 1 nhánh ra', async () => { await c.query(`alter table public.${CHA} detach partition public.dai_${HO}`); await c.query(`alter table public.dai_${HO} drop constraint dai_${HO}_kho_chk, drop column kho`); return await one(`select count(*)::int n from dai_${HO}`); });
} catch (e) { console.log('!!! LỖI:', e.code, e.message, (e.where || '').slice(0, 200)); }
finally { await c.query('rollback'); const k = await one(`select count(*)::int n from pg_class where relname='${CHA}'`); console.log('\nĐÃ ROLLBACK (' + (Date.now() - t0) + ' ms). bảng chung còn tồn tại (phải 0):', k.n); await c.end(); }

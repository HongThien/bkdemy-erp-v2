// CUU: tach moi bang nhanh ra khoi bang chung kho_* (PostgREST khong lo bang la "phan" ⇒ app bao "Could not find the table … in the schema cache").
// Giu bang tra kho_cau_dang chay tiep: doc qua view gop 3 ho + trigger dat lai tren tung bang nhanh. Ghi file SQL de dua vao so migration.
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const ph = (await c.query(`select p.relname cha, ch.relname con from pg_inherits i join pg_class p on p.oid = i.inhparent join pg_class ch on ch.oid = i.inhrelid where p.relkind = 'p' and p.relnamespace = 'public'::regnamespace and p.relname like 'kho\\_%' order by 1, 2`)).rows;
const NH = ['dai', 'hgt', 'khtn', 'vatly', 'hoahoc'];
const v = (ho, cols) => `create or replace view public.v_kho_${ho} with (security_invoker = on) as\n` + NH.map(n => `  select ${cols} from public.${n}_${ho}`).join('\n  union all\n') + ';';
const trg = (ho, ten, dk, fn) => NH.map(n => `drop trigger if exists ${ten} on public.${n}_${ho};\ncreate trigger ${ten} after ${dk} on public.${n}_${ho} for each row execute function public.${fn}();`).join('\n');
const sql = `-- CỨU (13/11/2026 tối): tách mọi bảng nhánh khỏi bảng chung kho_* — PostgREST KHÔNG lộ bảng là "phần" (partition) ra API
-- ⇒ mọi chỗ app đọc thẳng <nhánh>_<họ> báo "Could not find the table 'public.hgt_cau_hoi' in the schema cache" (ET, kho, tài liệu…).
-- Bài học: cách "gắn làm phần" (mig 202611131904 … 202611132033) KHÔNG dùng được chừng nào client còn đọc bảng nhánh qua API.
-- Giữ lại: cột \`kho\` trên bảng nhánh (hằng, vô hại) · các cột đã làm khớp · bảng tra kho_cau_dang (đọc qua view gộp dưới đây).
-- Các bảng kho_<họ> (đã rỗng, không còn phần nào) CHƯA xoá — chờ Thùy.
set local lock_timeout = '8s';
${ph.map(x => `alter table public.${x.cha} detach partition public.${x.con};`).join('\n')}

-- bảng tra: đọc 3 họ qua view gộp (tạm, tới khi có cách gộp dùng được với API)
${v('cau_hoi', 'ma_cau, parent_ma_cau, kho')}
${v('bdm_gan_cau', 'ma_cau, dang_bai_id, kho')}
${v('bdm_de_xuat', 'ma_cau, dang_bai_id, kho')}
revoke all on public.v_kho_cau_hoi, public.v_kho_bdm_gan_cau, public.v_kho_bdm_de_xuat from anon;

create or replace function public._kho_cau_dang_tinh(p_kho text default null, p_ma text[] default null)
returns table (kho text, ma_cau text, dang_bai_id text, nguon text)
language sql stable security definer set search_path = public
as $$
  select q.kho, q.ma_cau,
         coalesce(g.dang_bai_id, gg.dang_bai_id, d.dang_bai_id, dg.dang_bai_id),
         case when g.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from public.v_kho_cau_hoi q
    left join public.v_kho_bdm_gan_cau g  on g.kho  = q.kho and g.ma_cau  = q.ma_cau
    left join public.v_kho_bdm_gan_cau gg on gg.kho = q.kho and gg.ma_cau = q.parent_ma_cau
    left join public.v_kho_bdm_de_xuat d  on d.kho  = q.kho and d.ma_cau  = q.ma_cau
    left join public.v_kho_bdm_de_xuat dg on dg.kho = q.kho and dg.ma_cau = q.parent_ma_cau
   where (p_kho is null or q.kho = p_kho)
     and (p_ma is null or q.ma_cau = any (p_ma) or q.parent_ma_cau = any (p_ma))
     and coalesce(g.ma_cau, gg.ma_cau, d.ma_cau, dg.ma_cau) is not null
$$;

create or replace function public._kho_cau_dang_lam_lai(p_kho text, p_ma text[])
returns void language sql security definer set search_path = public
as $$
  with moi as (select * from public._kho_cau_dang_tinh(p_kho, p_ma)),
  xoa as (
    delete from public.kho_cau_dang t
     where t.kho = p_kho
       and (t.ma_cau = any (p_ma) or t.ma_cau in (select q.ma_cau from public.v_kho_cau_hoi q where q.kho = p_kho and q.parent_ma_cau = any (p_ma)))
       and not exists (select 1 from moi m where m.ma_cau = t.ma_cau)
    returning 1)
  insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon)
  select m.kho, m.ma_cau, m.dang_bai_id, m.nguon from moi m
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon
   where t.dang_bai_id is distinct from excluded.dang_bai_id or t.nguon is distinct from excluded.nguon
$$;

-- trigger giữ đồng bộ: đặt lại trên TỪNG bảng nhánh (trigger ở bảng chung mất khi tách phần)
${trg('bdm_gan_cau', 'kho_cau_dang_gan', 'insert or update or delete', '_trg_kho_cau_dang')}
${trg('bdm_de_xuat', 'kho_cau_dang_dexuat', 'insert or update or delete', '_trg_kho_cau_dang')}
${trg('cau_hoi', 'kho_cau_dang_cau', 'insert or delete or update of parent_ma_cau, ma_cau', '_trg_kho_cau_dang_cau')}

-- làm lại bảng tra cho chắc (phòng có ghi trong lúc chuyển)
delete from public.kho_cau_dang t where not exists (select 1 from public._kho_cau_dang_tinh() m where m.kho = t.kho and m.ma_cau = t.ma_cau);
insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon) select kho, ma_cau, dang_bai_id, nguon from public._kho_cau_dang_tinh()
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon;

notify pgrst, 'reload schema';
`;
fs.writeFileSync(S + '/cuu.sql', sql);
console.log('số phần sẽ tách:', ph.length, '| số bảng chung:', new Set(ph.map(x => x.cha)).size);
await c.end();

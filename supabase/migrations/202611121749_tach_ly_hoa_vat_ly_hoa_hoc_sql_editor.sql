-- ============================================================================
-- TÁCH Lý hóa ⇒ Vật lý + Hóa học — PHẦN CHẠY Ở SUPABASE SQL EDITOR (owner postgres, claude_build không thay được)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_vat_ly_hoa_hoc.mjs. Chạy SAU file *_tach_ly_hoa_vat_ly_hoa_hoc.sql. Project ERP: osrvycilwshkzhljuxef.
-- Bản gốc trước Lý hóa + nhánh 2 môn. create or replace giữ ACL cũ của hàm. Không mất dữ liệu.
-- ============================================================================
-- fn_kho_sua_tk
CREATE OR REPLACE FUNCTION public.fn_kho_sua_tk(p_mon text, p_tu timestamp with time zone, p_den timestamp with time zone DEFAULT now())
 RETURNS TABLE(khau text, so_cau_duyet bigint, so_cau_nguoi_sua bigint)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
begin
  if p_mon not in ('dai', 'hgt', 'khtn', 'vatly', 'hoahoc') then raise exception 'fn_kho_sua_tk: mon không hợp lệ %', p_mon; end if;
  return query execute format($q$
    with d as (
      select c.ma_cau, c.duyet_at from %1$I c
       where c.xoa_at is null and c.da_duyet and c.duyet_nguon = 'nguoi' and c.duyet_at >= $2 and c.duyet_at < $3
    ), s as (
      select l.khau, l.ma_cau from public.kho_sua_log l join d on d.ma_cau = l.ma_cau
       where l.mon = $1 and l.nguon = 'nguoi' and l.cu is not null and l.sua_at <= d.duyet_at + interval '1 minute'
      union
      select 'dang', g.ma_cau from public.kho_doi_dang_log g join d on d.ma_cau = g.ma_cau
       where g.mon = $1 and g.loai = 'cau' and g.actor is not null and g.dang_cu !~ '000000$'
         and g.doi_at <= d.duyet_at + interval '1 minute'
    )
    select k.khau, (select count(*) from d)::bigint, (select count(distinct s.ma_cau) from s where s.khau = k.khau)::bigint
      from unnest(array['doc', 'menh_de', 'dang', 'cum', 'dap_so', 'loi_giai', 'hinh']) with ordinality k(khau, tt)
     order by k.tt
  $q$, p_mon || '_cau_hoi') using p_mon, p_tu, p_den;
end $function$
;
alter table public.kho_sua_log drop constraint kho_sua_log_mon_check;
alter table public.kho_sua_log add constraint kho_sua_log_mon_check CHECK ((mon = ANY (ARRAY['dai'::text, 'hgt'::text, 'khtn'::text, 'vatly'::text, 'hoahoc'::text, 'anh'::text, 'tsa'::text])));

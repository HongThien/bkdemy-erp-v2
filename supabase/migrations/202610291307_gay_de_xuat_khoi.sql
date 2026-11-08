-- ============================================================================
-- gay_de_xuat_khoi — Thùy 29/10: lọc đề xuất gậy theo KHỐI.
-- Khối/lớp của 1 đề xuất suy từ ref_key vận hành 'vh:<buoi_hoc_id>|<tab>|<nhan_su_id>'
-- → buoi_hoc.lop_id → lop. Đề xuất không gắn buổi (nếu có) không trả dòng ⇒ client xếp "không theo lớp".
-- ============================================================================

create or replace function public.fn_gay_de_xuat_lop(p_ids uuid[])
returns table (id uuid, khoi text, mon text, ten_lop text)
language sql stable
set search_path = public
as $$
  select d.id, l.khoi, l.mon, l.ten_lop
  from gay_de_xuat d
  join buoi_hoc b on b.id::text = substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')
  join lop l on l.id = b.lop_id
  where d.id = any(p_ids);
$$;

revoke execute on function public.fn_gay_de_xuat_lop(uuid[]) from public;
revoke execute on function public.fn_gay_de_xuat_lop(uuid[]) from anon;
grant execute on function public.fn_gay_de_xuat_lop(uuid[]) to authenticated;
